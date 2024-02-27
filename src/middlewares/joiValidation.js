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
const CARTSREQ = Joi.array().items(
  Joi.object().keys({
    cartId: SHORTSTRREQ,
    totalPrice: SHORTNUMREQ,
    productName: SHORTSTRREQ,
    orderedQty: SHORTNUMREQ,
    orderedSize: SHORTSTRREQ,
    thumbnail: LONGSTRREQ,
  })
);
const VARIANTSREQ = Joi.array().items(
  Joi.object().keys({
    size: SHORTSTRREQ,
    qty: SHORTNUMREQ,
  })
);

const joiValidator = ({ schema, req, res, next }) => {
  try {
    const { error } = schema.validate(req.body);

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
    qty: SHORTNUMREQ.optional(),
    status: SHORTSTR.valid("active", "inactive").optional(),
  }).oxor("qty", "status");

  joiValidator({ schema, req, res, next });
};

export const addNewOrderValidation = (req, res, next) => {
  const { _id } = req.userInfo;
  req.body.userId = _id.toString();
  const schema = Joi.object({
    email: EMAILREQ,
    name: SHORTSTRREQ,
    shippingStreet: LONGSTRREQ,
    shippingState: SHORTSTRREQ,
    shippingZip: SHORTSTRREQ,
    billingStreet: LONGSTRREQ,
    billingState: SHORTSTRREQ,
    billingZip: SHORTSTRREQ,
    userId: SHORTSTRREQ,
    carts: CARTSREQ,
    amount: SHORTNUMREQ,
    paymentMethod: SHORTSTRREQ,
    paymentIntentId: SHORTSTRREQ,
  });

  joiValidator({ schema, req, res, next });
};

export const updateProductQtyValidation = (req, res, next) => {
  const { variants, ...rest } = req.body;
  req.body = rest;
  req.body.variants = variants.map((item, i) => {
    return item;
  });

  const schema = Joi.object({
    slug: SHORTSTRREQ,
    variants: VARIANTSREQ,
  });

  joiValidator({ schema, req, res, next });
};
