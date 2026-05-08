import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import * as userService from "../services/user";
import { CONFIG } from "../config/constants";

export const authRouter = Router();

authRouter.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ success: false, message: "Email and password are required." });
            return;
        }

        const user = await userService.authenticateUser(email, password);

        if (!user) {
            res.status(401).json({ success: false, message: "Invalid email or password." });
            return;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, account_id: user.account_id },
            CONFIG.JWT.SECRET as jwt.Secret,
            { expiresIn: CONFIG.JWT.EXPIRY as any }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "Login successful.",
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

authRouter.post('/logout', (_req: Request, res: Response) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ success: true, message: "Logged out successfully" })
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
})
