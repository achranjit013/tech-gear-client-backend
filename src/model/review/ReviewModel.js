import ReviewSchema from "./ReviewSchema.js";

// create
export const createReview = (reviewObj) => {
  return ReviewSchema(reviewObj).save();
};

// read
export const getAReview = (userId, productId) => {
  return ReviewSchema.findOne({ userId, productId });
};

// read
export const getAllReviews = (condition) => {
  return ReviewSchema.find(condition);
};

// update
export const updateReview = (filter, update) => {
  return ReviewSchema.findOneAndUpdate(filter, update);
};
