// ------------------------------------------------------------------ settings

// The GitHub repository that holds the releases (this website's own repository).
const OWNER = "Akane13";
const REPO = "FallenStars-download";

// Each release must have files with exactly these names (prepare-release.ps1 names them so).
const WINDOWS_FILE = "FallenStars-Setup.exe";
const ANDROID_FILE = "FallenStars.apk";

// The announcements: once the game server is online, put its address here (https, no "/" at the end, e.g. "https://api.example.com")
// and the page shows the same announcements as the game. While it is empty, they come from notices.json in this repository.
const SERVER_URL = "https://api.fallenstars.fyi";

// All the words on the page. Put the short introduction in "intro" (empty = not shown); a line break is "\n".
const TEXT = {
  zh: {
    name: "落星",
    intro: "从高空坠落的混乱开局，到香气四溢的餐车日常。当万物失去味觉与色彩，唯有爱与美食能重拾这片大地的烟火气。",
    winTitle: "Windows 电脑版",
    winSub: "安装程序 · 自动更新",
    apkTitle: "Android 手机版",
    apkSub: "APK 安装包",
    latest: (v, d) => `最新版本 ${v} · ${d}`,
    allReleases: "历代版本",
    none: "还没有发布版本，敬请期待",
    loading: "正在读取最新版本…",
    failed: "读取版本信息失败，按钮仍会下载最新版",
    hintAndroid: "安卓安装时如提示「未知来源」，请在设置里允许本次安装",
    hintWindows: "运行安装程序后，从桌面的「落星」进入游戏，之后的更新会自动完成",
    hintIos: "暂不支持 iPhone / iPad",
    newsCue: "安装说明 · 公告",
    newsTitle: "公告",
    helpTitle: "安装说明",
    helpAndroid: "Android 手机",
    helpWindows: "Windows 电脑",
    stepsAndroid: [
      "点上方「Android 手机版」，下载 FallenStars.apk。",
      "打开下载好的文件。如果提示不能安装未知来源的应用，点「设置」，为你的浏览器（或文件管理器）打开「允许安装未知应用」，再返回继续安装。",
      "如果 Google Play 保护机制提示这是未知应用，点「更多详情」→「仍然安装」。",
      "以后有新版本时，同样下载新的 APK 直接安装，会覆盖旧版本。",
    ],
    stepsWindows: [
      "点上方「Windows 电脑版」，下载 FallenStars-Setup.exe。",
      "运行下载好的安装程序。如果出现「Windows 已保护你的电脑」，点「更多信息」→「仍要运行」。不需要管理员权限。",
      "如果出现「智能应用控制已阻止可能不安全的应用」（没有「仍要运行」按钮），这台电脑暂时无法安装电脑版，请改玩 Android 版。也可以在「Windows 安全中心 → 应用和浏览器控制 → 智能应用控制设置」里关闭它，但关闭后无法再重新开启（除非重装 Windows），请自行决定。",
      "安装完会打开启动器：点「下载并安装」，第一次会下载整个游戏。",
      "之后从桌面或开始菜单的「落星 FallenStars」进入游戏，更新会自动下载。卸载在 Windows 的「设置 → 应用」里。",
    ],
    helpNote: "游戏进度保存在服务器上：换设备时登录同一个账号即可继续。暂不支持 iPhone / iPad。",
    noNews: "暂无公告",
    newsFailed: "公告读取失败，请稍后再来看看",
    tags: { Notice: "公告", Maintenance: "维护", Update: "更新" },
    rights: "保留所有权利。",
  },
  en: {
    name: "Fallen Stars",
    intro: "From a chaotic fall out of the sky to everyday life on a food truck full of good smells. When the world has lost its taste and its colour, only love and good food can bring the warmth of life back to this land.",
    winTitle: "Windows",
    winSub: "Installer · auto-updates",
    apkTitle: "Android",
    apkSub: "APK installer",
    latest: (v, d) => `Latest ${v} · ${d}`,
    allReleases: "All releases",
    none: "Nothing released yet — coming soon",
    loading: "Checking the latest version…",
    failed: "Could not read the version; the buttons still download the latest",
    hintAndroid: "If Android warns about unknown apps, allow this install in Settings",
    hintWindows: "Run the installer, then start the game from the desktop; updates come by themselves",
    hintIos: "iPhone / iPad are not supported yet",
    newsCue: "How to install · News",
    newsTitle: "News",
    helpTitle: "How to install",
    helpAndroid: "Android phone",
    helpWindows: "Windows PC",
    stepsAndroid: [
      "Tap \"Android\" above to download FallenStars.apk.",
      "Open the downloaded file. If Android says it cannot install apps from unknown sources, tap Settings, turn on \"Allow from this source\" for your browser (or file manager), then go back and install.",
      "If Google Play Protect says the app is unknown, tap \"More details\" → \"Install anyway\".",
      "When there is a new version, download the new APK and install it the same way; it replaces the old one.",
    ],
    stepsWindows: [
      "Click \"Windows\" above to download FallenStars-Setup.exe.",
      "Run the installer. If \"Windows protected your PC\" appears, click \"More info\" → \"Run anyway\". No admin rights are needed.",
      "If \"Smart App Control blocked an app that may be unsafe\" appears (with no \"Run anyway\"), the PC version cannot be installed on this computer for now: please play the Android version. You can also turn it off in \"Windows Security → App & browser control → Smart App Control settings\", but it cannot be turned on again afterwards (short of reinstalling Windows), so decide for yourself.",
      "The launcher opens when it is done: press \"Download and install\"; the first time downloads the whole game.",
      "From then on, start \"Fallen Stars\" from the desktop or the Start menu: updates download by themselves. Uninstall it in Windows Settings → Apps.",
    ],
    helpNote: "Your progress is kept on the server: on another device, log in with the same account to carry on. iPhone / iPad are not supported yet.",
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

  renderHelp(t);
  renderNews(t);
}

// The install steps: this device's first.
function renderHelp(t) {
  const box = document.getElementById("help-cards");
  box.replaceChildren();
  const cards = [["android", t.helpAndroid, t.stepsAndroid], ["pc", t.helpWindows, t.stepsWindows]];
  if (device !== "android") cards.reverse();
  for (const [, title, steps] of cards) {
    const card = document.createElement("div");
    card.className = "help-card";
    const h = document.createElement("h3");
    h.textContent = title;
    const ol = document.createElement("ol");
    for (const s of steps) {
      const li = document.createElement("li");
      li.textContent = s;
      ol.append(li);
    }
    card.append(h, ol);
    box.append(card);
  }
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
    appendLinked(body, pick(n.body, n.bodyZh) || pick(n.title, n.titleZh));
    item.append(head, body);
    box.append(item);
  });
}

