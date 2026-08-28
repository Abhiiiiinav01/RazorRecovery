const simulatePaymentRetry = (transaction) => {
  const random = Math.random();

  // 70% chance of success after retry
  if (random < 0.7) {
    return {
      success: true,
      message: "Payment successfully recovered after retry."
    };
  }

  return {
    success: false,
    message: "Payment retry failed."
  };
};

export default simulatePaymentRetry;