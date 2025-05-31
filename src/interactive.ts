import { readdirSync } from "fs";
import inquirer from "inquirer";
import { join } from "path";

interface ProcessOptions {
  inputFile: string;
  outputPath: string;
  format: string;
  concurrency: number;
  quality: number;
}

export async function getInteractiveOptions(): Promise<ProcessOptions> {
  // Get all .txt files from the source directory
  const sourceDir = join(process.cwd(), "source");
  const files = readdirSync(sourceDir)
    .filter((file) => file.endsWith(".txt"))
    .map((file) => ({
      name: file,
      value: join(sourceDir, file),
    }));

  if (files.length === 0) {
    throw new Error("No .txt files found in the source directory");
  }

  // Select input files
  const { selectedFiles } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedFiles",
      message: "Select one or more URL files to process:",
      choices: files,
      validate: (input) =>
        input.length > 0 ? true : "Please select at least one file",
    },
  ]);

  // Select output format
  const { format } = await inquirer.prompt([
    {
      type: "list",
      name: "format",
      message: "Select output format:",
      choices: [
        { name: "PDF", value: "pdf" },
        { name: "ZIP", value: "zip" },
      ],
    },
  ]);

  // Select quality
  const { quality } = await inquirer.prompt([
    {
      type: "number",
      name: "quality",
      message: "Select JPEG quality (1-100):",
      default: 90,
      validate: (input) => {
        const num = parseInt(input);
        return num >= 1 && num <= 100
          ? true
          : "Please enter a number between 1 and 100";
      },
    },
  ]);

  // Select concurrency
  const { concurrency } = await inquirer.prompt([
    {
      type: "number",
      name: "concurrency",
      message: "Select number of concurrent downloads:",
      default: 5,
      validate: (input) => {
        const num = parseInt(input);
        return num >= 1 && num <= 20
          ? true
          : "Please enter a number between 1 and 20";
      },
    },
  ]);

  // Get output name
  const { outputName } = await inquirer.prompt([
    {
      type: "input",
      name: "outputName",
      message: "Enter output file name (without extension):",
      default: "output",
      validate: (input) =>
        input.trim().length > 0 ? true : "Please enter a valid name",
    },
  ]);

  return {
    inputFile: selectedFiles[0], // For now, we'll process one file at a time
    outputPath: join(process.cwd(), "output", outputName),
    format,
    concurrency: parseInt(concurrency),
    quality: parseInt(quality),
  };
}
