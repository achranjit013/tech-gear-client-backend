import { connectToDatabase } from "../config/databaseConnection.js";

const uri = process.env.MONGO_URL;
const collectionName = "categories";
let collection;

(async () => {
  try {
    const db = await connectToDatabase(uri);
    collection = db.collection(collectionName);
  } catch (error) {
    console.error("Error connecting the database:", error);
  }
})();

export const getACategory = (filter) => {
  return collection.findOne(filter);
};

export const getAllCategories = () => {
  // optional params
  const options = {
    sort: { createdAt: -1 },
  };

  return collection.find({ status: "active" }, options).toArray();
};
