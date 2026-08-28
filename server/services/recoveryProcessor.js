import Transaction from "../models/Transaction.js";
import RecoveryCase from "../models/RecoveryCase.js";

import simulatePaymentRetry from "./paymentSimulator.js";
import getAIDecision from "./aiAgent.js";
import Customer from "../models/Customer.js";

const processRetry = async (recoveryCase) => {
  const transaction = await Transaction.findOne({
    transactionId: recoveryCase.transactionId
  });

  if (!transaction) {
    console.log("Transaction not found.");
    return;
  }

  // Don't retry if maximum attempts reached
  if (transaction.attemptNumber >= 3) {
    recoveryCase.status = "ESCALATED";
    await recoveryCase.save();

    console.log("Maximum retry attempts reached → Escalated ❌");
    return;
  }

  console.log("\nRetrying payment...");

  const result = simulatePaymentRetry(transaction);

  transaction.attemptNumber += 1;

  if (result.success) {
    transaction.status = "SUCCESS";
    recoveryCase.status = "RECOVERED";

    await transaction.save();
    await recoveryCase.save();

    console.log("Payment recovered successfully! ✅");
    return;
  }

  // Retry failed
  transaction.status = "FAILED";
  recoveryCase.status = "RETRY_FAILED";

  await transaction.save();
  await recoveryCase.save();

  console.log("Payment retry failed ❌");

  // Check whether another retry is allowed
  if (transaction.attemptNumber >= 3) {
    recoveryCase.status = "ESCALATED";
    await recoveryCase.save();

    console.log("Maximum attempts reached → Human escalation 🚨");
    return;
  }

  console.log("Another recovery attempt is possible.");
};

export default processRetry;