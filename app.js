const DEFAULT_DATA = {
  profile: {
    displayName: "Yuuki",
    username: "@nyuukoria",
    tagline: "See the light is shining so bright",
    bio: "Gamer, artist, coder, osu! enjoyer, and lover of cozy dark fantasy aesthetics.",
    avatar: "assets/profile.jpg",
    banner: "assets/banner.png",
    badges: ["she/her", "eepy", "artist", "coder"],
    aboutIntro: "Hiiyaaa, I'm Yuuki. I like osu!, coding. This page is a small place for my socials, projects, and things I care about. Feel free to explore and reach out if you wanna chat or collab on something fun! ♡. My Discord is @Nyuukoria",
    names: ["Yuuki", "Yui", "Nyuukoria"],
    pronouns: ["she/her"],
    likes: ["cats", "coffee", "osu!", "Minecraft", "cozy designs", "dark fantasy", "anime art"],
    boundaries: ["don’t be creepy", "don’t spam", "don’t be overly formal"],
    words: {
      honorifics: ["ms.", "ma'am", "madam"],
      compliments: ["pretty", "cute", "handsome"],
      relationships: ["friend", "partner", "princess"]
    }
  },

  theme: {
    accent: "#ff4fbd",
    secondary: "#8b5cf6",
    background: "assets/bg.jpg",
    backgroundDarkness: 0.50,
    cardOpacity: 0.75,
    nameColor: "#ff92ff",
    avatarDecor: "softRing",
    avatarBubbleStyle: "gradient",
    avatarBubbleColor: "#f3ff88",
    avatarBubbleIcon: "none",
    themeStyle: "dreamy",
    particles: true,
    particleStyle: "stars",
    cursorTrail: "sparkle",
    musicVolume: 0.50,
    intro: true
  },

  socials: [
    { label: "TikTok", icon: "♪", url: "https://tiktok.com/@nyuukoria" },
    { label: "Instagram", icon: "◎", url: "https://instagram.com/nyuukoria" },
    { label: "Twitch", icon: "▣", url: "https://twitch.tv/nyuukoria" },
    { label: "YouTube", icon: "▶", url: "https://youtube.com/@nyuukoria" },
    { label: "Discord", icon: "☁", url: "https://discord.gg/9hfnXKx7xZ" },
    { label: "GitHub", icon: "⌘", url: "https://github.com/Nyuukoria" }
  ],

  links: [
    {
      title: "Join My Discord Server",
      description: "Come hang out and chat.",
      icon: "☁",
      url: "https://discord.gg/9hfnXKx7xZ",
      featured: true,
      enabled: true
    },
    {
      title: "Twitch",
      description: "Streams and cozy chaos.",
      icon: "▣",
      url: "https://twitch.tv/nyuukoria",
      featured: true,
      enabled: true
    },
    {
      title: "TikTok",
      description: "Short clips and posts.",
      icon: "♪",
      url: "https://tiktok.com/@nyuukoria",
      featured: false,
      enabled: true
    },
    {
      title: "YouTube",
      description: "Videos and projects.",
      icon: "▶",
      url: "https://youtube.com/@nyuukoria",
      featured: false,
      enabled: true
    },
    {
      title: "Spotify",
      description: "Music vibe.",
      icon: "♫",
      url: "https://open.spotify.com/user/1z5q051gcrmu6ckbybvr16uj2?si=efafa7b1e3984496",
      featured: false,
      enabled: true
    },
    {
      title: "Pronouns",
      description: "Names, pronouns, and words.",
      icon: "♡",
      url: "https://en.pronouns.page/@Nyuukoria",
      featured: false,
      enabled: true
    }
  ],

  projects: [
    {
      title: "NamAI",
      description: "Personal AI character chat app with memory, accounts, and custom themes.",
      url: "https://nya.namai.fun"
    },
    {
      title: "YuukiQuests",
      description: "Minecraft quest plugin with GUI, rewards, dailies, and economy support.",
      url: "#"
    },
    {
      title: "Bettle",
      description: "Minecraft Fabric mod experiments, custom items, and visual ideas.",
      url: "#"
    }
  ],

  skills: [
  { title: "Web Development", url: "#" },
  { title: "Minecraft Plugins", url: "#" },
  { title: "UI Design", url: "#" },
  { title: "Drawing", url: "#" },
  { title: "Photo Editing", url: "#" },
  { title: "OBS Assets", url: "#" },
  { title: "Story Writing", url: "#" },
  { title: "Databases", url: "#" },
  { title: "Creative Direction", url: "#" }
  ],

  gallery: [
    {
      title: "Cozy Profile Theme",
      image: "assets/banner.png",
      url: "assets/banner.png"
    },
    {
      title: "Night Aesthetic",
      image: "assets/bg.jpg",
      url: "assets/bg.jpg"
    },
    {
      title: "Minecraft Ideas",
      image: "assets/meme1.png",
      url: "assets/meme1.png"
    },
    {
      title: "Stream Assets",
      image: "assets/meme2.png",
      url: "assets/meme2.png"
    }
  ],

  changelogs: [
    {
      date: "2026-05-12",
      title: "Website started",
      text: "Added profile, links, gallery, particles, and admin editing."
    },
    {
      date: "2026-05-12",
      title: "Design update",
      text: "Improved dark dreamy layout and profile customization."
    }
  ],

  footer: "made with ♡ by Yuuki"
};

let siteData = structuredClone(DEFAULT_DATA);

const urlParams = new URLSearchParams(window.location.search);
const isOwnerMode =
  urlParams.has("owner") ||
  window.location.hostname.startsWith("admin.");

if (isOwnerMode) {
  document.body.classList.add("owner-mode");
}



const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const introScreen = $("#introScreen");
const enterButton = $("#enterButton");
const app = $("#app");
const bgMusic = $("#bgMusic");

