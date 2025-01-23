import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import { connectDB } from "./db/db.js";
import cors from "cors";
import colors from "colors";

dotenv.config();
connectDB();

const app = express();

app.get("/", (req, res) => {
  return res.send("Welcome to ICY Hotels");
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/hotels", hotelRoutes);
app.use("/api/v1/booking", bookingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold);
});
