# Bulk Image Zipper

A command-line tool to download images from URLs and convert them to PDF or ZIP format. Built with Bun and TypeScript.

## Features

- 📥 Download images from URLs in parallel
- 📄 Convert images to PDF with proper page sizing
- 📦 Package images into ZIP archives
- 🖼️ Image optimization using sharp
- ⚡ Fast processing with Bun runtime
- 📊 Progress tracking and error handling
- 🔄 Configurable concurrency and quality settings
- 🎯 Interactive mode for easy file selection and configuration

## Installation

### Option 1: Download Executable (Windows)

1. Go to the [Releases](https://github.com/yourusername/bulk-image-zipper/releases) page
2. Download the latest `bulk-image-zipper-vX.X.X.exe` file
3. Run the executable directly from your command line

### Option 2: Build from Source

```bash
# Clone the repository
git clone https://github.com/yourusername/bulk-image-zipper.git
cd bulk-image-zipper

# Install dependencies
bun install
```

## Usage

### Interactive Mode (Recommended)

1. Place your URL files (`.txt` files) in the `source` directory
2. Run the interactive mode:

```bash
# If using the executable
bulk-image-zipper.exe interactive

# If building from source
bun interactive
```

The interactive mode will:
- Let you select one or more URL files from the source directory
- Choose between PDF or ZIP output format
- Set the JPEG quality (1-100)
- Configure the number of concurrent downloads
- Name your output file

### Command Line Mode

1. Create a text file (e.g., `urls.txt`) containing image URLs, one per line.
2. Run the tool using one of the following commands:

```bash
# Using the executable
bulk-image-zipper.exe process -i urls.txt -o output

# Using npm scripts
bun start process -i urls.txt -o output

# Or directly with bun
bun run src/index.ts process -i urls.txt -o output
```

### Command Options

- `-i, --input <file>`: Input file containing URLs (required)
- `-o, --output <name>`: Output file name without extension (required)
- `-f, --format <format>`: Output format (pdf or zip, default: pdf)
- `-c, --concurrency <number>`: Number of concurrent downloads (default: 5)
- `-q, --quality <number>`: JPEG quality (1-100, default: 90)

### Examples

```bash
# Interactive mode
bulk-image-zipper.exe interactive

# Convert to PDF with default settings
bulk-image-zipper.exe process -i urls.txt -o images

# Convert to ZIP with custom settings
bulk-image-zipper.exe process -i urls.txt -o images -f zip -c 10 -q 80

# Convert to PDF with high quality
bulk-image-zipper.exe process -i urls.txt -o images -f pdf -q 95
```

## Development

```bash
# Start development mode
bun dev

# Build the project
bun build

# Clean temporary files
bun clean

# Format code
bun format

# Lint code
bun lint

# Run tests
bun test
```

## Project Structure

```
bulk-image-zipper/
├── src/
│   ├── index.ts        # CLI entry point
│   ├── process.ts      # Core processing logic
│   ├── utils.ts        # Utility functions
│   └── interactive.ts  # Interactive mode logic
├── source/            # Place URL files here
├── output/           # Generated output files
├── temp/            # Temporary processing files
└── package.json
```

## License

MIT
