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


async function main(){
    const userProblem = readlineSync.question("Ask me anythings");
    main();
}
main();