import { MongoClient, ObjectId } from "mongodb";
import express from "express";

const router = express.Router();

// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// Database Name
const dbName = "tech_gear";

router.get("/:slug?", async (req, res, next) => {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection("products");

    //
    const { slug } = req.params;

    console.log(slug);

    // const products = _id ? await getAProduct({ _id }) : await getProducts();

    // the following code examples can be pasted here...
    const options = {
      sort: { createdAt: -1 },
      limit: 12,
    };

    // const findResult = await collection.find({}, options).toArray();
    // await collection.findOne({ _id: new ObjectId(_id) })
    const findResult = slug
      ? await collection.findOne({ slug })
      : await collection.find({}, options).toArray();

    // const findResult = await collection
    //   .find({})
    //   .sort({ createdAt: -1 })
    //   .limit(12)
    //   .toArray();
    console.log("Found documents =>", findResult);

    return res.json({
      status: "success",
      findResult,
    });
  } catch (error) {
    console.log(error.message);
  }
});

export default router;
