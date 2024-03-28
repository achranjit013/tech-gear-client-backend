import { ObjectId } from "mongodb";
import { connectToDatabase } from "../config/databaseConnection.js";

const uri = process.env.MONGO_URL;
const collectionName = "products";
let collection;

(async () => {
  try {
    const db = await connectToDatabase(uri);
    collection = db.collection(collectionName);
  } catch (error) {
    console.error("Error connecting the database:", error);
  }
})();

export const getAProductBySlug = (slug) => {
  return collection.findOne({ slug, status: "active" });
};

export const getProductBySlugAndSize = (slug, size) => {
  const query = {
    status: "active",
    slug,
    "variants.size": size,
  };

  const options = {
    projection: {
      _id: 1,
      status: 1,
      name: 1,
      parentCatId: 1,
      slug: 1,
      basePrice: 1,
      sku: 1,
      description: 1,
      thumbnail: 1,
      variants: {
        $elemMatch: { size },
      },
    },
  };

  return collection.findOne(query, options);
};

export const getFeaturedProducts = (filter) => {
  // default options
  const options = {
    sort: { createdAt: -1 },
  };

  // If the filter is an empty object, add the limit option
  // this is for home page, latest arrivals
  if (Object.keys(filter).length === 0) {
    options.limit = 12;
  }

  return collection.find({ ...filter, status: "active" }, options).toArray();
};

export const getProductsForMenu = () => {
  return collection
    .aggregate([
      { $match: { status: "active" } },
      {
        $group: {
          _id: {
            subCategoryId: "$subCategoryId",
            categoryId: "$categoryId",
          },
          products: { $push: "$$ROOT" }, // Push the entire document into the products array
        },
      },
      {
        $group: {
          _id: { categoryId: "$_id.categoryId" },
          subCategories: {
            $push: {
              subCategoryId: "$_id.subCategoryId",
              products: "$products",
            },
          },
        },
      },
      { $sort: { _id: -1 } }, // Sort the categories
    ])
    .toArray();
};

export const updateAProductQtyBySlugAndSize = (slug, size, qty) => {
  const query = {
    slug,
    "variants.size": size,
  };

  // Specify the update to set a value for the plot field
  const updateDoc = {
    $set: { "variants.$.qty": Number(qty) },
  };

  // { $set: { "variants.$.qty": qty } }

  return collection.findOneAndUpdate(query, updateDoc, { new: true });
};
