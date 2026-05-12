import { Router, Request, Response } from "express";
import multer from "multer";
import { extractPDF } from "../services/pdf";
import { chunkPDF } from "../services/chunking";
import { EmbedChunk } from "../services/embedding";
import { deleteDoc, ingest, updateDoc } from "../services/core";
import { getDocs } from "../services/core";
import { retrieve } from "../services/retrieval";
import { LLM } from "../services/llm";


export const coreRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });

coreRouter.get('/:account_id/documents', async (req: Request, res: Response) => {
    try {
        const account_id = req.params.account_id as string;
        const name = (req.query.name as string) || null;

        const response = await getDocs(account_id, name);
        res.status(200).json({ success: true, data: response });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failure, Please try again later." });
    }
});

coreRouter.post('/:account_id/ingest', upload.single("file"), async (req: Request, res: Response) => {
    try {
        const pdfFile = req.file?.buffer;
        const account_id = req.params?.account_id as string;
        const doc_name = req.body.name;

        if (!pdfFile || !req.file) {
            res.status(422).json({ success: false, message: "No PDF content was provided." });
            return;
        }

        if (!doc_name) {
            res.status(422).json({ success: false, message: "PDF name was not provided." });
            return;
        }

        const extractedResult = await extractPDF(pdfFile);
        const chunks = chunkPDF(extractedResult);
        const embedObject = new EmbedChunk();
        const embeddings = await embedObject.embeddingChunks(chunks);
        const doc_id = await ingest(account_id, chunks, embeddings, doc_name, req.file.size, extractedResult.totalPages);

        res.status(200).json({ success: true, message: "Document ingested successfully", data: { document_id: doc_id } });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to upload, Please try with a small sized PDF" });
    }
});

coreRouter.patch('/:account_id/document', async (req: Request, res: Response) => {
    try {
        const account_id = req.params.account_id as string;
        const new_name = req.body.name;
        const doc_id = req.body.doc_id;

        if (!account_id || !new_name || !doc_id) {
            res.status(422).json({ success: false, message: "Please try again later." });
        }

        const response = await updateDoc(account_id, doc_id, new_name);
        res.status(200).json({ success: true, message: "Document updated successfully.", data: response });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed, Please try again" });
    }
});

coreRouter.post('/:account_id/query', async (req: Request, res: Response) => {
    try {
        const account_id = req.params?.account_id as string;

        const question: string = req.body.prompt ?? '';
        const doc_id: string = req.body.doc_id ?? null;

        const llmObject = new LLM();
        const prompt: string = await llmObject.modifyQuery(question);
        const embedObject = new EmbedChunk();
        const [questionEmbedding] = await embedObject.embeddingChunks([prompt]);

        const vector_string = `[${questionEmbedding.join(',')}]`;
        const retrieved_chunks = await retrieve(account_id, vector_string, doc_id);
        const answer = await llmObject.generateResponse(prompt, retrieved_chunks);

        res.status(200).json({
            success: true,
            message: "Generated the response",
            data: { answer, citations: retrieved_chunks }
        });
    } catch (error) {
        console.error("Error..", error);
        res.status(500).json({ success: false, message: "Failed, Please try again," });
    }
});

// 👾 need to implement better logic 👾
coreRouter.delete('/:account_id/documents/:doc_id', async (req: Request, res: Response) => {
    try {
        const account_id = req.params.account_id as string;
        const doc_id = req.params.doc_id as string;
        const result = await deleteDoc(account_id, doc_id);
        if (result.count === 0) {
            res.status(404).json({ success: false, message: "Document not found." });
            return;
        }
        res.json({ success: true, message: "Document deleted" });
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});