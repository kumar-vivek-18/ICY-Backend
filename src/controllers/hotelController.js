import { Hotel } from "../models/hotel.model.js";
import { Room } from "../models/room.model.js";
import { uploadFileToCloudinary } from "../utils/cloudinary.js";

export const createHotel = async (req, res) => {
  try {
    const {
      name,
      owner,
      hotelAddress,
      hotelCity,
      hotelState,
      description,
      hotelAmenities,
      hotelCategory,
      alphaRooms,
      betaRooms,
      gammaRooms,
      alphaPrice,
      betaPrice,
      gammaPrice,
    } = req.body;

    console.log(
      name,
      owner,
      description,
      hotelAmenities,
      hotelCategory,
      alphaRooms,
      betaRooms,
      gammaRooms
    );
    if (
      !name ||
      !owner ||
      !description ||
      !hotelAmenities ||
      !alphaRooms ||
      !betaRooms ||
      !gammaRooms ||
      !hotelCategory
    )
      return res.status(400).json({ message: "All fields are required" });
    let hotelImages = [];

    if (req.files) {
      if (req.files?.images && req.files?.images.length > 0) {
        hotelImages = await Promise.all(
          req.files.images.map(async (file) => {
            if (file.fieldname === "images") {
              return await uploadFileToCloudinary(file.path);
            }
          })
        );
      }
    }

    const newHotel = await Hotel.create({
      name: name,
      owner: owner,
      category: hotelCategory,
      hotelAddress: hotelAddress,
      hotelCity: hotelCity,
      hotelState: hotelState,
      description: description,
      hotelAmenities: hotelAmenities,
      images: hotelImages,
    });

    const days = [];
    if (alphaRooms > 0) {
      for (let i = 2025; i <= 2027; i++) {
        for (let j = 1; j <= 365; j++) {
          days.push({ i, j });
        }
      }
    }
    if (alphaRooms > 0) {
      const alphas = await Promise.all(
        days.map(async (curr) => {
          console.log(curr.i, curr.j, curr);
          await Room.create({
            hotelId: newHotel._id,
            roomType: "alpha",
            day: curr.i,
            year: curr.j,
            pricing: alphaPrice,
            availableRooms: alphaRooms,
          });
        })
      );
    }

    if (betaRooms > 0) {
      const alphas = await Promise.all(
        days.map(async (curr) => {
          await Room.create({
            hotelId: newHotel._id,
            roomType: "beta",
            day: curr.i,
            year: curr.j,
            pricing: betaPrice,
            availableRooms: betaRooms,
          });
        })
      );
    }

    if (gammaRooms > 0) {
      const alphas = await Promise.all(
        days.map(async (curr) => {
          await Room.create({
            hotelId: newHotel._id,
            roomType: "gamma",
            day: curr.i,
            year: curr.j,
            pricing: gammaPrice,
            availableRooms: gammaRooms,
          });
        })
      );
    }
    res.status(201).json(newHotel);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating hotel", error: error.message });
  }
};

export const getHotelsByCity = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: "City is required." });
    }

    const hotels = await Hotel.find({
      location: { $regex: city, $options: "i" },
    }).lean();

    if (!hotels || hotels.length === 0) {
      return res.status(404).json({ message: `No hotels found in ${city}.` });
    }

    const rooms = await Promise.all(
      hotels.map(async (hotel) => {
        return Room.find({ hotelId: hotel._id }).populate("hotelId").lean();
      })
    );

    const flattenedRooms = rooms.flat();

    return res.status(200).json(flattenedRooms);
  } catch (error) {
    console.error("Error fetching hotels by city:", error);
    return res
      .status(500)
      .json({ message: "An error occurred.", error: error.message });
  }
};

export const confirmAvailability = async (req, res) => {
  const { hotelId, date } = req.query;

  try {
    const availability = await Room.findOne({
      hotelId,
      date: new Date(date),
    });

    if (!availability) {
      return res
        .status(404)
        .json({ message: "No availability data found for the given date" });
    }

    res.status(200).json({ availableRooms: availability.availableRooms });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const roomsNearMe = async (req, res) => {
  try {
    const { lon, lat } = req.query;

    if (!lat || !lon)
      return res
        .status(400)
        .json({ message: "Langitude and Latitude are required" });

    const hotels = await Hotel.find({
      "location.coords": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lon), parseFloat(lat)],
          },
          $maxDistance: 15000,
        },
      },
    });

    if (!hotels || hotels.length === 0) {
      return res.status(404).json({ message: `No hotels found in ${city}.` });
    }

    const rooms = await Promise.all(
      hotels.map(async (hotel) => {
        return Room.find({ hotelId: hotel._id }).populate("hotelId").lean();
      })
    );

    const flattenedRooms = rooms.flat();

    return res.status(200).json(flattenedRooms);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
