// Phase 2: Query Resolving phase

import * as dotenv from "dotenv";
dotenv.config();
import readlineSync from 'readline-sync';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});
const History = []

// Step 1: Convert the user query into embedding(vector)

async function chatting(question){
    // convert this question into vector 
    const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-embedding-001',
    });
 
    const queryVector = await embeddings.embedQuery(question);  
    // query vector 

    // make connection with pinecone 

        // Step 2: Search Relevant document into vector DB
    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    const searchResults = await pineconeIndex.query({
        topK: 5,
        vector: queryVector,
        includeMetadata: true,
        });

        console.log(searchResults);

    const context = searchResults.matches
                .map(match => match.metadata.text)
                .join("\n\n---\n\n");

    // Step 3: Query + Context to LLM            

    History.push({
    role:'user',
    parts:[{text:question}]
    })              



    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: History,
    config: {
      systemInstruction: `You have to behave like a Data Structure and Algorithm Expert.
    You will be given a context of relevant information and a user question.
    Your task is to answer the user's question based ONLY on the provided context.
    If the answer is not in the context, you must say "I could not find the answer in the provided document."
    Keep your answers clear, concise, and educational.
      
      Context: ${context}
      `,
    },
   });


   History.push({
    role:'model',
    parts:[{text:response.text}]
  })

  console.log("\n");
  console.log(response.text);           

}

// Step0: Take the user Input from terminal

async function main(){
   const userProblem = readlineSync.question("Ask me anything--> ");
   await chatting(userProblem);
   main();
}


main();

