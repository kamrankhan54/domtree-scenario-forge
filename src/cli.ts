#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { forgeScenarios } from "./extract";

yargs(hideBin(process.argv))
  .scriptName("domtree-scenario-forge")
  .command(
    "forge",
    "Generate Gherkin scenarios from a requirements document (DOCX/PDF) using AI",
    y => y
      .option("input", { type: "string", demandOption: true, describe: "Path to .docx or .pdf" })
      .option("output", { type: "string", demandOption: true, describe: "Path to .feature output" })
      .option("summary", { type: "string", describe: "Optional path to summary.md" })
      .option("feature", { type: "string", describe: "Feature name hint" })
      .option("style", { type: "string", choices: ["concise", "detailed"] as const, default: "concise" }),
    async argv => {
      await forgeScenarios({
        input: argv.input as string,
        output: argv.output as string,
        summary: argv.summary as string | undefined,
        feature: argv.feature as string | undefined,
        style: argv.style as "concise" | "detailed",
      });
    }
  )
  .demandCommand()
  .help()
  .parse();
