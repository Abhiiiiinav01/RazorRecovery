import "dotenv/config";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const getAIDecision = async (recoveryCase, transaction, customer) => {

  const successRate =
    customer.totalPayments > 0
      ? (
          (customer.successfulPayments / customer.totalPayments) *
          100
        ).toFixed(1)
      : 0;

  const prompt = `
You are the AI recovery agent for RazorRecovery.

Analyze this failed payment:

Transaction:
- Amount: ₹${transaction.amount}
- Payment method: ${transaction.paymentMethod}
- Failure reason: ${transaction.failureReason}
- Current status: ${transaction.status}
- Previous attempts: ${transaction.attemptNumber}

Customer:
- Total payments: ${customer.totalPayments}
- Successful payments: ${customer.successfulPayments}
- Failed payments: ${customer.failedPayments}
- Success rate: ${successRate}%

Recovery:
- Risk score: ${recoveryCase.riskScore}
- Amount at risk: ₹${recoveryCase.amountAtRisk}
- Previous AI action: ${recoveryCase.aiRecommendedAction}

Choose exactly ONE action:

EMAIL
PAYMENT_RETRY
HUMAN_ESCALATION

Return ONLY valid JSON:

{
  "action": "EMAIL",
  "reason": "Short explanation"
}
`;

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content:
          "You are a payment recovery decision-making agent. Return only valid JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0
  });

  const aiResponse = response.choices[0].message.content;

  const decision = JSON.parse(aiResponse);

  // Save new AI decision
  recoveryCase.aiRecommendedAction = decision.action;
  recoveryCase.aiReason = decision.reason;

  await recoveryCase.save();

  return decision;
};

export default getAIDecision;