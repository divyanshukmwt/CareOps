import AllowedStaff from "../models/allowedStaff.models.js";

export const addStaff = async (req, res) => {
  try {
    if (req.user.role !== "OWNER") {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { email } = req.body;
    const workspaceId = req.user.workspaceId;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const exists = await AllowedStaff.findOne({ email, workspaceId });
    if (exists) {
      return res.status(400).json({ message: "Staff already added" });
    }

    await AllowedStaff.create({ email, workspaceId });

    res.json({ message: "Staff added successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
