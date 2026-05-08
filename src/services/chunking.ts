import { ExtractPDFType } from "./pdf";

export const chunkPDF = (extractPDFContent: ExtractPDFType): string[] => {
    try {
        const CHUNK_SIZE = 500;
        const OVERLAP = 100;

        const contents = extractPDFContent.content;
        const words = contents.map(page => page.text).join(' ').split(' ');
        const chunks: string[] = [];

        // Chunking in a fixed window size of 800 tokens
        for (let i = 0; i < words.length; i += CHUNK_SIZE - OVERLAP) {
            chunks.push(words.slice(i, i + CHUNK_SIZE).join(' '));
        }

        return chunks;

    } catch (error) {
        throw new Error(`Error occured during Chunking. ${error}`);
    }
}
