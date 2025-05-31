# Build script for bulk-image-zipper
Write-Host "🚀 Starting build process..." -ForegroundColor Cyan

# Check if Bun is installed
try {
    $bunVersion = bun --version
    Write-Host "✅ Bun is installed: $bunVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Bun is not installed. Please install Bun first." -ForegroundColor Red
    exit 1
}

# Clean up old builds
if (Test-Path "bulk-image-zipper.exe") {
    Remove-Item "bulk-image-zipper.exe"
    Write-Host "🧹 Cleaned up old build" -ForegroundColor Yellow
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
bun install --production
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Install sharp specifically for Windows
Write-Host "📦 Installing sharp for Windows..." -ForegroundColor Cyan
bun add sharp@latest --platform=win32 --arch=x64
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install sharp" -ForegroundColor Red
    exit 1
}

# Build executable
Write-Host "🔨 Building executable..." -ForegroundColor Cyan
bun build --compile --target=bun-windows-x64 --minify ./src/index.ts --outfile bulk-image-zipper.exe --no-sourcemap
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Check if build was successful
if (Test-Path "bulk-image-zipper.exe") {
    $file = Get-Item "bulk-image-zipper.exe"
    $sizeMB = [math]::Round($file.Length / 1MB, 2)
    Write-Host "✅ Build successful! Executable size: $sizeMB MB" -ForegroundColor Green
    Write-Host "📂 Executable location: $($file.FullName)" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed - executable not found" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Done! You can now run the executable with: .\bulk-image-zipper.exe" -ForegroundColor Green 