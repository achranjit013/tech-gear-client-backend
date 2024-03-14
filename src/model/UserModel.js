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

// create user
export const createUser = (userObj) => {
  return collection.insertOne(userObj, {
    writeConcern: userObj,
  });
};

export const getUserByEmail = (email) => {
  return collection.findOne({ email });
};

export const getActiveUserByEmail = (filter) => {
  return collection.findOne(filter);
};

export const getUserByEmailAndRefreshJWT = (email, refreshJWT) => {
  return collection.findOne({ email, refreshJWT });
};

// update user
export const updateUser = (filter, update) => {
  // Specify the update to set a value for the plot field
  const updateDoc = {
    $set: update,
  };

  return collection.updateOne(filter, updateDoc);
};
