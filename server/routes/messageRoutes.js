import express from "express";
import { getMessages, sendMessage } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:userId", protect, getMessages);   // purani chat lao
router.post("/:userId", protect, sendMessage);  // naya message bhejo

export default router;