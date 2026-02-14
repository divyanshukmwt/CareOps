import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const createWorkspace = async (req, res) => {
  try {
    const { name, timezone, contactEmail } = req.body;
    const userId = req.user.userId;

    if (!name || !timezone || !contactEmail) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findById(userId);
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

    // ✅ UPDATE JWT
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
      secure: process.env.NODE_ENV === "production",
    });

    // ✅ EMAIL WORKSPACE ID TO OWNER
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Your CareOps Workspace ID",
      html: `
        <h2>Workspace Created 🎉</h2>
        <p><strong>Workspace Name:</strong> ${workspace.name}</p>
        <p><strong>Workspace ID:</strong></p>
        <code style="font-size:16px">${workspace._id}</code>
        <p>Share this ID with your staff to login.</p>
      `,
    });

    res.status(201).json({
      message: "Workspace created",
      workspaceId: workspace._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
