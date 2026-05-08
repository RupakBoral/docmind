import { Request, Response, Router } from "express";
import * as accountService from "../services/account";
import * as userService from "../services/user";

export const accountRouter = Router();


accountRouter.get('/:account_id', async (req: Request, res: Response) => {
    try {
        const id = req.params.account_id as string;
        const account = await accountService.getAccountById(id);

        if (!account) {
            res.status(404).json({ success: false, message: "Account not found." });
            return;
        }

        res.status(200).json({ success: true, data: account });
    } catch (error) {
        console.error("Error fetching account:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

accountRouter.get('/:account_id/users', async (req: Request, res: Response) => {
    try {
        const id = req.params.account_id as string;
        const users = await userService.listUsersByAccount(id);
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error("Error fetching account users:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

accountRouter.patch('/:account_id', async (req: Request, res: Response) => {
    try {
        const id = req.params.account_id as string;
        const account = await accountService.updateAccount(id, req.body);
        res.status(200).json({ success: true, data: account });
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ success: false, message: "Account not found." });
            return;
        }
        console.error("Error updating account:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

accountRouter.delete('/:account_id', async (req: Request, res: Response) => {
    try {
        const id = req.params.account_id as string;
        await accountService.deleteAccount(id);
        res.status(200).json({ success: true, message: "Account deleted successfully." });
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ success: false, message: "Account not found." });
            return;
        }
        console.error("Error deleting account:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});
