import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/User.js";
import productRouter from "./routes/Product.js";
import productUpdateRouter from "./routes/UpdateProducts.js";
import billRouter from "./routes/Bill.js";
import customerRouter from "./routes/Customer.js";
import transactionRouter from "./routes/Transaction.js";
import dailyReportRouter from "./routes/DailyReport.js";
dotenv.config({
  path: "./src/config/config.env",
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", userRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", billRouter);
app.use("/api/admin", productUpdateRouter);
app.use("/api/v1", customerRouter);
app.use("/api/v1", transactionRouter);
app.use("/api/v1", dailyReportRouter);

export default app;
