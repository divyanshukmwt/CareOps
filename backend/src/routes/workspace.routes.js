import express from "express";
import { createWorkspace } from "../controller/workspace.controller.js";

const router = express.Router();

router.post("/", createWorkspace);

export default router;
