import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    shippingStreet: {
      type: String,
      required: true,
    },
    shippingState: {
      type: String,
      required: true,
    },
    shippingZip: {
      type: String,
      required: true,
    },
    billingStreet: {
      type: String,
      required: true,
    },
    billingState: {
      type: String,
      required: true,
    },
    billingZip: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    carts: [
      {
        cartId: {
          type: mongoose.Types.ObjectId,
          ref: "Cart",
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        orderedQty: {
          type: Number,
          required: true,
        },
        orderedSize: {
          type: String,
          required: true,
        },
        thumbnail: {
          type: String,
          required: true,
        },
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
