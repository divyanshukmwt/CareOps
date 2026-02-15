import Conversation from "../models/conversation.models.js";
import Message from "../models/message.models.js";
import { io } from "../index.js";

export const getInbox = async (req, res) => {
  try {
    const workspaceId = req.user.workspaceId;

    const conversations = await Conversation.find({ workspaceId })
      .populate("contactId", "name email")
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
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const replyToConversation = async (req, res) => {
  try {
    const msg = await Message.create({
      conversationId: req.params.conversationId,
      sender: "STAFF",
      content: req.body.message,
    });

    io.to(req.user.workspaceId.toString()).emit("newMessage", msg);
    io.to(req.user.workspaceId.toString()).emit("dashboard:update");
    io.to(`conversation_${req.params.conversationId}`).emit("newMessage", msg);

    res.json({ message: "Reply sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