const adminModal = $("#adminModal");
const adminOpenButton = $("#adminOpenButton");
const adminCloseButton = $("#adminCloseButton");
const saveAdminButton = $("#saveAdminButton");

async function loadData() {
  try {
    const response = await fetch("/site-data.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("site-data.json not found");
    }

    const jsonData = await response.json();
    return mergeDeep(structuredClone(DEFAULT_DATA), jsonData);
  } catch (error) {
    console.warn("Could not load site-data.json, using DEFAULT_DATA:", error);
    if (isOwnerMode) {
      alert("Website content could not be loaded. Editing is paused to protect your saved content. Please reload and try again.");
      return null;
    }
    return structuredClone(DEFAULT_DATA);
  }
}

let saveTimer;
let saveQueue = Promise.resolve();
let lastSaveAt = 0;
let editRevision = 0;
let hasUnsavedChanges = false;

function setSaveStatus(message) {
  const status = $("#saveStatus");
  if (status) status.textContent = message;
}

function scheduleSave() {
  hasUnsavedChanges = true;
  editRevision += 1;
  setSaveStatus("Unsaved changes…");
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { saveData(); }, 1400);
}

async function saveData() {
  clearTimeout(saveTimer);
  const content = JSON.stringify(siteData, null, 2);
  const revision = editRevision;
  hasUnsavedChanges = true;
  try { localStorage.setItem("nyuukoria-site-data-backup", content); }
  catch (error) { console.warn("Local backup unavailable:", error); }

  // Serialize saves and stay below KV's one-write-per-second limit per key.
  const task = saveQueue.then(async () => {
    const delay = Math.max(0, 1100 - (Date.now() - lastSaveAt));
    if (delay) await new Promise(resolve => setTimeout(resolve, delay));
    lastSaveAt = Date.now();
    setSaveStatus("Saving online…");
    try {
      const response = await fetch("/api/save-site-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: content
      });
      if (!response.ok) {
        let message = `Save failed (${response.status})`;
        try { message = (await response.json()).error || message; } catch {}
        throw new Error(message);
      }
      const result = await response.json();
      if (result.ok !== true) throw new Error("The server did not confirm the save.");
      if (revision === editRevision) {
        hasUnsavedChanges = false;
        setSaveStatus("Saved online ♡");
      }
      return true;
    } catch (error) {
      console.warn("Online save failed:", error);
      setSaveStatus(`Not saved online: ${error.message} Use Export JSON to keep a copy.`);
      return false;
    }
  });
  saveQueue = task.catch(() => false);
  return task;
}

window.addEventListener("beforeunload", event => {
  if (!hasUnsavedChanges) return;
  event.preventDefault();
  event.returnValue = "";
});

