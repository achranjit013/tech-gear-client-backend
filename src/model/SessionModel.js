import { connectToDatabase } from "../config/databaseConnection.js";

const uri = process.env.MONGO_URL;
const collectionName = "sessions";
let collection;

(async () => {
  try {
    const db = await connectToDatabase(uri);
    collection = db.collection(collectionName);
  } catch (error) {
    console.error("Error connecting the database:", error);
  }
})();

export const createNewSession = (sessionObj) => {
  return collection.insertOne(sessionObj);
};

export const getSession = (sessionObj) => {
  return collection.findOne(sessionObj);
};
