// ================= 申论分项刷题模块 =================
// 主观题：读材料 → 作答 → 对照要点 → 自评掌握

let shenlunPracticeList = [];
let shenlunPracticeIndex = 0;
let shenlunAnswerRevealed = false;
let shenlunPracticeMode = "seq";

function escapeShenlunHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatShenlunMultiline(str) {
  return escapeShenlunHtml(str).replace(/\n/g, "<br>");
}

function isShenlunSubject() {
  return currentSubject === "shenlun_practice";
}

function startShenlunPractice(mode, categoryId = null) {
  if (!isShenlunSubject()) {
    selectSubject("shenlun_practice");
  }
  const progress = getActiveProgress();
  shenlunPracticeMode = mode;
  shenlunAnswerRevealed = false;

  let pool = [...QUESTIONS];
  if (mode === "cat" && categoryId) {
    pool = pool.filter(q => q.category === categoryId);
  } else if (mode === "undone") {
    pool = pool.filter(q => !isQuestionAnswered(q.id, progress));
  } else if (mode === "redo") {
    pool = pool.filter(q => progress.mistakes.includes(q.id));
    if (pool.length === 0) {
      alert("当前没有标记为「需再练」的题目。");
      return;
    }
  }

  if (mode === "seq" || mode === "cat" || mode === "undone") {
    pool = preparePracticeQuestions(pool, progress, mode === "cat" ? "cat" : mode === "undone" ? "rand" : "seq");
  } else if (mode === "rand") {
    pool = preparePracticeQuestions(pool, progress, "rand");
  } else if (mode === "redo") {
    pool = shuffleArray(pool);
  }

  if (mode !== "exam" && typeof practiceLimit !== "undefined" && practiceLimit !== "all") {
    const limit = parseInt(practiceLimit, 10);
    if (!Number.isNaN(limit)) pool = pool.slice(0, limit);
  }

  if (pool.length === 0) {
    alert(mode === "undone" ? "太棒了！未刷题目已全部攻克。" : "暂无题目。");
    return;
  }

  shenlunPracticeList = pool;
  shenlunPracticeIndex = 0;
  if (typeof startPracticeTimer === "function") {
    startPracticeTimer("shenlun-timer", "shenlun-timer-text");
  }
  switchScreen("shenlun-practice");
  renderShenlunPracticeQuestion();
}

function showShenlunCategoryPicker() {
  if (!isShenlunSubject()) selectSubject("shenlun_practice");
  const container = document.getElementById("category-list-container");
  if (!container) return;
  container.innerHTML = "";
  const progress = getActiveProgress();
  (SUBJECT_DATA.shenlun_practice.categories || []).forEach(cat => {
    const catQuestions = QUESTIONS.filter(q => q.category === cat.id);
    const counts = getSubjectProgressCounts(catQuestions, progress);
    const card = document.createElement("div");
    card.className = "cat-card";
    card.onclick = () => startShenlunPractice("cat", cat.id);
    card.innerHTML = `
      <div class="cat-info">
        <span class="cat-title">${escapeShenlunHtml(cat.name)}</span>
        <span class="cat-count">已练 ${counts.done} · 未练 ${counts.undone} · 共 ${counts.total} 题</span>
      </div>
      <div class="cat-go">→</div>
    `;
    container.appendChild(card);
  });
  switchScreen("category-picker");
}

