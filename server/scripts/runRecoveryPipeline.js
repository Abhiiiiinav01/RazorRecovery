import "dotenv/config";
import mongoose from "mongoose";

import RecoveryCase from "../models/RecoveryCase.js";
import Transaction from "../models/Transaction.js";
import Customer from "../models/Customer.js";

import evaluatePolicy from "../services/policyEngine.js";
import executeAction from "../services/actionExecutor.js";

try {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log("MongoDB connected");

  // Get one case that has an AI decision
  const recoveryCase = await RecoveryCase.findOne({
    aiRecommendedAction: { $exists: true }
  });

  if (!recoveryCase) {
    console.log("No AI-processed recovery case found.");
    process.exit(0);
  }

  // Get related transaction
  const transaction = await Transaction.findOne({
    transactionId: recoveryCase.transactionId
  });

  if (!transaction) {
    console.log("Transaction not found.");
    process.exit(0);
  }

  const customer = await Customer.findOne({
  customerId: recoveryCase.customerId
});

  console.log("\n==============================");
  console.log("RECOVERY PIPELINE");
  console.log("==============================");

  console.log("\nCase:", recoveryCase.caseId);
  console.log("Amount:", transaction.amount);
  console.log("Failure:", transaction.failureReason);
  console.log("AI Decision:", recoveryCase.aiRecommendedAction);

  // Policy Engine
  const policyResult = evaluatePolicy(
    recoveryCase,
    transaction
  );

  console.log("\nPolicy Result:");
  console.log(policyResult);

  // Execute approved action
  await executeAction(
    policyResult,
    transaction,
    recoveryCase,
    customer

  );

  console.log("\n==============================");
  console.log("PIPELINE COMPLETED");
  console.log("==============================");

  await mongoose.connection.close();

} catch (error) {
  console.error("Pipeline failed:", error.message);
  process.exit(1);
}