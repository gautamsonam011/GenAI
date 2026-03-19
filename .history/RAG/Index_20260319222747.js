import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import * as dotenv from 'dotenv';
dotenv.config();
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { v4 as uuidv4 } from 'uuid';

async function indexDocument() {
    // Load PDF 

    const PDF_PATH = './SonamGautamCV.pdf';
    const pdfLoader = new PDFLoader(PDF_PATH);

    const rawDocs = await pdfLoader.load();

    // console.log(rawDocs.length);
    // console.log("Raw docs:", rawDocs.length);
    // console.log("First raw doc:", rawDocs[0]);
    console.log("PDF Loaded")

    // Chunking 

    const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
    });
    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);
    console.log("Chunking completed")

    // console.log("Chunked docs:", chunkedDocs.length);
    // console.log("First chunk:", chunkedDocs[0]);

    // console.log(chunkedDocs.length)
    // console.log(chunkedDocs)

    // Vector Embedding model

    const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    modelName: "models/text-embedding-004",
    });

    embeddings.embedQuery("test").then(res => console.log("Success!")).catch(err => console.error("Failed again"));
        
    console.log("Embedding model configured")
    // Database configuring 
    // Step4:  Initialize Pinecone Client

    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    console.log("Pinecone configured")

    // Langchain (chunking, embedding, database)

    // Step 5: Embed Chunks and Upload to Pinecone

    // Step 1: Test embedding
   
    // console.log("Test embedding length:", testEmbedding?.length);

    // if (!testEmbedding || testEmbedding.length === 0) {
    // throw new Error("Embedding not working");
    // }

    // Step 2: Create vectors manually
    const vectors = [];

    for (const doc of chunkedDocs) {
    const text = doc.pageContent?.trim();

    if (!text) continue;

    try {
        const embedding = await embeddings.embedQuery(text);

        if (!embedding || embedding.length === 0) {
        console.log("Empty embedding skipped");
        continue;
        }

        vectors.push({
        id: uuidv4(),
        values: embedding,
        metadata: {
            text,
        },
        });

    } catch (err) {
        console.log("Embedding failed:", err.message);
    }
    }

    console.log("Vectors prepared:", vectors.length);

    // if (vectors.length === 0) {
    // throw new Error("No vectors generated");
    // }

    // Step 3: Upload to Pinecone
    await pineconeIndex.upsert(vectors);

    console.log("Data stored successfully");
}

indexDocument();

// https://certain-mechanic-42c.notion.site/RAG-System-23c3a78e0e22801caa04d16f95df1825