// The Chinese text on the Chinese page, the English one on the English page; when one is empty, the other.
// Writes text into el, turning web addresses into links that open in a new tab: "https://…", "www.…" and "forms.gle/…"-style addresses
// (a name with a dot, then a "/" path). Built from text nodes and <a> elements, never innerHTML, so an announcement cannot inject markup.
const LINK = /(https?:\/\/[A-Za-z0-9\-._~:/?#\[\]@!$&()*+,;=%]+|www\.[A-Za-z0-9\-._~:/?#\[\]@!$&()*+,;=%]+|\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}\/[A-Za-z0-9\-._~:/?#\[\]@!$&()*+,;=%]*)/gi;
const TRAILING = /[.,;:!?。，；：！？、)\]]+$/;
function appendLinked(el, text) {
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    let url = m[0];
    const tail = url.match(TRAILING);
    if (tail) url = url.slice(0, -tail[0].length);
    if (!url) continue;
    el.append(text.slice(last, m.index));
    const a = document.createElement("a");
    a.href = /^https?:\/\//i.test(url) ? url : "https://" + url;
    a.textContent = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    el.append(a);
    last = m.index + url.length;
  }
  el.append(text.slice(last));
}

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
// The announcements of the game server (the ones the game shows); when the server cannot be reached (the PC is off), the ones in notices.json.
async function fetchNotices(url) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()).notices || [];
  } catch (_) {
    return null;
  }
}

async function loadNews() {
  try {
    const [server, local] = await Promise.all([SERVER_URL ? fetchNotices(`${SERVER_URL}/api/system/status`) : Promise.resolve(null), fetchNotices("notices.json")]);
    if (server === null && local === null) throw new Error("no announcements could be read");
    // the game server is the one source (the same announcements as in the game); notices.json is only for when the server cannot be reached
    const all = server !== null ? server : local || [];
    const now = Date.now() / 1000;
    const list = all
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