function mergeDeep(target, source) {
  for (const key of Object.keys(source || {})) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      target[key] = mergeDeep(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

function renderSite() {
  applyTheme();
  renderIntro();
  renderProfile();
  renderSocials();
  renderLinks();
  renderAbout();
  renderProjects();
  renderGallery();
  renderChangelogs();
  renderFooter();
  renderParticles();
}

function applyTheme() {
  const theme = siteData.theme;

  document.body.dataset.themeStyle = theme.themeStyle || "dreamy";

  document.documentElement.style.setProperty("--accent", theme.accent);
  document.documentElement.style.setProperty("--secondary", theme.secondary);
  document.documentElement.style.setProperty("--bg-darkness", theme.backgroundDarkness);
  document.documentElement.style.setProperty("--card-opacity", theme.cardOpacity ?? 0.75);
  document.documentElement.style.setProperty("--name-color", theme.nameColor || "#ff92ff");
  document.documentElement.style.setProperty(
    "--site-bg-image",
    theme.background ? `url("${theme.background}")` : "none"
  );
  document.documentElement.style.setProperty(
    "--banner-image",
    siteData.profile.banner ? `url("${siteData.profile.banner}")` : "none"
  );
  document.body.dataset.avatarDecor = theme.avatarDecor || "softRing";
  document.body.dataset.avatarBubbleStyle = theme.avatarBubbleStyle || "gradient";
  document.body.dataset.avatarBubbleIcon = theme.avatarBubbleIcon || "none";

  document.documentElement.style.setProperty(
    "--avatar-bubble-color",
    theme.avatarBubbleColor || "#f3ff88"
  );
}

function renderIntro() {
  if (!siteData.theme.intro) {
    introScreen.classList.add("hidden");
    app.classList.remove("hidden");
  }
}

function renderProfile() {
  const profile = siteData.profile;

  $("#siteTitle").textContent = profile.displayName;
  $("#displayName").textContent = profile.displayName;
  $("#usernameBadge").textContent = profile.username;
  $("#tagline").textContent = profile.tagline;
  $("#bio").textContent = profile.bio;
  $("#profileAvatar").src = profile.avatar;

  const badgeList = $("#badgeList");
  badgeList.innerHTML = "";
  profile.badges.forEach((badge) => {
    const span = document.createElement("span");
    span.className = "badge";
    span.textContent = badge;
    badgeList.appendChild(span);
  });
}

function renderSocials() {
  const row = $("#socialIconRow");
  row.innerHTML = "";

  siteData.socials.forEach((social) => {
    const a = document.createElement("a");
    a.className = "social-icon";
    a.href = social.url;
    a.target = "_blank";
    a.rel = "noreferrer";
    a.title = social.label;
    a.textContent = social.icon || social.label[0];
    row.appendChild(a);
  });
}

function renderLinks() {
  const featured = $("#featuredLinks");
  const normal = $("#normalLinks");

  featured.innerHTML = "";
  normal.innerHTML = "";

  siteData.links
    .filter((link) => link.enabled)
    .forEach((link) => {
      const a = document.createElement("a");
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noreferrer";

      if (link.featured) {
        a.className = "featured-link";
        a.innerHTML = `
          <span class="link-icon">${escapeHtml(link.icon || "✦")}</span>
          <span>
            <span class="link-title">${escapeHtml(link.title)}</span>
            <span class="link-desc">${escapeHtml(link.description || "")}</span>
          </span>
        `;
        featured.appendChild(a);
      } else {
        a.className = "link-button";
        a.innerHTML = `
          <span class="link-icon">${escapeHtml(link.icon || "✦")}</span>
          <span>
            <span class="link-title">${escapeHtml(link.title)}</span>
            <span class="link-desc">${escapeHtml(link.description || "")}</span>
          </span>
        `;
        normal.appendChild(a);
      }
    });
}

function renderAbout() {
  const aboutIntroCard = $("#aboutIntroCard");
  if (aboutIntroCard) {
    aboutIntroCard.textContent = siteData.profile.aboutIntro || "";
  }

  renderSimpleList("#namesList", siteData.profile.names, "♡");
  renderSimpleList("#pronounsList", siteData.profile.pronouns, "♡");

  const wordsGrid = $("#wordsGrid");
  wordsGrid.innerHTML = "";

  

  Object.entries(siteData.profile.words).forEach(([title, words]) => {
    const div = document.createElement("div");
    div.className = "word-group";
    div.innerHTML = `
      <strong>${escapeHtml(capitalize(title))}</strong>
      <div class="pill-list">
        ${words.map((word) => `<span class="pill">${escapeHtml(word)}</span>`).join("")}
      </div>
    `;
    wordsGrid.appendChild(div);
  });

  renderPills("#likesList", siteData.profile.likes);
  renderPills("#boundariesList", siteData.profile.boundaries);
}

function renderSimpleList(selector, items, icon = "•") {
  const list = $(selector);
  list.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${icon} ${item}`;
    list.appendChild(li);
  });
}

function renderPills(selector, items) {
  const list = $(selector);
  list.innerHTML = "";
  items.forEach((item) => {
    const span = document.createElement("span");
    span.className = "pill";
    span.textContent = item;
    list.appendChild(span);
  });
}

function renderProjects() {
  const grid = $("#projectGrid");
  grid.innerHTML = "";

  siteData.projects.forEach((project) => {
    const href = project.url && project.url.trim() ? project.url : "#";
    const isClickable = href !== "#";

    const card = document.createElement(isClickable ? "a" : "article");
    card.className = "project-card clickable-card";
    if (isClickable) {
      card.href = href;
      card.target = "_blank";
      card.rel = "noreferrer";
    }

    card.innerHTML = `
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.description)}</p>
      ${isClickable ? `<span class="card-open-hint">Open ↗</span>` : ""}
    `;

    grid.appendChild(card);
  });

  const skillGrid = $("#skillGrid");
  skillGrid.innerHTML = "";

  siteData.skills.forEach((skill) => {
    const skillObj = typeof skill === "string" ? { title: skill, url: "#" } : skill;
    const href = skillObj.url && skillObj.url.trim() ? skillObj.url : "#";
    const isClickable = href !== "#";

    const el = document.createElement(isClickable ? "a" : "div");
    el.className = "skill clickable-skill";
    el.textContent = skillObj.title || "Skill";

    if (isClickable) {
      el.href = href;
      el.target = "_blank";
      el.rel = "noreferrer";
    }

    skillGrid.appendChild(el);
  });
}

function renderGallery() {
  const grid = $("#galleryGrid");
  grid.innerHTML = "";

  siteData.gallery.forEach((item) => {
    const href = item.url || item.image || "#";

    const article = document.createElement("a");
    article.className = "gallery-item";
    article.href = href;
    article.target = "_blank";
    article.rel = "noreferrer";

    article.innerHTML = `
      <img src="${escapeAttribute(item.image)}" alt="${escapeAttribute(item.title)}" />
      <p>${escapeHtml(item.title)}</p>
      <span class="gallery-open">Open ↗</span>
    `;

    grid.appendChild(article);
  });
}

function renderChangelogs() {
  const list = $("#changelogList");
  if (!list) return;

  list.innerHTML = "";

  (siteData.changelogs || []).forEach((log) => {
    const article = document.createElement("article");
    article.className = "changelog-item";

    article.innerHTML = `
      <div class="changelog-date">${escapeHtml(log.date || "")}</div>
      <div>
        <h3>${escapeHtml(log.title || "Update")}</h3>
        <p>${escapeHtml(log.text || "")}</p>
      </div>
    `;

    list.appendChild(article);
  });
}

async function setupVisitCounter() {
  const visitCount = $("#visitCount");
  if (!visitCount) return;

  try {
    const sessionKey = "nyuukoria-counted-visit";
    const alreadyCounted = sessionStorage.getItem(sessionKey) === "true";

    const response = await fetch("/api/visit", {
      method: alreadyCounted ? "GET" : "POST",
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Visit API failed: ${response.status}`);
    }

    const data = await response.json();
    visitCount.textContent = Number(data.visits || 0).toLocaleString();

    if (!alreadyCounted) {
      sessionStorage.setItem(sessionKey, "true");
    }
  } catch (error) {
    console.warn("Visit counter failed:", error);
    visitCount.textContent = "0";
  }
}

function renderFooter() {
  $("#footerText").textContent = siteData.footer;
}

let lastParticleSignature = "";

