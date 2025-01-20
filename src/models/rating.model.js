import mongoose, { mongo, Schema } from "mongoose";

const Schema = new Schema({
  hotelId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Hotel',
    index:true
  },
  userId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  rating: {
    type:Number,
    min:0,
    max:5
  },
  feedback: {
    type:String,
    default:"",
  },
});

export const Hotel = mongoose.model("Hotel", Schema);
