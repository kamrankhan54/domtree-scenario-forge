import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type ScenarioOptions = {
  includeSummary?: boolean;
  featureName?: string;
  style?: "concise" | "detailed";
};

export async function generateGherkinFromRequirements(
  plainText: string,
  tablesTSV: string[] = [],
  opts: ScenarioOptions = {}
): Promise<{ featureText: string; summary?: string }> {
  const styleLine =
    opts.style === "detailed"
      ? "Write comprehensive scenarios, include edge cases."
      : "Write concise, focused scenarios.";

  const featureHint = opts.featureName ? `Feature name hint: "${opts.featureName}".` : "";

  const prompt = `
You are a senior QA with strong product sense and BDD expertise.
Read the following requirements and acceptance criteria and produce valid Gherkin (.feature) content.

Rules:
- Use proper Gherkin syntax: Feature, Scenario, Given, When, Then.
- Group scenarios under a single Feature.
- Use camelCase placeholders where appropriate (e.g., {validUser}, {invalidPassword}).
- Do NOT include any explanations or prose outside of Gherkin unless asked for a summary.
- ${styleLine}
- ${featureHint}

REQUIREMENTS (plain text):
"""
${plainText}
"""

${tablesTSV.length ? `TABLES (TSV format):
${tablesTSV.map((t, i) => `--- TABLE ${i + 1} ---\n${t}`).join("\n\n")}
` : ""}

Return:
1) The full Gherkin feature file.
${opts.includeSummary ? "2) A short markdown summary of scenarios (bullet points)." : ""}
`;

  const resp = await client.responses.create({
    model: "gpt-4o-mini",
    input: prompt,
  });

  // Try to capture both Gherkin and optional summary
  const text = (resp as any).output_text ?? "";
  if (!text) {
    // Fallback to older shapes if needed
    const outArr = (resp as any).output ?? [];
    const first = outArr[0];
    const content = first?.content;
    const blocks = Array.isArray(content) ? content : [];
    const blockText = blocks.map((b: any) => b.text || "").join("\n");
    if (!blockText) return { featureText: "" };
    return splitGherkinAndSummary(blockText, !!opts.includeSummary);
  }

  return splitGherkinAndSummary(text, !!opts.includeSummary);
}

function splitGherkinAndSummary(full: string, hasSummary: boolean) {
  // Heuristic: look for a Feature block, then anything after a line like "Summary:" or "----"
  const featureMatch = full.match(/(^|\n)\s*Feature:([\s\S]*)/i);
  let featureText = featureMatch ? featureMatch[0].trim() : full.trim();
  let summary: string | undefined;

  if (hasSummary) {
    const parts = full.split(/(^|\n)Summary:|(^|\n)---+|(^|\n)# Summary/i);
    if (parts.length > 1) {
      summary = parts[parts.length - 1].trim();
    }
  }
  return { featureText, summary };
}
