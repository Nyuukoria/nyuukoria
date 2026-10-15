import { authorizeEditor } from "./_lib/auth.js";

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/+$/, "");
  const editing = url.hostname.startsWith("admin.") || url.searchParams.has("owner") ||
    pathname === "/api/save-site-data";
  if (!editing) return next();

  const denied = await authorizeEditor(request, env);
  if (denied) return denied;
  const original = await next();
  const response = new Response(original.body, original);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
