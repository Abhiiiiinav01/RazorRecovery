import Transaction from "../models/Transaction.js";
import Customer from "../models/Customer.js";
import RecoveryCase from "../models/RecoveryCase.js";

const calculateRiskScore = (transaction, customer) => {
  let score = 0;

  // 1. Amount score
  if (transaction.amount < 1000) {
    score += 5;
  } else if (transaction.amount <= 3000) {
    score += 10;
  } else if (transaction.amount <= 5000) {
    score += 20;
  } else {
    score += 30;
  }

  // 2. Failure reason score
  switch (transaction.failureReason) {
    case "NETWORK_ERROR":
      score += 15;
      break;
    case "BANK_SERVER_ERROR":
      score += 20;
      break;
    case "INSUFFICIENT_FUNDS":
      score += 20;
      break;
    case "BANK_DECLINED":
      score += 25;
      break;
    case "EXPIRED_CARD":
      score += 30;
      break;
  }

  // 3. Customer history score
  const successRate =
    customer.totalPayments > 0
      ? customer.successfulPayments / customer.totalPayments
      : 0;

  if (successRate > 0.90) {
    score += 5;
  } else if (successRate >= 0.70) {
    score += 10;
  } else if (successRate >= 0.40) {
    score += 18;
  } else {
    score += 25;
  }

  // 4. Previous attempts score
  if (transaction.attemptNumber === 1) {
    score += 5;
  } else if (transaction.attemptNumber === 2) {
    score += 10;
  } else {
    score += 15;
  }

  return score;
};


const processFailedTransactions = async () => {
  const failedTransactions = await Transaction.find({
    status: "FAILED"
  });

  console.log(`Found ${failedTransactions.length} failed transactions`);

  for (const transaction of failedTransactions) {
    const customer = await Customer.findOne({
      customerId: transaction.customerId
    });

    if (!customer) {
      console.log(
        `Customer not found for ${transaction.transactionId}`
      );
      continue;
    }

    const riskScore = calculateRiskScore(
      transaction,
      customer
    );

    const recoveryCase = new RecoveryCase({
      caseId: `CASE_${transaction.transactionId}`,
      transactionId: transaction.transactionId,
      customerId: customer.customerId,
      amountAtRisk: transaction.amount,
      riskScore: riskScore,
      riskType: transaction.failureReason,
      status: "PENDING_AI"
    });

    await recoveryCase.save();

    console.log(
      `Recovery case created: ${recoveryCase.caseId} | Risk Score: ${riskScore}`
    );
  }
};

export {
  calculateRiskScore,
  processFailedTransactions
};