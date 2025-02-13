import express from "express";
import {
  bookingHistory,
  createBooking,
  upcomingBookings,
  updateBookingStatus,
  updatePaymentStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

router.route("/book-room").post(createBooking);
router.route("/upcoming-bookings").get(upcomingBookings);
router.route("/booking-history").get(bookingHistory);
router.route("/update-booking-status").patch(updateBookingStatus);
router.route("/update-payment-status").patch(updatePaymentStatus);

export default router;