function renderParticles(force = false) {
  const layer = $("#particleLayer");
  if (!layer) return;

  const style = siteData.theme.particleStyle || "stars";
  const enabled = siteData.theme.particles && style !== "none";
  const isPhone = window.matchMedia("(max-width: 760px)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const signature = `${enabled}-${style}-${isPhone}-${reduceMotion}`;

  if (!force && signature === lastParticleSignature) return;
  lastParticleSignature = signature;

  layer.innerHTML = "";

  if (!enabled || reduceMotion) return;

  const amountMap = {
    stars: 42,
    sakura: 30,
    hearts: 28,
    snow: 55,
    bubbles: 34,
    fireflies: 38,
    moons: 18,
    diamonds: 32,
    leaves: 28,
    embers: 36,
    rain: 70,
    pixels: 60,
    butterflies: 20,
    music: 24,
    paw: 24,
    candy: 28,
    clouds: 18
  };

  const baseAmount = amountMap[style] || 34;
  const amount = isPhone ? Math.ceil(baseAmount * 0.38) : baseAmount;

  for (let i = 0; i < amount; i++) {
    const particle = document.createElement("span");
    particle.className = `particle particle-${style}`;

    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${10 + Math.random() * 16}s`;
    particle.style.animationDelay = `${Math.random() * -18}s`;
    particle.style.setProperty("--x-drift", `${-120 + Math.random() * 240}px`);
    particle.style.setProperty("--spin", `${-120 + Math.random() * 240}deg`);
    particle.style.setProperty("--size", `${5 + Math.random() * 8}px`);

    layer.appendChild(particle);
  }
}

/* ADMIN */
function fillAdminFields() {
  const p = siteData.profile;
  const t = siteData.theme;

  $("#editDisplayName").value = p.displayName;
  $("#editUsername").value = p.username;
  $("#editTagline").value = p.tagline;
  $("#editBio").value = p.bio;
  $("#editAvatar").value = p.avatar;
  $("#editBanner").value = p.banner;
  $("#editBadges").value = p.badges.join(", ");
  $("#editAboutIntro").value = siteData.profile.aboutIntro || "";
  $("#editNames").value = p.names.join(", ");
  $("#editPronouns").value = p.pronouns.join(", ");
  $("#editLikes").value = p.likes.join(", ");
  $("#editBoundaries").value = p.boundaries.join(", ");


  $("#editAboutNames").value = siteData.profile.names.join(", ");
    $("#editAboutPronouns").value = siteData.profile.pronouns.join(", ");
    $("#editWordsHonorifics").value = siteData.profile.words.honorifics.join(", ");
    $("#editWordsCompliments").value = siteData.profile.words.compliments.join(", ");
    $("#editWordsRelationships").value = siteData.profile.words.relationships.join(", ");
    $("#editAboutLikes").value = siteData.profile.likes.join(", ");
    $("#editAboutBoundaries").value = siteData.profile.boundaries.join(", ");

  $("#editSkills").value = siteData.skills
  .map((skill) => {
    if (typeof skill === "string") return `${skill}|#`;
    return `${skill.title || ""}|${skill.url || "#"}`;
  })
  .join("\n");
  $("#editFooterText").value = siteData.footer || "";

  $("#editAccent").value = t.accent;
  $("#editSecondary").value = t.secondary;
  $("#editBackground").value = t.background;
  $("#editBackgroundDarkness").value = t.backgroundDarkness;
  $("#darknessValue").textContent = `${Math.round(t.backgroundDarkness * 100)}%`;
  $("#editThemeStyle").value = t.themeStyle;
  $("#editParticleStyle").value = t.particleStyle || "stars";
  $("#editCursorTrail").value = t.cursorTrail || "none";
  $("#editParticles").checked = t.particles;
  $("#editIntro").checked = t.intro;

  $("#editCardOpacity").value = t.cardOpacity ?? 0.76;
  $("#cardOpacityValue").textContent = `${Math.round((t.cardOpacity ?? 0.76) * 100)}%`;

  $("#editNameColor").value = t.nameColor || "#fff7ff";
  $("#editAvatarDecor").value = t.avatarDecor || "softRing";
  $("#editAvatarBubbleStyle").value = t.avatarBubbleStyle || "gradient";
  $("#editAvatarBubbleColor").value = t.avatarBubbleColor || "#f3ff88";
  $("#editAvatarBubbleIcon").value = t.avatarBubbleIcon || "none";

  $("#dataEditor").value = JSON.stringify(siteData, null, 2);

  renderLinkEditor();
  renderSocialEditor();
  renderProjectEditor();
  renderGalleryEditor();
  renderChangelogEditor();
}

function renderChangelogEditor() {
  const list = $("#changelogEditorList");
  if (!list) return;

  list.innerHTML = "";

  siteData.changelogs = siteData.changelogs || [];

  siteData.changelogs.forEach((log, index) => {
    const item = document.createElement("div");
    item.className = "link-editor-item";

    item.innerHTML = `
      <div class="link-editor-top">
        <strong>${escapeHtml(log.title || "Changelog")}</strong>
        <button class="admin-danger small-danger" data-delete-changelog="${index}">Delete</button>
      </div>

      <label>
        Date
        <input data-changelog-field="date" data-changelog-index="${index}" value="${escapeAttribute(log.date || "")}" />
      </label>

      <label>
        Title
        <input data-changelog-field="title" data-changelog-index="${index}" value="${escapeAttribute(log.title || "")}" />
      </label>

      <label>
        Text
        <textarea data-changelog-field="text" data-changelog-index="${index}">${escapeHtml(log.text || "")}</textarea>
      </label>

      <div class="admin-row">
        <button class="admin-action" data-move-changelog-up="${index}">↑ Up</button>
        <button class="admin-action" data-move-changelog-down="${index}">↓ Down</button>
      </div>
    `;

    list.appendChild(item);
  });

  $$("[data-changelog-field]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const input = event.target;
      const index = Number(input.dataset.changelogIndex);
      const field = input.dataset.changelogField;

      siteData.changelogs[index][field] = input.value;
      liveSaveAndRender();
    });
  });

  $$("[data-delete-changelog]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.deleteChangelog);
      siteData.changelogs.splice(index, 1);
      liveSaveAndRender();
      renderChangelogEditor();
    });
  });

  $$("[data-move-changelog-up]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.moveChangelogUp);
      if (index <= 0) return;

      [siteData.changelogs[index - 1], siteData.changelogs[index]] =
        [siteData.changelogs[index], siteData.changelogs[index - 1]];

      liveSaveAndRender();
      renderChangelogEditor();
    });
  });

  $$("[data-move-changelog-down]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.moveChangelogDown);
      if (index >= siteData.changelogs.length - 1) return;

      [siteData.changelogs[index + 1], siteData.changelogs[index]] =
        [siteData.changelogs[index], siteData.changelogs[index + 1]];

      liveSaveAndRender();
      renderChangelogEditor();
    });
  });
}

