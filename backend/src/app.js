import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/User.js";
import productRouter from "./routes/Product.js";
import productUpdateRouter from "./routes/UpdateProducts.js";
import billRouter from "./routes/Bill.js";

dotenv.config({
  path: "./src/config/config.env",
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", userRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", billRouter);
app.use("/api/admin", productUpdateRouter);

export default app;
