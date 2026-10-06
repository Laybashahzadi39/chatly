import Message from "../models/Message.js";

// ---------- Purani chat lana ----------
export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const otherId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherId },
        { sender: otherId, receiver: myId },
      ],
    }).sort({ createdAt: 1 }); // purane pehle, naye baad mein

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Could not load messages." });
  }
};

// ---------- Naya message bhejna ----------
export const sendMessage = async (req, res) => {
  try {
    const text = req.body.text?.trim();

    if (!text) {
      return res.status(400).json({ message: "Message cannot be empty." });
    }

    const message = await Message.create({
      sender: req.user._id,        // bhejne wala = jo login hai
      receiver: req.params.userId, // paane wala = URL se
      text,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Could not send message." });
  }
};