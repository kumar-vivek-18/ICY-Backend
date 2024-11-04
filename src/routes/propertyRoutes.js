import express from 'express';
import { addProperty, getProperties, updatePropertyStatus } from '../controllers/propertiesController.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();


router.route('/add-property').post(upload, addProperty);
router.route('/all-properties').get(getProperties);
router.route('/update-property-status').post(updatePropertyStatus);

export default router;