// Phase 2: Query Resolving phase

import * as dotenv from "dotenv";
dotenv.config();
import readlineSync from 'readline-sync';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});
const History = []

// How to Enhance our user Query
async function transformQuery(question){

History.push({
    role:'user',
    parts:[{text:question}]
    })  

const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: History,
    config: {
      systemInstruction: `You are a query rewriting expert. Based on the provided chat history, rephrase the "Follow Up user Question" into a complete, standalone question that can be understood without the chat history.
    Only output the rewritten question and nothing else.
      `,
    },
 });
 
 History.pop()
 
 return response.text


}

// Step 1: Convert the user query into embedding(vector)

async function chatting(question){

    const queries = await transformQuery(question);

    // convert this question into vector 
    const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-embedding-001',
    });
 
    const queryVector = await embeddings.embedQuery(queries);  
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
    parts:[{text:queries}]
    })              



    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: History,
    config: {
      systemInstruction: `You have to behave like a resume reader Expert.
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

