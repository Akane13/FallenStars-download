// ------------------------------------------------------------------ settings

// The GitHub repository that holds the releases (this website's own repository).
const OWNER = "Akane13";
const REPO = "FallenStars-download";

// Each release must have files with exactly these names (prepare-release.ps1 names them so).
const WINDOWS_FILE = "FallenStars-Launcher.zip";
const ANDROID_FILE = "FallenStars.apk";

// The announcements: once the game server is online, put its address here (https, no "/" at the end, e.g. "https://api.example.com")
// and the page shows the same announcements as the game. While it is empty, they come from notices.json in this repository.
const SERVER_URL = "";

// All the words on the page. Put the short introduction in "intro" (empty = not shown); a line break is "\n".
const TEXT = {
  zh: {
    name: "落星",
    intro: "",
    winTitle: "Windows 电脑版",
    winSub: "启动器 · 自动更新",
    apkTitle: "Android 手机版",
    apkSub: "APK 安装包",
    latest: (v, d) => `最新版本 ${v} · ${d}`,
    allReleases: "历代版本",
    none: "还没有发布版本，敬请期待",
    loading: "正在读取最新版本…",
    failed: "读取版本信息失败，按钮仍会下载最新版",
    hintAndroid: "安卓安装时如提示「未知来源」，请在设置里允许本次安装",
    hintWindows: "解压后运行 FallenStars Launcher，之后的更新由启动器自动完成",
    hintIos: "暂不支持 iPhone / iPad",
    newsCue: "公告",
    newsTitle: "公告",
    noNews: "暂无公告",
    newsFailed: "公告读取失败，请稍后再来看看",
    tags: { Notice: "公告", Maintenance: "维护", Update: "更新" },
    rights: "保留所有权利。",
  },
  en: {
    name: "Fallen Stars",
    intro: "",
    winTitle: "Windows",
    winSub: "Launcher · auto-updates",
    apkTitle: "Android",
    apkSub: "APK installer",
    latest: (v, d) => `Latest ${v} · ${d}`,
    allReleases: "All releases",
    none: "Nothing released yet — coming soon",
    loading: "Checking the latest version…",
    failed: "Could not read the version; the buttons still download the latest",
    hintAndroid: "If Android warns about unknown apps, allow this install in Settings",
    hintWindows: "Unzip and run FallenStars Launcher; it keeps the game up to date",
    hintIos: "iPhone / iPad are not supported yet",
    newsCue: "News",
    newsTitle: "News",
    noNews: "No announcements yet",
    newsFailed: "Could not load the announcements; please try again later",
    tags: { Notice: "News", Maintenance: "Maintenance", Update: "Update" },
    rights: "All rights reserved.",
  },
};

// ------------------------------------------------------------------ the page

const RELEASES_PAGE = `https://github.com/${OWNER}/${REPO}/releases`;
const latestLink = (file) => `${RELEASES_PAGE}/latest/download/${file}`;

const ua = navigator.userAgent;
const device = /android/i.test(ua) ? "android" : /iphone|ipad|ipod/i.test(ua) ? "ios" : "pc";

let lang = pickLanguage();
let release = { state: "loading" };   // loading | ok | none | failed
let news = { state: "loading", list: [] };   // loading | ok | failed

function pickLanguage() {
  try {
    const saved = localStorage.getItem("lang");
    if (saved === "zh" || saved === "en") return saved;
  } catch (_) { /* private mode */ }
  return /^zh/i.test(navigator.language || "") ? "zh" : "en";
}

function setLanguage(next) {
  lang = next;
  try { localStorage.setItem("lang", next); } catch (_) { /* private mode */ }
  render();
}

function sizeText(bytes) {
  return bytes ? ` · ${(bytes / 1024 / 1024).toFixed(0)} MB` : "";
}

