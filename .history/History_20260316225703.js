import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: [],
})
async function Chatting(userProblem) {
   
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: History
  });
  
    console.log("\n") 
  console.log(response.text);
}

async function main(){
    const userProblem = readlineSync.question("Ask me anythings");
    await Chatting(userProblem);
    main();
}
main();