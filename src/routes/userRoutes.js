import express from 'express';
import { checkUser, createUser } from '../controllers/userController.js';
const router = express.Router();

// Route for check if user exists
router.route("/check-user").get( checkUser);

router.route("/create-user").post(createUser);

export default router;
