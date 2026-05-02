import { Router } from "express";
import { fileRouter } from "./router/ingest";
import { retrievalRouter } from "./router/query";
import { userRouter } from "./router/user";
import { accountRouter } from "./router/account";
import { authRouter } from "./router/auth";
import { authenticate } from "./middlewares/auth";


export const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);

router.use('/account', authenticate, accountRouter);
router.use('', authenticate, fileRouter);
router.use('', authenticate, retrievalRouter);