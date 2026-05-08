import { prisma } from "../config/db";
import bcrypt from "bcryptjs";
import { createAccount } from "./account";

export const registerUser = async (userData: any) => {
    const { first_name, last_name, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    return await prisma.$transaction(async (tx) => {
        const account = await createAccount();

        const user = await tx.user.create({
            data: {
                first_name,
                last_name,
                email,
                password: hashedPassword,
                account_id: account.id
            }
        });
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, account };
    });
};

export const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id }
    });
    if (!user) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export const updateUser = async (id: string, data: any) => {
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await prisma.user.update({
        where: { id },
        data
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export const deleteUser = async (id: string) => {
    return await prisma.user.delete({
        where: { id }
    });
};

export const listUsersByAccount = async (accountId: string) => {
    const users = await prisma.user.findMany({
        where: { account_id: accountId }
    });
    return users.map(({ password: _, ...u }) => u);
};

export const getUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email }
    });
};

export const authenticateUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
