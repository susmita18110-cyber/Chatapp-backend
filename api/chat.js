// Vercel serverless function: POST /api/chat
// Set ANTHROPIC_API_KEY as an environment variable in the Vercel dashboard
// (Project Settings -> Environment Variables). Never hardcode it here.

export default async function handler(req, res) {
  // Allow requests from your HTML app (adjust origin later if you want to lock it down)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, history = [] } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: "Missing 'message' in request body" });
  }

  try {
    const messages = [
      ...history.map((h) => ({ role: "user", content: h })),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1024,
        messages,
      }),
    });

    const data = await response.json();
    const reply = data?.content?.[0]?.text ?? "Sorry, I couldn't generate a reply.";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Chat request failed" });
  }
}
