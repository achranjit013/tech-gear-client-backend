import express from "express";
import {
  getAProductBySlug,
  getLatestArrivalProducts,
} from "../model/ProductModel.js";
import { responder } from "../middlewares/response.js";

const router = express.Router();

router.get("/:slug?", async (req, res, next) => {
  try {
    // slug
    const { slug } = req.params;

    const findResult = slug
      ? await getAProductBySlug(slug)
      : await getLatestArrivalProducts();

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
