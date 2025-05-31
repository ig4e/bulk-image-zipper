import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import JSZip from "jszip";
import { join } from "path";
import { PDFDocument } from "pdf-lib";
import { cleanup, processImage, setupCleanup } from "./utils";

interface ProcessOptions {
  inputFile: string;
  outputPath: string;
  format: string;
  concurrency: number;
  quality: number;
}

export async function processImages(options: ProcessOptions): Promise<void> {
  // Create temp directory for images
  const tempDir = join(process.cwd(), "temp");
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir);
  }

  // Setup cleanup handlers
  setupCleanup(tempDir);

  try {
    console.log("\n📥 Reading URLs from input file...");
    const urls = readFileSync(options.inputFile, "utf-8")
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urls.length === 0) {
      throw new Error("No valid URLs found in input file");
    }

    console.log(`📋 Found ${urls.length} URLs to process`);

    // Create output directory if it doesn't exist
    const outputDir = join(process.cwd(), "output");
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir);
    }

    // Download and process images in parallel with concurrency limit
    console.log(
      `\n⏳ Downloading and processing images (concurrency: ${options.concurrency})...`
    );
    const imagePaths = (
      await processInChunks(urls, options.concurrency, (url, index) =>
        processImage(url, index, tempDir, options.quality)
      )
    ).filter((path): path is string => path !== null);

    if (imagePaths.length === 0) {
      throw new Error("No images were successfully downloaded");
    }

    console.log(`\n✅ Successfully processed ${imagePaths.length} images`);

    // Create output based on format
    console.log(`\n📦 Creating ${options.format.toUpperCase()} file...`);
    const outputFile = `${options.outputPath}.${options.format}`;

    if (options.format === "pdf") {
      const pdfDoc = await PDFDocument.create();

      for (const imagePath of imagePaths) {
        const imageBytes = readFileSync(imagePath);
        const image = await pdfDoc.embedJpg(imageBytes);
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      writeFileSync(outputFile, pdfBytes);
    } else if (options.format === "zip") {
      const zip = new JSZip();

      for (let i = 0; i < imagePaths.length; i++) {
        const imagePath = imagePaths[i];
        if (imagePath) {
          const imageData = readFileSync(imagePath);
          zip.file(`image-${i + 1}.jpg`, imageData);
        }
      }

      const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
      writeFileSync(outputFile, zipBuffer);
    }

    console.log(`\n✨ Successfully created ${outputFile}`);
  } catch (error) {
    throw error;
  } finally {
    // Clean up temporary files
    cleanup(tempDir);
  }
}

// Helper function to process items in chunks
async function processInChunks<T>(
  items: T[],
  chunkSize: number,
  processFn: (item: T, index: number) => Promise<any>
) {
  const results = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(
      chunk.map((item, index) => processFn(item, i + index))
    );
    results.push(...chunkResults);
  }
  return results;
}
