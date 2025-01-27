import express from "express";
import {
  bookingHistory,
  createBooking,
  upcomingBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

router.route("/book-room").post(createBooking);
router.route("/upcoming-bookings").get(upcomingBookings);
router.route("/booking-history").get(bookingHistory);
router.route("/update-booking-status").post(updateBookingStatus);

export default router;
