import express from "express";
import {
  addNewCartValidation,
  updateCartValidation,
} from "../middlewares/joiValidation.js";
import {
  createCart,
  deleteCartById,
  getACartByUserIdAndProductIdAndSize,
  getAllCartByUserId,
  updateACartById,
} from "../model/cart/CartModel.js";
import { responder } from "../middlewares/response.js";
import { userAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// post cart
router.post("/", userAuth, addNewCartValidation, async (req, res, next) => {
  try {
    const { productId, size, userId, qty } = req.body;
    const itemExist = await getACartByUserIdAndProductIdAndSize({
      userId,
      productId,
      size,
      status: "active",
    });

    let findResult;
    if (itemExist?._id) {
      // update the cart
      findResult = await updateACartById({ _id: itemExist._id }, { qty });
    } else {
      // add new
      findResult = await createCart(req.body);
    }

    findResult?._id
      ? responder.SUCESS({
          res,
          message:
            "The product has been successfully added to the cart. Please visit cart to checkout!",
        })
      : responder.ERROR({
          res,
          message:
            "Sorry, couldn't add the product to the cart. Please try again later!",
        });
  } catch (error) {
    next(error);
  }
});

// get cart
router.get("/", userAuth, async (req, res, next) => {
  try {
    const { _id } = req.userInfo;

    const findResult = await getAllCartByUserId(_id);

    responder.SUCESS({
      res,
      findResult,
    });
  } catch (error) {
    next(error);
  }
});

// update cart
router.patch("/", userAuth, updateCartValidation, async (req, res, next) => {
  try {
    const { _id, ...rest } = req.body;

    const findResult = await updateACartById({ _id }, rest);

    findResult?._id
      ? responder.SUCESS({
          res,
          message:
            "Your cart has been successfully updated. Please checkout to place order!",
        })
      : responder.ERROR({
          res,
          message: "Sorry, couldn't update the cart. Please try again later!",
        });
  } catch (error) {
    next(error);
  }
});

// delete cart
router.delete("/", userAuth, async (req, res, next) => {
  try {
    const { _id } = req.body;
    const findResult = await deleteCartById(_id);

    findResult?._id
      ? responder.SUCESS({
          res,
          message: "The item has been successfully removed from your cart!",
        })
      : responder.ERROR({
          res,
          message:
            "Sorry, the item couldn't be removed from your cart. Please try again later!",
        });
  } catch (error) {
    next(error);
  }
});

export default router;
