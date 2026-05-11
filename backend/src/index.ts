import 'dotenv/config';
import express, { Request, Response } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { CONFIG } from './config/constants';
import { prisma } from './config/db';
import { router } from './router';

const app = express();

app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowed = ['http://localhost:5173', 'http://localhost:5174'];
    if (origin && allowed.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    }
    if (req.method === 'OPTIONS') { res.sendStatus(204); return; }
    next();
});

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