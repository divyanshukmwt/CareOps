import express from "express";
import { createForm, getForms } from "../controller/form.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, getForms);
router.post("/", requireAuth, createForm);

export default router;
