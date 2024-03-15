import express from "express";
import { addNewFavouriteValidation } from "../middlewares/joiValidation.js";
import { responder } from "../middlewares/response.js";
import {
  createFavourite,
  createManyFavourite,
  deleteFavouriteById,
  getAllFavouriteByUserId,
} from "../model/favourite/FavouriteModel.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// post cart
router.post("/", addNewFavouriteValidation, async (req, res, next) => {
  try {
    const { ids } = req.body; // array of objects with property productId (only present if user have favourite items in local storage)

    let findResult;
    let createFav = false;

    // "if" block is only executed when user logs in and has favourite items in their local storage
    // "else" block is executed every time user clicks the favourite button
    if (ids?.length) {
      const userFavs = await getAllFavouriteByUserId(req.body.userId);

      // get unique array of objects (productId, userId) out of ids, that are not in favourites table
      const uniqueIds = ids
        .filter(
          (item) =>
            !userFavs.some((obj) => obj.productId.toString() === item.productId)
        )
        .map((prod) => ({ ...prod, userId: req.body.userId }));

      // create data in db table
      findResult = await createManyFavourite(uniqueIds);

      createFav = true; //return success
    } else {
      findResult = await createFavourite(req.body);

      if (findResult?._id) {
        createFav = true;
      }
    }

    createFav
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
