import Conversation from "../models/conversation.models.js";
import Contact from "../models/contact.models.js";
import Message from "../models/message.models.js";
import { io } from "../index.js";

export const getInbox = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const conversations = await Conversation.find({ workspaceId })
      .populate("contactId", "name email phone")
      .sort({ updatedAt: -1 });

    const inbox = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await Message.findOne({
          conversationId: conv._id,
        }).sort({ createdAt: -1 });

        return {
          conversationId: conv._id,
          contact: conv.contactId,
          lastMessage,
          updatedAt: conv.updatedAt,
        };
      })
    );

    res.json(inbox);
  } catch (error) {
    console.error("Inbox fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    res.json(messages);
  } catch (error) {
    console.error("Fetch messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const replyToConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const msg = await Message.create({
      conversationId,
      sender: "STAFF",
      content: message,
    });

    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
  { isAutoPaused: true },
  { returnDocument: "after" }
    );

    // 🔥 REAL-TIME EVENT
    io.to(conversation.workspaceId.toString()).emit("newMessage", {
      conversationId,
      message: msg,
    });

    io.to(conversation.workspaceId.toString()).emit("dashboard:update");

    res.json({ message: "Reply sent" });
  } catch (error) {
    console.error("Reply error:", error);
    res.status(500).json({ message: "Server error" });
  }
}