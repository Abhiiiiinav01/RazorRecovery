import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true
    },

    caseId: {
      type: String,
      required: true
    },

    eventType: {
      type: String,
      required: true,
      enum: [
        "RISK_DETECTED",
        "CASE_CREATED",
        "AI_ANALYSIS",
        "AI_DECISION",
        "EMAIL_SENT",
        "PAYMENT_RETRY",
        "PAYMENT_RECOVERED",
        "HUMAN_ESCALATION",
        "CASE_CLOSED"
      ]
    },

    description: {
      type: String,
      required: true
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;