import mongoose from "mongoose";
import { Hotel } from "./hotel.model.js";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalRooms: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    transactionId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

bookingSchema.methods.hotelDetails = async function () {
  if (!this.room) {
    throw new Error("Room reference not found");
  }

  const room = await mongoose
    .model("Room")
    .findById(this.room)
    .select("-availability")
    .lean();
  if (!room || !room.hotelId) {
    throw new Error("Hotel reference not found in room");
  }
  let hotelId = room.hotelId.toString();
  const hotelDetails = await mongoose.model("Hotel").findById(hotelId);
  return hotelDetails;
};

export const Booking = mongoose.model("Booking", bookingSchema);
