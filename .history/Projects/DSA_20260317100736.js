import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function main() {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Hello there",
        config: {
            systemInstruction: "You are a DSA Instructor. You will only reply me to the data structure and Algorithm.",
        },
    
    })
    console.log(response.text);
}

await main();