import express from "express";
import { responder } from "../middlewares/response.js";
import {
  getASubCategoryById,
  getLatestArrivalSubCategories,
} from "../model/SubCategoryModel.js";

const router = express.Router();

router.get("/:_id?", async (req, res, next) => {
  try {
    // subcategory id
    const { _id } = req.params;

    const findResult = _id
      ? await getASubCategoryById(_id)
      : await getLatestArrivalSubCategories();

    responder.SUCESS({
      res,
      message: "successfully retrieved subcategories",
      findResult,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
