import express from "express";
import {
  createRating,
  getAllReviews,
  updateRating,
} from "../controllers/rating.Controller.js";

const router = express.Router();

router.route("/post-rating").post(createRating);
router.route("/get-hotel-ratings").get(getAllReviews);
router.route("/update-rating").patch(updateRating);

export default router;
