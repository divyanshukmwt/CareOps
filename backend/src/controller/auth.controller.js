import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.models.js";
import Workspace from "../models/workspace.models.js";

export const registerOwner = async (req, res) => {
  try {
    const { name, email, password, workspaceName, timezone, contactEmail } =
      req.body;

    if (!name || !email || !password || !workspaceName || !timezone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const workspace = await Workspace.create({
      name: workspaceName,
      timezone,
      contactEmail,
      isActive: true,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "OWNER",
      workspaceId: workspace._id,
    });

    res.status(201).json({
      message: "Workspace created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        workspaceId: user.workspaceId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ SET COOKIE
    res.cookie("careops_token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.json({
      message: "Login successful",
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const logout = async (req, res) => {
  res.clearCookie("careops_token");
  res.json({ message: "Logged out" });
};
