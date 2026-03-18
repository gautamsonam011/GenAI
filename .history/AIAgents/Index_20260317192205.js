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

const sumDeclaration = {
    name:'sum',
    description:"Get the sum of 2 number",
    parameters:{
        type:'OBJECT',
        properties:{
            num1:{
                type:'NUMBER',
                description: 'It will be first number for addition ex: 10'
            },
            num2:{
                type:'NUMBER',
                description:'It will be Second number for addition ex: 10'
            }
        },
        required: ['num1','num2']   
    }
}

const primeDeclaration = {
    name:'prime',
    description:"Get if number if prime or not",
    parameters:{
        type:'OBJECT',
        properties:{
            num:{
                type:'NUMBER',
                description: 'It will be the number to find it is prime or not ex: 13'
            },
        },
        required: ['num']   
    }
}



const cryptoDeclaration = {
    name:'getCryptoPrice',
    description:"Get the current price of any crypto Currency like bitcoin",
    parameters:{
        type:'OBJECT',
        properties:{
            coin:{
                type:'STRING',
                description: 'It will be the crypto currency name, like bitcoin'
            },
        },
        required: ['coin']   
    }
}


const availableTools = {
    sum:sum,
    prime:prime,
    getCryptoPrice:getCryptoPrice,
}

// getCryptoPrice('bitcoin');

// console.log(userProblem);

async function runAgent(userProblem){
    History.push({
        role: 'user',
        parts: [{text:userProblem}]
    });

    const response = await ai.models.generateContent({
        model:"gemini-2.0-flash",
        contents: History
    })

}

async function main() {
    const userProblem = readlineSync.question("Ask me anything-->");
    await runAgent(userProblem);
    main();
}
main();