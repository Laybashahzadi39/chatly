import express from "express";
import { getUsers } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// protect pehle chalega (token check), phir getUsers
router.get("/", protect, getUsers);

export default router;