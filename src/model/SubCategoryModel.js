import { ObjectId } from "mongodb";
import { connectToDatabase } from "../config/databaseConnection.js";

const uri = process.env.MONGO_URL;
const collectionName = "subcategories";
let collection;

(async () => {
  try {
    const db = await connectToDatabase(uri);
    collection = db.collection(collectionName);
  } catch (error) {
    console.error("Error connecting the database:", error);
  }
})();

export const getASubCategoryById = (_id) => {
  return collection.findOne({ _id: new ObjectId(_id) });
};

export const getLatestArrivalSubCategories = () => {
  // optional params, only gets latest 4
  const options = {
    sort: { createdAt: -1 },
    limit: 4,
  };

  return collection.find({}, options).toArray();
};
