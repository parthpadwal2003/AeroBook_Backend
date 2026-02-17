import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach user details to request
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ error: "Invalid token." });
    } else if (err.name === "TokenExpiredError") {
      return res.status(403).json({ error: "Token expired. Please login again." });
    }
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default authMiddleware;