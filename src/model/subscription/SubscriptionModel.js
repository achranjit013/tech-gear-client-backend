import SubscriptionSchema from "./SubscriptionSchema.js";

// create subscripton
export const createSubscription = (obj) => {
  return SubscriptionSchema(obj).save();
};

// delete subscripton
export const deleteSubscription = (email) => {
  return SubscriptionSchema.findOneAndDelete({ email });
};
