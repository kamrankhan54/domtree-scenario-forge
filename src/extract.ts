import fs from "fs/promises";
import path from "path";
import type { Adapter } from "./types";
import { docxAdapter } from "./adapters/docx.adapter";
import { pdfAdapter } from "./adapters/pdf.adapter";
import { generateGherkinFromRequirements } from "./utils/aiScenario";

const adapters: Adapter[] = [docxAdapter, pdfAdapter];

export async function forgeScenarios(opts: {
  input: string;
  output: string;               // .feature path
  summary?: string | undefined; // make explicit to satisfy exactOptionalPropertyTypes
  feature?: string | undefined;
  style?: "concise" | "detailed";
}) {
  const adapter = adapters.find(a => a.canRead(opts.input));
  if (!adapter) throw new Error(`No adapter for file: ${opts.input}`);

  const parsed = await adapter.read(opts.input);

  const { featureText, summary } = await generateGherkinFromRequirements(
    parsed.text,
    parsed.tablesTSV || [],
    { includeSummary: !!opts.summary, featureName: opts.feature, style: opts.style || "concise" }
  );

  if (!featureText.trim()) {
    throw new Error("AI did not return Gherkin content. Check the input and OPENAI_API_KEY.");
  }

  await fs.mkdir(path.dirname(opts.output), { recursive: true });
  await fs.writeFile(opts.output, ensureFeatureHeader(featureText), "utf-8");

  if (opts.summary) {
    await fs.mkdir(path.dirname(opts.summary), { recursive: true });
    await fs.writeFile(opts.summary, summary ?? "*No summary generated.*", "utf-8");
  }

  console.log(`✅ Wrote feature → ${opts.output}`);
  if (opts.summary) console.log(`📝 Wrote summary  → ${opts.summary}`);
}

function ensureFeatureHeader(gherkin: string) {
  const trimmed = gherkin.trim();
  if (!/^Feature:/i.test(trimmed)) {
    return `Feature: Generated Feature\n\n${trimmed}\n`;
  }
  return trimmed + "\n";
}
