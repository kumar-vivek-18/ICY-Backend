import { User } from "../models/user.model.js";
import { uploadFileToCloudinary } from "../utils/cloudinary.js";

export const checkUser = async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber)
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });

    const existingUser = await User.findOne({ phoneNumber: phoneNumber });

    if (!existingUser)
      return res.status(200).json({
        success: true,
        exists: false,
        data: null,
      });

    if (existingUser)
      return res.status(200).json({
        success: true,
        exists: true,
        data: existingUser,
      });
  } catch (error) {
    console.error("Error in checking User", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { phoneNumber, name, email, gender } = req.body;

    if (!phoneNumber || !name || !gender || !email)
      return res.status(400).json({
        success: false,
        message: "phone number is required",
      });

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const newUser = await User.create({
      phoneNumber: phoneNumber,
      name: name,
      email: email,
      gender: gender,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId, updatedFields } = req.body;

    if (!userId || !updatedFields)
      return res.status(400).json({ message: "All fields are required" });

    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    });

    if (!updatedUser) return res.status(409).json({ message: "Error occured" });
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateImage = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    let userImage = [];

    if (req.files && req.files.images && req.files.images.length > 0) {
      try {
        userImage = await Promise.all(
          req.files.images.map(async (file) => {
            const result = await uploadFileToCloudinary(file.path);
            return result;
          })
        );
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Failed to upload images to Cloudinary", error });
      }
    }

    if (userImage.length === 0) {
      return res.status(400).json({ message: "No images provided for upload" });
    }

    const updatedUserImage = await User.findByIdAndUpdate(
      userId,
      { userImage: userImage[0] },
      { new: true }
    );

    if (!updatedUserImage) {
      return res
        .status(404)
        .json({ message: "User not found or update failed" });
    }

    return res.status(200).json(updatedUserImage);
  } catch (error) {
    console.error("Error updating image:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
