import Workspace from "../models/workspace.models.js";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { sendEmailSafe } from "../utils/email.util.js";

export const createWorkspace = async (req, res) => {
  try {
    const { name, timezone, contactEmail } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.workspaceId) {
      return res.status(400).json({ message: "Workspace already exists" });
    }

    // Create workspace
    const workspace = await Workspace.create({
      name,
      timezone,
      contactEmail,
      ownerId: user._id,
    });

    // Attach workspace to user
    user.workspaceId = workspace._id;
    await user.save();

    // 🔐 Update JWT with workspaceId
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

    // 📧 Send workspace email
    try {
      console.log(
        "📧 Sending workspace email to:",
        user.email,
        "workspaceId:",
        workspace._id.toString()
      );

      const emailResult = await sendEmailSafe({
        to: user.email,
        subject: "Workspace Created Successfully",
        html: `
          <h2>Workspace Created Successfully 🎉</h2>
          <p>Your workspace <strong>${workspace.name}</strong> has been created.</p>
          <p><strong>Workspace ID:</strong></p>
          <code style="font-size:16px">${workspace._id}</code>
          <p>
            This Workspace ID is required for login and for inviting staff.
            Please keep it safe.
          </p>
        `,
      });

      console.log("📧 Workspace email sent:", emailResult);
    } catch (emailErr) {
      console.error(
        "❌ Workspace email failed:",
        emailErr?.message || emailErr
      );
    }

    return res.status(201).json({
      message: "Workspace created",
      workspaceId: workspace._id,
    });
  } catch (err) {
    console.error("Create workspace error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
