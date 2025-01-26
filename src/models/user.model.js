import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Select Gender"],
    default: "Select Gender",
  },
  email: {
    type: String,
    default: "user@gmail.com",
  },
  userImage: {
    type: String,
    default:
      "https://res.cloudinary.com/dojp57ix9/image/upload/v1737902477/user-front-side-with-white-background_wnlxvu.jpg",
  },
});

export const User = mongoose.model("User", userSchema);
