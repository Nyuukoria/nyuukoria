const fs = require("node:fs/promises");
const path = require("node:path");

async function build() {
  const root = path.resolve(__dirname, "..");
  const output = path.join(root, "dist");
  await fs.rm(output, { recursive: true, force: true });
  await fs.mkdir(output, { recursive: true });
  // Publish only browser assets, never server code, tests, or repository files.
  for (const file of ["index.html", "app.js", "style.css", "site-data.json", "assets", "nude", "_headers"]) {
    await fs.cp(path.join(root, file), path.join(output, file), { recursive: true });
  }
  await fs.writeFile(path.join(output, "_routes.json"), JSON.stringify({
    version: 1, include: ["/*"], exclude: ["/assets/*", "/app.js", "/style.css", "/nude", "/nude/*"]
  }, null, 2));
  console.log("Pages assets built in dist/; functions/ provides the API and editor authentication.");
}

build().catch(error => { console.error(error); process.exitCode = 1; });
