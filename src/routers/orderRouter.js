import express from "express";
import { addNewOrderValidation } from "../middlewares/joiValidation.js";
import { userAuth } from "../middlewares/authMiddleware.js";
import {
  createOrder,
  getAllOrdersByUserId,
} from "../model/order/OrderModel.js";
import { responder } from "../middlewares/response.js";
import { sendOrderVerificationEmailNotification } from "../utils/nodemailer.js";

const router = express.Router();

// post cart
router.post("/", userAuth, addNewOrderValidation, async (req, res, next) => {
  try {
    const findResult = await createOrder(req.body);

    if (findResult?._id) {
      // send order verification email to user
      let toEmail = [];

      const {
        email,
        name,
        shippingStreet,
        shippingState,
        shippingZip,
        carts,
        amount,
      } = findResult;

      if (req.userInfo.email !== email) {
        toEmail = [req.userInfo.email, email];
      } else {
        toEmail = [email];
      }

      sendOrderVerificationEmailNotification({
        toEmail,
        name,
        shippingStreet,
        shippingState,
        shippingZip,
        carts,
        amount,
      });

      responder.SUCESS({
        res,
        message:
          "Your order has been successfully placed. While you eagerly await the arrival of your order, please feel free to explore our wide range of products. Happy shopping! 🛍️",
      });
    } else {
      responder.ERROR({
        res,
        message: "Sorry, couldn't place your order. Please try again later!",
      });
    }

    // findResult?._id
    //    responder.SUCESS({
    //       res,
    //       message:
    //         "Your order has been successfully placed. While you eagerly await the arrival of your order, please feel free to explore our wide range of products. Happy shopping!",
    //     })
    //   : responder.ERROR({
    //       res,
    //       message: "Sorry, couldn't place your order. Please try again later!",
    //     });
  } catch (error) {
    next(error);
  }
});

// get cart
router.get("/", userAuth, async (req, res, next) => {
  try {
    const { _id } = req.userInfo;
    const { date, limit, skip, text } = req.query;

    const findResult = await getAllOrdersByUserId(_id, date, limit, skip, text);

    responder.SUCESS({
      res,
      findResult,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
