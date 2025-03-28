import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from './_index';

// This is the serverless entry point for Vercel
export default async (req: VercelRequest, res: VercelResponse) => {
  // Create mock Express req/res objects to handle the route
  return new Promise((resolve) => {
    // Create a response listener to capture when Express sends a response
    const originalEnd = res.end;
    res.end = function(...args: any[]) {
      originalEnd.apply(res, args);
      resolve(undefined);
      return res;
    };

    // Process the request through our Express app
    app(req, res);
  });
};