function renderLinkEditor() {
  const list = $("#linkEditorList");
  list.innerHTML = "";

  siteData.links.forEach((link, index) => {
    const item = document.createElement("div");
    item.className = "link-editor-item";

    item.innerHTML = `
      <div class="link-editor-top">
        <strong>${escapeHtml(link.title || "New Link")}</strong>

        <div class="editor-button-row">
          <a class="admin-mini-link" href="${escapeAttribute(link.url || "#")}" target="_blank" rel="noreferrer">
            Open
          </a>
          <button class="admin-danger small-danger" data-delete-link="${index}">Delete</button>
        </div>
      </div>

      <div class="link-editor-row">
        <label>
          Title
          <input data-link-field="title" data-link-index="${index}" value="${escapeAttribute(link.title)}" />
        </label>

        <label>
          Icon / Emoji
          <input data-link-field="icon" data-link-index="${index}" value="${escapeAttribute(link.icon || "")}" />
        </label>
      </div>

      <label>
        URL
        <input data-link-field="url" data-link-index="${index}" value="${escapeAttribute(link.url)}" />
      </label>

      <label>
        Description
        <input data-link-field="description" data-link-index="${index}" value="${escapeAttribute(link.description || "")}" />
      </label>

      <label class="toggle-label">
        <input data-link-field="featured" data-link-index="${index}" type="checkbox" ${link.featured ? "checked" : ""} />
        Big featured button
      </label>

      <label class="toggle-label">
        <input data-link-field="enabled" data-link-index="${index}" type="checkbox" ${link.enabled ? "checked" : ""} />
        Show this link
      </label>

      <div class="admin-row">
        <button class="admin-action" data-move-link-up="${index}">↑ Up</button>
        <button class="admin-action" data-move-link-down="${index}">↓ Down</button>
      </div>
    `;

    list.appendChild(item);
  });

  $$("[data-link-field]").forEach((input) => {
    input.addEventListener("input", handleLinkEditorChange);
    input.addEventListener("change", handleLinkEditorChange);
  });

  $$("[data-delete-link]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.deleteLink);
      siteData.links.splice(index, 1);
      renderLinkEditor();
    });
  });

  $$("[data-move-link-up]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.moveLinkUp);
      if (index <= 0) return;
      [siteData.links[index - 1], siteData.links[index]] = [siteData.links[index], siteData.links[index - 1]];
      renderLinkEditor();
    });
  });

  $$("[data-move-link-down]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.moveLinkDown);
      if (index >= siteData.links.length - 1) return;
      [siteData.links[index + 1], siteData.links[index]] = [siteData.links[index], siteData.links[index + 1]];
      renderLinkEditor();
    });
  });
}

function renderSocialEditor() {
  const list = $("#socialEditorList");
  if (!list) return;

  list.innerHTML = "";

  siteData.socials.forEach((social, index) => {
    const item = document.createElement("div");
    item.className = "link-editor-item";

    item.innerHTML = `
      <div class="link-editor-top">
        <strong>${escapeHtml(social.label || "New Social")}</strong>

        <div class="editor-button-row">
          <a class="admin-mini-link" href="${escapeAttribute(social.url || "#")}" target="_blank" rel="noreferrer">
            Open
          </a>
          <button class="admin-danger small-danger" data-delete-social="${index}">Delete</button>
        </div>
      </div>

      <div class="link-editor-row">
        <label>
          Name
          <input data-social-field="label" data-social-index="${index}" value="${escapeAttribute(social.label || "")}" />
        </label>

        <label>
          Icon / Emoji
          <input data-social-field="icon" data-social-index="${index}" value="${escapeAttribute(social.icon || "")}" />
        </label>
      </div>

      <label>
        URL
        <input data-social-field="url" data-social-index="${index}" value="${escapeAttribute(social.url || "")}" />
      </label>

      <div class="admin-row">
        <button class="admin-action" data-move-social-up="${index}">↑ Up</button>
        <button class="admin-action" data-move-social-down="${index}">↓ Down</button>
      </div>
    `;

    list.appendChild(item);
  });

  $$("[data-social-field]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const input = event.target;
      const index = Number(input.dataset.socialIndex);
      const field = input.dataset.socialField;
      siteData.socials[index][field] = input.value;
      liveSaveAndRender();
    });
  });

  $$("[data-delete-social]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.deleteSocial);
      siteData.socials.splice(index, 1);
      renderSocialEditor();
    });
  });

  $$("[data-move-social-up]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.moveSocialUp);
      if (index <= 0) return;
      [siteData.socials[index - 1], siteData.socials[index]] = [siteData.socials[index], siteData.socials[index - 1]];
      renderSocialEditor();
    });
  });

  $$("[data-move-social-down]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.moveSocialDown);
      if (index >= siteData.socials.length - 1) return;
      [siteData.socials[index + 1], siteData.socials[index]] = [siteData.socials[index], siteData.socials[index + 1]];
      renderSocialEditor();
    });
  });
}

