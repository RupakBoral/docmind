import { ExtractPDFType } from "./pdf";

export const chunkPDF = (extractPDFContent: ExtractPDFType): string[] => {
    try {
        /**
         * contents = [
            { text: "page 1 text here...", page: 1 },
            { text: "page 2 text here...", page: 2 },
            ]
            // this is PageTextResult[] — array of PAGE OBJECTS

            contents.map(page => page.text) = ["page 1 text here...", "page 2 text here..."]
            // array of STRINGS (one per page)

            .join(' ') = "page 1 text here... page 2 text here..."
            // ONE big string — all pages merged

            .split(' ') = ["page", "1", "text", "here...", "page", "2", "text", "here..."]
            // array of WORDS

            flattenContent.slice(0, 800).join(' ') = "page 1 text here... page 2 text..."
            // first 800 WORDS joined back into a string → this is ONE chunk
         */

        const contents = extractPDFContent.content;
        const words = contents.map(page => page.text).join(' ').split(' ');
        const chunks: string[] = [];

        // Chunking in a fixed window size of 800 tokens
        for (let i = 0; i < words.length; i += 100) {
            chunks.push(words.slice(i, i + 800).join(' '));
        }

        return chunks;

    } catch (error) {
        throw new Error(`Error occured during Chunking. ${error}`);
    }
}