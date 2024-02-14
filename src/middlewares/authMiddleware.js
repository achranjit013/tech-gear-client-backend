import { getSession } from "../model/SessionModel.js";
import {
  getUserByEmail,
  getUserByEmailAndRefreshJWT,
} from "../model/UserModel.js";
import {
  createAccessJWT,
  verifyAccessJWT,
  verifyRefreshJWT,
} from "../utils/jwtHelper.js";
import { responder } from "./response.js";

export const userAuth = async (req, res, next) => {
  try {
    console.log("into user auth");
    // get the access jwt
    const { authorization } = req.headers;

    // verify the access jwt
    const decoded = await verifyAccessJWT(authorization);
    console.log(decoded);

    // get the user and check if active
    if (decoded?.email) {
      // check if the token is in the db
      const accessJWT = await getSession({
        token: authorization,
        associate: decoded.email,
      });

      if (accessJWT?._id) {
        // get user by email
        const user = await getUserByEmail(decoded.email);
        if (user?.status === "active" && user?.role === "user") {
          user.password = undefined;
          req.userInfo = user;
          return next();
        }
      }
    }

    // for all invalid cases
    responder.ERROR({
      res,
      message: "Unauthorized!",
      errorCode: 401,
    });
  } catch (error) {
    console.log(error.message);
    // jwt expired
    if (error.message.includes("jwt expired")) {
      return responder.ERROR({
        res,
        errorCode: 403,
        message: "jwt expired",
      });
    }

    next(error);
  }
};

export const refreshAuth = async (req, res, next) => {
  try {
    console.log("i am into refresh auth");
    const { authorization } = req.headers; //refresh jwt
    console.log(authorization);
    const decoded = await verifyRefreshJWT(authorization);
    console.log(decoded);

    if (decoded?.email) {
      const user = await getUserByEmailAndRefreshJWT(
        decoded.email,
        authorization
      );

      console.log("i am user: " + user);

      if (user?._id && user?.status === "active") {
        const accessJWT = await createAccessJWT(decoded.email);
        return responder.SUCESS({
          res,
          message: "access jwt",
          accessJWT,
        });
      }
    }

    responder.ERROR({
      res,
      message: "unauthorized",
      errorCode: 401,
    });
  } catch (error) {
    next(error);
  }
};
