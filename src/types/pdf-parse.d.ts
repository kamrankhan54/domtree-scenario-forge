declare module "pdf-parse" {
    export interface PDFInfo {
      numpages: number;
      numrender: number;
      info: Record<string, any>;
      metadata: any;
      version: string;
    }
  
    export interface PDFData {
      text: string;
      numpages: number;
      info?: PDFInfo;
    }
  
    function pdf(dataBuffer: Buffer): Promise<PDFData>;
  
    export default pdf;
  }
  