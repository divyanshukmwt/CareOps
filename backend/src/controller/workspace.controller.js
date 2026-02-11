import Workspace from "../models/workspace.models.js";

export const createWorkspace = async (req, res) => {
  try {
    const { name, timezone, contactEmail } = req.body;

    if (!name || !timezone || !contactEmail) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const workspace = await Workspace.create({
      name,
      timezone,
      contactEmail,
    });

    return res.status(201).json({
      message: "Workspace created successfully",
      workspace,
    });
  } catch (error) {
    console.error("Create workspace error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
