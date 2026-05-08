import { prisma } from "../config/db";

export interface RetrieveChunks {
    content: string;
    page: number;
    similarity: number;
}

export const retrieve = async (account_id: string, vector_string: string, doc_id: string | null): Promise<Array<RetrieveChunks>> => {
    try {
        if (!vector_string || vector_string.length === 0) {
            throw new Error("Invalid vector input");
        }

        const chunks: Array<RetrieveChunks> = doc_id
            ? await prisma.$queryRaw`
                SELECT ch.content, ch.page,
                1 - (embedding <=> ${vector_string}::vector) as similarity
                FROM account AS acc
                JOIN document AS doc
                ON doc.account_id = ${account_id}
                JOIN "chunk" AS ch
                ON ch.document_id = ${doc_id}
                ORDER BY similarity DESC
                LIMIT 5
                `
            : await prisma.$queryRaw`
                SELECT ch.content, ch.page,
                1 - (embedding <=> ${vector_string}::vector) as similarity
                FROM account AS acc
                JOIN document AS doc
                ON doc.account_id = ${account_id}
                JOIN "chunk" AS ch
                ON ch.document_id = doc.id
                ORDER BY similarity DESC
                LIMIT 5
            `;

        return chunks;
    } catch (error) {
        throw new Error(`DB Error: ${error}`);
    }
}