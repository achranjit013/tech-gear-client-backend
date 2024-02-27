import express from "express";
import {
  getAProductBySlug,
  getLatestArrivalProducts,
  getProductBySlugAndSize,
  updateAProductQtyBySlugAndSize,
} from "../model/ProductModel.js";
import { responder } from "../middlewares/response.js";
import { userAuth } from "../middlewares/authMiddleware.js";
import { updateProductQtyValidation } from "../middlewares/joiValidation.js";

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
router.get("/:slug?/:size?", async (req, res, next) => {
  try {
    // slug
    const { slug, size } = req.params;

    const findResult =
      slug && size
        ? await getProductBySlugAndSize(slug, size)
        : slug
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

router.patch(
  "/",
  userAuth,
  updateProductQtyValidation,
  async (req, res, next) => {
    try {
      const { slug, variants } = req.body;
      const { size, qty } = variants[0];

      const updateResult = await updateAProductQtyBySlugAndSize(
        slug,
        size,
        qty
      );

      responder.SUCESS({
        res,
        message: "successfully updated",
        updateResult,
      });
      // }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
