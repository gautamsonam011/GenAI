import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';


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

    console.log(chunkedDocs.length)
}

indexDocument();

// https://certain-mechanic-42c.notion.site/RAG-System-23c3a78e0e22801caa04d16f95df1825

