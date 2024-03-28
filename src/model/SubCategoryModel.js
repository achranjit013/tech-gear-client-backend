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

export const getASubCategory = (filter) => {
  return collection.findOne(filter);
};

export const getFilteredSubCategories = (filter) => {
  // optional params
  const options = {
    sort: { createdAt: -1 },
  };

  return collection.find(filter, options).toArray();
};

export const getAllSubCategories = (filter) => {
  return collection
    .aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$categoryId",
          subCat: {
            $push: {
              _id: "$_id",
              status: "$status",
              title: "$title",
              slug: "$slug",
              createdAt: "$createdAt",
              image: "$image",
            },
          },
        },
      },
      { $sort: { "subCat.createdAt": -1 } },
    ])
    .toArray();
};
