import { Request, Response, Router } from "express";
import multer from "multer";
import { extractPDF, ExtractPDFType } from "../services/pdf";
import { chunkPDF } from "../services/chunking";
import { EmbedChunk } from "../services/embedding";
import { ingest } from "../services/ingest";
import { prisma } from "../config/db";

const upload = multer({ storage: multer.memoryStorage() })
export const fileRouter = Router();

fileRouter.get('/account/:account_id/documents', async (req: Request, res: Response) => {
    try {
        const account_id = req.params.account_id as string;
        const docs = await prisma.document.findMany({
            where: { account_id },
            include: { _count: { select: { chunks: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ success: true, data: docs });
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

fileRouter.delete('/account/:account_id/documents/:doc_id', async (req: Request, res: Response) => {
    try {
        const account_id = req.params.account_id as string;
        const doc_id = req.params.doc_id as string;
        const result = await prisma.document.deleteMany({
            where: { id: doc_id, account_id },
        });
        if (result.count === 0) {
            res.status(404).json({ success: false, message: "Document not found" });
            return;
        }
        res.json({ success: true, message: "Document deleted" });
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

fileRouter.post('/account/:account_id/ingest', upload.single("file"), async (req: Request, res: Response) => {
    try {
        const pdfFile = req.file?.buffer;
        const account_id = req.params?.account_id;
        const doc_name = req.body.name;

        if (typeof (account_id) != 'string') {
            throw new Error("Please try logging again.");
        }

        if (!pdfFile || !req.file) {
            res.status(422).json({ success: false, message: "No PDF content was provided." });
            return;
        }

        if (!doc_name) {
            res.status(422).json({ success: false, message: "PDF name was not provided." });
            return;
        }

        const extractedResult: ExtractPDFType = await extractPDF(pdfFile);
        const chunks: string[] = chunkPDF(extractedResult);
        const embedObject = new EmbedChunk();
        const embeddings = await embedObject.embeddingChunks(chunks);
        const doc_id = await ingest(account_id, chunks, embeddings, doc_name, req.file.size, extractedResult.totalPages);

        res.status(200).json({ success: true, message: "Document ingested successfully", data: { document_id: doc_id } });
    } catch (error) {
        console.error("Error..", error);
        res.status(500).json({ success: false, message: "Failed, Please try again,", error: error });
    }
});