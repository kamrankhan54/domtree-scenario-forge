export type ParsedDoc = {
    text: string;           // plain text from doc
    tablesTSV?: string[];   // each table as TSV (for DOCX when available)
    meta?: Record<string, any>;
  };
  
  export interface Adapter {
    canRead: (filePath: string) => boolean;
    read: (filePath: string) => Promise<ParsedDoc>;
  }
  