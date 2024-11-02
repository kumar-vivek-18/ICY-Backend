import mongoose, { Schema } from "mongoose";

const locationSchema = new Schema({
    city: {
        type: String,
        trim: true,
    },
    pinCode: {
        type: Number,
    },
    address: {
        type: String,
        trim: true
    }

})

const propertiesSchema = new Schema({
    // owner: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    // },
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
    propertyDescription: {
        type: String,
    },
    propertyPrice: {
        lb: { type: Number },
        ub: { type: Number },
    },
    propertyLocation: locationSchema,
    propertyImages: [{
        type: String,
    }],
    propertyVideos: [{
        type: String,
    }],
    propertyArea: {
        type: Number,
    },
    bedRooms: {
        type: Number,
    },
    bathRooms: {
        type: Number,
    },
    verified: {
        type: String,
        enum: ["verified", "unverified", "sold"],
        default: "unverified"
    },
    facilities: [
        { type: String }
    ],


}, {
    timestamps: true,
})

export const Properties = mongoose.model('Properties', propertiesSchema);