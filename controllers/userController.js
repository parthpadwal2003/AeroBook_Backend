import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ✅ Fix: Ensure `username` is used consistently
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // ✅ Check for existing user by username & email
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(400).json({ message: "Username or Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Save user with `username`
    const user = await User.create({
      username,  // Ensure `username` is stored correctly
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (err) {
    console.error("Error in registerUser:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ✅ Fix: Ensure login works correctly
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user.id,
      username: user.username, // ✅ Return `username`
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (err) {
    console.error("Error in loginUser:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
