import express from "express";
import {
  getInbox,
  getConversationMessages,
  replyToConversation,
} from "../controller/inbox.controller.js";
import { requireAuth } from "../middleware/requireauth.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getInbox);
router.get("/conversation/:conversationId", getConversationMessages);
router.post("/conversation/:conversationId/reply", replyToConversation);

export default router;
