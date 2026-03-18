import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey:"AIzaSyAOzPC5T5TxSJIte10odzuZKR6EfssgZZA"});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

await main();