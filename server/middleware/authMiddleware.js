import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Chowkidar: token check karta hai. Sahi ho to aage jaane deta hai
export const protect = async (req, res, next) => {
  try {
    // Token header mein aisa aata hai:  Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Login required (Token is missing)" });
    }

    const token = authHeader.split(" ")[1]; // "Bearer" ke baad wala hissa

    // Token asli hai? Is mein se user ki id nikal lo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // DB se user dhoondo (password ke baghair)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: " User not found." });
    }

    // User ko request mein rakh do, controller isay use karega
    req.user = user;
    next(); // ab agle function (controller) par jao
  } catch (error) {
    res.status(401).json({ message: "Not authorized. Token is invalid or expired." });
  }
};