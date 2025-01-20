import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user making the booking
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true }, // Reference to the hotel
    roomType: { type: String, required: true }, // Room type booked (e.g., "Deluxe", "Budget")
    checkInDate: { type: Date, required: true }, // Start date of the booking
    checkOutDate: { type: Date, required: true }, // End date of the booking
    totalRooms: { type: Number, required: true }, // Number of rooms booked
    totalPrice: { type: Number, required: true }, // Total price for the booking
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    }, // Booking status
    createdAt: { type: Date, default: Date.now }, // Booking creation timestamp
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    } // Status of payment
});

export const Booking = mongoose.model('Booking', bookingSchema);
