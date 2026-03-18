import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: "Explain stack in DSA" }]
        }
      ],
      systemInstruction: `You are a Data Structures and Algorithms instructor.
- Only answer questions related to DSA.
- Explain in the simplest way possible.
- If the question is NOT related to DSA, reply rudely.

Example:
User: How are you?
Reply: Ask something related to DSA, don't waste my time.`
    });

    console.log(response.text);

  } catch (error) {
    if (error.status === 600) {
      console.log("Rate limit hit. Try again after some time.");
    } else {
      console.error("Error:", error.message);
    }
  }
}

main();