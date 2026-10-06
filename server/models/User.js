import mongoose from "mongoose";

// Schema = database mein user ka naqsha (kaun si fields hongi)
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true } // createdAt aur updatedAt khud ban jayenge
);

// Model = is naqshe se "users" collection banata hai
const User = mongoose.model("User", userSchema);

export default User;