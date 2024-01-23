import mongoose from "mongoose";

export const connectDb = () => {
  try {
    mongoose.connect(process.env.MONGO_URL);
  } catch (error) {
    console.log(error.message);
  }
};
