import express from "express";
import {
  getInbox,
  getConversationMessages,
  replyToConversation,
} from "../controller/inbox.controller.js";

const router = express.Router();

// ✅ Specific routes FIRST
router.get("/conversation/:conversationId", getConversationMessages);
router.post("/conversation/:conversationId/reply", replyToConversation);

// ✅ Generic route LAST
router.get("/:workspaceId", getInbox);

export default router;
