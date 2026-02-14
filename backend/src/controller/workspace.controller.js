import Workspace from "../models/workspace.models.js";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const createWorkspace = async (req, res) => {
  try {
    const { name, timezone, contactEmail } = req.body;
    const user = await User.findById(req.user.userId);

    if (user.workspaceId)
      return res.status(400).json({ message: "Workspace already exists" });

    const workspace = await Workspace.create({
      name,
      timezone,
      contactEmail,
      ownerId: user._id,
    });

    user.workspaceId = workspace._id;
    await user.save();

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
      sameSite: "none",
      secure: true,
    });

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Your CareOps Workspace ID",
      html: `
        <h2>Workspace Created 🎉</h2>
        <p><strong>ID:</strong></p>
        <code>${workspace._id}</code>
        <p>Share this with your staff.</p>
      `,
    });

    res.status(201).json({ workspaceId: workspace._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
