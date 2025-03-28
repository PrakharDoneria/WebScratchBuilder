// This file is a fallback for the Vercel API
export default function handler(req, res) {
  res.status(200).json({
    message: 'HTML Block Editor API is running',
    endpoints: [
      '/api/projects',
      '/api/projects/:id'
    ]
  });
}