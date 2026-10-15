export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extraHeaders }
  });
}

export function dataKey(env) {
  return env.SITE_DATA_KEY || "site-data";
}

export function validSiteData(data) {
  return data !== null && typeof data === "object" && !Array.isArray(data) &&
    data.profile !== null && typeof data.profile === "object" && !Array.isArray(data.profile) &&
    data.theme !== null && typeof data.theme === "object" && !Array.isArray(data.theme) &&
    ["socials", "links", "projects", "gallery", "changelogs"].every(key => Array.isArray(data[key]));
}
