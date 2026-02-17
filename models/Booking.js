import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Associate booking with user
  flightNumber: { type: String, required: true },
  departure: { type: String, required: true },
  arrival: { type: String, required: true },
  passengerName: { type: String, required: true },
  email: { type: String, required: true },
  passportNumber: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  seatPreference: { type: String, enum: ["Window", "Aisle", "Middle"], required: true },
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
