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

    console.log(hotelImages);

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

    let alpha, beta, gamma;
    if (alphaRooms > 0) {
      const today = new Date();
      const startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endDate = new Date(
        today.getFullYear() + 2,
        today.getMonth(),
        today.getDate()
      );
      const availability = [];
      for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        availability.push({
          date: new Date(d),
          availableRooms: alphaRooms,
        });
      }

      alpha = await Room.create({
        hotelId: newHotel._id,
        roomType: "alpha",
        price: alphaPrice,
        availability: availability,
      });
    }

    if (betaRooms > 0) {
      const today = new Date();
      const startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endDate = new Date(
        today.getFullYear() + 2,
        today.getMonth(),
        today.getDate()
      );
      const availability = [];
      for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        availability.push({
          date: new Date(d),
          availableRooms: betaRooms,
        });
      }

      beta = await Room.create({
        hotelId: newHotel._id,
        roomType: "beta",
        price: betaPrice,
        availability: availability,
      });
    }

    if (gammaRooms > 0) {
      const today = new Date();
      const startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endDate = new Date(
        today.getFullYear() + 2,
        today.getMonth(),
        today.getDate()
      );
      const availability = [];
      for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        availability.push({
          date: new Date(d),
          availableRooms: gammaRooms,
        });
      }

      gamma = await Room.create({
        hotelId: newHotel._id,
        roomType: "gamma",
        price: gammaPrice,
        availability: availability,
      });
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
    const { qs } = req.query;

    if (!qs) {
      return res.status(400).json({ message: "City is required." });
    }

    const hotels = await Hotel.find({
      $or: [
        { hotelCity: { $regex: qs, $options: "i" } },
        { hotelAddress: { $regex: qs, $options: "i" } },
      ],
    })
      .select("_id")
      .lean();

    if (!hotels || hotels.length === 0) {
      return res.status(404).json({ message: `No hotels found in ${qs}.` });
    }

    const rooms = await Promise.all(
      hotels.map(async (hotel) => {
        return Room.find({
          $and: [{ hotelId: hotel._id }],
        })
          .select("hotleId roomType price")
          .populate("hotelId")
          .lean();
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

export const getHotelsByDate = async (req, res) => {
  try {
    const { qs, startDate, endDate } = req.query;

    if (!qs || !startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "City, startDate, and endDate are required." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const hotels = await Hotel.find({
      $or: [
        { hotelCity: { $regex: qs, $options: "i" } },
        { hotelAddress: { $regex: qs, $options: "i" } },
      ],
    })
      .select("_id")
      .lean();

    if (!hotels || hotels.length === 0) {
      return res.status(404).json({ message: `No hotels found in ${qs}.` });
    }
    const hotelIds = hotels.map((hotel) => hotel._id);

    const rooms = await Room.find({
      hotelId: { $in: hotelIds },
      "availability.date": { $gte: start, $lte: end },
      "availability.availableRooms": { $gt: 0 },
    }).select("hotelId roomType availability");

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
