import { Properties } from "../models/properties.model.js";
import { uploadFileToCloudinary } from "../utils/cloudinary.js";


export const addProperty = async (req, res) => {
    try {
        const { userName, email, contactNumber, propertyDescription, propertyPriceLB, propertyPriceUB, city, pinCode, address, propertyArea, bedRooms, bathRooms, facilities } = req.body;

        if (!userName || !email || !contactNumber || !propertyDescription || !propertyPriceLB || !propertyPriceUB || !city || !pinCode || !address) return res.status(400).json({ message: "Please complete the fields" });
        console.log(userName, propertyDescription, propertyPriceLB, propertyPriceUB, city, req.files);
        let propertyImages = [];
        let propertyVideos = [];


        if (req.files) {
            if (req.files?.propertyImages && req.files?.propertyImages.length > 0) {
                propertyImages = await Promise.all(req.files.propertyImages.map(async (file) => {
                    if (file.fieldname === "propertyImages") {
                        return await uploadFileToCloudinary(file.path);
                    }
                }));
            }
            if (req.files?.propertyVideos && req.files?.propertyVideos.length > 0) {
                propertyVideos = await Promise.all(req.files.propertyVideos.map(async (file) => {
                    if (file.fieldname === "propertyVideos") {
                        return await uploadFileToCloudinary(file.path);
                    }
                }));
            }
        }

        // console.log('images/videos', propertyImages, propertyVideos);

        const createProperty = await Properties.create({
            userName: userName,
            email: email,
            contactNumber: contactNumber,
            propertyDescription: propertyDescription,
            propertyPrice: {
                lb: propertyPriceLB,
                ub: propertyPriceUB
            },
            propertyLocation: {
                city: city,
                pinCode: pinCode,
                address: address
            },
            propertyImages: propertyImages,
            propertyVideos: propertyVideos,
            propertyArea: propertyArea,
            bedRooms: bedRooms,
            bathRooms: bathRooms,
            facilities: facilities
        });

        if (!createProperty) return res.status(500).json({ message: "Error occured while creating property" });


        return res.status(200).json(createProperty);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

export const getProperties = async (req, res) => {

    try {
        const { type } = req.query;
        const properties = await Properties.find({ verified: type }).lean();

        if (!properties) return res.status(404).json({ message: "No properties found" });

        return res.status(200).json(properties);

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }

}

export const updatePropertyStatus = async (req, res) => {

    try {
        const { propertyId, status } = req.body;

        console.log(propertyId, status);

        if (!propertyId || !status) return res.status(400).json({ message: "Please fill all the fields" });

        const updateProperty = await Properties.findByIdAndUpdate({ _id: propertyId }, { verified: status }, { new: true }).lean();

        if (!updateProperty) return res.status(500).json({ message: "Error occured while updating property status" });

        return res.status(200).json({ message: "Property updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}