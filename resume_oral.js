// 实习与项目 · 面试口述背诵
// 两步流 + 挖空显隐 + 名词点击释义

let oralMaskMode = "all-mask";
let oralPanel = "script";
let oralStep = "pick";
let currentOralScript = null;
let oralProjectFilter = "momenta";
let oralTermMap = {};

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

function escapeAttr(s) {
  return escapeHtml(s).replace(/'/g, "&#39;");
}

function getScriptTerms(script) {
  const list = [];
  const seen = new Set();
  const add = (t) => {
    if (!t || !t.term) return;
    const id = t.id || t.term;
    if (seen.has(id)) return;
    seen.add(id);
    list.push({
      id,
      term: t.term,
      title: t.title || t.term,
      summary: t.summary || "",
      detail: t.detail || ""
    });
  };

  (script.terms || []).forEach(add);
  (script.knowledge || []).forEach((k) => {
    const short = (k.title || "").split(/[（(]/)[0].trim();
    if (short.length >= 2) add({ id: k.id, term: short, title: k.title, summary: k.summary, detail: k.detail });
    // 知识标题里斜杠分隔的拆词（如 穿透 / 击穿 / 雪崩）
    (k.title || "").split(/[/／、]/).forEach((part) => {
      const p = part.trim();
      if (p.length >= 2 && p.length <= 12) add({ id: `${k.id}_${p}`, term: p, title: k.title, summary: k.summary, detail: k.detail });
    });
  });

  // 综合篇：合并各实习/项目全部名词
  if (script.id === "oral_combo" || script.project === "skills") {
    getOralScripts().forEach((s) => {
      if (s.id === script.id) return;
      (s.terms || []).forEach(add);
      (s.knowledge || []).forEach((k) => {
        const short = (k.title || "").split(/[（(]/)[0].trim();
        if (short.length >= 2) add({ id: `combo_${k.id}`, term: short, title: k.title, summary: k.summary, detail: k.detail });
      });
    });
  }

  if (typeof RESUME_ORAL_COMMON_TERMS !== "undefined" && Array.isArray(RESUME_ORAL_COMMON_TERMS)) {
    RESUME_ORAL_COMMON_TERMS.forEach(add);
  }

  return list.sort((a, b) => b.term.length - a.term.length);
}

function buildTermMap(script) {
  const map = {};
  getScriptTerms(script).forEach((t) => {
    map[t.id] = t;
  });
  return map;
}

async function startOralRecitation() {
  const scripts = getOralScripts();
  if (!scripts.length) {
    alert("暂无口述稿数据");
    return;
  }

  currentMode = "oral_recitation";
  if (typeof currentSubject !== "undefined") currentSubject = "resume_projects";

  oralProjectFilter = scripts[0].project || "momenta";
  oralStep = "pick";
  oralPanel = "script";
  oralMaskMode = "all-mask";
  currentOralScript = null;
  oralTermMap = {};

  bindOralEventsOnce();
  showOralStep("pick");
  renderOralProjectChips();
  renderOralScriptList();
  closeOralTermPopup();

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
      const termBtn = e.target.closest(".oral-term-btn");
      if (termBtn) {
        e.preventDefault();
        e.stopPropagation();
        showOralTermPopup(termBtn.getAttribute("data-term-id"));
        return;
      }
      const maskBtn = e.target.closest(".oral-mask-btn");
      if (!maskBtn) return;
      const text = maskBtn.getAttribute("data-text") || "";
      const type = maskBtn.getAttribute("data-type") || "key";
      if (maskBtn.classList.contains("revealed")) {
        maskBtn.classList.remove("revealed");
        maskBtn.innerHTML = `🔑 ${oralMaskLabel(type)}`;
      } else {
        maskBtn.classList.add("revealed");
        const terms = getScriptTerms(currentOralScript || {});
        maskBtn.innerHTML = linkTermsInPlainText(text, terms);
      }
    });
    bodyView.dataset.bound = "true";
  }

  const popup = document.getElementById("oral-term-popup");
  if (popup && !popup.dataset.bound) {
    popup.addEventListener("click", (e) => {
      if (e.target.classList.contains("oral-term-popup-backdrop")) closeOralTermPopup();
    });
    popup.dataset.bound = "true";
  }
}

