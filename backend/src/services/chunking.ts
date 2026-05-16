import { CONFIG } from "../config/constants";
import { ExtractPDFType } from "./pdf";

export const chunkPDF = (extractPDFContent: ExtractPDFType): string[] => {
    try {
        const CHUNK_SIZE = CONFIG.CHUNKING.CHUNK_SIZE;
        const OVERLAP = CONFIG.CHUNKING.OVERLAP;

        const contents = extractPDFContent.content;
        const words = contents
            .map(page => page.text)
            .join(' ')
            .split(/\s+/)
            .filter(w => w.length > 0 && w.length < 50);

        const chunks: string[] = [];

        for (let i = 0; i < words.length; i += CHUNK_SIZE - OVERLAP) {
            chunks.push(words.slice(i, i + CHUNK_SIZE).join(' '));
        }

        return chunks;

    } catch (error) {
        throw new Error(`Error occured during Chunking. ${error}`);
    }
}
