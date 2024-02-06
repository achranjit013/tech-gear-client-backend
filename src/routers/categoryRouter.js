import express from "express";
import {
  getACategoryById,
  getLatestArrivalCategories,
} from "../model/CategoryModel.js";
import { responder } from "../middlewares/response.js";

const router = express.Router();

router.get("/:_id?", async (req, res, next) => {
  try {
    // category id
    const { _id } = req.params;

    const findResult = _id
      ? await getACategoryById(_id)
      : await getLatestArrivalCategories();

    responder.SUCESS({
      res,
      message: "successfully retrieved categories",
      findResult,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
