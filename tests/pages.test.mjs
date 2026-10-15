import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { onRequest as middleware } from "../functions/_middleware.js";
import { onRequest as save } from "../functions/api/save-site-data.js";
import { onRequestGet as load } from "../functions/site-data.json.js";
import { onRequestGet as getVisits, onRequestPost as visit } from "../functions/api/visit.js";
import { onRequestGet as getClicks, onRequestPost as click } from "../functions/api/nude-click.js";

const fixture = JSON.parse(await readFile(new URL("../site-data.json", import.meta.url), "utf8"));
const password = "local-test-only-password-♡";
const auth = "Basic " + Buffer.from(`admin:${password}`).toString("base64");
function storage(entries = []) {
  const values = new Map(entries);
  return { values, get: async key => values.get(key) ?? null, put: async (key, value) => values.set(key, value) };
}
function request(url = "https://nyuukoria.tech/api/save-site-data", options = {}) {
  return new Request(url, {
    method: "POST", body: JSON.stringify(fixture), ...options,
    headers: { Authorization: auth, Origin: new URL(url).origin, "Content-Type": "application/json", ...options.headers }
  });
}
function invoke(request, env, handler = save) {
  return middleware({ request, env, next: () => handler({ request, env }) });
}

test("public page remains available without editor secrets", async () => {
  const response = await middleware({ request: new Request("https://nyuukoria.tech/"), env: {}, next: () => new Response("profile") });
  assert.equal(await response.text(), "profile");
});

test("save and every admin host fail closed without a configured secret", async () => {
  for (const url of ["https://nyuukoria.tech/api/save-site-data", "https://admin.nyuukoria.tech/", "https://nyuukoria.tech/?owner=anything"]) {
    const response = await invoke(request(url), {});
    assert.equal(response.status, 503);
  }
});

test("a public owner query or spoofed admin hostname cannot authorize a save", async () => {
  const kv = storage();
  for (const url of ["https://nyuukoria.tech/api/save-site-data?owner=anything", "https://admin.nyuukoria.tech/api/save-site-data"]) {
    const response = await invoke(request(url, { headers: { Authorization: "" } }), { ADMIN_PASSWORD: password, SITE_DATA: kv });
    assert.equal(response.status, 401);
    assert.match(response.headers.get("WWW-Authenticate"), /^Basic /);
  }
  assert.equal(kv.values.size, 0);
});

test("wrong and malformed credentials are rejected", async () => {
  for (const Authorization of ["Basic %%%", "Bearer anything", "Basic " + btoa("admin:wrong")]) {
    assert.equal((await invoke(request(undefined, { headers: { Authorization } }), { ADMIN_PASSWORD: password })).status, 401);
  }
});

test("trailing-slash and direct save-handler invocation cannot bypass authentication", async () => {
  const env = { ADMIN_PASSWORD: password, SITE_DATA: storage() };
  const unsigned = request("https://nyuukoria.tech/api/save-site-data/", { headers: { Authorization: "" } });
  assert.equal((await invoke(unsigned.clone(), env)).status, 401);
  assert.equal((await save({ request: unsigned, env })).status, 401);
  assert.equal(env.SITE_DATA.values.size, 0);
});

test("authenticated cross-origin writes and missing origins are rejected", async () => {
  for (const Origin of ["https://other.example", "null", ""]) {
    assert.equal((await invoke(request(undefined, { headers: { Origin } }), { ADMIN_PASSWORD: password })).status, 403);
  }
});

