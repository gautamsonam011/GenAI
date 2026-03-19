// import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
// import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
// import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
// import * as dotenv from 'dotenv';
// dotenv.config();
// import { Pinecone } from '@pinecone-database/pinecone';
// import { PineconeStore } from '@langchain/pinecone';

// async function indexDocument() {
//     // Load PDF 

//     const PDF_PATH = './SonamGautamCV.pdf';
//     const pdfLoader = new PDFLoader(PDF_PATH);

//     const rawDocs = await pdfLoader.load();

//     // console.log(rawDocs.length);
//     // console.log("Raw docs:", rawDocs.length);
//     // console.log("First raw doc:", rawDocs[0]);
//     console.log("PDF Loaded")

//     // Chunking 

//     const textSplitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 500,
//     chunkOverlap: 50,
//     });
//     const chunkedDocs = await textSplitter.splitDocuments(rawDocs);
//     console.log("Chunking completed")

//     // console.log("Chunked docs:", chunkedDocs.length);
//     // console.log("First chunk:", chunkedDocs[0]);

//     // console.log(chunkedDocs.length)
//     // console.log(chunkedDocs)

//     // Vector Embedding model

//     const embeddings = new GoogleGenerativeAIEmbeddings({
//     apiKey: process.env.GEMINI_API_KEY,
//     model: 'text-embedding-004',
//     });

//     console.log("Embedding model configured")
//     // Database configuring 
//     // Step4:  Initialize Pinecone Client

//     const pinecone = new Pinecone();
//     const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
//     console.log("Pinecone configured")

//     // Langchain (chunking, embedding, database)

//     // Step 5: Embed Chunks and Upload to Pinecone

//     await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
//     pineconeIndex,
//     maxConcurrency: 5,
//     });
//     console.log("Data stored successfully")
// }

// indexDocument();

// // https://certain-mechanic-42c.notion.site/RAG-System-23c3a78e0e22801caa04d16f95df1825

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function indexDocument() {
  try {
    // ✅ Resolve absolute path (avoids Windows issues)
    const PDF_PATH = path.resolve('./SonamGautamCV.pdf');

    // ===== 1. Load PDF =====
    const pdfLoader = new PDFLoader(PDF_PATH, {
      splitPages: true,
    });

    const rawDocs = await pdfLoader.load();

    console.log("PDF Loaded");
    console.log("Raw docs count:", rawDocs.length);

    if (!rawDocs || rawDocs.length === 0) {
      throw new Error("❌ No content extracted from PDF. PDF may be scanned/image-based.");
    }

    // ===== 2. Chunking =====
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });

    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

    console.log("Chunking completed");
    console.log("Chunked docs count:", chunkedDocs.length);

    // ===== 3. Remove Empty Chunks (🔥 MAIN FIX) =====
    const validDocs = chunkedDocs.filter(
      (doc) => doc.pageContent && doc.pageContent.trim().length > 0
    );

    console.log("Valid docs count:", validDocs.length);

    if (validDocs.length === 0) {
      throw new Error("❌ All chunks are empty. PDF likely has no readable text.");
    }

    // ===== 4. Add Metadata =====
    const docsWithMetadata = validDocs.map((doc, index) => ({
      ...doc,
      metadata: {
        source: PDF_PATH,
        chunk: index,
        page: doc.metadata?.loc?.pageNumber || null,
      },
    }));

    // ===== 5. Embeddings =====
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: 'text-embedding-004',
    });

    console.log("Embedding model configured");

    // ===== 6. Pinecone =====
    const pinecone = new Pinecone();

    const pineconeIndex = pinecone.Index(
      process.env.PINECONE_INDEX_NAME
    );

    console.log("Pinecone configured");

    // ===== 7. Store in Pinecone =====
    await PineconeStore.fromDocuments(docsWithMetadata, embeddings, {
      pineconeIndex,
      namespace: "resume-sonam", // ✅ important
      maxConcurrency: 5,
    });

    console.log("✅ Data stored successfully");

  } catch (error) {
    console.error("🚨 Error:", error.message);
  }

  console.log("API KEY:", process.env.GEMINI_API_KEY);
}

indexDocument();