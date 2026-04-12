import { Router } from "express";
import { fileRouter } from "./router/ingest";
import { retrievalRouter } from "./router/query";


export const router = Router();

router.use('/', fileRouter);
router.use('', retrievalRouter);