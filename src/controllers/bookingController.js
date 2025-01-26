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

    const bookings = await Booking.find({ user: userId, status: "Confirmed" })
      .populate({
        path: "room",
        select: "roomType",
        populate: {
          path: "hotel",
        },
      })
      .lean();
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching bookings", error });
  }
};

export const bookingHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    const bookings = await Booking.find({ user: userId, status: "Completed" })
      .populate({
        path: "room",
        select: "roomType",
        populate: {
          path: "hotel",
        },
      })
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
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
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
