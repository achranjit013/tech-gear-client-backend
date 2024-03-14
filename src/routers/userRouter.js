import express from "express";
import {
  loginValidation,
  newUserValidation,
} from "../middlewares/joiValidation.js";
import { comparePassword, hashPassword } from "../utils/bcryptHelper.js";
import {
  createUser,
  getActiveUserByEmail,
  getUserByEmail,
  updateUser,
} from "../model/UserModel.js";
import { getJWTs } from "../utils/jwtHelper.js";
import { responder } from "../middlewares/response.js";
import { refreshAuth, userAuth } from "../middlewares/authMiddleware.js";
import { v4 as uuidv4 } from "uuid";
import { createNewSession, deleteSession } from "../model/SessionModel.js";
import {
  sendEmailVerificationLinkTemplate,
  sendEmailVerifiedNotification,
} from "../utils/nodemailer.js";

const router = express.Router();

// create new user
router.post("/", newUserValidation, async (req, res, next) => {
  try {
    // encrypt the password
    const { password } = req.body;
    req.body.password = hashPassword(password);

    // const currentDate = new Date();
    const createdAt = new Date().toISOString().replace("Z", "+00:00"); // Format: '2024-03-11T06:03:06.356+00:00'
    const updatedAt = new Date().toISOString().replace("Z", "+00:00"); // Format: '2024-03-11T06:03:06.356+00:00'

    // creating new user
    const user = await createUser({
      status: "inactive",
      role: "user",
      ...req.body,
      refreshJWT: "",
      createdAt,
      updatedAt,
      __v: 0,
    });

    // if user is created, create unique url and email that to user to verify
    if (user?.insertedId) {
      const c = uuidv4(); //this must be stored in db
      const token = await createNewSession({
        token: c,
        associate: req.body.email,
        createdAt,
        updatedAt,
        __v: 0,
      });

      const url = `${process.env.CLIENT_ROOT_DOMAIN}/verify-email?e=${req.body.email}&c=${c}`;

      // send new email
      sendEmailVerificationLinkTemplate({
        email: req.body.email,
        url,
        fname: req.body.fname,
      });
    }

    user?.insertedId
      ? responder.SUCESS({
          res,
          message:
            "Your account has been created! An email verification link has been sent to the provided email. Please check your inbox/spam folder.",
        })
      : responder.ERROR({
          res,
          message:
            "Sorry, we are unable to create your account at the moment. Please try again later.",
          errorCode: 200,
        });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.errorCode = 200;
      error.message =
        "There is another user with the same email ID. Please login or use another email to create an account!";
    }
    next(error);
  }
});

// verify user email
router.post("/verify-email", async (req, res, next) => {
  try {
    const { associate, token } = req.body;

    if (associate && token) {
      // delete from session table
      const session = await deleteSession({ token, associate });

      // if success, then update user status to active
      if (session?.deletedCount) {
        // update user table
        const user = await updateUser(
          { email: associate },
          { status: "active" }
        );

        if (user?.modifiedCount) {
          // get updated user
          const findResult = await getActiveUserByEmail({
            email: associate,
            status: "active",
          });

          if (findResult?._id) {
            // send email notification
            sendEmailVerifiedNotification({
              email: associate,
              fname: findResult?.fname,
            });

            return responder.SUCESS({
              res,
              message:
                "Congratulations, your email has been verified. You may login now.",
            });
          }
        }
      }
    }

    return responder.ERROR({
      res,
      message: "Invalid!",
    });
  } catch (error) {
    next(error);
  }
});

// login
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

// logout
router.post("/logout", async (req, res, next) => {
  try {
    const { accessJWT, _id } = req.body;
    accessJWT && (await deleteSession({ token: accessJWT }));
    await updateUser({ _id }, { refreshJWT: "" });

    responder.SUCESS({
      res,
      message: "sucess logout",
    });
  } catch (error) {
    next(error);
  }
});

// get user info
router.get("/", userAuth, async (req, res, next) => {
  try {
    responder.SUCESS({
      res,
      message: "user info",
      user: req.userInfo,
    });
  } catch (error) {
    next(error);
  }
});

// get access jwt
router.get("/get-accessjwt", refreshAuth);

export default router;
