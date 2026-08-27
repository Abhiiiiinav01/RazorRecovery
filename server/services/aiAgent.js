import "dotenv/config";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const testAI = async () => {
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "user",
        content: "Say hello to RazorRecovery in one sentence."
      }
    ]
  });

  console.log(response.choices[0].message.content);
};

testAI();