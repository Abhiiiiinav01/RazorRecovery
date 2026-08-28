const sendRecoveryEmail = (customer, transaction) => {
  console.log("\n📧 Recovery Email Sent");
  console.log(`To: ${customer.email}`);
  console.log(`Subject: Payment of ₹${transaction.amount} failed`);
  console.log(
    "Message: Please update your payment details or ensure sufficient balance."
  );

  return {
    success: true,
    message: "Recovery email sent successfully."
  };
};

export default sendRecoveryEmail;