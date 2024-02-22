import Joi from "joi";
import { responder } from "./response.js";

// constants
const SHORTSTR = Joi.string().max(100).allow(null, "");
const SHORTSTRREQ = SHORTSTR.required();
const SHORTNUM = Joi.string().max(100).allow(null, "");
const SHORTNUMREQ = SHORTNUM.required();
const LONGSTR = Joi.string().max(5000).allow(null, "");
const LONGSTRREQ = LONGSTR.required();
const EMAIL = Joi.string().email({ minDomainSegments: 2 }).max(100);
const EMAILREQ = EMAIL.required();

const joiValidator = ({ schema, req, res, next }) => {
  try {
    const { error } = schema.validate(req.body);

    console.log("error");
    console.log(error);

    if (error) {
      return responder.ERROR({ res, message: error.message });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const loginValidation = async (req, res, next) => {
  const schema = Joi.object({
    email: EMAILREQ,
    password: SHORTSTRREQ,
  });

  joiValidator({ schema, req, res, next });
};

export const addNewCartValidation = (req, res, next) => {
  const { _id } = req.userInfo;
  req.body.userId = _id.toString();
  const schema = Joi.object({
    status: SHORTSTR,
    userId: SHORTSTRREQ,
    productId: SHORTSTRREQ,
    slug: SHORTSTRREQ,
    qty: SHORTNUMREQ,
    size: SHORTSTRREQ,
  });

  joiValidator({ schema, req, res, next });
};

export const updateCartValidation = (req, res, next) => {
  const schema = Joi.object({
    _id: SHORTNUMREQ,
    qty: SHORTNUMREQ,
  });

  joiValidator({ schema, req, res, next });
};
