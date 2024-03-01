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
export const getAllReviews = (userId) => {
  return ReviewSchema.find({ userId });
};

// update
export const updateReview = (filter, update) => {
  return ReviewSchema.findOneAndUpdate(filter, update);
};
