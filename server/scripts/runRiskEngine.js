import "dotenv/config";
import mongoose from "mongoose";
import { processFailedTransactions } from "../services/riskEngine.js";

try {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log("MongoDB connected");

  await processFailedTransactions();

  await mongoose.connection.close();

  console.log("Risk Engine completed");
} catch (error) {
  console.error("Risk Engine failed:", error.message);
  process.exit(1);
}