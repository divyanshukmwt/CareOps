import Workspace from "../models/workspace.models.js";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

export const createWorkspace = async (req, res) => {
  try {
    const { name, timezone, contactEmail } = req.body;
    const userId = req.user.userId;

    if (!name || !timezone || !contactEmail) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.workspaceId) {
      return res.status(400).json({
        message: "Workspace already exists",
      });
    }

    const workspace = await Workspace.create({
      name,
      timezone,
      contactEmail,
      ownerId: user._id,
    });

    user.workspaceId = workspace._id;
    await user.save();

    // ✅ RE-ISSUE JWT WITH WORKSPACE ID
    const newToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        workspaceId: workspace._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("careops_token", newToken, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(201).json({
      message: "Workspace created successfully",
      workspace,
    });
  } catch (error) {
    console.error("Create workspace error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
