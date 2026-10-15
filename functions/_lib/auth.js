import { json } from "./data.js";

async function sameSecret(a, b) {
  const encode = new TextEncoder();
  const [left, right] = await Promise.all([a, b].map(value => crypto.subtle.digest("SHA-256", encode.encode(value))));
  const x = new Uint8Array(left), y = new Uint8Array(right);
  let difference = 0;
  for (let i = 0; i < x.length; i++) difference |= x[i] ^ y[i];
  return difference === 0;
}

export async function authorizeEditor(request, env) {
  const url = new URL(request.url);
  if (!env.ADMIN_PASSWORD) {
    return json({ error: "Editing is unavailable until ADMIN_PASSWORD is configured in Pages." }, 503);
  }

  let username = "", password = "";
  try {
    const authorization = request.headers.get("Authorization") || "";
    if (/^Basic /i.test(authorization)) {
      const decoded = new TextDecoder().decode(Uint8Array.from(atob(authorization.slice(6)), char => char.charCodeAt(0)));
      const separator = decoded.indexOf(":");
      if (separator >= 0) {
        username = decoded.slice(0, separator);
        password = decoded.slice(separator + 1);
      }
    }
  } catch { /* Malformed credentials receive the same challenge. */ }

  if (username !== "admin" || !(await sameSecret(password, env.ADMIN_PASSWORD))) {
    return json({ error: "Sign in to edit this website." }, 401, {
      "WWW-Authenticate": 'Basic realm="Nyuukoria editor", charset="UTF-8"'
    });
  }

  if (!["GET", "HEAD", "OPTIONS"].includes(request.method) &&
      request.headers.get("Origin") !== url.origin) {
    return json({ error: "Editing requests must come from this website." }, 403);
  }

  return null;
}
