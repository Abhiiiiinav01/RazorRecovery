import mongoose from "mongoose";

const recoveryCaseSchema = new mongoose.Schema(
  {
    caseId: {
      type: String,
      required: true,
      unique: true
    },

    transactionId: {
      type: String,
      required: true
    },

    customerId: {
      type: String,
      required: true
    },

    amountAtRisk: {
      type: Number,
      required: true
    },

    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    riskType: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: [
        "PENDING_AI",
        "ANALYZING",
        "RECOVERING",
        "RECOVERED",
        "ESCALATED",
        "STOPPED",
        "EMAIL_SENT"
      ],
      default: "PENDING_AI"
    },

    aiDiagnosis: {
      type: String,
      default: null
    },

    aiRecommendedAction: {
      type: String,
      default: null
    },

    aiReason: {
      type: String,
      default: null
    },

    recoveryAttempts: {
      type: Number,
      default: 0
    },

    recoveredAmount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const RecoveryCase = mongoose.model(
  "RecoveryCase",
  recoveryCaseSchema
);

export default RecoveryCase;