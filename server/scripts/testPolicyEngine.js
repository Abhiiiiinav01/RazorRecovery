import "dotenv/config";
import mongoose from "mongoose";

import RecoveryCase from "../models/RecoveryCase.js";
import Transaction from "../models/Transaction.js";

import evaluatePolicy from "../services/policyEngine.js";

try {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log("MongoDB connected");

  // Get the first case that has an AI decision
  const recoveryCase = await RecoveryCase.findOne({
    aiRecommendedAction: { $exists: true }
  });

  if (!recoveryCase) {
    console.log("No AI-processed recovery case found.");
    process.exit(0);
  }

  // Find its transaction
  const transaction = await Transaction.findOne({
    transactionId: recoveryCase.transactionId
  });

  if (!transaction) {
    console.log("Transaction not found.");
    process.exit(0);
  }

  // Evaluate AI decision against our policies
  const policyResult = evaluatePolicy(
    recoveryCase,
    transaction
  );

  console.log("\nAI Decision:");
  console.log(recoveryCase.aiRecommendedAction);

  console.log("\nPolicy Result:");
  console.log(policyResult);

  await mongoose.connection.close();

  console.log("\nPolicy Engine completed.");
} catch (error) {
  console.error("Policy Engine failed:", error.message);
  process.exit(1);
}