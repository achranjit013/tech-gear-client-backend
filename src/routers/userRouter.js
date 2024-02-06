import express from "express";
import { loginValidation } from "../middlewares/joiValidation.js";
import { comparePassword } from "../utils/bcryptHelper.js";
import { getUserByEmail } from "../model/UserModel.js";
import { getJWTs } from "../utils/jwtHelper.js";
import { responder } from "../middlewares/response.js";

const router = express.Router();

router.post("/login", loginValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // check if user exists, by email
    const user = await getUserByEmail(email);

    if (user?._id) {
      // if user exists, check if password matches
      const isMatched = comparePassword(password, user.password);
      if (isMatched) {
        // create jwts
        const jwts = await getJWTs(email);

        // response tokens
        return responder.SUCESS({
          message: "success",
          res,
          jwts,
        });
      }
    }

    return responder.ERROR({
      res,
      message: "Invalid login details!",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
