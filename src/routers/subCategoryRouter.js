import express from "express";
import { responder } from "../middlewares/response.js";
import {
  getASubCategory,
  getFilteredSubCategories,
} from "../model/SubCategoryModel.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { _id, categoryId, slug } = req.query;

    // const objectIds = ids?.split(",").map((id) => new ObjectId(id));
    const filter = categoryId
      ? { categoryId: new ObjectId(categoryId) }
      : slug
      ? { slug }
      : _id
      ? { _id: new ObjectId(_id) }
      : {};

    const findResult =
      _id || slug
        ? await getASubCategory(filter)
        : await getFilteredSubCategories(filter);

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
