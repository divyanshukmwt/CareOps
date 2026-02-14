import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import AllowedStaff from "../models/allowedStaff.models.js";

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    email = email.toLowerCase().trim();

    const exists = await User.findOne({ email, role: "OWNER" });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      hasPassword: true,
      role: "OWNER",
      workspaceId: null,
    });

    const token = jwt.sign(
      { userId: user._id, role: "OWNER", workspaceId: null },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("careops_token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(201).json({
      message: "Registered & logged in",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    let { email, password, workspaceId } = req.body;
    email = email.toLowerCase().trim();
    if (!workspaceId) workspaceId = null;

    const user = workspaceId
      ? await User.findOne({ email, workspaceId, role: "STAFF" })
      : await User.findOne({ email, role: "OWNER" });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (user.role === "STAFF" && !user.hasPassword)
      return res.status(403).json({ message: "Password not set" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        workspaceId: user.workspaceId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("careops_token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.json({ role: user.role, hasWorkspace: !!user.workspaceId });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= STAFF ================= */
export const checkStaffAccess = async (req, res) => {
  const { email, workspaceId } = req.body;
  const allowed = await AllowedStaff.findOne({ email, workspaceId });
  if (!allowed) return res.status(403).json({ message: "Not allowed" });

  const user = await User.findOne({ email, workspaceId });
  res.json({ allowed: true, hasPassword: user?.hasPassword || false });
};

export const setStaffPassword = async (req, res) => {
  const { email, workspaceId, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  let user = await User.findOne({ email, workspaceId });
  if (!user) {
    user = await User.create({
      name: email.split("@")[0],
      email,
      password: hashed,
      hasPassword: true,
      role: "STAFF",
      workspaceId,
    });
  } else {
    user.password = hashed;
    user.hasPassword = true;
    await user.save();
  }

  const token = jwt.sign(
    { userId: user._id, role: "STAFF", workspaceId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("careops_token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.json({ message: "Password set" });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.userId).select(
    "_id email role workspaceId"
  );
  res.json(user);
};

export const logout = async (_, res) => {
  res.clearCookie("careops_token");
  res.json({ message: "Logged out" });
};
