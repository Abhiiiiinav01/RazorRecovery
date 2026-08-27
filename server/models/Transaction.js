import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true
    },

    customerId: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      default: "INR"
    },

    paymentMethod: {
      type: String,
      required: true
    },

    status: {
      type: String,
      required: true,
      enum: ["SUCCESS", "FAILED"]
    },

    failureReason: {
      type: String,
      default: null
    },

    attemptNumber: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;