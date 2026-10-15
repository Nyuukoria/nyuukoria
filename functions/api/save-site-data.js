import { authorizeEditor } from "../_lib/auth.js";
import { dataKey, json, validSiteData } from "../_lib/data.js";

export async function onRequest({ request, env }) {
  // Also authenticate here so route aliases cannot bypass the middleware guard.
  const denied = await authorizeEditor(request, env);
  if (denied) return denied;
  if (request.method !== "POST") return json({ error: "Use POST to save website data." }, 405, { Allow: "POST" });
  if (!env.SITE_DATA) return json({ error: "SITE_DATA storage is not connected." }, 503);
  if (!(request.headers.get("Content-Type") || "").includes("application/json")) {
    return json({ error: "Send website data as JSON." }, 415);
  }
  let data;
  try { data = await request.json(); }
  catch { return json({ error: "Invalid JSON." }, 400); }
  if (!validSiteData(data)) return json({ error: "Invalid website data. Export the complete website JSON." }, 400);
  const content = JSON.stringify(data);
  if (new TextEncoder().encode(content).length > 10 * 1024 * 1024) {
    return json({ error: "Website data exceeds the 10 MB limit." }, 413);
  }
  try {
    await env.SITE_DATA.put(dataKey(env), content);
    return json({ ok: true });
  } catch (error) {
    console.error("Website save failed:", error);
    return json({ error: "Could not save online. Your local backup is still available." }, 503);
  }
}
