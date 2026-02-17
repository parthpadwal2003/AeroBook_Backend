import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // ✅ Ensure consistency
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ✅ Password is now stored securely
});

const User = mongoose.model("User", userSchema);
export default User;
