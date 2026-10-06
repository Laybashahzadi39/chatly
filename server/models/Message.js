import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    // ref: "User" matlab ye id User collection ke kisi user ki hai
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;