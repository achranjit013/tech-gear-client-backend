import OrderSchema from "./OrderSchema.js";

// crud operation

// create order
export const createOrder = (orderObj) => {
  return OrderSchema(orderObj).save();
};

// read order by userId
export const getAllOrdersByUserId = (userId) => {
  const projection = {
    createdAt: 0,
    updatedAt: 0,
    __v: 0,
  };
  return OrderSchema.find({ userId }, projection);
};
