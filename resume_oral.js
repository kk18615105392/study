// 实习与项目 · 面试口述背诵
// 一篇一清：顶部分项目 → 正文/知识点分页 → 挖空用占位符防 HTML 串扰

let oralMaskMode = "all-mask"; // all-mask | key | tech | reveal
let oralPanel = "script"; // script | knowledge
let currentOralScript = null;
let oralProjectFilter = "all";

function getOralScripts() {
  if (typeof RESUME_ORAL_SCRIPTS !== "undefined" && Array.isArray(RESUME_ORAL_SCRIPTS)) {
    return RESUME_ORAL_SCRIPTS;
  }
  const data = typeof SUBJECT_DATA !== "undefined" ? SUBJECT_DATA.resume_projects : null;
  return (data && data.oralScripts) || [];
}

function getOralCategories() {
  const data = typeof SUBJECT_DATA !== "undefined" ? SUBJECT_DATA.resume_projects : null;
  if (data && Array.isArray(data.categories)) return data.categories;
  return [
    { id: "momenta", name: "实习·Momenta" },
    { id: "farm_robot", name: "实习·银黄农场" },
    { id: "zhinnong", name: "项目·智农云眸" },
    { id: "fruit_mp", name: "项目·水果小程序" },
    { id: "skills", name: "综合串联" }
  ];
}

