import { prisma } from "../config/db";

export const getDocs = async (account_id: string, name?: string | null) => {
    try {
        const docs = await prisma.document.findMany({
            where: {
                account_id,
                ...(name && { name: { contains: name, mode: 'insensitive' } }),
            },
            orderBy: { createdAt: 'desc' },
        });
        return docs;
    } catch (error) {
        throw new Error(`DB Error: ${error}`);
    }
};

export const ingest = async (
    account_id: string,
    chunks: string[],
    embeddings: number[][],
    doc_name: string,
    size: number,
    pages: number
) => {
    try {
        const doc = await prisma.document.create({
            data: {
                name: doc_name,
                size: size,
                pages: pages,
                account_id: account_id,
            },
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
                    )`;
            })
        );

        console.info(`Ingested ${chunks.length} chunks for doc ${doc_id}`);
        return doc_id || '';
    } catch (error) {
        throw new Error(`DB Error: ${error}`);
    }
};

export const updateDoc = async (account_id: string, doc_id: string, new_name: string) => {
    try {
        const doc = await prisma.document.update({
            where: { id: doc_id },
            data: { name: new_name },
        });
        return doc;
    } catch (error) {
        throw new Error(`DB Error ${error}`);
    }
};

export const deleteDoc = async (account_id: string, doc_id: string) => {
    try {
        const doc = prisma.document.deleteMany({
            where: { id: doc_id, account_id },
        });
        return doc;
    } catch (error) {
        throw new Error(`DB Error ${error}`);
    }
};