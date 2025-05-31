import { existsSync, rmSync } from "fs";
import { join } from "path";
import sharp from "sharp";

export async function processImage(
  url: string,
  index: number,
  tempDir: string,
  quality: number,
): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);

    const buffer = await response.arrayBuffer();
    const imagePath = join(tempDir, `image-${index + 1}.jpg`);

    await sharp(Buffer.from(buffer)).jpeg({ quality }).toFile(imagePath);

    return imagePath;
  } catch (error) {
    console.error(
      `❌ Error processing ${url}:`,
      error instanceof Error ? error.message : String(error),
    );
    return null;
  }
}

export function cleanup(tempDir: string) {
  try {
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
      console.log("\n🧹 Cleaned up temporary files");
    }
  } catch (error) {
    console.error(
      "\n⚠️ Warning: Failed to clean up temporary files:",
      error instanceof Error ? error.message : String(error),
    );
  }
}

// Handle process termination
export function setupCleanup(tempDir: string) {
  const cleanupHandler = () => {
    cleanup(tempDir);
    process.exit(0);
  };

  // Handle normal termination
  process.on("SIGINT", cleanupHandler);
  process.on("SIGTERM", cleanupHandler);
  process.on("exit", () => cleanup(tempDir));

  // Handle uncaught errors
  process.on("uncaughtException", (error) => {
    console.error(
      "\n❌ Uncaught Exception:",
      error instanceof Error ? error.message : String(error),
    );
    cleanup(tempDir);
    process.exit(1);
  });

  process.on("unhandledRejection", (error) => {
    console.error(
      "\n❌ Unhandled Rejection:",
      error instanceof Error ? error.message : String(error),
    );
    cleanup(tempDir);
    process.exit(1);
  });
}
