import fs from "fs/promises";
import mammoth from "mammoth";
import type { Adapter, ParsedDoc } from "../types";

function stripTagsToText(html: string): string {
  return html.replace(/<[^>]+>/g, "\n").replace(/\n{2,}/g, "\n").trim();
}

function tablesToTSV(html: string): string[] {
  const tables: string[] = [];
  const tableRegex = /<table[\s\S]*?<\/table>/gi;
  const rowRegex = /<tr[\s\S]*?<\/tr>/gi;
  const cellRegex = /<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi;

  const norm = (s: string) =>
    s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  const matches = html.match(tableRegex) || [];
  for (const tableHtml of matches) {
    const rows = tableHtml.match(rowRegex) || [];
    const tsvRows: string[] = [];
    for (const tr of rows) {
      const cells: string[] = [];
      let m: RegExpExecArray | null;
      cellRegex.lastIndex = 0;
      while ((m = cellRegex.exec(tr))) {
        cells.push(norm(m[2]));
      }
      if (cells.length) tsvRows.push(cells.join("\t"));
    }
    if (tsvRows.length) tables.push(tsvRows.join("\n"));
  }
  return tables;
}

export const docxAdapter: Adapter = {
  canRead(file) {
    return /\.docx$/i.test(file);
  },
  async read(file): Promise<ParsedDoc> {
    const buf = await fs.readFile(file);
    const { value: html } = await mammoth.convertToHtml({ buffer: buf });
    const text = stripTagsToText(html);
    const tablesTSV = tablesToTSV(html);
    return { text, tablesTSV, meta: { tables: tablesTSV.length } };
  }
};
