import Groq from "groq-sdk";
import { RetrieveChunks } from "./retrieval";
import { CONFIG } from "../config/constants";

export class LLM {
    private KEY: string;
    private model: string;
    private ai: Groq;

    constructor() {
        this.KEY = CONFIG.LLM.API_KEY;
        this.model = "llama-3.3-70b-versatile";
        this.ai = new Groq({ apiKey: this.KEY });
    }

    public modifyQuery = async (question: string): Promise<string> => {
        try {
            const response = await this.ai.chat.completions.create({
                messages: [{
                    role: "user",
                    content: `Question: ${question}. Formulate the question in a better structure and tune it so nomic-embed-text model can fetch the best response. Donot include content other than what is asked.`,
                },
                ],
                model: this.model,
            });
            return response.choices[0].message.content || '';
        } catch (error) {
            throw new Error(`Error while generating response: ${error}`);
        }
    }

    public generateResponse = async (prompt: string, chunks: Array<RetrieveChunks>): Promise<string> => {
        try {
            const content: string = chunks.map((chunk) => chunk.content).join("\n\n");

            const response = await this.ai.chat.completions.create({
                messages: [{
                    role: "system",
                    content: `Answer the user's question using ONLY the context below. 
                    If the answer is not in the context, say "I don't know".
                    User's question:
                    ${prompt}

                    Context:
                    ${content}`,
                },],
                model: this.model
            });
            return response.choices[0].message.content || '';
        } catch (error) {
            throw new Error(`Error while generating response: ${error}`);
        }
    }
}

