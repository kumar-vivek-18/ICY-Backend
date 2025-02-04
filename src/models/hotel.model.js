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
        default: "Point", // The "type" field is mandatory for geospatial queries.
      },
      coordinates: {
        type: [Number],
        default: [0, 0], // Default value, but should be updated with real coordinates.
        required: true, // Ensure coordinates are always present.
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
      default: [],
    },
    images: { type: [String], default: [] },
    ratings: {
      totalRating: { type: Number, default: 0 },
      totalUsers: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);
hotelSchema.index({ coords: "2dsphere" });

export const Hotel = mongoose.model("Hotel", hotelSchema);