function renderProjectEditor() {
  const list = $("#projectEditorList");
  if (!list) return;

  list.innerHTML = "";

  siteData.projects.forEach((project, index) => {
    const item = document.createElement("div");
    item.className = "link-editor-item";

    item.innerHTML = `
      <div class="link-editor-top">
        <strong>${escapeHtml(project.title || "New Project")}</strong>

        <div class="editor-button-row">
          <button class="admin-danger small-danger" data-delete-project="${index}">Delete</button>
        </div>
      </div>

      <label>
        Project Title
        <input data-project-field="title" data-project-index="${index}" value="${escapeAttribute(project.title || "")}" />
      </label>

      <label>
        Project Description
        <textarea data-project-field="description" data-project-index="${index}">${escapeHtml(project.description || "")}</textarea>
      </label>

    <label>
        Project Link
        <input data-project-field="url" data-project-index="${index}" value="${escapeAttribute(project.url || "#")}" placeholder="https://example.com or #" />
    </label>
    
    
    <div class="admin-row">
    <a class="admin-mini-link" href="${escapeAttribute(project.url || "#")}" target="_blank" rel="noreferrer">Open Project</a>
    </div>


    `;

    list.appendChild(item);
  });

  $$("[data-project-field]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const input = event.target;
      const index = Number(input.dataset.projectIndex);
      const field = input.dataset.projectField;
      siteData.projects[index][field] = input.value;
      liveSaveAndRender();
    });
  });

  $$("[data-delete-project]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.deleteProject);
      siteData.projects.splice(index, 1);
      renderProjectEditor();
    });
  });

  $$("[data-move-project-up]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.moveProjectUp);
      if (index <= 0) return;
      [siteData.projects[index - 1], siteData.projects[index]] =
        [siteData.projects[index], siteData.projects[index - 1]];
      renderProjectEditor();
    });
  });

  $$("[data-move-project-down]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.moveProjectDown);
      if (index >= siteData.projects.length - 1) return;
      [siteData.projects[index + 1], siteData.projects[index]] =
        [siteData.projects[index], siteData.projects[index + 1]];
      renderProjectEditor();
    });
  });
}

function renderGalleryEditor() {
  const list = $("#galleryEditorList");
  if (!list) return;

  list.innerHTML = "";

  siteData.gallery.forEach((itemData, index) => {
    const item = document.createElement("div");
    item.className = "link-editor-item";

    item.innerHTML = `
      <div class="link-editor-top">
        <strong>${escapeHtml(itemData.title || "Gallery Item")}</strong>

        <div class="editor-button-row">
          <a class="admin-mini-link" href="${escapeAttribute(itemData.image || "#")}" target="_blank" rel="noreferrer">
            Open Image
          </a>
          <button class="admin-danger small-danger" data-delete-gallery="${index}">Delete</button>
        </div>
      </div>

      <label>
        Gallery Title
        <input data-gallery-field="title" data-gallery-index="${index}" value="${escapeAttribute(itemData.title || "")}" />
      </label>

      <label>
        Image URL
        <input data-gallery-field="image" data-gallery-index="${index}" value="${escapeAttribute(itemData.image || "")}" />
      </label>

      <label>
        Open Link / GIF URL
        <input data-gallery-field="url" data-gallery-index="${index}" value="${escapeAttribute(itemData.url || itemData.image || "")}" placeholder="Image, GIF, page, video link..." />
      </label>

      <div class="admin-row">
        <button class="admin-action" data-move-gallery-up="${index}">↑ Up</button>
        <button class="admin-action" data-move-gallery-down="${index}">↓ Down</button>
      </div>
    `;

    list.appendChild(item);
  });

  $$("[data-gallery-field]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const input = event.target;
      const index = Number(input.dataset.galleryIndex);
      const field = input.dataset.galleryField;
      siteData.gallery[index][field] = input.value;
      liveSaveAndRender();
    });
  });

  $$("[data-delete-gallery]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.deleteGallery);
      siteData.gallery.splice(index, 1);
      renderGalleryEditor();
    });
  });

  $$("[data-move-gallery-up]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.moveGalleryUp);
      if (index <= 0) return;
      [siteData.gallery[index - 1], siteData.gallery[index]] =
        [siteData.gallery[index], siteData.gallery[index - 1]];
      renderGalleryEditor();
    });
  });

  $$("[data-move-gallery-down]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.moveGalleryDown);
      if (index >= siteData.gallery.length - 1) return;
      [siteData.gallery[index + 1], siteData.gallery[index]] =
        [siteData.gallery[index], siteData.gallery[index + 1]];
      renderGalleryEditor();
    });
  });
}

function handleLinkEditorChange(event) {
  const input = event.target;
  const index = Number(input.dataset.linkIndex);
  const field = input.dataset.linkField;

  if (input.type === "checkbox") {
    siteData.links[index][field] = input.checked;
  } else {
    siteData.links[index][field] = input.value;
  }

  liveSaveAndRender();
}

async function liveSaveAndRender() {
  renderSite();
  localStorage.setItem("nyuukoria-site-sync", String(Date.now()));

  if (isOwnerMode && adminModal) {
    adminModal.classList.remove("hidden");
  }

  scheduleSave();
}

