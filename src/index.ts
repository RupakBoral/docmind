import 'dotenv/config';
import express, { Request, Response } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { CONFIG } from './config/constants';
import { prisma } from './config/db';
import { router } from './router';

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({ message: "Server is running fine" });
})
app.use('/api/v1', router);

app.listen(CONFIG.SERVER.PORT, async () => {
    try {
        console.info("Server running in PORT: ", CONFIG.SERVER.PORT);
        await prisma.$connect();
        console.info("DB Connected");
    } catch (err) {
        console.error("Error", err);
    }
});

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
})