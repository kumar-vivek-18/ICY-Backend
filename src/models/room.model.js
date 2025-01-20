import mongoose from "mongoose";


const roomSchema = new mongoose.Schema(
  {
    hotelId: { type:mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    roomType:{type:String, enum:["alpha","beta","gamma"]},
    day:{type:Number,required:true},
    year:{type:Number},
    availableRooms: { type: Number, required: true }, 
  },
  { timestamps: true }
);

export const Room = mongoose.model("RoomAvailability", roomSchema);
