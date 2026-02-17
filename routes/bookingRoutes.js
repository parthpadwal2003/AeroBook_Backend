import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Booking from "../models/Booking.js";

const router = express.Router();

// ✅ Create a new booking (Only for logged-in users)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { flightNumber, departure, arrival, passengerName, email, passportNumber, phoneNumber, seatPreference } = req.body;
    const userId = req.user.userId; // Extract logged-in user's ID from JWT

    const newBooking = new Booking({
      userId,
      flightNumber,
      departure,
      arrival,
      passengerName,
      email,
      passportNumber,
      phoneNumber,
      seatPreference,
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking successful!", booking: newBooking });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", authMiddleware, async (req, res) => { 
  try {
    const userId = req.user.userId;
    const bookings = await Booking.find({ userId });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
