const evaluatePolicy = (recoveryCase, transaction) => {
  const action = recoveryCase.aiRecommendedAction;

  // Payment already successful → no action needed
  if (transaction.status === "SUCCESS") {
    return {
      actionable: false,
      action: "NONE",
      reason: "Payment has already been successful."
    };
  }

  // Retry limit
  if (
    action === "PAYMENT_RETRY" &&
    transaction.attemptNumber >= 3
  ) {
    return {
      actionable: false,
      action: "HUMAN_ESCALATION",
      reason: "Maximum retry attempts reached."
    };
  }

  // Expired card cannot be retried automatically
  if (
    action === "PAYMENT_RETRY" &&
    transaction.failureReason === "EXPIRED_CARD"
  ) {
    return {
      actionable: false,
      action: "HUMAN_ESCALATION",
      reason: "Expired card requires customer intervention."
    };
  }

  // All other AI decisions are allowed
  return {
    actionable: true,
    action: action,
    reason: "AI recommendation passed policy checks."
  };
};

export default evaluatePolicy;