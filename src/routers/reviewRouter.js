import express from "express";
import {
  createReview,
  getAllReviews,
  updateReview,
} from "../model/review/ReviewModel.js";
import { userAuth } from "../middlewares/authMiddleware.js";
import { addNewReviewValidation } from "../middlewares/joiValidation.js";
import { responder } from "../middlewares/response.js";

const router = express.Router();

// post review
router.post("/", userAuth, addNewReviewValidation, async (req, res, next) => {
  try {
    const findResult = await createReview(req.body);

    findResult?._id
      ? responder.SUCESS({
          res,
          message:
            "Thank you for your review! It will be assessed by our team before it's published.",
        })
      : responder.ERROR({
          res,
          message:
            "Sorry, your review couldn't be posted. Please try again later!",
        });
  } catch (error) {
    next(error);
  }
});

// put review
router.put("/", userAuth, addNewReviewValidation, async (req, res, next) => {
  try {
    const { _id, ...rest } = req.body;

    const findResult = await updateReview({ _id }, rest);

    findResult?._id
      ? responder.SUCESS({
          res,
          message:
            "Thank you for your review! It will be assessed by our team before it's published.",
        })
      : responder.ERROR({
          res,
          message:
            "Sorry, your review couldn't be updated. Please try again later!",
        });
  } catch (error) {
    next(error);
  }
});

router.get("/:someId?", async (req, res, next) => {
  try {
    const { someId } = req.params;

    // Determine the condition based on the presence of someId
    let condition = { status: "active" };
    if (someId) {
      if (someId.startsWith("user")) {
        condition = { userId: someId.substring(4) };
      } else if (someId.startsWith("product")) {
        condition = { ...condition, productId: someId.substring(7) };
      }
    }

    const findResult = await getAllReviews(condition);

    responder.SUCESS({
      res,
      findResult,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
