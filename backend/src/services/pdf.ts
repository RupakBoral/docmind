import { LoadParameters, PageTextResult, PDFParse } from "pdf-parse";

export interface ExtractPDFType {
    content: PageTextResult[];
    totalPages: number;
}

export const extractPDF = async (pdf: Buffer): Promise<ExtractPDFType> => {
    try {
        const loadParams: LoadParameters = {
            data: pdf
        }

        const parser = new PDFParse(loadParams);
        const PDF = await parser.getText();
        const pages = PDF.pages;

        const extractResult: ExtractPDFType = {
            content: pages,
            totalPages: PDF.total
        }
        return extractResult;

    } catch (err) {
        console.error("Error: ", err);
        throw new Error(`Error extracting the PDF. ${err}`);
    }
}