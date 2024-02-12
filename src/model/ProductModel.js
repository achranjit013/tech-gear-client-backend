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
  return collection.findOne({ slug });
};

export const getProductBySlugAndSize = (slug, size) => {
  const query = {
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

export const getLatestArrivalProducts = () => {
  // optional params, only gets latest 12
  const options = {
    sort: { createdAt: -1 },
    limit: 12,
  };

  return collection.find({}, options).toArray();
};
