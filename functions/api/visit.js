export async function onRequestPost({ env }) {
  if (!env.SITE_DATA) return unavailable();
  try {
    const key = "visitor-count";

    const current = Number(await env.SITE_DATA.get(key)) || 0;
    const next = current + 1;

    await env.SITE_DATA.put(key, String(next));

    return new Response(JSON.stringify({ visits: next }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("Visitor counter failed:", error);
    return unavailable();
  }
}

export async function onRequestGet({ env }) {
  if (!env.SITE_DATA) return unavailable();
  try {
    const key = "visitor-count";

    const visits = Number(await env.SITE_DATA.get(key)) || 0;

    return new Response(JSON.stringify({ visits }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("Visitor counter failed:", error);
    return unavailable();
  }
}

function unavailable() {
  return new Response(JSON.stringify({ error: "Visitor counter unavailable" }), {
    status: 503,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  });
}
