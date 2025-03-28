#!/bin/bash

# This script is used by Vercel's static build process

# Build the frontend only - Vercel will handle the API serverless functions separately
npx vite build

echo "Vercel Static Build completed successfully!"
echo "Files in dist/public directory:"
ls -la dist/public/