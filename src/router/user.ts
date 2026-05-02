import { Request, Response, Router } from "express";
import * as userService from "../services/user";
import { authenticate } from "../middlewares/auth";

export const userRouter = Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

userRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        if (!first_name || !last_name || !email || !password) {
            res.status(400).json({ success: false, message: "Missing required fields." });
            return;
        }

        if (!emailRegex.test(email)) {
            res.status(400).json({ success: false, message: "Invalid email format." });
            return;
        }

        const result = await userService.registerUser(req.body);

        res.status(201).json({
            success: true,
            message: "User and account created successfully.",
            data: result
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            res.status(409).json({ success: false, message: "Email already exists." });
            return;
        }
        console.error("Error registering user:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

userRouter.get('/:id', authenticate, async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const user = await userService.getUserById(id);

        if (!user) {
            res.status(404).json({ success: false, message: "User not found." });
            return;
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

userRouter.patch('/:id', authenticate, async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { email } = req.body;

        if (email && !emailRegex.test(email)) {
            res.status(400).json({ success: false, message: "Invalid email format." });
            return;
        }

        const user = await userService.updateUser(id, req.body);

        res.status(200).json({ success: true, data: user });
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ success: false, message: "User not found." });
            return;
        }
        console.error("Error updating user:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

userRouter.delete('/:id', authenticate, async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await userService.deleteUser(id);

        res.status(200).json({ success: true, message: "User deleted successfully." });
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ success: false, message: "User not found." });
            return;
        }
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});