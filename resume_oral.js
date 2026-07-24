// 实习与项目 · 面试口述背诵（关键句/技术词显隐，对齐申论范文挖空）

let oralMaskMode = "all-mask"; // all-mask | key | tech | reveal
let currentOralScript = null;

function getOralScripts() {
  if (typeof RESUME_ORAL_SCRIPTS !== "undefined" && Array.isArray(RESUME_ORAL_SCRIPTS)) {
    return RESUME_ORAL_SCRIPTS;
  }
  const data = typeof SUBJECT_DATA !== "undefined" ? SUBJECT_DATA.resume_projects : null;
  return (data && data.oralScripts) || [];
}

function oralMaskLabel(type) {
  if (type === "tech") return "技术词";
  return "关键句";
}

async function startOralRecitation() {
  const scripts = getOralScripts();
  if (!scripts.length) {
    alert("暂无口述稿数据");
    return;
  }

  currentMode = "oral_recitation";
  currentSubject = "resume_projects";

  const selector = document.getElementById("oral-script-selector");
  const bodyView = document.getElementById("oral-body-view");
  if (!selector || !bodyView) return;

  selector.innerHTML = "";
  scripts.forEach((script, idx) => {
    const opt = document.createElement("option");
    opt.value = script.id;
    opt.textContent = `${idx + 1}. ${script.title}`;
    selector.appendChild(opt);
  });

  if (!selector.dataset.bound) {
    selector.addEventListener("change", (e) => {
      loadOralScript(e.target.value);
    });
    selector.dataset.bound = "true";
  }

  if (!bodyView.dataset.bound) {
    bodyView.addEventListener("click", (e) => {
      const btn = e.target.closest(".essay-mask-btn, .oral-mask-btn");
      if (!btn) return;
      const text = btn.getAttribute("data-text");
      const type = btn.getAttribute("data-type");
      if (btn.classList.contains("revealed")) {
        btn.classList.remove("revealed");
        btn.textContent = `🔑 显隐${oralMaskLabel(type)}`;
      } else {
        btn.classList.add("revealed");
        btn.textContent = text;
      }
    });
    bodyView.dataset.bound = "true";
  }

  oralMaskMode = "all-mask";
  setOralMaskMode("all-mask");

  selector.value = scripts[0].id;
  loadOralScript(scripts[0].id);

  if (typeof startPracticeTimer === "function") {
    startPracticeTimer("oral-timer", "oral-timer-text");
  }

  if (typeof switchScreen === "function") {
    switchScreen("oral-recitation");
  }
}

function loadOralScript(scriptId) {
  const script = getOralScripts().find((s) => s.id === scriptId);
  if (!script) return;
  currentOralScript = script;

  const titleEl = document.getElementById("oral-title-view");
  const metaEl = document.getElementById("oral-meta-view");
  if (titleEl) titleEl.textContent = script.title;
  if (metaEl) {
    metaEl.textContent = `${script.projectName || ""} · ${script.oneLiner || ""}`;
  }

  renderOralBody();
  renderOralKnowledge();
}

function setOralMaskMode(mode) {
  oralMaskMode = mode;
  ["all-mask", "key", "tech", "reveal"].forEach((m) => {
    const btn = document.getElementById(`oral-mode-${m}`);
    if (!btn) return;
    btn.classList.toggle("active", m === mode);
  });
  renderOralBody();
}

function renderOralBody() {
  if (!currentOralScript) return;
  const container = document.getElementById("oral-body-view");
  if (!container) return;
  container.innerHTML = "";

  currentOralScript.paragraphs.forEach((para) => {
    const wrap = document.createElement("div");
    wrap.className = "oral-para-block";

    if (para.label) {
      const tag = document.createElement("div");
      tag.className = "oral-para-label";
      tag.textContent = para.label;
      wrap.appendChild(tag);
    }

    const pEl = document.createElement("p");
    let text = para.text;
    const masks = (para.masks || []).slice().sort((a, b) => b.text.length - a.text.length);

    masks.forEach((mask) => {
      if (!mask.text || !text.includes(mask.text)) return;
      const escapedText = mask.text.replace(/"/g, "&quot;");
      const label = oralMaskLabel(mask.type);

      let shouldHide = false;
      if (oralMaskMode === "all-mask") shouldHide = true;
      else if (oralMaskMode === "key" && mask.type === "key") shouldHide = true;
      else if (oralMaskMode === "tech" && mask.type === "tech") shouldHide = true;

      const htmlRepl = shouldHide
        ? `<span class="essay-mask-btn oral-mask-btn" data-text="${escapedText}" data-type="${mask.type}">🔑 显隐${label}</span>`
        : `<span class="essay-mask-btn oral-mask-btn revealed" data-text="${escapedText}" data-type="${mask.type}">${mask.text}</span>`;

      text = text.replace(mask.text, htmlRepl);
    });

    pEl.innerHTML = text;
    wrap.appendChild(pEl);
    container.appendChild(wrap);
  });
}

function renderOralKnowledge() {
  const box = document.getElementById("oral-knowledge-view");
  if (!box) return;
  const list = (currentOralScript && currentOralScript.knowledge) || [];
  if (!list.length) {
    box.innerHTML = '<div class="oral-knowledge-empty">本篇暂无延伸知识点</div>';
    return;
  }

  box.innerHTML = list
    .map(
      (k, idx) => `
    <details class="oral-knowledge-card" ${idx === 0 ? "open" : ""}>
      <summary>
        <span class="oral-knowledge-title">${k.title}</span>
        <span class="oral-knowledge-summary">${k.summary}</span>
      </summary>
      <div class="oral-knowledge-detail">${k.detail}</div>
    </details>`
    )
    .join("");
}

// 暴露给 HTML onclick
window.startOralRecitation = startOralRecitation;
window.setOralMaskMode = setOralMaskMode;
window.loadOralScript = loadOralScript;
