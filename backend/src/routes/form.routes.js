import express from "express";
import {
  getPublicForm,
  submitPublicForm,
  createForm,
} from "../controller/form.controller.js";

const router = express.Router();

router.get("/public/:bookingFormId", getPublicForm);
router.post("/public/:bookingFormId", submitPublicForm);
router.post("/", createForm);

export default router;
