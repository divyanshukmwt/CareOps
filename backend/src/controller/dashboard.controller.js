import Conversation from "../models/conversation.models.js";
import Message from "../models/message.models.js";
import Booking from "../models/booking.models.js";

export const getDashboardStats = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    /* ---------------- LEADS & INBOX ---------------- */

    const totalConversations = await Conversation.countDocuments({
      workspaceId,
    });

    const conversations = await Conversation.find({ workspaceId });

    let unansweredConversations = 0;
    let newInquiriesToday = 0;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    for (const conv of conversations) {
      const lastMessage = await Message.findOne({
        conversationId: conv._id,
      }).sort({ createdAt: -1 });

      if (
        lastMessage &&
        lastMessage.sender === "CUSTOMER" &&
        conv.isAutoPaused === false
      ) {
        unansweredConversations++;
      }

      if (conv.createdAt >= todayStart) {
        newInquiriesToday++;
      }
    }

    /* ---------------- BOOKINGS ---------------- */

    const totalBookings = await Booking.countDocuments({ workspaceId });

    const todaysBookings = await Booking.countDocuments({
      workspaceId,
      scheduledAt: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    });

    const upcomingBookings = await Booking.countDocuments({
      workspaceId,
      scheduledAt: { $gt: todayEnd },
      status: "CONFIRMED",
    });

    const completedBookings = await Booking.countDocuments({
      workspaceId,
      status: "COMPLETED",
    });

    const noShowBookings = await Booking.countDocuments({
      workspaceId,
      status: "NO_SHOW",
    });

    /* ---------------- ALERTS ---------------- */

    const alerts = [];

    if (unansweredConversations > 0) {
      alerts.push(
        `${unansweredConversations} conversation(s) awaiting reply`
      );
    }

    if (todaysBookings > 0) {
      alerts.push(`${todaysBookings} booking(s) scheduled today`);
    }

    res.json({
      /* Leads */
      totalConversations,
      unansweredConversations,
      newInquiriesToday,

      /* Bookings */
      totalBookings,
      todaysBookings,
      upcomingBookings,
      completedBookings,
      noShowBookings,

      alerts,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};