import CartSchema from "./CartSchema.js";

// crud operation

// create cart
export const createCart = (cartObj) => {
  return CartSchema(cartObj).save();
};

// read cart by userId
export const getAllCartByUserId = (userId) => {
  const projection = {
    createdAt: 0,
    updatedAt: 0,
    __v: 0,
  };
  return CartSchema.find({ userId }, projection);
};

// read cart by userId, productId and size
// filter is an object
export const getACartByUserIdAndProductIdAndSize = (filter) => {
  return CartSchema.findOne(filter);
};

// update cart
// filter and data are objects
export const updateACartById = (filter, data) => {
  return CartSchema.findOneAndUpdate(filter, data, { new: true });
};

// filter and data are objects
export const updateACartByUserIdAndProductIdAndSize = (filter, data) => {
  return CartSchema.findOneAndUpdate(filter, data);
};

// delete cart
export const deleteCartById = (_id) => {
  return CartSchema.findOneAndDelete({ _id });
};
