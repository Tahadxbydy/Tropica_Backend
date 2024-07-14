import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.mongoose_url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDb;