function renderShenlunPracticeQuestion() {
  const q = shenlunPracticeList[shenlunPracticeIndex];
  if (!q) {
    finishShenlunPractice();
    return;
  }

  shenlunAnswerRevealed = false;
  const progress = getActiveProgress();
  const answered = isQuestionAnswered(q.id, progress);

  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setText("shenlun-badge-category", q.categoryName || "申论");
  setText("shenlun-progress-text", `${shenlunPracticeIndex + 1} / ${shenlunPracticeList.length}`);
  setText("shenlun-q-source", q.source ? `来源：${q.source}` : "");
  setText("shenlun-q-meta", [
    q.score != null ? `${q.score}分` : "",
    q.wordLimit || "",
    answered ? "已练" : "未练",
  ].filter(Boolean).join(" · "));

  const bar = document.getElementById("shenlun-progress-bar");
  if (bar) {
    bar.style.width = `${(shenlunPracticeIndex / Math.max(shenlunPracticeList.length, 1)) * 100}%`;
  }

  const stemEl = document.getElementById("shenlun-q-stem");
  if (stemEl) stemEl.innerHTML = formatShenlunMultiline(q.stem || q.question);

  const reqEl = document.getElementById("shenlun-q-requirements");
  if (reqEl) {
    if (q.requirements) {
      reqEl.style.display = "block";
      reqEl.innerHTML = `<strong>要求：</strong>${formatShenlunMultiline(q.requirements)}`;
    } else {
      reqEl.style.display = "none";
    }
  }

  const matEl = document.getElementById("shenlun-q-materials");
  if (matEl) {
    matEl.innerHTML = q.materials
      ? formatShenlunMultiline(q.materials)
      : "<span style='color:var(--text-muted)'>本题材料请结合题干要求作答。</span>";
  }

  const tipsEl = document.getElementById("shenlun-q-tips");
  if (tipsEl) {
    tipsEl.textContent = q.reviewTips || "先读材料分层找点，再对照参考答案自评。";
  }

  const input = document.getElementById("shenlun-user-answer");
  if (input) {
    const saved = (progress.answers[q.id] && progress.answers[q.id].userText) || "";
    input.value = saved;
    input.disabled = false;
  }

  const ansPanel = document.getElementById("shenlun-answer-panel");
  if (ansPanel) ansPanel.style.display = "none";

  const revealBtn = document.getElementById("btn-shenlun-reveal");
  if (revealBtn) {
    revealBtn.style.display = "block";
    revealBtn.textContent = "查看参考答案";
  }

  const rateBar = document.getElementById("shenlun-rate-bar");
  if (rateBar) rateBar.style.display = "none";

  const favBtn = document.getElementById("btn-shenlun-favorite");
  if (favBtn) {
    favBtn.classList.toggle("active-favorite", progress.favorites.includes(q.id));
  }

  const prevBtn = document.getElementById("btn-shenlun-prev");
  if (prevBtn) prevBtn.style.display = shenlunPracticeIndex > 0 ? "block" : "none";

  // 滚动到顶部
  const screen = document.getElementById("screen-shenlun-practice");
  if (screen) screen.scrollTop = 0;
  const scrollBox = document.getElementById("shenlun-scroll-body");
  if (scrollBox) scrollBox.scrollTop = 0;
}

function revealShenlunAnswer() {
  const q = shenlunPracticeList[shenlunPracticeIndex];
  if (!q) return;

  shenlunAnswerRevealed = true;
  const panel = document.getElementById("shenlun-answer-panel");
  const content = document.getElementById("shenlun-answer-content");
  const points = document.getElementById("shenlun-keypoints");
  const note = document.getElementById("shenlun-answer-note");

  if (content) content.innerHTML = formatShenlunMultiline(q.answer || "暂无参考答案");
  if (points) {
    if (q.keyPoints && q.keyPoints.length) {
      points.innerHTML = "<strong>要点清单：</strong><ol style='margin:8px 0 0 18px;padding:0;'>"
        + q.keyPoints.map(p => `<li style="margin-bottom:6px;">${escapeShenlunHtml(p)}</li>`).join("")
        + "</ol>";
      points.style.display = "block";
    } else {
      points.style.display = "none";
    }
  }
  if (note) {
    if (q.answerNote) {
      note.style.display = "block";
      note.textContent = q.answerNote;
    } else {
      note.style.display = "none";
    }
  }
  if (panel) panel.style.display = "block";

  const revealBtn = document.getElementById("btn-shenlun-reveal");
  if (revealBtn) revealBtn.style.display = "none";

  const rateBar = document.getElementById("shenlun-rate-bar");
  if (rateBar) rateBar.style.display = "flex";

  // 自动保存用户草稿
  persistShenlunDraft();
}

