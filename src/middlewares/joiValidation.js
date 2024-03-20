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
const BOOLEANREQ = Joi.boolean().required();
const CARTSREQ = Joi.array().items(
  Joi.object().keys({
    cartId: SHORTSTRREQ,
    productId: SHORTSTRREQ,
    totalPrice: SHORTNUMREQ,
    productName: SHORTSTRREQ,
    productSlug: SHORTSTRREQ,
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

// create new user validation
export const newUserValidation = (req, res, next) => {
  const schema = Joi.object({
    fname: SHORTSTRREQ,
    lname: SHORTSTRREQ,
    address: SHORTSTR,
    phone: SHORTSTR,
    email: EMAILREQ,
    password: SHORTSTRREQ,
  });

  joiValidator({ schema, req, res, next });
};

// login
export const loginValidation = async (req, res, next) => {
  const schema = Joi.object({
    email: EMAILREQ,
    password: SHORTSTRREQ,
  });

  joiValidator({ schema, req, res, next });
};

// add new cart
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

// add new cart
export const addNewFavouriteValidation = (req, res, next) => {
  const { _id } = req.userInfo;
  req.body.userId = _id.toString();

  if (req.body.ids?.length) {
    const schema = Joi.object({
      ids: Joi.array().items(
        Joi.object().keys({
          productId: SHORTSTRREQ,
        })
      ),
      userId: SHORTSTRREQ,
    });

    joiValidator({ schema, req, res, next });
  } else {
    const schema = Joi.object({
      productId: SHORTSTRREQ,
      userId: SHORTSTRREQ,
    });

    joiValidator({ schema, req, res, next });
  }
};

// update cart
export const updateCartValidation = (req, res, next) => {
  const schema = Joi.object({
    _id: SHORTNUMREQ,
    qty: SHORTNUMREQ.optional(),
    status: SHORTSTR.valid("active", "inactive").optional(),
  }).oxor("qty", "status");

  joiValidator({ schema, req, res, next });
};

// add new order
export const addNewOrderValidation = (req, res, next) => {
  const { _id } = req.userInfo;
  req.body.userId = _id.toString();

  const schema = Joi.object({
    email: EMAILREQ,
    name: SHORTSTRREQ,
    shipping: SHORTSTRREQ,
    shippingStreet: LONGSTRREQ,
    shippingState: SHORTSTRREQ,
    shippingZip: SHORTSTRREQ,
    billingStreet: LONGSTRREQ,
    billingState: SHORTSTRREQ,
    billingZip: SHORTSTRREQ,
    billingSameAsShipping: BOOLEANREQ,
    userId: SHORTSTRREQ,
    carts: CARTSREQ,
    amount: SHORTNUMREQ,
    paymentMethod: SHORTSTRREQ,
    paymentIntentId: SHORTSTRREQ,
  });

  joiValidator({ schema, req, res, next });
};

// update product qty
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

// subscription
export const addNewSubscriptionValidation = (req, res, next) => {
  const schema = Joi.object({
    email: EMAILREQ,
  });

  joiValidator({ schema, req, res, next });
};

// review
export const addNewReviewValidation = (req, res, next) => {
  const { _id } = req.userInfo;
  req.body.userId = _id.toString();
  const schema = Joi.object({
    _id: Joi.string().optional(),
    status: Joi.string().optional(),
    title: SHORTSTRREQ,
    productId: SHORTSTRREQ,
    userId: SHORTSTRREQ,
    productName: SHORTSTRREQ,
    productSlug: SHORTSTRREQ,
    ratings: SHORTNUMREQ,
    feedback: LONGSTRREQ,
  });

  joiValidator({ schema, req, res, next });
};
