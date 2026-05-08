import { Request, Response, Router } from "express";
import { EmbedChunk } from "../services/embedding";
import { retrieve } from "../services/retrieval";
import { LLM } from "../services/llm";

export const retrievalRouter = Router();

retrievalRouter.post('/account/:account_id/query', async (req: Request, res: Response) => {
    try {
        const account_id = req.params?.account_id;

        if (typeof (account_id) != 'string') {
            throw new Error("Please try logging again.");
        }

        const question: string = req.body.prompt ?? '';
        const doc_id: string = req.body.doc_id ?? null;

        const llmObject = new LLM();
        const prompt: string = await llmObject.modifyQuery(question);
        const embedObject = new EmbedChunk();
        const [questionEmbedding] = await embedObject.embeddingChunks([prompt]);

        const vector_string = `[${questionEmbedding.join(',')}]`;
        const retrieved_chunks = await retrieve(account_id, vector_string, doc_id);
        const data = await llmObject.generateResponse(prompt, retrieved_chunks);

        res.status(200).json({ success: true, message: "Generated the response", data: data });
    } catch (error) {
        console.error("Error..", error);
        res.status(500).json({ success: false, message: "Failed, Please try again,", error: error });
    }
})