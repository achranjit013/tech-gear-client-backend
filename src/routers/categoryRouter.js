import { MongoClient, ObjectId } from "mongodb";
import express from "express";

const router = express.Router();

// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// Database Name
const dbName = "tech_gear";

router.get("/:_id?", async (req, res, next) => {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection("categories");

    //
    const { _id } = req.params;

    const findResult = _id
      ? await collection.findOne({ _id: new ObjectId(_id) })
      : await collection.find({}).toArray();

    return res.json({
      status: "success",
      findResult,
    });
  } catch (error) {
    console.log(error.message);
  }
});

export default router;
