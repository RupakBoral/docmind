import { prisma } from "../config/db";
import crypto from "crypto";

export const generateAccountKey = () => {
    return `ACC-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
};

export const createAccount = async (key?: string) => {
    const accountKey = key || generateAccountKey();
    return await prisma.account.create({
        data: {
            key: accountKey
        }
    });
};

export const getAccountById = async (id: string) => {
    return await prisma.account.findUnique({
        where: { id },
        include: {
            users: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    createdAt: true
                }
            },
            documents: true
        }
    });
};

export const updateAccount = async (id: string, data: { key?: string }) => {
    return await prisma.account.update({
        where: { id },
        data
    });
};

export const deleteAccount = async (id: string) => {
    return await prisma.account.delete({
        where: { id }
    });
};
