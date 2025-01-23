import express from "express";
import {
  confirmAvailability,
  createHotel,
  getHotelsByCity,
  getHotelsByDate,
  roomsNearMe,
} from "../controllers/hotelController.js";
import { uploads } from "../middlewares/multer.middleware.js";

const router = express.Router();
router.post("/add-hotel", uploads, createHotel);

router.get("/hotels-by-city", getHotelsByCity);
router.get("/hotels-by-dates", getHotelsByDate);
router.get("/confirm-availability", confirmAvailability);
router.get("/rooms-near-me", roomsNearMe);

export default router;
