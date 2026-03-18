import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';

const History = [];
const ai = new GoogleGenAI({ apiKey: "AIzaSyDMm5gvphiTn0aIv-dpnmq1oQ1fWrW-C4c" });

function sum({num1,num2}){
    return num1+num2;
}


function prime({num}){

    if(num<2)
        return false;

    for(let i=2;i<=Math.sqrt(num);i++)
        if(num%i==0) return false

    return true;
}


async function getCryptoPrice({coin}){

   const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin}`)
   const data = await response.json();

   return data;
}

const userProblem = readlineSync.question("Ask me anything-->");

getCryptoPrice('bitcoin');

console.log(userProblem);