test("authenticated save preserves the complete data and is visible on both domains", async () => {
  const kv = storage([["visitor-count", "234"], ["nude-click-count", "56"]]);
  const env = { ADMIN_PASSWORD: password, SITE_DATA: kv };
  const response = await invoke(request(), env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  for (const hostname of ["sasutendo.tech", "nyuukoria.tech"]) {
    const read = await load({ request: new Request(`https://${hostname}/site-data.json`), env });
    assert.deepEqual(await read.json(), fixture);
    assert.equal(read.headers.get("Cache-Control"), "no-store");
  }
  assert.equal(kv.values.get("visitor-count"), "234");
  assert.equal(kv.values.get("nude-click-count"), "56");
});

test("an existing KV key can be reused without copying or replacing content", async () => {
  const saved = { ...fixture, footer: "existing production content" };
  const env = { SITE_DATA_KEY: "legacy-content", SITE_DATA: storage([["legacy-content", JSON.stringify(saved)]]) };
  assert.deepEqual(await (await load({ env })).json(), saved);
  assert.equal(env.SITE_DATA.values.size, 1);
});

test("empty storage serves the checked-in JSON without seeding or resetting KV", async () => {
  const kv = storage();
  const response = await load({ env: { SITE_DATA: kv }, next: () => new Response(JSON.stringify(fixture), { headers: { "Content-Type": "application/json" } }) });
  assert.deepEqual(await response.json(), fixture);
  assert.equal(response.status, 200);
  assert.equal(kv.values.size, 0);
});

test("failed or malformed saved content is an error, never silently replaced by defaults", async () => {
  for (const SITE_DATA of [storage([["site-data", "bad JSON"]]), { get: async () => { throw new Error("offline"); } }]) {
    const response = await load({ env: { SITE_DATA }, next: () => { throw new Error("must not fallback"); } });
    assert.equal(response.status, 503);
  }
});

test("bad bodies, unsupported methods, and missing storage cannot report save success", async () => {
  const env = { ADMIN_PASSWORD: password, SITE_DATA: storage() };
  assert.equal((await invoke(request(undefined, { body: "{" }), env)).status, 400);
  assert.equal((await invoke(request(undefined, { body: "{}" }), env)).status, 400);
  assert.equal((await invoke(request(undefined, { headers: { "Content-Type": "text/plain" } }), env)).status, 415);
  assert.equal((await invoke(request(undefined, { method: "GET", body: undefined }), env)).status, 405);
  assert.equal((await invoke(request(), { ADMIN_PASSWORD: password })).status, 503);
  assert.equal(env.SITE_DATA.values.size, 0);
});

test("a failed KV write reports failure", async () => {
  const env = { ADMIN_PASSWORD: password, SITE_DATA: { put: async () => { throw new Error("offline"); } } };
  assert.equal((await invoke(request(), env)).status, 503);
});

test("both counters preserve their existing keys", async () => {
  const env = { SITE_DATA: storage([["visitor-count", "234"], ["nude-click-count", "56"]]) };
  assert.deepEqual(await (await getVisits({ env })).json(), { visits: 234 });
  assert.deepEqual(await (await visit({ env })).json(), { visits: 235 });
  assert.deepEqual(await (await getClicks({ env })).json(), { clicks: 56 });
  assert.deepEqual(await (await click({ env })).json(), { clicks: 57 });
  assert.equal((await getVisits({ env: {} })).status, 503);
  assert.equal((await getClicks({ env: {} })).status, 503);
});

test("build publishes the full prank page and browser assets, without server files", async () => {
  const { execFileSync } = await import("node:child_process");
  execFileSync(process.execPath, ["scripts/build.cjs"], { cwd: new URL("..", import.meta.url) });
  const { readdir } = await import("node:fs/promises");
  const files = await readdir(new URL("../dist/", import.meta.url));
  assert.ok(!files.includes("server.js") && !files.includes("package.json") && !files.includes(".git"));
  assert.deepEqual(JSON.parse(await readFile(new URL("../dist/site-data.json", import.meta.url), "utf8")), fixture);
  const prank = await readFile(new URL("../dist/nude/index.html", import.meta.url), "utf8");
  assert.match(prank, /\/api\/nude-click/);
  assert.match(prank, /<audio/);
  assert.ok(prank.length > 100000, "embedded prank media must be preserved");
});
