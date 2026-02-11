import express from "express";
import { submitContactForm } from "../controller/public.controller.js";

const router = express.Router();

// PUBLIC CONTACT FORM
router.post("/f/:workspacePublicId", submitContactForm);

export default router;
