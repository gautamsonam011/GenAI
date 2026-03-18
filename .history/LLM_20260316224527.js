import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const History = [];

async function Chatting(userProblem) {
    History.push({
        role:"user",
        parts:[{text:userProblem}]
    })
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    // contents: "Explain how AI works in a few words"
    // contents: "Explain array and how this work?"
    // contents: [
    //     {
    //         role:"user",
    //         parts:[
    //             {
    //                 text: "Hi, I am Sonam!"
    //             }
    //         ]
    //     },
    //     {
    //         role: "model",
    //         parts: [
    //             {
    //                 text: "Hello Sonam! Nice to meet you."
    //             }
    //         ]
    //     },
    //     {
    //         role: "user",
    //         parts: [{
    //             text: "what is my name?"
    //         }]
    //     }
    // ]
    contents: History
  });

  History.push({
        role: "model",
        parts: [{text: response.text}]
    })

  console.log(response.text);
}

async function main(){
    const userProblem = readlineSync.question("Ask me anythings");
    Chatting(userProblem);
    main();
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