import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import * as dotenv from 'dotenv';
dotenv.config();
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';

async function indexDocument() {
    // Load PDF 

    const PDF_PATH = './SonamGautamCV.pdf';
    const pdfLoader = new PDFLoader(PDF_PATH);

    const rawDocs = await pdfLoader.load();

    // console.log(rawDocs.length);

    // Chunking 

    const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    });
    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

    // console.log(chunkedDocs.length)
    // console.log(chunkedDocs)

    // Vector Embedding model

    const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'text-embedding-004',
    });

    // Database configuring 
    // Step4:  Initialize Pinecone Client

    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    // Langchain (chunking, embedding, database)

    // Step 5: Embed Chunks and Upload to Pinecone

    await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
    });
}

indexDocument();

// https://certain-mechanic-42c.notion.site/RAG-System-23c3a78e0e22801caa04d16f95df1825

