import simulatePaymentRetry from "./paymentSimulator.js";
import sendRecoveryEmail from "./emailSimulator.js";
import processRetry from "./recoveryProcessor.js";

const executeAction = async (policyResult, transaction, recoveryCase, customer) => {

  if (!policyResult.actionable) {
    console.log("Action rejected by Policy Engine.");

    recoveryCase.status = "ESCALATED";
    await recoveryCase.save();

    return;
  }

  switch (policyResult.action) {

    case "PAYMENT_RETRY": {
      console.log("Executing payment retry...");

      const result = simulatePaymentRetry(transaction);

      transaction.attemptNumber += 1;

      if (result.success) {
        transaction.status = "SUCCESS";
        recoveryCase.status = "RECOVERED";

        console.log("Payment recovered successfully! ✅");
      } else {
        transaction.status = "FAILED";
        recoveryCase.status = "RETRY_FAILED";

        console.log("Payment retry failed ❌");
      }

      await transaction.save();
      await recoveryCase.save();

      break;
    }

    case "EMAIL": {
  console.log("Sending recovery email...");

  const emailResult = sendRecoveryEmail(
    customer,
    transaction
  );

  if (emailResult.success) {
    recoveryCase.status = "EMAIL_SENT";
    await recoveryCase.save();

    console.log("Email sent successfully ✅");

    // Retry payment after 30 seconds
    await processRetry(recoveryCase);
  }

  break;
}

    case "HUMAN_ESCALATION":
      console.log("Escalating case to human...");

      recoveryCase.status = "ESCALATED";
      await recoveryCase.save();

      break;

    default:
      console.log("Unknown action:", policyResult.action);
  }
};

export default executeAction;