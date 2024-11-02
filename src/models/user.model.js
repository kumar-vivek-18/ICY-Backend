import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    userName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        index: true,
    },
    contactNumber: {
        type: String,
    },
    password: {
        type: String,
    }

});

export const User = mongoose.model('User', userSchema);