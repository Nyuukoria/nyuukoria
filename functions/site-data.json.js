import { dataKey, json, validSiteData } from "./_lib/data.js";

export async function onRequestGet({ env, next }) {
  if (env.SITE_DATA) {
    try {
      const saved = await env.SITE_DATA.get(dataKey(env));
      if (saved !== null) {
        const data = JSON.parse(saved);
        if (!validSiteData(data)) throw new Error("Invalid saved site data");
        return json(data);
      }
    } catch (error) {
      console.error("Saved site data could not be loaded:", error);
      return json({ error: "Saved website content is temporarily unavailable." }, 503);
    }
  }

  // First deployment: read the existing checked-in JSON without writing to KV.
  const original = await next();
  const response = new Response(original.body, original);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
