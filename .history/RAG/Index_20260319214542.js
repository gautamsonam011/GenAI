import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import * as dotenv from "dotenv";
import { Pinecone } from "@pinecone-database/pinecone";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

async function indexDocument() {
  try {
    // ✅ Step 1: Load PDF
    const PDF_PATH = "./SonamGautamCV.pdf";
    const pdfLoader = new PDFLoader(PDF_PATH);

    const rawDocs = await pdfLoader.load();
    console.log("✅ PDF Loaded");

    // ✅ Step 2: Chunking
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });

    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);
    console.log("✅ Chunking completed:", chunkedDocs.length);

    // ✅ Step 3: Embeddings (FIXED - OpenAI)
    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: "text-embedding-3-small", // ✅ stable model
    });

    console.log("✅ Embedding model configured");

    // ✅ Step 4: Pinecone setup
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const pineconeIndex = pinecone.Index(
      process.env.PINECONE_INDEX_NAME
    );

    console.log("✅ Pinecone connected");

    // ✅ Step 5: Batch Embedding (FAST + OPTIMIZED)
    const texts = chunkedDocs
      .map((doc) => doc.pageContent.trim())
      .filter((text) => text.length > 0);

    const embeddingVectors = await embeddings.embedDocuments(texts);

    console.log("✅ Embeddings generated:", embeddingVectors.length);

    // ✅ Step 6: Prepare vectors
    const vectors = embeddingVectors.map((embedding, i) => ({
      id: uuidv4(),
      values: embedding,
      metadata: {
        text: texts[i],
      },
    }));

    console.log("✅ Vectors prepared:", vectors.length);

    if (vectors.length === 0) {
      throw new Error("❌ No vectors generated");
    }

    // ✅ Step 7: Upload to Pinecone
    await pineconeIndex.upsert(vectors);

    console.log("🎉 Data stored successfully in Pinecone!");
  } catch (error) {
    console.error("❌ ERROR:", error.message);
  }
}

indexDocument();