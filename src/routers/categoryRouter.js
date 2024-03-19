import express from "express";
import { getACategory, getAllCategories } from "../model/CategoryModel.js";
import { responder } from "../middlewares/response.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    // category id
    const { _id, slug } = req.query;

    let filter = { status: "active" };

    filter = _id
      ? { _id: new ObjectId(_id), ...filter }
      : slug
      ? { slug, ...filter }
      : filter;

    const findResult =
      _id || slug ? await getACategory(filter) : await getAllCategories(filter);

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
