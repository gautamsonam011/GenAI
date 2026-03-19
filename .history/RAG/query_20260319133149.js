// Phase 2: Query Resolving phase

import * as dotenv from "dotenv";
dotenv.config();
import readlineSync from 'readline-sync';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

// Step 1: Convert the user query into embedding(vector)

async function chatting(question){
    // convert this question into vector 
    const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'text-embedding-004',
    });
 
    const queryVector = await embeddings.embedQuery(question);  

}

// Step0: Take the user Input from terminal

async function main(){
   const userProblem = readlineSync.question("Ask me anything--> ");
   await chatting(userProblem);
   main();
}


main();

