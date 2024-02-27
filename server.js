import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

// port setup
const PORT = process.env.PORT || 8100;

// connection to remote database;
import { connectToDatabase } from "./src/config/databaseConnection.js";
const uri = process.env.MONGO_URL;
(async () => {
  try {
    await connectToDatabase(uri);
  } catch (error) {
    console.error("Error starting the server:", error);
  }
})();

// connection to own databse
import { connectDB } from "./src/config/dbConfig.js";
connectDB();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// api endpoints
import productRouter from "./src/routers/productRouter.js";
app.use("/api/v1/products", productRouter);
import categoryRouter from "./src/routers/categoryRouter.js";
app.use("/api/v1/categories", categoryRouter);
import userRouter from "./src/routers/userRouter.js";
app.use("/api/v1/users", userRouter);
import cartRouter from "./src/routers/cartRouter.js";
app.use("/api/v1/cart", cartRouter);
import stripeRouter from "./src/routers/stripeRouter.js";
app.use("/api/v1/payments", stripeRouter);
import orderRouter from "./src/routers/orderRouter.js";
app.use("/api/v1/orders", orderRouter);

// basic setup
app.get("/", (req, res, next) => {
  res.json({
    status: "success",
    message: "server is running well...",
  });
});

app.use("*", (req, res, next) => {
  const error = {
    message: "404 page not found!",
    errorCode: 404,
  };

  next(error);
});

// error handler
app.use((error, req, res, next) => {
  const errorCode = error.errorCode || 500;
  res.status(errorCode).json({
    status: "error",
    message: error.message,
  });

  next(error);
});

app.listen(PORT, (error) => {
  error
    ? console.log(error.message)
    : console.log(`server is running at: http://localhost:${PORT}`);
});
