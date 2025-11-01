// src/adapters/pdf.adapter.ts
import fs from "fs/promises";
import pdf from "pdf-parse";
import type { Adapter, ParsedDoc } from "../types";

export const pdfAdapter: Adapter = {
  canRead(file) {
    return /\.pdf$/i.test(file);
  },
  async read(file): Promise<ParsedDoc> {
    const buf = await fs.readFile(file);
    const result = await pdf(buf);
    return { text: result.text.trim(), meta: { pages: result.numpages } };
  },
};
