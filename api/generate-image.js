// Vercel serverless function: POST /api/generate-image
// Wire this up to whichever image-generation API you choose
// (Stable Diffusion, Flux, DALL·E, etc). This is a placeholder.

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body || {};

  // TODO: call your chosen image-generation API here and
  // return a hosted image URL.
  return res.status(501).json({
    error: "Image generation not yet wired up. Add your image API call here.",
    receivedPrompt: prompt,
  });
}