function oralMaskLabel(type) {
  return type === "tech" ? "技术词" : "关键句";
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function startOralRecitation() {
  const scripts = getOralScripts();
  if (!scripts.length) {
    alert("暂无口述稿数据");
    return;
  }

  currentMode = "oral_recitation";
  if (typeof currentSubject !== "undefined") currentSubject = "resume_projects";

  oralProjectFilter = "all";
  oralPanel = "script";
  oralMaskMode = "all-mask";

  bindOralEventsOnce();
  renderOralProjectChips();
  setOralPanel("script");
  setOralMaskMode("all-mask");

  const first = scripts[0];
  loadOralScript(first.id);

  if (typeof startPracticeTimer === "function") {
    startPracticeTimer("oral-timer", "oral-timer-text");
  }
  if (typeof switchScreen === "function") {
    switchScreen("oral-recitation");
  }
}

function bindOralEventsOnce() {
  const bodyView = document.getElementById("oral-body-view");
  if (bodyView && !bodyView.dataset.bound) {
    bodyView.addEventListener("click", (e) => {
      const btn = e.target.closest(".oral-mask-btn");
      if (!btn) return;
      const text = btn.getAttribute("data-text") || "";
      const type = btn.getAttribute("data-type") || "key";
      if (btn.classList.contains("revealed")) {
        btn.classList.remove("revealed");
        btn.textContent = `🔑 ${oralMaskLabel(type)}`;
      } else {
        btn.classList.add("revealed");
        btn.textContent = text;
      }
    });
    bodyView.dataset.bound = "true";
  }
}

function renderOralProjectChips() {
  const bar = document.getElementById("oral-project-chips");
  if (!bar) return;
  const cats = getOralCategories();
  const chips = [{ id: "all", name: "全部" }].concat(cats);

  bar.innerHTML = chips
    .map(
      (c) =>
        `<button type="button" class="oral-chip${c.id === oralProjectFilter ? " active" : ""}" data-project="${c.id}">${c.name.replace(/^实习·|^项目·/, "")}</button>`
    )
    .join("");

  bar.querySelectorAll(".oral-chip").forEach((btn) => {
    btn.onclick = () => {
      oralProjectFilter = btn.getAttribute("data-project") || "all";
      renderOralProjectChips();
      renderOralScriptList();
      const list = filteredOralScripts();
      if (list.length) loadOralScript(list[0].id);
    };
  });

  renderOralScriptList();
}

function filteredOralScripts() {
  const all = getOralScripts();
  if (oralProjectFilter === "all") return all;
  return all.filter((s) => s.project === oralProjectFilter);
}

function renderOralScriptList() {
  const listEl = document.getElementById("oral-script-list");
  if (!listEl) return;
  const scripts = filteredOralScripts();
  const currentId = currentOralScript && currentOralScript.id;

  listEl.innerHTML = scripts
    .map(
      (s) => `
    <button type="button" class="oral-script-item${s.id === currentId ? " active" : ""}" data-id="${s.id}">
      <span class="oral-script-item-title">${escapeHtml(s.title)}</span>
      <span class="oral-script-item-desc">${escapeHtml(s.oneLiner || "")}</span>
    </button>`
    )
    .join("");

  listEl.querySelectorAll(".oral-script-item").forEach((btn) => {
    btn.onclick = () => loadOralScript(btn.getAttribute("data-id"));
  });
}

function loadOralScript(scriptId) {
  const script = getOralScripts().find((s) => s.id === scriptId);
  if (!script) return;
  currentOralScript = script;

  const titleEl = document.getElementById("oral-title-view");
  const metaEl = document.getElementById("oral-meta-view");
  const badgeEl = document.getElementById("oral-project-badge");
  if (titleEl) titleEl.textContent = script.title;
  if (metaEl) metaEl.textContent = script.oneLiner || "";
  if (badgeEl) badgeEl.textContent = script.projectName || "";

  renderOralScriptList();
  renderOralBody();
  renderOralKnowledge();
  updateOralKnowCount();
}

function updateOralKnowCount() {
  const el = document.getElementById("oral-panel-know-count");
  if (!el || !currentOralScript) return;
  const n = (currentOralScript.knowledge || []).length;
  el.textContent = n ? String(n) : "0";
}

function setOralPanel(panel) {
  oralPanel = panel === "knowledge" ? "knowledge" : "script";
  const scriptPane = document.getElementById("oral-pane-script");
  const knowPane = document.getElementById("oral-pane-knowledge");
  const tabScript = document.getElementById("oral-tab-script");
  const tabKnow = document.getElementById("oral-tab-knowledge");
  const modeBar = document.getElementById("oral-mode-bar");

  if (scriptPane) scriptPane.hidden = oralPanel !== "script";
  if (knowPane) knowPane.hidden = oralPanel !== "knowledge";
  if (tabScript) tabScript.classList.toggle("active", oralPanel === "script");
  if (tabKnow) tabKnow.classList.toggle("active", oralPanel === "knowledge");
  if (modeBar) modeBar.hidden = oralPanel !== "script";
}

function setOralMaskMode(mode) {
  oralMaskMode = mode;
  ["all-mask", "key", "tech", "reveal"].forEach((m) => {
    const btn = document.getElementById(`oral-mode-${m}`);
    if (btn) btn.classList.toggle("active", m === mode);
  });
  renderOralBody();
}

/** 先替换为占位符，再统一插入 HTML，避免挖空互相污染 */
function applyMasks(text, masks) {
  const list = (masks || []).slice().sort((a, b) => b.text.length - a.text.length);
  const applied = [];
  let work = text;

  list.forEach((mask) => {
    if (!mask.text || !work.includes(mask.text)) return;
    const idx = applied.length;
    const token = `\uE000${idx}\uE001`;
    work = work.replace(mask.text, token);
    applied.push(mask);
  });

  let html = escapeHtml(work);
  applied.forEach((mask, idx) => {
    const token = `\uE000${idx}\uE001`;
    const tokenEsc = escapeHtml(token);
    let shouldHide = false;
    if (oralMaskMode === "all-mask") shouldHide = true;
    else if (oralMaskMode === "key" && mask.type === "key") shouldHide = true;
    else if (oralMaskMode === "tech" && mask.type === "tech") shouldHide = true;

    const safeText = escapeHtml(mask.text);
    const attrText = mask.text.replace(/"/g, "&quot;");
    const repl = shouldHide
      ? `<span class="oral-mask-btn" data-text="${attrText}" data-type="${mask.type}">🔑 ${oralMaskLabel(mask.type)}</span>`
      : `<span class="oral-mask-btn revealed" data-text="${attrText}" data-type="${mask.type}">${safeText}</span>`;
    html = html.split(tokenEsc).join(repl);
  });

  return html;
}

function renderOralBody() {
  if (!currentOralScript) return;
  const container = document.getElementById("oral-body-view");
  if (!container) return;
  container.innerHTML = "";

  const stepMap = { hook: "①", body: "②", close: "③" };
  currentOralScript.paragraphs.forEach((para, i) => {
    const wrap = document.createElement("section");
    wrap.className = `oral-para-block oral-para-${para.type || "body"}`;

    const head = document.createElement("div");
    head.className = "oral-para-head";
    const step = stepMap[para.type] || `${i + 1}.`;
    head.innerHTML = `<span class="oral-para-step">${step}</span><span class="oral-para-label">${escapeHtml(para.label || "段落")}</span>`;
    wrap.appendChild(head);

    const pEl = document.createElement("p");
    pEl.innerHTML = applyMasks(para.text, para.masks);
    wrap.appendChild(pEl);
    container.appendChild(wrap);
  });
}

function renderOralKnowledge() {
  const box = document.getElementById("oral-knowledge-view");
  if (!box) return;
  const list = (currentOralScript && currentOralScript.knowledge) || [];
  if (!list.length) {
    box.innerHTML = '<div class="oral-knowledge-empty">本篇暂无延伸知识点，先背完口述正文即可。</div>';
    return;
  }

  box.innerHTML = `
    <div class="oral-knowledge-intro">以下知识点只服务当前口述稿「${escapeHtml(currentOralScript.title)}」，与其它项目无关。</div>
    ${list
      .map(
        (k, idx) => `
    <details class="oral-knowledge-card"${idx === 0 ? " open" : ""}>
      <summary>
        <span class="oral-knowledge-idx">${idx + 1}</span>
        <span class="oral-knowledge-main">
          <span class="oral-knowledge-title">${escapeHtml(k.title)}</span>
          <span class="oral-knowledge-summary">${escapeHtml(k.summary)}</span>
        </span>
      </summary>
      <div class="oral-knowledge-detail">${escapeHtml(k.detail)}</div>
    </details>`
      )
      .join("")}`;
}

window.startOralRecitation = startOralRecitation;
window.setOralMaskMode = setOralMaskMode;
window.setOralPanel = setOralPanel;
window.loadOralScript = loadOralScript;
