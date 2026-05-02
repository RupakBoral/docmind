import { prisma } from "../config/db";

export const ingest = async (account_id: string, chunks: string[], embeddings: number[][], doc_name: string, size: number, pages: number): Promise<string> => {
    try {
        const doc = await prisma.document.create({
            data: {
                name: doc_name,
                size: size,
                pages: pages,
                account_id: account_id
            }
        });

        const doc_id = doc.id;

        await Promise.all(
            chunks.map((content, index) => {
                const vectorString = `[${embeddings[index].join(',')}]`;
                return prisma.$executeRaw`
                    INSERT INTO "chunk" (id, document_id, content, embedding, page)
                    VALUES (
                        gen_random_uuid(),
                        ${doc_id},
                        ${content},
                        ${vectorString}::vector,
                        ${index + 1}
                    )`
            })
        );

        console.info(`Ingested ${chunks.length} chunks for doc ${doc_id}`);
        return doc_id || '';

    } catch (error) {
        throw new Error(`DB Error: ${error}`);
    }
}