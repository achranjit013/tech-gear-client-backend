import OrderSchema from "./OrderSchema.js";

// crud operation

// create order
export const createOrder = (orderObj) => {
  return OrderSchema(orderObj).save();
};

// read order by userId
export const getAllOrdersByUserId = (userId, date, limit, skip, text) => {
  let query = {
    userId,
    "carts.productName": { $regex: text, $options: "i" },
  };

  if (date) {
    const today = new Date();
    const pastDate = new Date(date).toISOString();

    query.createdAt = { $gte: pastDate, $lte: today };
  }

  const projection = {
    updatedAt: 0,
    __v: 0,
  };

  const options = {
    sort: { createdAt: -1 },
    limit,
    skip,
  };

  return OrderSchema.find(query, projection, options);
};
