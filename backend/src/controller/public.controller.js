import Workspace from "../models/workspace.models.js";
import Contact from "../models/contact.models.js";
import Conversation from "../models/conversation.models.js";
import Message from "../models/message.models.js";
import { io } from "../index.js";

/**
 * PUBLIC: Submit contact form
 * URL: /f/:workspacePublicId
 */
export const submitContactForm = async (req, res) => {
  try {
    const { workspacePublicId } = req.params;
    const { name, email, phone, message } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // 🔍 LOOKUP WORKSPACE
    const workspace = await Workspace.findOne({
      publicId: workspacePublicId,
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // 1️⃣ Create contact (INTERNAL workspaceId)
    const contact = await Contact.create({
      workspaceId: workspace._id,
      name,
      email,
      phone,
    });

    // 2️⃣ Create conversation
    const conversation = await Conversation.create({
      workspaceId: workspace._id,
      contactId: contact._id,
    });

    // 3️⃣ System welcome message
    await Message.create({
      conversationId: conversation._id,
      sender: "SYSTEM",
      content:
        "Thanks for reaching out! Our team will get back to you shortly.",
    });

    // 4️⃣ Optional customer message
    if (message) {
      await Message.create({
        conversationId: conversation._id,
        sender: "CUSTOMER",
        content: message,
      });
    }

    // 5️⃣ Real-time dashboard update
    io.to(workspace._id.toString()).emit("dashboard:update");

    res.status(201).json({
      message: "Contact submitted successfully",
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
