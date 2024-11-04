import express from 'express';
import { createUser, getUser } from '../controllers/userController.js';

const router = express.Router();


router.route('/').post(createUser);
router.route('/get-user').get(getUser);


export default router;