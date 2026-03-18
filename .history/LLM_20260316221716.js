import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    // contents: "Explain how AI works in a few words"
    // contents: "Explain array and how this work?"
    contents: "What is my name?"
  });

  console.log(response.text);
}

main();

// import "dotenv/config";
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY
// });

// async function listModels() {
//   const models = await ai.models.list();
//   console.log(models);
// }

// listModels();