function showOralStep(step) {
  oralStep = step === "recite" ? "recite" : "pick";
  const pick = document.getElementById("oral-step-pick");
  const recite = document.getElementById("oral-step-recite");
  if (pick) pick.hidden = oralStep !== "pick";
  if (recite) recite.hidden = oralStep !== "recite";
  const screen = document.getElementById("screen-oral-recitation");
  if (screen) screen.scrollTop = 0;
  if (oralStep === "pick") closeOralTermPopup();
}

function renderOralProjectChips() {
  const bar = document.getElementById("oral-project-chips");
  if (!bar) return;
  const cats = getOralCategories();

  bar.innerHTML = cats
    .map((c) => {
      const short = c.name.replace(/^实习·|^项目·/, "");
      const active = c.id === oralProjectFilter ? " active" : "";
      return `<button type="button" class="oral-chip${active}" data-project="${c.id}">${escapeHtml(short)}</button>`;
    })
    .join("");

  bar.querySelectorAll(".oral-chip").forEach((btn) => {
    btn.onclick = () => {
      oralProjectFilter = btn.getAttribute("data-project") || oralProjectFilter;
      renderOralProjectChips();
      renderOralScriptList();
    };
  });
}

function filteredOralScripts() {
  return getOralScripts().filter((s) => s.project === oralProjectFilter);
}

function renderOralScriptList() {
  const listEl = document.getElementById("oral-script-list");
  if (!listEl) return;
  let scripts = filteredOralScripts();
  if (!scripts.length) scripts = getOralScripts();

  listEl.innerHTML = scripts
    .map(
      (s) => `
    <button type="button" class="oral-script-item" data-id="${escapeHtml(s.id)}">
      <span class="oral-script-item-title">${escapeHtml(s.title)}</span>
      <span class="oral-script-item-desc">${escapeHtml(s.oneLiner || "")}</span>
      <span class="oral-script-item-go">开始背诵 →</span>
    </button>`
    )
    .join("");

  listEl.querySelectorAll(".oral-script-item").forEach((btn) => {
    btn.onclick = () => openOralRecite(btn.getAttribute("data-id"));
  });
}

function openOralRecite(scriptId) {
  const script = getOralScripts().find((s) => s.id === scriptId);
  if (!script) return;
  currentOralScript = script;
  oralTermMap = buildTermMap(script);
  oralPanel = "script";
  oralMaskMode = "all-mask";

  const titleEl = document.getElementById("oral-title-view");
  const metaEl = document.getElementById("oral-meta-view");
  const badgeEl = document.getElementById("oral-project-badge");
  if (titleEl) titleEl.textContent = script.title;
  if (metaEl) metaEl.textContent = script.oneLiner || "";
  if (badgeEl) badgeEl.textContent = script.projectName || "";

  setOralPanel("script");
  setOralMaskMode("all-mask");
  renderOralBody();
  renderOralKnowledge();
  updateOralKnowCount();
  showOralStep("recite");
}

function backToOralPick() {
  closeOralTermPopup();
  showOralStep("pick");
  renderOralProjectChips();
  renderOralScriptList();
}

