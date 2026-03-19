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
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
    });
    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);
}

indexDocument();



