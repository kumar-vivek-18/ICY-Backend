import express from "express";
import {
  bookingHistory,
  createBooking,
  upcomingBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

router.route("/book-room").post(createBooking);
router.route("/upcoming-bookings").post(upcomingBookings);
router.route("/booking-history").post(bookingHistory);
router.route("/update-booking-status").post(updateBookingStatus);

export default router;
