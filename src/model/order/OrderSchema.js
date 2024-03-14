import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "unfulfilled",
    },
    trackingNumber: [
      {
        type: String,
        default: null,
      },
    ],
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    shipping: {
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
    billingSameAsShipping: {
      type: Boolean,
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
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
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
        productSlug: {
          type: String,
          required: true,
        },
        orderedQty: {
          type: Number,
          required: true,
        },
        dispatchedQty: {
          type: Number,
          default: 0,
        },
        cartRefund: {
          type: Number,
          default: 0,
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
    totalRefund: {
      type: Number,
      default: 0,
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
