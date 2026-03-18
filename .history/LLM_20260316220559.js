
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: "Explain what is array? How this work?"
  });

  console.log(response.text);
}

main();