function updateOralKnowCount() {
  const el = document.getElementById("oral-panel-know-count");
  if (!el || !currentOralScript) return;
  el.textContent = String((currentOralScript.knowledge || []).length);
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

function shouldHideMask(type) {
  if (oralMaskMode === "all-mask") return true;
  if (oralMaskMode === "key" && type === "key") return true;
  if (oralMaskMode === "tech" && type === "tech") return true;
  return false;
}

/** 在纯文本段里把名词包成可点击按钮（长词优先） */
function linkTermsInPlainText(text, terms) {
  let segments = [{ type: "plain", text }];
  (terms || []).forEach((term) => {
    const newSegs = [];
    segments.forEach((seg) => {
      if (seg.type !== "plain") {
        newSegs.push(seg);
        return;
      }
      let remaining = seg.text;
      let idx;
      while ((idx = remaining.indexOf(term.term)) !== -1) {
        if (idx > 0) newSegs.push({ type: "plain", text: remaining.slice(0, idx) });
        newSegs.push({ type: "term", term });
        remaining = remaining.slice(idx + term.term.length);
      }
      if (remaining) newSegs.push({ type: "plain", text: remaining });
    });
    segments = newSegs;
  });

  return segments
    .map((seg) => {
      if (seg.type === "term") {
        const t = seg.term;
        return `<button type="button" class="oral-term-btn" data-term-id="${escapeAttr(t.id)}">${escapeHtml(t.term)}</button>`;
      }
      return escapeHtml(seg.text);
    })
    .join("");
}

function buildParagraphHtml(text, masks, terms) {
  let parts = [{ type: "plain", text }];
  const sortedMasks = (masks || []).slice().sort((a, b) => b.text.length - a.text.length);

  sortedMasks.forEach((mask) => {
    const next = [];
    parts.forEach((part) => {
      if (part.type !== "plain") {
        next.push(part);
        return;
      }
      let remaining = part.text;
      let idx;
      while ((idx = remaining.indexOf(mask.text)) !== -1) {
        if (idx > 0) next.push({ type: "plain", text: remaining.slice(0, idx) });
        next.push({ type: "mask", mask });
        remaining = remaining.slice(idx + mask.text.length);
      }
      if (remaining) next.push({ type: "plain", text: remaining });
    });
    parts = next;
  });

  return parts
    .map((part) => {
      if (part.type === "mask") {
        const m = part.mask;
        const attrText = m.text.replace(/"/g, "&quot;");
        if (shouldHideMask(m.type)) {
          return `<span class="oral-mask-btn" data-text="${attrText}" data-type="${m.type}">🔑 ${oralMaskLabel(m.type)}</span>`;
        }
        return `<span class="oral-mask-btn revealed" data-text="${attrText}" data-type="${m.type}">${linkTermsInPlainText(m.text, terms)}</span>`;
      }
      return linkTermsInPlainText(part.text, terms);
    })
    .join("");
}

function renderOralBody() {
  if (!currentOralScript) return;
  const container = document.getElementById("oral-body-view");
  if (!container) return;
  container.innerHTML = "";

  const terms = getScriptTerms(currentOralScript);
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
    pEl.innerHTML = buildParagraphHtml(para.text, para.masks, terms);
    wrap.appendChild(pEl);
    container.appendChild(wrap);
  });
}

function renderOralKnowledge() {
  const box = document.getElementById("oral-knowledge-view");
  if (!box) return;
  const list = (currentOralScript && currentOralScript.knowledge) || [];
  if (!list.length) {
    box.innerHTML = '<div class="oral-knowledge-empty">本篇暂无延伸知识点。</div>';
    return;
  }

  box.innerHTML = `
    <div class="oral-knowledge-intro">仅属于「${escapeHtml(currentOralScript.title)}」</div>
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

function showOralTermPopup(termId) {
  const t = oralTermMap[termId];
  if (!t) return;
  const popup = document.getElementById("oral-term-popup");
  const titleEl = document.getElementById("oral-term-popup-title");
  const sumEl = document.getElementById("oral-term-popup-summary");
  const detEl = document.getElementById("oral-term-popup-detail");
  if (!popup || !titleEl) return;
  titleEl.textContent = t.title || t.term;
  if (sumEl) sumEl.textContent = t.summary || "";
  if (detEl) detEl.textContent = t.detail || "";
  popup.hidden = false;
  document.body.classList.add("oral-term-open");
}

function closeOralTermPopup() {
  const popup = document.getElementById("oral-term-popup");
  if (popup) popup.hidden = true;
  document.body.classList.remove("oral-term-open");
}

window.startOralRecitation = startOralRecitation;
window.setOralMaskMode = setOralMaskMode;
window.setOralPanel = setOralPanel;
window.backToOralPick = backToOralPick;
window.openOralRecite = openOralRecite;
window.closeOralTermPopup = closeOralTermPopup;
