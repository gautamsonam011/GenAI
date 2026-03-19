import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { PDFLoader } from '@langchain/...'

async function indexDocument(){

    const PDF_PATH = './SonamGautamCV.pdf';
    const pdfLoader = new PDFLoader(PDF_PATH);
    const rawDocs = await pdfLoader.load();

    console.log(rawDocs.length);
}

indexDocument();