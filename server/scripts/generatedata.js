import "dotenv/config";
import mongoose from "mongoose";
import Customer from "../models/Customer.js";
import Transaction from "../models/Transaction.js";

const customers = [];
const transactions = [];

const firstNames = [
  "Rahul", "Aman", "Priya", "Neha", "Arjun",
  "Riya", "Karan", "Ananya", "Vikram", "Sneha"
];

const lastNames = [
  "Sharma", "Agarwal", "Gupta", "Verma", "Mehta",
  "Singh", "Patel", "Malhotra", "Jain", "Kapoor"
];

const paymentMethods = ["UPI", "CARD", "NETBANKING"];

const failureReasons = [
  "INSUFFICIENT_FUNDS",
  "BANK_SERVER_ERROR",
  "NETWORK_ERROR",
  "BANK_DECLINED",
  "EXPIRED_CARD"
];

const amounts = [499, 999, 1499, 1999, 2999, 4999, 7999, 9999];

// Generate 100 customers
for (let i = 1; i <= 100; i++) {
  customers.push({
    customerId: `CUS_${String(i).padStart(3, "0")}`,
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
      lastNames[Math.floor(Math.random() * lastNames.length)]
    }`,
    email: `customer${i}@example.com`,
    phone: `98${String(10000000 + i).slice(-8)}`,
    customerSince: new Date(
      Date.now() - Math.floor(Math.random() * 730) * 24 * 60 * 60 * 1000
    ),
    totalPayments: 0,
    successfulPayments: 0,
    failedPayments: 0,
    totalSpent: 0
  });
}

// Create 500 transactions
for (let i = 1; i <= 500; i++) {
  const customer = customers[Math.floor(Math.random() * customers.length)];

  // Exactly 75 risky transactions
  const isRisky = i <= 75;

  const amount = amounts[Math.floor(Math.random() * amounts.length)];

  const transaction = {
    transactionId: `PAY_${String(i).padStart(4, "0")}`,
    customerId: customer.customerId,
    amount,
    currency: "INR",
    paymentMethod:
      paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    status: isRisky ? "FAILED" : "SUCCESS",
    failureReason: isRisky
      ? failureReasons[Math.floor(Math.random() * failureReasons.length)]
      : null,
    attemptNumber: 1,
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    )
  };

  transactions.push(transaction);

  // Update customer statistics
  customer.totalPayments++;

  if (transaction.status === "SUCCESS") {
    customer.successfulPayments++;
    customer.totalSpent += amount;
  } else {
    customer.failedPayments++;
  }
}

try {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log("MongoDB connected");

  // Clear old generated data
  await Customer.deleteMany({});
  await Transaction.deleteMany({});

  // Insert new data
  await Customer.insertMany(customers);
  await Transaction.insertMany(transactions);

  console.log("Synthetic data generated successfully!");
  console.log(`Customers created: ${customers.length}`);
  console.log(`Transactions created: ${transactions.length}`);
  console.log("Risky transactions: 75");

  await mongoose.connection.close();
} catch (error) {
  console.error("Data generation failed:", error.message);
  process.exit(1);
}