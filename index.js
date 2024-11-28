import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/db/db.js';
import colors from 'colors';
import userRoutes from './src/routes/userRoutes.js';
import propertyRoutes from './src/routes/propertyRoutes.js';

const app = express();
dotenv.config({ path: '.env' });

app.use(express.json());
app.use(cors({
    origin: '*',
}))
app.get('/', (req, res) => {
    return res.send("Welcome to ICY Properties🎉");
})

app.use('/uploads', express.static('uploads'));

app.use('/v1/user', userRoutes);
app.use('/v1/property', propertyRoutes);
connectDB()
    .then(() => {
        app.listen(5000, () => {
            console.log("Server is running on port 5000");
        })
    })
    .catch((error) => {
        console.error("Error occured while starting server");
    })
