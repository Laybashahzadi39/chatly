import User from "../models/User.js";
import Message from "../models/Message.js";

// Baqi users ki list, har user ke saath mera aur uska aakhri message
export const getUsers = async (req, res) => {
  try {
    const myId = String(req.user._id);

    // lean() = sada JavaScript object deta hai, spread karna asaan
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("-password")
      .lean();

    // Mere sab messages, naye pehle
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .sort({ createdAt: -1 })
      .lean();

    // Har dusre user ka sirf PEHLA (yani sab se naya) message yaad rakho
    const lastMessageMap = {};
    for (const m of messages) {
      const otherId = String(m.sender) === myId ? String(m.receiver) : String(m.sender);
      if (!lastMessageMap[otherId]) lastMessageMap[otherId] = m;
    }

    const result = users.map((u) => ({
      ...u,
      lastMessage: lastMessageMap[String(u._id)] || null,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Could not load users." });
  }
};