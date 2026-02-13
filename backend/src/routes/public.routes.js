import express from "express";
import { submitContactForm } from "../controller/public.controller.js";
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

export default router;
