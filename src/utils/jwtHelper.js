import jwt from "jsonwebtoken";
import { createNewSession } from "../model/SessionModel.js";
import { updateUser } from "../model/UserModel.js";

// create access token
export const createAccessJWT = async (email) => {
  const token = jwt.sign({ email }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: "15m",
  });

  // store access token in session table
  await createNewSession({ token, associate: email });

  return token;
};

// create refresh token
export const createRefreshJWT = async (email) => {
  const token = jwt.sign({ email }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "30d",
  });

  // store refresh token in user table
  await updateUser({ email }, { refreshJWT: token });

  return token;
};

// verify access jwt
export const verifyAccessJWT = async (accessJWT) => {
  return jwt.verify(accessJWT, process.env.JWT_ACCESS_TOKEN);
};

// verify refresh jwt
export const verifyRefreshJWT = async (refreshJWT) => {
  return jwt.verify(refreshJWT, process.env.JWT_REFRESH_TOKEN);
};

// get jwts
export const getJWTs = async (email) => {
  return {
    accessJWT: await createAccessJWT(email),
    refreshJWT: await createRefreshJWT(email),
  };
};
