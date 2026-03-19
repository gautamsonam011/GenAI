// Phase 2: Query Resolving phase

import * as dotenv from "dotenv";
dotenv.config();
import readlineSync from 'readline-sync';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';


async function chatting(question){
    // convert this question into vector 

}

// Step0: Take the user Input from terminal

async function main(){
   const userProblem = readlineSync.question("Ask me anything--> ");
   await chatting(userProblem);
   main();
}


main();

