import { Router } from "express";
import { coreRouter } from "./router/core";
import { userRouter } from "./router/user";
import { accountRouter } from "./router/account";
import { authRouter } from "./router/auth";
import { authenticate } from "./middlewares/auth";


export const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);

router.use('/account', authenticate, accountRouter);
router.use('/account', authenticate, coreRouter);