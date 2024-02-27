import express from "express";
import Stripe from "stripe";
import { userAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-payment-intent", userAuth, async (req, res, next) => {
  try {
    const { amount, currency, paymentMethodType } = req.body;

    // use stripe sdk to config with private key
    const stripe = new Stripe(process.env.STRIPE_SECRET);

    // use sdk to create new intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      payment_method_types: [paymentMethodType],
    });

    // return intent id
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/create-order", (req, res, next) => {
  // add order in the db
});

export default router;