function saveAdminFieldsToData() {
  siteData.profile.displayName = $("#editDisplayName").value.trim() || "Yuuki";
  siteData.profile.username = $("#editUsername").value.trim() || "@nyuukoria";
  siteData.profile.tagline = $("#editTagline").value.trim();
  siteData.profile.bio = $("#editBio").value.trim();
  siteData.profile.avatar = $("#editAvatar").value.trim();
  siteData.profile.banner = $("#editBanner").value.trim();

  siteData.profile.badges = splitComma($("#editBadges").value);
  siteData.profile.aboutIntro = $("#editAboutIntro").value.trim();
  siteData.profile.names = splitComma($("#editNames").value);
  siteData.profile.pronouns = splitComma($("#editPronouns").value);
  siteData.profile.likes = splitComma($("#editLikes").value);
  siteData.profile.boundaries = splitComma($("#editBoundaries").value);

  siteData.theme.accent = $("#editAccent").value;
  siteData.theme.secondary = $("#editSecondary").value;
  siteData.theme.background = $("#editBackground").value.trim();
  siteData.theme.backgroundDarkness = Number($("#editBackgroundDarkness").value);
  siteData.theme.cardOpacity = Number($("#editCardOpacity").value);
  siteData.theme.nameColor = $("#editNameColor").value;
  siteData.theme.avatarDecor = $("#editAvatarDecor").value;
  siteData.theme.avatarBubbleStyle = $("#editAvatarBubbleStyle").value;
  siteData.theme.avatarBubbleColor = $("#editAvatarBubbleColor").value;
  siteData.theme.avatarBubbleIcon = $("#editAvatarBubbleIcon").value;
  siteData.theme.themeStyle = $("#editThemeStyle").value;
  siteData.theme.particleStyle = $("#editParticleStyle").value;
  siteData.theme.cursorTrail = $("#editCursorTrail").value;
  siteData.theme.particles = $("#editParticles").checked;
  siteData.theme.intro = $("#editIntro").checked;

  siteData.profile.names = splitComma($("#editAboutNames").value);
    siteData.profile.pronouns = splitComma($("#editAboutPronouns").value);

    siteData.profile.words.honorifics = splitComma($("#editWordsHonorifics").value);
    siteData.profile.words.compliments = splitComma($("#editWordsCompliments").value);
    siteData.profile.words.relationships = splitComma($("#editWordsRelationships").value);

    siteData.profile.likes = splitComma($("#editAboutLikes").value);
    siteData.profile.boundaries = splitComma($("#editAboutBoundaries").value);

    siteData.skills = $("#editSkills").value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
        const [title, ...urlParts] = line.split("|");
        return {
        title: title.trim(),
        url: (urlParts.join("|").trim() || "#")
        };
    });
    siteData.footer = $("#editFooterText").value.trim() || "made with ♡";
}

function splitComma(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function setupAdmin() {
  setupLiveAdminPreview();
  adminOpenButton.addEventListener("click", () => {
  if (!isOwnerMode) return;

  fillAdminFields();
  adminModal.classList.remove("hidden");
  });

  adminCloseButton.addEventListener("click", () => {
    adminModal.classList.add("hidden");
  });

  adminModal.addEventListener("click", (event) => {
    if (event.target === adminModal) {
      adminModal.classList.add("hidden");
    }
  });

  $$(".admin-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".admin-tab").forEach((button) => button.classList.remove("active"));
      $$(".admin-panel").forEach((panel) => panel.classList.remove("active"));

      tab.classList.add("active");
      $(`[data-admin-panel="${tab.dataset.adminTab}"]`).classList.add("active");
    });
  });

  $("#addLinkButton").addEventListener("click", () => {
    siteData.links.push({
      title: "New Link",
      description: "Description here",
      icon: "✦",
      url: "https://example.com",
      featured: false,
      enabled: true
    });
    renderLinkEditor();
  });

  $("#addSocialButton").addEventListener("click", () => {
    siteData.socials.push({
        label: "New Social",
        icon: "✦",
        url: "https://example.com"
    });

    renderSocialEditor();
    });

    $("#addProjectButton").addEventListener("click", () => {
    siteData.projects.push({
    title: "New Project",
    description: "Project description...",
    url: "#"
    });

    renderProjectEditor();
    });

    $("#addGalleryButton").addEventListener("click", () => {
    siteData.gallery.push({
      title: "New Gallery Item",
      image: "assets/banner.png",
      url: "assets/banner.png"
    });

    renderGalleryEditor();
    });

    $("#addChangelogButton").addEventListener("click", () => {
      siteData.changelogs = siteData.changelogs || [];

      siteData.changelogs.unshift({
        date: new Date().toISOString().slice(0, 10),
        title: "New update",
        text: "Write what changed..."
      });

      liveSaveAndRender();
      renderChangelogEditor();
    });

  $("#editBackgroundDarkness").addEventListener("input", () => {
    $("#darknessValue").textContent = `${Math.round(Number($("#editBackgroundDarkness").value) * 100)}%`;
  });

  $("#editCardOpacity").addEventListener("input", () => {
    $("#cardOpacityValue").textContent = `${Math.round(Number($("#editCardOpacity").value) * 100)}%`;
  });

  saveAdminButton.addEventListener("click", async () => {
    saveAdminFieldsToData();
    saveAdminButton.disabled = true;
    try {
      if (await saveData()) {
        renderSite();
        if (!hasUnsavedChanges) adminModal.classList.add("hidden");
      }
    } finally { saveAdminButton.disabled = false; }
  });

  $("#exportDataButton").addEventListener("click", async () => {
    $("#dataEditor").value = JSON.stringify(siteData, null, 2);
    await navigator.clipboard.writeText($("#dataEditor").value).catch(() => {});
    alert("Data exported. It was also copied if browser allowed clipboard.");
  });

  $("#importDataButton").addEventListener("click", async () => {
    try {
      const imported = JSON.parse($("#dataEditor").value);
      siteData = mergeDeep(structuredClone(DEFAULT_DATA), imported);
      editRevision += 1;
      const saved = await saveData();
      renderSite();
      alert(saved ? "Imported and saved online." : "Imported locally. Online save failed; check the status beside Save Changes.");
    } catch {
      alert("Invalid JSON.");
    }
  });

  $("#resetDataButton").addEventListener("click", () => {
    if (!confirm("Reset all local edits?")) return;
    localStorage.removeItem("nyuukoria-site-data");
    siteData = structuredClone(DEFAULT_DATA);
    renderSite();
  });
}

