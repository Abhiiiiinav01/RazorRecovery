import mongoose from "mongoose";

const recoveryActionSchema = new mongoose.Schema(
  {
    actionId: {
      type: String,
      required: true,
      unique: true
    },

    caseId: {
      type: String,
      required: true
    },

    actionType: {
      type: String,
      required: true,
      enum: [
        "PAYMENT_RETRY",
        "EMAIL",
        "HUMAN_ESCALATION"
      ]
    },

    status: {
      type: String,
      required: true,
      enum: ["PENDING", "SUCCESS", "FAILED"]
    },

    reason: {
      type: String,
      default: null
    },

    attemptNumber: {
      type: Number,
      default: 1
    },

    executedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const RecoveryAction = mongoose.model(
  "RecoveryAction",
  recoveryActionSchema
);

export default RecoveryAction;