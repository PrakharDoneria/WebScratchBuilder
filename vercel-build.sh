#!/bin/bash

# Install dependencies if needed
npm install

# Make sure esbuild is available (required for server build)
if ! [ -x "$(command -v esbuild)" ]; then
  npm install -g esbuild
fi

# Create public dir if needed
mkdir -p dist/public

# Build the client with Vite
npx vite build

# Build the server files
npx esbuild server/index.ts api/_index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Ensure api directory exists in output
mkdir -p dist/api

# Confirm output
echo "Build completed successfully!"
echo "Files in dist directory:"
ls -la dist/