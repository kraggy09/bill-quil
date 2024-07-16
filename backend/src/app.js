import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/User.js";
import productRouter from "./routes/Product.js";
import productUpdateRouter from "./routes/UpdateProducts.js";
import billRouter from "./routes/Bill.js";
import customerRouter from "./routes/Customer.js";
import transactionRouter from "./routes/Transaction.js";
import dailyReportRouter from "./routes/DailyReport.js";
import categoryRouter from "./routes/Category.js";

dotenv.config({
  path: "./src/config/config.env",
});

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://dreamy-cuchufli-66a35d.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api/v1", userRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", billRouter);
app.use("/api/v1", customerRouter);
app.use("/api/v1", transactionRouter);
app.use("/api/v1", dailyReportRouter);
app.use("/api/v1", productUpdateRouter);
app.use("/api/v1", categoryRouter);

export default app;
