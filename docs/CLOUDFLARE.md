# Move the existing website to nyuukoria.tech

Keep the existing Pages project. Add the new hostnames to that project so the profile,
assets, music, gallery, `/nude/`, and counters use the same deployment and storage.
Renaming a GitHub repository or buying a domain does not attach it to Pages.

## What the repository contains

| Feature | Source / production route |
| --- | --- |
| Profile, socials, badges, skills, projects, gallery, changelogs, themes, music | `index.html`, `app.js`, `style.css`, `assets/`, `site-data.json` |
| Shared editable website data | Pages Function `/site-data.json`, saved in `SITE_DATA` KV |
| Save website data | Pages Function `/api/save-site-data` |
| Visitor counter | `/api/visit`, existing KV key `visitor-count` |
| Rickroll/prank page with embedded GIF and sound | Static `/nude/`, also accessible at `/nude` through Pages' directory redirect |
| Prank counter | `/api/nude-click`, existing KV key `nude-click-count` |
| Editor | `https://admin.nyuukoria.tech/` or `https://nyuukoria.tech/?owner=1` |

`server.js` is only a local development server. Cloudflare Pages runs the code in
`functions/` instead. It does not run `npm start` or Express.

## 1. Preserve existing production content before merging or rerouting

1. Open the working old editor. Under **Data → Export JSON**, copy the complete
   current content to a file on your computer. This includes edits made online that
   may be newer than the repository. Existing browser backups are tied to each origin
   and cannot move automatically to another domain.
2. In the existing Pages project's **Settings → Bindings**, note which KV namespace
   is connected as `SITE_DATA`. Keep that exact namespace; creating a new empty one
   would lose access to the existing counters and any saved content.
3. If an existing Worker handles `/site-data.json` or `/api/save-site-data`, inspect
   its code and record its KV namespace, data key, secrets and routes first. This
   repository does not contain a standalone Worker, so its live configuration must
   be checked in Cloudflare. Do not delete it yet.
4. This implementation uses key `site-data` for editable content by default.
   If the previous Worker used a different key **with the same complete JSON shape**,
   set Pages variable `SITE_DATA_KEY` to that exact key. Otherwise import the exported
   content through the new editor after deploying. No build or first request writes
   default content into KV.

## 2. Use the existing Pages project's Git deployment

Verify the Git integration points to **Nyuukoria/nyuukoria**, branch **main**.
If Cloudflare still shows the old repository name, verify its GitHub access and
repository connection before changing the integration.

Configure the production build:

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Root directory | Repository root (leave blank) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Production KV binding | `SITE_DATA` → the existing namespace |
| Production encrypted secret | `ADMIN_PASSWORD` → a new private password you choose |
| Optional variable | `SITE_DATA_KEY` → previous content key, if applicable |

The username for the browser login dialog is **admin**. The password is the value
you enter as `ADMIN_PASSWORD` in Cloudflare; it is never placed in frontend code or
the repository. Without this secret the public site still works, but editing is
unavailable. The old `?owner=...` link only opens the editor; it is not authentication.

Redeploy after changing bindings or environment variables. Functions are bundled
from the repository's root `functions/` directory. Do not upload `dist/` through the
dashboard's static drag-and-drop uploader, which does not deploy Functions.
No Wrangler config is provided because the existing project's binding IDs and
environment settings are managed in the dashboard.

If enabling branch previews, give them a **separate test KV namespace and secret**.
Do not bind preview deployments to production storage. Compare an actual production
deployment after cutover, not a branch preview with different settings.

## 3. Attach all three new domains

Check that the `nyuukoria.tech` zone is **Active** in the same Cloudflare account
as the existing Pages project. At Strato, nameservers must be the exact two listed
for that zone by Cloudflare.

Under **Workers & Pages → existing Pages project → Custom domains → Set up a
custom domain**, add each of:

- `nyuukoria.tech`
- `www.nyuukoria.tech`
- `admin.nyuukoria.tech`

Add the hostnames through Pages first, then approve the DNS changes. Wait for
**Active / SSL enabled** on each. Keep the three existing `sasutendo.tech` domains
connected during the migration.

Expected website DNS records after association:

| Type | Name | Target | Proxy |
| --- | --- | --- | --- |
| CNAME | `@` | Exact `*.pages.dev` hostname shown on the existing Pages project | Proxied |
| CNAME | `www` | Same Pages hostname | Proxied |
| CNAME | `admin` | Same Pages hostname | Proxied |

The screenshots supplied on 2026-10-15 show no website DNS record at the root and
only old hostnames in Pages. A `www → nyuukoria.tech` CNAME alone cannot attach the
new root domain to the Pages deployment. Manually creating CNAMEs without adding
custom domains in Pages is insufficient.

Do not change the mail MX, SRV or TXT records as part of this website move.
The `autoconfig` CNAME is a Strato mail setting, not the website origin.

## 4. Check existing Workers and security rules

In each domain's **Workers Routes**, check whether a standalone Worker intercepts
`/*`, `/api/*`, or `/site-data.json`. Pages Functions now provide the site's API.
Only remove a conflicting route after its current content has been exported and
any additional Worker behavior has been accounted for. Retain unrelated Workers.

Check existing Cloudflare Access applications, redirects, WAF rules and hostname
conditions. Rules applying only to `sasutendo.tech` do not necessarily cover
`nyuukoria.tech`. If the previous editor used Cloudflare Access, extend the existing
owner-only policy to the new admin hostname as appropriate; do not remove it to
make a login error disappear. This app also checks `ADMIN_PASSWORD` server-side.

## 5. Verify before retiring any old setup

1. Open the new root domain and compare its profile, About, socials, projects,
   gallery, badges, themes, changelog and music with the old site.
2. Open `/nude` and `/nude/`; the prank page, embedded animations, sound (after a
   click) and click counter must work. This is a folder in the same site and needs
   no extra Worker or custom domain.
3. Open the new admin domain, sign in as `admin`, and import the full old production
   export if the existing saved JSON was not reused. Confirm **Saved online**.
4. Make a small reversible edit, save, then reload the public new domain and old
   domain. Both should show the saved edit from the same KV namespace. KV can take
   up to around a minute to propagate between locations. Revert the test edit.
5. Confirm `/api/visit` returns JSON with `visits` and `/api/nude-click` returns JSON
   with `clicks`, using the previous totals. These existing KV counters remain
   approximate under simultaneous traffic; this migration does not change their
   storage design.
6. Confirm an unsigned POST to `/api/save-site-data` gets `401` (or `503` if the
   editor password has not been configured), never `{ "ok": true }`.

If old domains should redirect later, add Cloudflare Redirect Rules **after** the
new site is verified. Preserve both path and query string so that old `/nude/`
links lead to new `/nude/`. Keep the old domains' DNS and certificates active for
redirects. This migration does not activate redirects automatically.

## Local checks

```sh
npm test
npm run build
npm start
```

Local Express runs only on `127.0.0.1:3333` and writes the local `site-data.json`.
Open `http://localhost:3333/?owner=1` to edit locally. Local counters reset on restart.
For the real Pages runtime, use Wrangler locally with a test KV binding:

```sh
npx wrangler pages dev dist --kv SITE_DATA
```

Set a local-only `ADMIN_PASSWORD` in `.dev.vars` for editor tests; never commit it.

## Official references

- [Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Pages KV bindings](https://developers.cloudflare.com/pages/functions/bindings/)
- [Pages Functions deployment](https://developers.cloudflare.com/pages/functions/get-started/)
- [KV limits](https://developers.cloudflare.com/kv/platform/limits/)
