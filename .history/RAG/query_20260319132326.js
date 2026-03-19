import * as dotenv from "dotenv";
dotenv.config();
import readlineSync from 'readline-sync';

async function main(){
   const userProblem = readlineSync.question("Ask me anything--> ");
   await chatting(userProblem);
   main();
}


main();

