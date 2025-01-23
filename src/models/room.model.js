import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    roomType: {
      type: String,
      enum: ["alpha", "beta", "gamma"],
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    availability: [
      {
        date: { type: Date, required: true },
        availableRooms: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Room = mongoose.model("Room", roomSchema);
