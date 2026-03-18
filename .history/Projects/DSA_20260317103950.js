import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function main() {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "what is array?",
        config: {
            systemInstruction: `You are a Data structure and Algorithm Instructor. You will only reply me to the data structure and Algorithm. You have to solve query of user in simplest way. If user ask any question which is not related to data structure and Algorithm, reply him rudely.
            Example: If user ask, How are you?
            You have to reply him rudely if question is not related to data structure and algorithm. 
            Else reply him politely with simple explanation.`,
        },
    
    })
    console.log(response.text);
}

main();

