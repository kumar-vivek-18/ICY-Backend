import { Booking } from "../models/booking.model.js";

export const createBooking = async (req, res) => {
  try {
    const {
      user,
      room,
      checkInDate,
      checkOutDate,
      totalRooms,
      totalPrice,
      status,
      paymentStatus,
      transactionId,
    } = req.body;

    const newBooking = new Booking({
      user,
      room,
      checkInDate,
      checkOutDate,
      totalRooms,
      totalPrice,
      status,
      paymentStatus,
      transactionId,
    });

    const savedBooking = await newBooking.save();

    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate("room", "-availability")
      .lean();

    res.status(201).json(populatedBooking);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error creating booking", error });
  }
};

export const upcomingBookings = async (req, res) => {
  try {
    const { userId } = req.query;
    console.log("user", userId);
    if (!userId) return res.status(400).json({ message: "UserId is required" });
    const bookings = await Booking.find({
      user: userId,
      status: "Confirmed",
    })
      .populate("room", "-availability")
      .sort({ createdAt: -1 });
    // for (const booking of bookings) {
    //   const hotelDetails = await booking.hotelDetails();
    //   booking.hotelDetails = hotelDetails;
    // }
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};

export const bookingHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    const bookings = await Booking.find({ user: userId, status: "Completed" })
      .populate("room", "-availability")
      .lean();
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching bookings", error });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    if (!bookingId || !status)
      return res.status(400).json({ message: "Invalid data" });
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, booking: updatedBooking });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating booking status",
      error,
    });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { bookingId, paymentStatus, transactionId } = req.body;

    if ((!bookingId || !paymentStatus, !transactionId))
      return res.status(400).json({ message: "Invalid data" });

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentStatus, transactionId },
      { new: true }
    );

    if (!updatedBooking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, booking: updatedBooking });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating booking status",
      error,
    });
  }
};
