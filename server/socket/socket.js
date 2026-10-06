import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../models/Message.js";

// Yaad dasht: kaun sa user kis socketId par online hai
// Shakal: { "userId1": "socketId1", "userId2": "socketId2" }
const userSocketMap = {};

export const initSocket = (httpServer) => {
  // Socket.IO server banao aur CORS allow karo
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL },
  });

  // ---- Connect hone se pehle token check (socket ka chowkidar) ----
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token; // client yahan token bhejega
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id; // user ki id socket ke saath chipka di
      next();
    } catch (error) {
      next(new Error("Authentication failed"));
    }
  });

  // ---- Jab koi user connect ho jaye ----
  io.on("connection", (socket) => {
    const userId = socket.userId;
    console.log("User connected:", userId);

    // Is user ko online list mein daalo
    userSocketMap[userId] = socket.id;

    // Sab ko online users ki nayi list bhejo
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // ---- Message bhejna ----
    // callback = bhejne wale ko wapas jawab (saved message) dene ke liye
    socket.on("sendMessage", async ({ receiverId, text }, callback) => {
      try {
        // 1) Pehle DB mein save
        const message = await Message.create({
          sender: userId,
          receiver: receiverId,
          text,
        });

        // 2) Receiver online hai? To usi ko live bhejo
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", message);
        }

        // 3) Bhejne wale ko saved message wapas do
        if (callback) callback({ success: true, message });
      } catch (error) {
        if (callback) callback({ success: false, error: error.message });
      }
    });

    // ---- Typing indicator ----
    socket.on("typing", ({ receiverId }) => {
      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", { senderId: userId });
      }
    });

    socket.on("stopTyping", ({ receiverId }) => {
      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stopTyping", { senderId: userId });
      }
    });

    // ---- Disconnect ----
    socket.on("disconnect", () => {
      console.log("User disconnected:", userId);
      delete userSocketMap[userId]; // online list se hata do
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return io;
};