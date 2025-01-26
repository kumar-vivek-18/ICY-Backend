import express from "express";
import {
  confirmAvailability,
  createHotel,
  getAllHotels,
  getHotelDetails,
  getHotelsByCity,
  getHotelsByDate,
  roomsNearMe,
} from "../controllers/hotelController.js";
import { uploads } from "../middlewares/multer.middleware.js";

const router = express.Router();
router.post("/add-hotel", uploads, createHotel);

router.route("/hotels-by-city").get(getHotelsByCity);
router.route("/hotels-by-dates").get(getHotelsByDate);
router.route("/confirm-availability").get(confirmAvailability);
router.route("/rooms-near-me").get(roomsNearMe);
router.route("/hotel-details").get(getHotelDetails);
router.route("/all-hotels").get(getAllHotels);
export default router;
