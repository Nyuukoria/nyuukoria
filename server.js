const express = require("express");
const fs = require("fs/promises");
const path = require("path");

console.log("RUNNING NYUUKORIA WEBSITE SERVER:", __filename);
console.log("WORKING FOLDER:", __dirname);

const app = express();
const PORT = process.env.PORT || 3333;

const DATA_FILE = path.join(__dirname, "site-data.json");
const PUBLIC_DIR = __dirname;

app.use(express.json({ limit: "10mb" }));

let localNudeClickCount = 0;

app.get("/api/nude-click", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({ clicks: localNudeClickCount });
});

app.post("/api/nude-click", (req, res) => {
  localNudeClickCount += 1;
  res.set("Cache-Control", "no-store");
  res.json({ clicks: localNudeClickCount });
});

app.post("/api/save-site-data", async (req, res) => {
  try {
    const data = req.body;

    if (!data || typeof data !== "object") {
      return res.status(400).send("Invalid data");
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");

    res.json({ ok: true });
  } catch (error) {
    console.error("Save site data error:", error);
    res.status(500).send("Could not save site-data.json");
  }
});

app.get("/site-data.json", (req, res) => {
  res.sendFile(DATA_FILE);
});

app.use(express.static(PUBLIC_DIR));

app.use((req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Website running on http://localhost:${PORT}`);
});