function setupLiveAdminPreview() {
  if (!isOwnerMode) return;

  const liveInputs = [
    "#editDisplayName",
    "#editUsername",
    "#editTagline",
    "#editBio",
    "#editAvatar",
    "#editBanner",
    "#editBadges",
    "#editAboutIntro",
    "#editAboutNames",
    "#editAboutPronouns",
    "#editWordsHonorifics",
    "#editWordsCompliments",
    "#editWordsRelationships",
    "#editAboutLikes",
    "#editAboutBoundaries",
    "#editAccent",
    "#editSecondary",
    "#editBackground",
    "#editBackgroundDarkness",
    "#editCardOpacity",
    "#editNameColor",
    "#editAvatarDecor",
    "#editAvatarBubbleStyle",
    "#editAvatarBubbleColor",
    "#editAvatarBubbleIcon",
    "#editThemeStyle",
    "#editParticleStyle",
    "#editCursorTrail",
    "#editParticles",
    "#editIntro",
    "#editSkills",
    "#editFooterText"
  ];

  const liveUpdate = () => {
    try {
      saveAdminFieldsToData();
      scheduleSave();
      renderSite();

      localStorage.setItem("nyuukoria-site-sync", String(Date.now()));

      // Keep admin open after renderSite refills fields
      adminModal.classList.remove("hidden");
    } catch (error) {
      console.warn("Live preview skipped:", error);
    }
  };

  liveInputs.forEach((selector) => {
    const input = document.querySelector(selector);
    if (!input) return;

    input.addEventListener("input", liveUpdate);
    input.addEventListener("change", liveUpdate);
  });
}

/* INTRO + MUSIC */
function setupIntroAndMusic() {
  const musicButton = $("#musicButton");
  const volumeSlider = $("#musicVolumeSlider");
  const volumeText = $("#musicVolumeText");
  const volumeStorageKey = "nyuukoria-music-volume";

  const storedVolume = Number(localStorage.getItem(volumeStorageKey));
  const defaultVolume = Number(siteData.theme.musicVolume ?? 0.22);
  const savedVolume = Number.isFinite(storedVolume) ? storedVolume : defaultVolume;

  bgMusic.volume = Math.min(1, Math.max(0, savedVolume));

  if (volumeSlider) {
    volumeSlider.value = String(Math.round(bgMusic.volume * 100));
  }

  if (volumeText) {
    volumeText.textContent = `${Math.round(bgMusic.volume * 100)}%`;
  }

  function updateMusicButton(isPlaying = !bgMusic.paused) {
    musicButton.textContent = isPlaying ? "♪ Music On" : "♪ Music Off";
    musicButton.setAttribute("aria-pressed", String(isPlaying));
  }

  function playMusic() {
    if (!bgMusic.paused) {
      updateMusicButton(true);
      return;
    }

    // Update immediately so the control never waits for mobile audio decoding.
    updateMusicButton(true);

    const playRequest = bgMusic.play();
    if (playRequest && typeof playRequest.catch === "function") {
      playRequest.catch(() => updateMusicButton(false));
    }
  }

  enterButton.addEventListener("click", () => {
    introScreen.classList.add("hidden");
    app.classList.remove("hidden");
    playMusic();
  });

  musicButton.addEventListener("click", () => {
    if (bgMusic.paused) {
      playMusic();
      return;
    }

    bgMusic.pause();
    updateMusicButton(false);
  });

  bgMusic.addEventListener("play", () => updateMusicButton(true));
  bgMusic.addEventListener("pause", () => updateMusicButton(false));

  if (volumeSlider) {
    volumeSlider.addEventListener("input", () => {
      const volume = Number(volumeSlider.value) / 100;

      bgMusic.volume = volume;

      if (volumeText) {
        volumeText.textContent = `${Math.round(volume * 100)}%`;
      }

      // Volume is a visitor preference. Keep it local and avoid a network save
      // for every tiny slider movement.
      localStorage.setItem(volumeStorageKey, String(volume));
    });
  }

  updateMusicButton();
}

/* UTILS */
function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function capitalize(value) {
  return value.slice(0, 1).toUpperCase() + value.slice(1);
}

/* CURSOR TRAIL */
let cursorTrailReady = false;
let lastTrailTime = 0;

function setupCursorTrail() {
  if (cursorTrailReady) return;
  cursorTrailReady = true;

  const isTouch = window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
  if (isTouch) return;

  window.addEventListener("pointermove", (event) => {
    const style = siteData.theme.cursorTrail || "none";
    if (style === "none") return;

    const now = performance.now();

    // phone / touch gets fewer trail elements
    const delay = isTouch ? 95 : 32;
    if (now - lastTrailTime < delay) return;
    lastTrailTime = now;

    const dot = document.createElement("span");
    dot.className = `cursor-trail cursor-${style}`;
    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;

    if (style === "sakura") {
      dot.style.setProperty("--sakura-rot", `${Math.random() * 360}deg`);
    }

    document.body.appendChild(dot);

    setTimeout(() => {
      dot.remove();
    }, 700);
  }, { passive: true });
}

function lockAdminForVisitors() {
  if (isOwnerMode) return;

  const adminModal = document.querySelector("#adminModal");
  const adminButton = document.querySelector("#adminOpenButton");

  if (adminModal) adminModal.remove();
  if (adminButton) adminButton.remove();
}

window.addEventListener("storage", async (event) => {
  if (
    event.key === "nyuukoria-site-data" ||
    event.key === "nyuukoria-site-sync"
  ) {
    if (hasUnsavedChanges) return;
    const updated = await loadData();
    if (updated) { siteData = updated; renderSite(); }
  }
});

/* INIT */
async function initSite() {
  siteData = await loadData();
  if (!siteData) return;

  lockAdminForVisitors();

  if (isOwnerMode) {
    setupAdmin();
  }

  setupIntroAndMusic();
  setupCursorTrail();
  renderSite();
  setupVisitCounter();
}

initSite();