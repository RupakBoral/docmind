import { Request, Response, Router } from "express";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() })
export const fileRouter = Router();

fileRouter.post('/upload', upload.single("file"), (req: Request, res: Response) => {
    console.log("File: ", req.file?.buffer);
    res.status(200).json({ success: true, message: "Success" });
});