function dateText(iso) {
  const d = new Date(iso);
  return lang === "zh"
    ? `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
    : d.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
}

function render() {
  const t = TEXT[lang];
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.title = lang === "zh" ? "落星 Fallen Stars" : "Fallen Stars";
  document.querySelectorAll(".lang button").forEach((b) => b.classList.toggle("on", b.dataset.lang === lang));
  document.querySelectorAll("[data-t]").forEach((el) => { el.textContent = t[el.dataset.t]; });

  const intro = document.getElementById("intro");
  intro.textContent = t.intro;
  intro.hidden = !t.intro;

  const win = document.getElementById("dl-windows");
  const apk = document.getElementById("dl-android");
  // the button for this device comes first and is filled in
  win.classList.toggle("primary", device === "pc");
  apk.classList.toggle("primary", device === "android");
  if (device === "android") apk.parentElement.prepend(apk); else win.parentElement.prepend(win);

  const assets = release.assets || {};
  win.href = assets[WINDOWS_FILE]?.url || latestLink(WINDOWS_FILE);
  apk.href = assets[ANDROID_FILE]?.url || latestLink(ANDROID_FILE);
  win.classList.toggle("off", release.state === "none" || (release.state === "ok" && !assets[WINDOWS_FILE]));
  apk.classList.toggle("off", release.state === "none" || (release.state === "ok" && !assets[ANDROID_FILE]));
  win.querySelector(".dl-sub").textContent = t.winSub + sizeText(assets[WINDOWS_FILE]?.size);
  apk.querySelector(".dl-sub").textContent = t.apkSub + sizeText(assets[ANDROID_FILE]?.size);

  const meta = document.getElementById("meta");
  const all = `<a href="${RELEASES_PAGE}" target="_blank" rel="noopener">${t.allReleases}</a>`;
  if (release.state === "ok") meta.innerHTML = `${escapeHtml(t.latest(release.version, dateText(release.date)))} · ${all}`;
  else if (release.state === "none") meta.textContent = t.none;
  else if (release.state === "failed") meta.innerHTML = `${escapeHtml(t.failed)} · ${all}`;
  else meta.textContent = t.loading;

  document.getElementById("hint").textContent =
    device === "android" ? t.hintAndroid : device === "ios" ? t.hintIos : t.hintWindows;

  renderNews(t);
}

function renderNews(t) {
  const box = document.getElementById("news-list");
  box.replaceChildren();
  if (news.state !== "ok" || news.list.length === 0) {
    const p = document.createElement("p");
    p.className = "news-empty";
    p.textContent = news.state === "failed" ? t.newsFailed : news.state === "loading" ? "…" : t.noNews;
    box.append(p);
    return;
  }
  news.list.forEach((n, i) => {
    const item = document.createElement("details");
    item.className = "notice";
    if (i === 0) item.open = true;              // the newest one is open

    const head = document.createElement("summary");
    const tag = document.createElement("span");
    tag.className = `notice-tag ${n.kind || "Notice"}`;
    tag.textContent = t.tags[n.kind] || t.tags.Notice;
    const title = document.createElement("span");
    title.className = "notice-title";
    title.textContent = pick(n.title, n.titleZh);
    const date = document.createElement("span");
    date.className = "notice-date";
    date.textContent = n.showAtUnix ? dateText(n.showAtUnix * 1000) : "";
    head.append(tag, title, date);

    const body = document.createElement("p");
    body.className = "notice-body";
    body.textContent = pick(n.body, n.bodyZh) || pick(n.title, n.titleZh);
    item.append(head, body);
    box.append(item);
  });
}

// The Chinese text on the Chinese page, the English one on the English page; when one is empty, the other.
function pick(en, zh) {
  return (lang === "zh" ? zh || en : en || zh) || "";
}

function escapeHtml(s) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

async function loadRelease() {
  try {
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (res.status === 404) { release = { state: "none" }; return; }
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const assets = {};
    for (const a of data.assets || []) assets[a.name] = { url: a.browser_download_url, size: a.size };
    release = { state: "ok", version: data.tag_name || data.name, date: data.published_at, assets };
  } catch (_) {
    release = { state: "failed" };
  } finally {
    render();
  }
}

document.querySelectorAll(".lang button").forEach((b) => b.addEventListener("click", () => setLanguage(b.dataset.lang)));
async function loadNews() {
  try {
    const url = SERVER_URL ? `${SERVER_URL}/api/system/status` : "notices.json";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const now = Date.now() / 1000;
    const list = (data.notices || [])
      .filter((n) => !n.showAtUnix || n.showAtUnix <= now)
      .filter((n) => !n.endAtUnix || n.endAtUnix > now)
      .sort((a, b) => (b.showAtUnix || 0) - (a.showAtUnix || 0));
    news = { state: "ok", list };
  } catch (_) {
    news = { state: "failed", list: [] };
  } finally {
    render();
  }
}

// Scrolling down to the announcements blurs the picture behind (fades the blurred copy in).
const blur = document.getElementById("bg-blur");
function updateBlur() {
  const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.8)));
  blur.style.opacity = p.toFixed(3);
}
window.addEventListener("scroll", updateBlur, { passive: true });
window.addEventListener("resize", updateBlur);
updateBlur();

document.getElementById("year").textContent = String(Math.max(2026, new Date().getFullYear()));
render();
loadRelease();
loadNews();
