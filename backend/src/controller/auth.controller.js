import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import AllowedStaff from "../models/allowedStaff.models.js";

/* ================= OWNER / EXISTING REGISTER (UNCHANGED LOGIC) ================= */

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const staffEntry = await AllowedStaff.findOne({ email });

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      hasPassword: true,
      role: staffEntry ? "STAFF" : "OWNER",
      workspaceId: staffEntry ? staffEntry.workspaceId : null,
    });

    res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    console.error("REGISTER ERROR 🔴:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }

};

/* ================= OWNER / NORMAL LOGIN (UNCHANGED) ================= */

export const login = async (req, res) => {
  try {
    let { email, password, workspaceId } = req.body;

    if (!workspaceId || workspaceId.trim() === "") {
      workspaceId = null;
    }

    let user;

    if (!workspaceId) {
      user = await User.findOne({ email, role: "OWNER" });
    } else {
      user = await User.findOne({
        email,
        workspaceId,
        role: "STAFF",
      });
    }

    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    // ✅ FIX IS HERE
    if (user.role === "STAFF" && !user.hasPassword)
      return res.status(403).json({ message: "Password not set" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

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
      sameSite: "lax",
    });

    res.json({
      role: user.role,
      hasWorkspace: !!user.workspaceId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= STAFF STEP 1: CHECK ACCESS ================= */

export const checkStaffAccess = async (req, res) => {
  const { email, workspaceId } = req.body;

  if (!email || !workspaceId)
    return res.status(400).json({ message: "Missing fields" });

  const allowed = await AllowedStaff.findOne({ email, workspaceId });
  if (!allowed)
    return res.status(403).json({ message: "Not allowed in this workspace" });

  const user = await User.findOne({ email, workspaceId });

  res.json({
    allowed: true,
    hasPassword: user?.hasPassword || false,
  });
};

/* ================= STAFF STEP 2: SET PASSWORD (FIRST LOGIN) ================= */

export const setStaffPassword = async (req, res) => {
  const { email, workspaceId, password } = req.body;

  if (!email || !workspaceId || !password)
    return res.status(400).json({ message: "Missing fields" });

  const allowed = await AllowedStaff.findOne({ email, workspaceId });
  if (!allowed)
    return res.status(403).json({ message: "Unauthorized" });

  let user = await User.findOne({ email, workspaceId });

  const hashed = await bcrypt.hash(password, 10);

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
    {
      userId: user._id,
      role: "STAFF",
      workspaceId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("careops_token", token, {
    httpOnly: true,
    sameSite: "lax",
  });

  res.json({ message: "Password set & logged in" });
};

export const logout = async (req, res) => {
  res.clearCookie("careops_token");
  res.json({ message: "Logged out" });
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "_id email role workspaceId"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
