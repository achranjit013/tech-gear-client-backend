import express from "express";
import {
  getAProductBySlug,
  getLatestArrivalProducts,
  getProductBySlugAndSize,
} from "../model/ProductModel.js";
import { responder } from "../middlewares/response.js";

const router = express.Router();

// get products for cart by their id / slug and size
router.get("/cart-item/:slug&:size", async (req, res, next) => {
  try {
    const { slug, size } = req.params;

    const findResult = await getProductBySlugAndSize(slug, size);

    responder.SUCESS({
      res,
      message: "successfully retrieved products",
      findResult,
    });
  } catch (error) {
    next(error);
  }
});

// get all products or one selected product
router.get("/:slug?", async (req, res, next) => {
  try {
    // slug
    const { slug } = req.params;

    const findResult = slug
      ? await getAProductBySlug(slug)
      : await getLatestArrivalProducts();
    console.log(findResult);
    responder.SUCESS({
      res,
      message: "successfully retrieved products",
      findResult,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
