import Form from "../models/form.models.js";

export const getForms = async (req, res) => {
  try {
    const workspaceId = req.user.workspaceId;

    const forms = await Form.find({ workspaceId }).sort({
      createdAt: -1,
    });

    res.json(forms);
  } catch (error) {
    console.error("Get forms error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
