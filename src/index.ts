#!/usr/bin/env bun
import { Command } from "commander";
import { join } from "path";
import { version } from "../package.json";
import { getInteractiveOptions } from "./interactive";
import { processImages } from "./process";

const program = new Command();

program
  .name("bulk-image-zipper")
  .description(
    "A CLI tool to download images from URLs and convert them to PDF or ZIP"
  )
  .version(version);

program
  .command("process")
  .description("Process images from URLs file")
  .requiredOption(
    "-i, --input <file>",
    "Input file containing URLs (one URL per line)"
  )
  .requiredOption("-o, --output <name>", "Output file name (without extension)")
  .option("-f, --format <format>", "Output format (pdf or zip)", "pdf")
  .option("-c, --concurrency <number>", "Number of concurrent downloads", "5")
  .option("-q, --quality <number>", "JPEG quality (1-100)", "90")
  .action(async (options) => {
    try {
      const outputPath = join(process.cwd(), "output", options.output);
      await processImages({
        inputFile: options.input,
        outputPath,
        format: options.format.toLowerCase(),
        concurrency: parseInt(options.concurrency),
        quality: parseInt(options.quality),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("\n❌ Error:", error.message);
      } else {
        console.error("\n❌ An unknown error occurred");
      }
      process.exit(1);
    }
  });

program
  .command("interactive")
  .description("Start interactive mode to process images")
  .action(async () => {
    try {
      const options = await getInteractiveOptions();
      await processImages(options);
    } catch (error) {
      if (error instanceof Error) {
        console.error("\n❌ Error:", error.message);
      } else {
        console.error("\n❌ An unknown error occurred");
      }
      process.exit(1);
    }
  });

program.parse();
