import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    customerSince: {
      type: Date,
      required: true
    },

    totalPayments: {
      type: Number,
      default: 0
    },

    successfulPayments: {
      type: Number,
      default: 0
    },

    failedPayments: {
      type: Number,
      default: 0
    },

    totalSpent: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;