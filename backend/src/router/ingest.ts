import { Request, Response, Router } from "express";
import multer from "multer";
import { extractPDF, ExtractPDFType } from "../services/pdf";
import { chunkPDF } from "../services/chunking";
import { EmbedChunk } from "../services/embedding";
import { ingest } from "../services/ingest";

const upload = multer({ storage: multer.memoryStorage() })
export const fileRouter = Router();

fileRouter.post('/account/:account_id/ingest', upload.single("file"), async (req: Request, res: Response) => {
    try {
        const pdfFile = req.file?.buffer;
        const account_id = req.params?.account_id;
        const doc_name = req.body.doc_name;

        if (typeof (account_id) != 'string') {
            throw new Error("Please try logging again.");
        }

        if (!pdfFile || !req.file) {
            res.status(422).json({ success: false, message: "No PDF content was provided." });
            return;
        }

        const extractedResult: ExtractPDFType = await extractPDF(pdfFile);
        const chunks: string[] = chunkPDF(extractedResult);
        const embedObject = new EmbedChunk();
        const embeddings = await embedObject.embeddingChunks(chunks);
        const doc_id = await ingest(account_id, chunks, embeddings, doc_name, req.file.size , extractedResult.totalPages);

        res.status(200).json({ success: true, message: "Document ingested successfully", data: { document_id: doc_id } });
    } catch (error) {
        console.error("Error..", error);
        res.status(500).json({ success: false, message: "Failed, Please try again,", error: error });
    }
});