import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CONFIG } from "../config/constants";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        account_id: string;
    }
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({ success: false, message: "Authentication required. Please log in." });
            return;
        }

        const decoded = jwt.verify(token, CONFIG.JWT.SECRET) as any;

        req.user = {
            id: decoded.id,
            email: decoded.email,
            account_id: decoded.account_id
        };

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(401).json({ success: false, message: "Invalid or expired token. Please log in again." });
    }
};
