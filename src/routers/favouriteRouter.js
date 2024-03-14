import express from "express";
import { addNewFavouriteValidation } from "../middlewares/joiValidation.js";
import { responder } from "../middlewares/response.js";
import {
  createFavourite,
  createManyFavourite,
  deleteFavouriteById,
  getAllFavouriteByUserId,
} from "../model/favourite/FavouriteModel.js";

const router = express.Router();

// post cart
router.post("/", addNewFavouriteValidation, async (req, res, next) => {
  try {
    let findResult;
    const { ids } = req.body;
    let create = false;
    if (ids?.length) {
      const userFavs = await getAllFavouriteByUserId(req.body.userId);

      const uniqueIds = ids
        .filter(
          (item) => !userFavs.some((obj) => obj.productId === item.productId)
        )
        .map((item) => ({ ...item, userId: req.body.userId }));

      findResult = await createManyFavourite(uniqueIds);

      if (findResult.length > 0) {
        create = true;
      }
    } else {
      findResult = await createFavourite(req.body);

      if (findResult?._id) {
        create = true;
      }
    }

    create
      ? responder.SUCESS({
          res,
          message: "The product has been successfully added to your favourite.",
        })
      : responder.ERROR({
          res,
          message:
            "Sorry, the product couldn't be added to your favourite. Please try again later.",
        });
  } catch (error) {
    next(error);
  }
});

// get cart
router.get("/", async (req, res, next) => {
  try {
    const { _id } = req.userInfo;

    const findResult = await getAllFavouriteByUserId(_id);

    responder.SUCESS({
      res,
      findResult,
    });
  } catch (error) {
    next(error);
  }
});

// delete cart
router.delete("/", async (req, res, next) => {
  try {
    const { _id } = req.userInfo;
    req.body.userId = _id;

    const findResult = await deleteFavouriteById(req.body);

    findResult?._id
      ? responder.SUCESS({
          res,
          message:
            "The product has been successfully removed from your favourite.",
        })
      : responder.ERROR({
          res,
          message:
            "Sorry, the product couldn't be removed from your favourite. Please try again later.",
        });
  } catch (error) {
    next(error);
  }
});

export default router;
