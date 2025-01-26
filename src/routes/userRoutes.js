import express from "express";
import {
  checkUser,
  createUser,
  updateImage,
  updateUserProfile,
} from "../controllers/userController.js";
import { uploads } from "../middlewares/multer.middleware.js";
const router = express.Router();

// Route for check if user exists
router.route("/check-user").get(checkUser);

router.route("/create-user").post(createUser);
router.route("/update-user-profile").patch(updateUserProfile);
router.route("/update-user-image").post(uploads, updateImage);

export default router;
