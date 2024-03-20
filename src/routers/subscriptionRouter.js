import express from "express";
import { addNewSubscriptionValidation } from "../middlewares/joiValidation.js";
import {
  createSubscription,
  deleteSubscription,
} from "../model/subscription/SubscriptionModel.js";
import { responder } from "../middlewares/response.js";
import {
  sendSubscriptionVerifiedNotification,
  sendUnsubscriptionVerifiedNotification,
} from "../utils/nodemailer.js";

const router = express.Router();

// create new subscription
router.post("/", addNewSubscriptionValidation, async (req, res, next) => {
  try {
    const findResult = await createSubscription(req.body);

    if (findResult?._id) {
      // unsubscribe link
      const url = `${process.env.CLIENT_ROOT_DOMAIN}/unsubscribe?e=${findResult.email}`;

      // send email notification
      sendSubscriptionVerifiedNotification({
        email: findResult.email,
        url,
      });

      responder.SUCESS({
        res,
        message:
          "Thank you for subscribing to our newsletter! A verification email has been sent to you. Please check your inbox/spam folder.",
      });
    } else {
      responder.ERROR({
        res,
        message:
          "Sorry, we are unable to add you to our subscription list at the moment. Please try again later.",
      });
    }
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.errorCode = 200;
      error.message =
        "Hey there, you are already subscribed to our newsletter!";
    }

    next(error);
  }
});

// unsubscribe
router.delete("/", async (req, res, next) => {
  try {
    const { email } = req.body;
    const findResult = await deleteSubscription(email);

    if (findResult?._id) {
      responder.SUCESS({
        res,
        message:
          "We're sorry to see you leave our newsletter community! A verification email has been sent to you. Please check your inbox/spam folder.",
      });

      // send email notification
      sendUnsubscriptionVerifiedNotification({
        email: findResult.email,
      });
    } else {
      responder.ERROR({
        res,
        message:
          "Sorry, we are unable process your request at the moment. Please try again later.",
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
