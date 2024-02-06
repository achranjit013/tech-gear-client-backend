import { connectToDatabase } from "../config/databaseConnection.js";

const uri = process.env.MONGO_URL;
const collectionName = "users";
let collection;

(async () => {
  try {
    const db = await connectToDatabase(uri);
    collection = db.collection(collectionName);
  } catch (error) {
    console.error("Error connecting the database:", error);
  }
})();

export const getUserByEmail = (email) => {
  return collection.findOne({ email });
};

// update user
export const updateUser = (filter, update) => {
  /* Set the upsert option to insert a document if no documents match the filter */
  const options = { upsert: true };

  // Specify the update to set a value for the plot field
  const updateDoc = {
    $set: update,
  };

  return collection.updateOne(filter, updateDoc, options);
};
