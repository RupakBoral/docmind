import { Request, Response, Router } from "express";
import multer from "multer";
import { extractPDF, ExtractPDFType } from "../services/pdf";
import { chunkPDF } from "../services/chunking";
import { EmbedChunk } from "../services/embedding";
import { ingest } from "../services/ingest";

const upload = multer({ storage: multer.memoryStorage() })
export const fileRouter = Router();

fileRouter.post('/ingest', upload.single("file"), async (req: Request, res: Response) => {
    try {
        const pdfFile = req.file?.buffer;

        if (!pdfFile) {
            res.status(422).json({ success: false, message: "No PDF content was provided." });
            return;
        }

        const extractedResult: ExtractPDFType = await extractPDF(pdfFile);
        const chunks: string[] = chunkPDF(extractedResult);
        const embedObject = new EmbedChunk();
        const embeddings = await embedObject.embeddingChunks(chunks);
        await ingest(chunks, embeddings);

        res.status(200).json({ success: true, message: "Document ingested successfully" });
    } catch (error) {
        console.error("Error..", error);
        res.status(500).json({ success: false, message: "Failed, Please try again," });
    }
});