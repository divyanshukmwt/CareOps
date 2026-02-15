import Workspace from "../models/workspace.models.js";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { sendEmailSafe } from "../utils/email.util.js";

export const createWorkspace = async (req, res) => {
  try {
    const { name, timezone, contactEmail } = req.body;
    const user = await User.findById(req.user.userId);

    if (user.workspaceId) {
      return res.status(400).json({ message: "Workspace already exists" });
    }

    const workspace = await Workspace.create({
      name,
      timezone,
      contactEmail,
      ownerId: user._id,
    });

    user.workspaceId = workspace._id;
    await user.save();

    /* 🔐 UPDATE JWT */
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        workspaceId: workspace._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("careops_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    /* 📧 EMAIL WORKSPACE ID (SAFE) */
    await sendEmailSafe({
      to: user.email,
      subject: "Workspace Created Successfully",
      html: `
        <h2>Workspace Created Successfully 🎉</h2>
        <p>Your workspace <strong>${workspace.name}</strong> has been created.</p>
        <p><strong>Workspace ID:</strong></p>
        <code style="font-size:16px">${workspace._id}</code>
        <p>This Workspace ID is required for login and for inviting staff. Keep it safe.</p>
      `,
    });

    res.status(201).json({
      message: "Workspace created",
      workspaceId: workspace._id,
    });
  } catch (err) {
    console.error("Create workspace error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
