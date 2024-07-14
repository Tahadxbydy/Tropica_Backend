import mongoose from "mongoose";

const catagorySchema = new mongoose.Schema({
  catagoryName: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  image: { type: String },
});

export const catagoryModel = mongoose.model("catagory", catagorySchema);
