import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/signup  ->  signup function chalega
router.post("/signup", signup);

// POST /api/auth/login   ->  login function chalega
router.post("/login", login);

export default router;