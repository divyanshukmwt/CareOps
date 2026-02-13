import Workspace from "../models/workspace.models.js";
import Contact from "../models/contact.models.js";
import Conversation from "../models/conversation.models.js";
import Message from "../models/message.models.js";
import Form from "../models/form.models.js";
import { io } from "../index.js";

export const submitContactForm = async (req, res) => {
  try {
    const { workspacePublicId } = req.params;
    const { name, email, phone, message } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const workspace = await Workspace.findOne({
      publicId: workspacePublicId,
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const contact = await Contact.create({
      workspaceId: workspace._id,
      name,
      email,
      phone,
    });

    const conversation = await Conversation.create({
      workspaceId: workspace._id,
      contactId: contact._id,
    });

    await Message.create({
      conversationId: conversation._id,
      sender: "SYSTEM",
      content: "Thanks for reaching out! Our team will get back to you shortly.",
    });

    if (message) {
      await Message.create({
        conversationId: conversation._id,
        sender: "CUSTOMER",
        content: message,
      });
    }

    io.to(workspace._id.toString()).emit("dashboard:update");

    res.status(201).json({
      message: "Contact submitted successfully",
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPublicForms = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const forms = await Form.find({ workspaceId }).select(
      "_id title description"
    );

    res.json(forms);
  } catch (error) {
    console.error("Public forms error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
  