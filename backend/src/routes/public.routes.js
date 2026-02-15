import express from "express";
import { submitContactForm, getPublicConversationMessages, postPublicMessage } from "../controller/public.controller.js";
import {
  getPublicForm,
  submitPublicForm,
  getPublicFormsByWorkspace,
} from "../controller/form.controller.js";

const router = express.Router();

router.post("/f/:workspacePublicId", submitContactForm);

router.get("/forms/:workspaceId", getPublicFormsByWorkspace);

router.get("/form/:bookingFormPublicId", getPublicForm);
router.post("/form/:bookingFormPublicId", submitPublicForm);

router.get("/chat/:conversationId/messages", getPublicConversationMessages);
router.post("/chat/:conversationId/messages", postPublicMessage);

// backward-compatible routes used by frontend public chat page
router.get("/chat/:conversationId", getPublicConversationMessages);
router.post("/chat/:conversationId", postPublicMessage);

export default router;
