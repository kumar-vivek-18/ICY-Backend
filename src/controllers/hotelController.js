import { Hotel } from "../models/hotel.model.js";
import { Room } from "../models/room.model.js";

export const createHotel = async (req, res) => {
  try {
    const {name, owner, location, description, hotelAmenities, images,hotelCategory, alphaRooms, betaRooms, gammaRooms} = req.body;

    if(!name || !owner || !location || !description || !hotelAmenities || !images || !alphaRooms || !betaRooms || !gammaRooms || !hotelCategory) 
      return res.status(400).json({message:"All fields are required"});
    let hotelImages=[];

    if(req.files && Array.isArray(req.files)) {
      hotelImages= req.files.map((file)=>{return `${process.env.SEVRVER_URI}/uploads/${file.filename}`});
    }

    const newHotel= await Hotel.create({
      name:name,
      owner:owner,
      category:hotelCategory,
      location:location,
      description:description,
      hotelAmenities:hotelAmenities,
      images:hotelImages,
    }).lean();

    
    if(alphaRooms>0) {
      for(let i=2025; i<=2027; i++) {
        for(let j=1; j<=365; j++) {
          await Room.create({
            hotelId:newHotel._id,
            roomType:"alpha",
            day:j,
            year:i,
            availableRooms:alphaRooms
          }).lean();
        }
      }
    }
    if(alphaRooms>0) {
      for(let i=2025; i<=2027; i++) {
        for(let j=1; j<=365; j++) {
          await Room.create({
            hotelId:newHotel._id,
            roomType:"alpha",
            day:j,
            year:i,
            availableRooms:alphaRooms
          }).lean();
        }
      }
    }

    if(betaRooms>0) {
      for(let i=2025; i<=2027; i++) {
        for(let j=1; j<=365; j++) {
          await Room.create({
            hotelId:newHotel._id,
            roomType:"alpha",
            day:j,
            year:i,
            availableRooms:betaRooms
          }).lean();
        }
      }
    }

    if(gammaRooms>0) {
      for(let i=2025; i<=2027; i++) {
        for(let j=1; j<=365; j++) {
          await Room.create({
            hotelId:newHotel._id,
            roomType:"alpha",
            day:j,
            year:i,
            availableRooms:gammaRooms
          }).lean();
        }
      }
    }


    res.status(201).json(newHotel);

  } catch (error) {
    res.status(500).json({ message: "Error creating hotel", error });
  }
};




export const getHotelsByCity = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: "City is required." });
    }

    const hotels = await Hotel.find({ location: { $regex: city, $options: 'i' } }).lean();

    if (!hotels || hotels.length === 0) {
      return res.status(404).json({ message: `No hotels found in ${city}.` });
    }

    const rooms = await Promise.all(
      hotels.map(async (hotel) => {
        return Room.find({ hotelId: hotel._id }).populate('hotelId').lean();
      })
    );

    const flattenedRooms = rooms.flat();

    return res.status(200).json(flattenedRooms);
  } catch (error) {
    console.error("Error fetching hotels by city:", error);
    return res.status(500).json({ message: "An error occurred.", error: error.message });
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


export const roomsNearMe= async(req, res) => {
  try {
    const {lon, lat} = req.query;

    if(!lat || !lon) return res.status(400).json({message:"Langitude and Latitude are required"});

    const hotels = await Hotel.find({
      "location.coords":{
        $near:{
          $geometry:{
            type:'Point',
            coordinates:[parseFloat(lon),parseFloat(lat)]
          },
          $maxDistance:15000
        }
      }
    });

    if (!hotels || hotels.length === 0) {
      return res.status(404).json({ message: `No hotels found in ${city}.` });
    }

    const rooms = await Promise.all(
      hotels.map(async (hotel) => {
        return Room.find({ hotelId: hotel._id }).populate('hotelId').lean();
      })
    );

    const flattenedRooms = rooms.flat();

    return res.status(200).json(flattenedRooms);

  } catch (error) {
    return res.status(500).json({message:"Internal Server Error",error:error.message})
  }
}



