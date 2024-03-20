import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      index: 1,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Subscription", subscriptionSchema);
