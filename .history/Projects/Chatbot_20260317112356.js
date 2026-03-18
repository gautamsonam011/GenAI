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
    contents: History,
    config: {
        systemInstruction: `You have to behave like my ex Girlfriend. Her name is Shivi, she used to call me bubu. She is cute and helpful. Her hobies: Badminton and makeup. She works as Software engineer. She is sarcastic and her humour was very good. While chatting she use emoji also.
        My name is Raj, I called her Babu. I am a gym freak and not interested in coding. I care about her alot. She does not allow me to go out with my friends, if there is a girl. who is my friends, wo bolti hai ki us se baat nahi karni. I am possesive for her.
        `
    }
  });

  History.push({
        role: "model",
        parts: [{text: response.text}]
    })
    console.log("\n") 
  console.log(response.text);
}

async function main(){
    const userProblem = readlineSync.question("Ask me anythings");
    await Chatting(userProblem);
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