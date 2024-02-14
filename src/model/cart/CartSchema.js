import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "active",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cart", cartSchema);
