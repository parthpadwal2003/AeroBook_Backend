import axios from "axios";
import express from "express";

const router = express.Router();

// 🔥 Search by Flight Number
router.get("/:flightNumber", async (req, res) => {
  const flightNumber = req.params.flightNumber;
  const API_KEY = process.env.AVIATION_API_KEY;

  try {
    const response = await axios.get(
      // `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}&flight_iata=${flightNumber}`
    );

    if (!response.data || !response.data.data || response.data.data.length === 0) {
      return res.status(404).json({ message: "Flight not found" });
    }

    const flight = response.data.data[0];

    res.json({
      flightNumber: flight.flight?.iata || "N/A",
      status: flight.flight_status || "Unknown",
      departure: flight.departure?.airport || "Unknown",
      arrival: flight.arrival?.airport || "Unknown",
      scheduledDeparture: flight.departure?.scheduled || "Unknown",
      scheduledArrival: flight.arrival?.scheduled || "Unknown",
    });
  } catch (error) {
    console.error("❌ Error fetching flight data:", error.message);
    res.status(500).json({ error: "Failed to fetch flight data" });
  }
});

// 🔥 NEW ROUTE: Search by Source & Destination
router.get("/search", async (req, res) => {
  const { source, destination } = req.query;
  const API_KEY = process.env.AVIATION_API_KEY;

  if (!source || !destination) {
    return res.status(400).json({ message: "Source and destination are required!" });
  }

  try {
    const response = await axios.get(
      `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}`
    );

    if (!response.data || !response.data.data) {
      return res.status(404).json({ message: "No flights found" });
    }

    // ✅ Filter flights by Source and Destination
    const flights = response.data.data.filter(
      (flight) =>
        flight.departure?.airport?.toLowerCase() === source.toLowerCase() &&
        flight.arrival?.airport?.toLowerCase() === destination.toLowerCase()
    );

    if (flights.length === 0) {
      return res.status(404).json({ message: "No matching flights found" });
    }

    res.json(
      flights.map((flight) => ({
        flightNumber: flight.flight?.iata || "N/A",
        status: flight.flight_status || "Unknown",
        departure: flight.departure?.airport || "Unknown",
        arrival: flight.arrival?.airport || "Unknown",
        scheduledDeparture: flight.departure?.scheduled || "Unknown",
        scheduledArrival: flight.arrival?.scheduled || "Unknown",
      }))
    );
  } catch (error) {
    console.error("❌ Error fetching flights:", error.message);
    res.status(500).json({ error: "Failed to fetch flight data" });
  }
});

export default router;