function persistShenlunDraft() {
  const q = shenlunPracticeList[shenlunPracticeIndex];
  if (!q) return;
  const progress = getActiveProgress();
  const input = document.getElementById("shenlun-user-answer");
  const userText = input ? input.value : "";
  const prev = progress.answers[q.id] || {};
  progress.answers[q.id] = {
    ...prev,
    userText,
    count: (prev.count || 0),
    correct: prev.correct,
    updatedAt: new Date().toISOString(),
  };
  if (typeof saveProgress === "function") saveProgress();
}

function rateShenlunPractice(level) {
  // level: mastered | review | hard
  const q = shenlunPracticeList[shenlunPracticeIndex];
  if (!q) return;
  const progress = getActiveProgress();
  const input = document.getElementById("shenlun-user-answer");
  const userText = input ? input.value : "";

  const correct = level === "mastered";
  progress.answers[q.id] = {
    correct,
    count: ((progress.answers[q.id] && progress.answers[q.id].count) || 0) + 1,
    userText,
    level,
    updatedAt: new Date().toISOString(),
  };

  // 错题本：未掌握 / 再练
  const idx = progress.mistakes.indexOf(q.id);
  if (level === "mastered") {
    if (idx >= 0) progress.mistakes.splice(idx, 1);
  } else if (idx < 0) {
    progress.mistakes.push(q.id);
  }

  if (typeof saveProgress === "function") saveProgress();
  if (typeof updateHomeStats === "function") updateHomeStats();

  // 下一题
  shenlunNextQuestion();
}

function shenlunNextQuestion() {
  if (shenlunPracticeIndex >= shenlunPracticeList.length - 1) {
    finishShenlunPractice();
    return;
  }
  shenlunPracticeIndex += 1;
  renderShenlunPracticeQuestion();
}

function shenlunPrevQuestion() {
  if (shenlunPracticeIndex <= 0) return;
  persistShenlunDraft();
  shenlunPracticeIndex -= 1;
  renderShenlunPracticeQuestion();
}

function toggleShenlunFavorite() {
  const q = shenlunPracticeList[shenlunPracticeIndex];
  if (!q) return;
  const progress = getActiveProgress();
  const idx = progress.favorites.indexOf(q.id);
  if (idx >= 0) progress.favorites.splice(idx, 1);
  else progress.favorites.push(q.id);
  if (typeof saveProgress === "function") saveProgress();
  const favBtn = document.getElementById("btn-shenlun-favorite");
  if (favBtn) favBtn.classList.toggle("active-favorite", progress.favorites.includes(q.id));
}

function finishShenlunPractice() {
  if (typeof stopPracticeTimer === "function") stopPracticeTimer();
  const progress = getActiveProgress();
  const done = shenlunPracticeList.filter(q => isQuestionAnswered(q.id, progress)).length;
  alert(`本轮练习结束！\n本轮 ${shenlunPracticeList.length} 题，已记录 ${done} 题进度。\n可在错题本复习标记为「再练」的题目。`);
  switchScreen("home");
  if (typeof updateHomeStats === "function") updateHomeStats();
}

function quitShenlunPractice() {
  persistShenlunDraft();
  if (typeof stopPracticeTimer === "function") stopPracticeTimer();
  switchScreen("home");
}

// 拦截标准刷题入口：申论科目走主观题流程
(function patchShenlunPracticeEntry() {
  const originalStart = window.startPractice;
  window.startPractice = function (mode, categoryId) {
    if (currentSubject === "shenlun_practice") {
      if (mode === "exam") {
        alert("申论主观题暂不支持限时模考，请使用顺序/随机/按题型练习。");
        return;
      }
      startShenlunPractice(mode === "cat" ? "cat" : mode, categoryId);
      return;
    }
    return originalStart.apply(this, arguments);
  };

  const originalUndone = window.startUndonePractice;
  window.startUndonePractice = function () {
    if (currentSubject === "shenlun_practice") {
      startShenlunPractice("undone");
      return;
    }
    return originalUndone.apply(this, arguments);
  };

  const originalCat = window.showCategoryPicker;
  window.showCategoryPicker = function () {
    if (currentSubject === "shenlun_practice") {
      showShenlunCategoryPicker();
      return;
    }
    return originalCat.apply(this, arguments);
  };
})();
