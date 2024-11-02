import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
    try {
        const { userName, email, contactNumber, password } = req.body;

        if (!userName || !email || !contactNumber || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(409).json({ message: "User already exists, please login" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            userName,
            email,
            contactNumber,
            password: hashedPassword
        });

        if (!newUser) {
            return res.status(500).json({ message: "Error occurred while creating user" });
        }

        const { password: _, ...userWithoutPassword } = newUser.toObject();
        return res.status(201).json(userWithoutPassword);
    } catch (error) {
        return res.status(500).json({ message: "Error occurred while creating user", error: error.message });
    }
};


export const getUser = async (req, res) => {
    try {
        const { email, password } = req.query;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email }).lean();

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
