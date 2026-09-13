// Vercel serverless function: GET/POST /api/state
// Reads and writes the app's projects + conversations to Supabase,
// so chat history survives page reloads.
//
// Requires these environment variables in Vercel:
//   SUPABASE_URL       - Project URL from Supabase (Settings -> API)
//   SUPABASE_ANON_KEY   - "anon public" key from Supabase (Settings -> API)

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, apikey, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: "Supabase env vars not set" });
  }

  const tableUrl = `${SUPABASE_URL}/rest/v1/app_state?id=eq.default`;
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    if (req.method === "GET") {
      const r = await fetch(tableUrl + "&select=data", { headers });
      const rows = await r.json();
      const data = rows && rows[0] ? rows[0].data : { projects: [], conversations: [] };
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const body = req.body || {};
      const payload = {
        projects: body.projects || [],
        conversations: body.conversations || [],
      };

      const r = await fetch(tableUrl, {
        method: "PATCH",
        headers: { ...headers, Prefer: "return=minimal" },
        body: JSON.stringify({ data: payload, updated_at: new Date().toISOString() }),
      });

      if (!r.ok) {
        const errText = await r.text();
        return res.status(500).json({ error: "Supabase write failed", details: errText });
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "State request failed" });
  }
}
