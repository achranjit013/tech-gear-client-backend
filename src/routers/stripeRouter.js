import express from "express";
import Stripe from "stripe";

const router = express.Router();

router.post("/create-payment-intent", async (req, res, next) => {
  try {
    console.log("i am in stripe router");
    console.log(req.body);
    const { amount, currency, paymentMethodType } = req.body;

    // use stripe sdk to config with private key
    const stripe = new Stripe(process.env.STRIPE_SECRET);

    // use sdk to create new intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      payment_method_types: [paymentMethodType],
    });

    console.log(paymentIntent);

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
