import { Router } from "express";
import { fileRouter } from "./router/file";


export const router = Router();

router.use('/file', fileRouter);