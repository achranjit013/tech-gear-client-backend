import express from "express";
import { responder } from "../middlewares/response.js";
import {
  getASubCategory,
  getAllSubCategories,
  getFilteredSubCategories,
} from "../model/SubCategoryModel.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { _id, categoryId, slug } = req.query;

    let filter = { status: "active" };

    filter = categoryId
      ? { categoryId: new ObjectId(categoryId), ...filter }
      : slug
      ? { slug, ...filter }
      : _id
      ? { _id: new ObjectId(_id), ...filter }
      : filter;

    const findResult =
      _id || slug
        ? await getASubCategory(filter)
        : await getAllSubCategories(filter);

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
