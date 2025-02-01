import { Hotel } from "../models/hotel.model.js";
import { Rating } from "../models/rating.model.js";

export const createRating = async (req, res) => {
  try {
    const { userId, hotelId, rating, feedback } = req.body;
    if (!userId || !hotelId || !rating || !feedback)
      return res.status(400).json({ message: "All details are required" });

    const createdRating = await Rating.create({
      hotelId: hotelId,
      userId: userId,
      rating: rating,
      feedback: feedback,
    });
    if (!createdRating)
      return res
        .status(409)
        .json({ message: "Error occured while created hotel rating" });
    const updatedHoteldDetails = await Hotel.findByIdAndUpdate(hotelId, {
      $inc: { "ratings.totalRating": rating, "ratings.totalUsers": 1 },
    });
    return res.status(201).json(createdRating);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    let { hotelId, userId } = req.query;

    if (!hotelId)
      return res.status(400).json({ message: "HotelId is required" });
    if (!userId) userId = null;
    console.log(hotelId, userId);
    const allRatings = await Rating.find({
      hotelId: hotelId,
      userId: { $ne: userId },
      feedback: { $ne: "" },
    });
    if (!allRatings)
      return res
        .status(409)
        .json({ message: "Error occured while creating rating" });
    let userRating = {};
    if (userId)
      userRating = await Rating.findOne({ hotelId: hotelId, userId: userId });

    if (!allRatings)
      return res
        .status(404)
        .json({ message: "No ratings found for given hotel" });
    return res.status(200).json({ allRatings, userRating });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateRating = async (req, res) => {
  try {
    const { ratingId, rating, feedback } = req.body;
    if (!ratingId)
      return res.status(400).json({ message: "RatingId is required" });

    const updatedRating = await Rating.findById(ratingId);
    const currRating = updatedRating.rating;
    updatedRating.rating = rating;
    updatedRating.feedback = feedback;
    updatedRating.save();

    const updatedHoteldDetails = await Hotel.findByIdAndUpdate(
      updatedRating.hotelId.toString(),
      {
        $inc: { "ratings.totalRating": rating - currRating },
      }
    );

    if (!updatedRating)
      return res
        .status(409)
        .json({ message: "Error occured while updating rating" });

    return res.status(200).json(updatedRating);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
