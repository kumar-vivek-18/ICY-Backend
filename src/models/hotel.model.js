import mongoose from "mongoose";
import { Room } from "./room.model.js";

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: String },
    category: {
      type: String,
      enum: ["ICY YELLOW", "ICY WHITE", "ICY BLACK"],
      default: "ICY YELLOW",
    },
    hotelAddress: {
      type: String,
      default: "",
    },
    hotelCity: {
      type: String,
      default: "",
    },
    hotelState: {
      type: String,
      default: "",
    },
    coords: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    description: { type: String, required: true },
    hotelAmenities: {
      type: [String],
      enum: [
        "Swimming Pool",
        "Restaurant",
        "Bar",
        "Lounge",
        "Power Backup",
        "Free Parking",
        "Air Conditioning",
        "Room Service",
        "Free Wi-Fi",
        "Refrigerator",
        "Laundry Service",
        "Smoke Detector",
        "Housekeeping",
        "Ironing Service",
        "Elevator/Lift",
        "Childcare Services",
        "Dining Area",
        "Fire Extinguishers",
        "CCTV",
        "First-aid Services",
        "Night Club",
        "Luggage Storage",
        "Wake-up Call",
        "Doctor on Call",
        "Luggage Assistance",
        "Bellboy Service",
        "Pool/Beach towels",
        "Seating Area",
        "Balcony/Terrace",
        "Reception",
        "Outdoor Furniture",
        "Lawn",
        "Printer",
        "Kid's Menu",
        "Security Guard",
        "Breakfast",
        "Music System",
      ],
      default: [], // Default empty array
    },
    images: { type: [String], default: [] },
    ratings: {
      totalRating: { type: Number, default: 0 },
      totalUsers: { type: Number, default: 0 },
    },
    alphaPrice: {
      type: Number,
      default: 0,
    },
    betaPrice: {
      type: Number,
      default: 0,
    },
    gammaPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// hotelSchema.post("save", async function (hotel) {
//   const startDate = new Date();
//   const endDate = new Date();
//   endDate.setDate(startDate.getDate() + 30);

//   let currentDate = new Date(startDate);

//   while (currentDate <= endDate) {
//     const existingAvailability = await Room.findOne({
//       hotelId: hotel._id,
//       date: currentDate,
//     });

//     if (!existingAvailability) {
//       // Create room availability record for each day
//       await Room.create({
//         hotelId: hotel._id,
//         date: currentDate,
//         availableRooms: hotel.totalRooms, // Initially set available rooms to total rooms
//         bookedRooms: 0,
//       });
//     }

//     // Move to the next day
//     currentDate.setDate(currentDate.getDate() + 1);
//   }
// });

export const Hotel = mongoose.model("Hotel", hotelSchema);
