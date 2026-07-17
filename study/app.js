// ================= 1. 状态管理 =================
let userProgress = {
  beijing: {
    answers: {},     // qId -> { correct: boolean, count: number }
    mistakes: [],    // 错题ID列表
    favorites: []    // 收藏题ID列表
  },
  logic_600: {
    answers: {},
    mistakes: [],
    favorites: []
  },
  passage_600: {
    answers: {},
    mistakes: [],
    favorites: []
  },
  idioms: {
    answers: {},
    mistakes: [],
    favorites: []
  },
  politics: {
    answers: {},
    mistakes: [],
    favorites: []
  },
  theory: {
    answers: {},
    mistakes: [],
    favorites: []
  },
  quant: {
    answers: {},
    mistakes: [],
    favorites: []
  },
  checkInDays: [], // 签到日期列表 "YYYY-MM-DD"
  streak: 0        // 连续签到天数
};

// 账号系统状态
let currentUser = null;
let allUsers = {};

// 检测是否运行在本地 Node 服务器（node server.js），以决定用 API 还是 localStorage
let IS_LOCAL_SERVER = false;

async function detectServerMode() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2000);
  try {
    const res  = await fetch('/api/ping', { signal: controller.signal });
    const data = await res.json();
    return data.ok === true;
  } catch (e) {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

// 运行时状态
let currentSubject = "beijing"; // beijing | idioms | politics | theory
let QUESTIONS = [];
let FACTS = [];
let currentMode = "seq"; // seq, rand, cat, exam, redo
let currentQuestions = [];
let currentIndex = 0;
let selectedAnswers = []; // 用于多选暂存
let hasSubmitted = false;

// 模拟考试专用计时变量
let examStartTime = 0;
let examTimer = null;
let examTimeUsed = 0;
let examCorrectCount = 0;

// 每次练习量限制与计时变量
let practiceLimit = "all";
let sessionCorrectCount = 0;
let sessionAnsweredCount = 0;
let lastPracticeSetup = { mode: "rand", categoryId: null, singleQId: null };
let progressFilter = "all"; // all=优先未刷 | undone=仅未刷 | done=仅已刷
let questionBankTab = "all";
let practiceSeconds = 0;
let practiceTimerInterval = null;

// 每日金句（习主席语录，按日期轮换）
const DAILY_MOTIVATIONS = [
  "人民对美好生活的向往，就是我们的奋斗目标。——习近平",
  "空谈误国，实干兴邦。——习近平",
  "实现中华民族伟大复兴，就是中华民族近代以来最伟大的梦想。——习近平",
  "不忘初心，方得始终。——习近平",
  "幸福都是奋斗出来的。——习近平",
  "绿水青山就是金山银山。——习近平",
  "打铁必须自身硬。——习近平",
  "撸起袖子加油干。——习近平",
  "中国梦归根到底是人民的梦。——习近平",
  "踏石留印，抓铁有痕。——习近平",
  "一分部署，九分落实。——习近平",
  "行百里者半九十。——习近平",
  "惟改革者进，惟创新者强，惟改革创新者胜。——习近平",
  "国无德不兴，人无德不立。——习近平",
  "小康不小康，关键看老乡。——习近平",
  "鞋子合不合脚，自己穿了才知道。——习近平",
  "人心是最大的政治。——习近平",
  "时代是出卷人，我们是答卷人，人民是阅卷人。——习近平",
  "伟大出自平凡，平凡造就伟大。——习近平",
  "奋斗是青春最亮丽的底色。——习近平",
  "一个有希望的民族不能没有英雄，一个有前途的国家不能没有先锋。——习近平",
  "理想信念是共产党人精神上的'钙'。——习近平",
  "我将无我，不负人民。——习近平",
  "江山就是人民，人民就是江山。——习近平",
  "国泰民安是人民群众最基本、最普遍的愿望。——习近平",
  "科技是国家强盛之基，创新是民族进步之魂。——习近平",
  "读书可以让人保持思想活力，让人得到智慧启发，让人滋养浩然之气。——习近平",
  "青年一代有理想、有本领、有担当，国家就有前途，民族就有希望。——习近平",
  "文化自信是一个国家、一个民族发展中更基本、更深沉、更持久的力量。——习近平",
  "统一战线是党的事业取得胜利的重要法宝。——习近平",
  "全面小康路上一个都不能少。——习近平",
  "治国必先治党，治党务必从严。——习近平"
];

let quizSwipeState = { startX: 0, startY: 0, tracking: false };

function startPracticeTimer(timerElId = "quiz-timer", textElId = "quiz-timer-text") {
  stopPracticeTimer();
  practiceSeconds = 0;
  const timerEl = document.getElementById(timerElId);
  const timerText = document.getElementById(textElId);
  if (timerEl) timerEl.style.display = "flex";
  if (timerText) timerText.textContent = "00:00";
  
  practiceTimerInterval = setInterval(() => {
    practiceSeconds++;
    const mins = Math.floor(practiceSeconds / 60);
    const secs = practiceSeconds % 60;
    if (timerText) {
      timerText.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  }, 1000);
}

function stopPracticeTimer() {
  if (practiceTimerInterval) {
    clearInterval(practiceTimerInterval);
    practiceTimerInterval = null;
  }
  const timerIds = ["quiz-timer", "timeline-timer", "match-timer", "reading-timer", "daily-timer"];
  timerIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}

function initPracticeLimit() {
  const container = document.getElementById("practice-limit-options");
  if (!container) return;

  loadPracticeLimit(currentSubject);
  
  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".limit-btn");
    if (!btn) return;
    
    container.querySelectorAll(".limit-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    
    practiceLimit = btn.getAttribute("data-limit");
    savePracticeLimit(practiceLimit);
  });
}

function getPracticeLimitKey(subjectId = currentSubject) {
  return `beijing_quiz_practice_limit_${subjectId}`;
}

function loadPracticeLimit(subjectId = currentSubject) {
  const saved = localStorage.getItem(getPracticeLimitKey(subjectId));
  const valid = ["all", "5", "10", "15", "20", "30", "35"];
  practiceLimit = valid.includes(saved) ? saved : "all";
  syncPracticeLimitUI();
}

function savePracticeLimit(limit = practiceLimit) {
  practiceLimit = limit;
  localStorage.setItem(getPracticeLimitKey(currentSubject), limit);
  syncPracticeLimitUI();
}

function syncPracticeLimitUI() {
  const container = document.getElementById("practice-limit-options");
  if (!container) return;
  container.querySelectorAll(".limit-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-limit") === practiceLimit);
  });
}

function getPracticeLimitLabel(limit = practiceLimit) {
  return limit === "all" ? "全部" : `每次 ${limit} 题`;
}

function getPracticeModeLabel(mode = lastPracticeSetup.mode) {
  const labels = {
    seq: "顺序练习",
    rand: "随机测试",
    cat: "章节练习",
    redo: "错题复盘",
    "redo-single": "单题练习",
    exam: "模拟考试"
  };
  return labels[mode] || "练习";
}

function getProgressFilterLabel(filter = progressFilter) {
  const labels = { all: "优先未刷", undone: "仅未刷", done: "仅已刷" };
  return labels[filter] || labels.all;
}

function getProgressFilterKey(subjectId = currentSubject) {
  return `beijing_quiz_progress_filter_${subjectId}`;
}

function loadProgressFilter(subjectId = currentSubject) {
  const saved = localStorage.getItem(getProgressFilterKey(subjectId));
  progressFilter = saved === "undone" || saved === "done" ? saved : "all";
  syncProgressFilterUI();
}

function saveProgressFilter(filter) {
  progressFilter = filter;
  localStorage.setItem(getProgressFilterKey(currentSubject), filter);
  syncProgressFilterUI();
  updateHomeStats();
}

function syncProgressFilterUI() {
  const container = document.getElementById("progress-filter-options");
  if (!container) return;
  container.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-filter") === progressFilter);
  });
}

function initProgressFilter() {
  const container = document.getElementById("progress-filter-options");
  if (!container) return;

  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    saveProgressFilter(btn.getAttribute("data-filter"));
  });

  loadProgressFilter(currentSubject);
}

function isQuestionAnswered(qId, progress = getActiveProgress()) {
  return !!(progress.answers && progress.answers[qId]);
}

function getSubjectProgressCounts(questions = QUESTIONS, progress = getActiveProgress()) {
  const done = questions.filter(q => isQuestionAnswered(q.id, progress)).length;
  return { done, undone: questions.length - done, total: questions.length };
}

function filterQuestionsByProgress(questions, progress, filter = progressFilter) {
  if (filter === "undone") return questions.filter(q => !isQuestionAnswered(q.id, progress));
  if (filter === "done") return questions.filter(q => isQuestionAnswered(q.id, progress));
  return [...questions];
}

function prioritizeUnanswered(questions, progress) {
  const undone = questions.filter(q => !isQuestionAnswered(q.id, progress));
  const done = questions.filter(q => isQuestionAnswered(q.id, progress));
  return [...shuffleArray([...undone]), ...shuffleArray([...done])];
}

function preparePracticeQuestions(questions, progress, mode, filter = progressFilter) {
  let pool = filterQuestionsByProgress(questions, progress, filter);

  if (mode === "seq") {
    const undone = pool.filter(q => !isQuestionAnswered(q.id, progress)).sort((a, b) => a.id - b.id);
    const done = pool.filter(q => isQuestionAnswered(q.id, progress)).sort((a, b) => a.id - b.id);
    return filter === "done" ? done : filter === "undone" ? undone : [...undone, ...done];
  }

  if (mode === "rand" || mode === "cat") {
    if (filter === "done" || filter === "undone") return shuffleArray([...pool]);
    return prioritizeUnanswered(pool, progress);
  }

  if (mode === "exam") {
    const prioritized = filter === "all"
      ? prioritizeUnanswered(pool, progress)
      : shuffleArray([...pool]);
    return prioritized.slice(0, Math.min(prioritized.length, 20));
  }

  return pool;
}

function getPracticeQuestionCount(defaultWhenAll = 15) {
  if (practiceLimit === "all") return defaultWhenAll;
  const n = parseInt(practiceLimit, 10);
  return Number.isFinite(n) && n > 0 ? n : defaultWhenAll;
}

function getProgressFilterEmptyMessage() {
  return {
    all: "当前筛选下暂无题目，试试切换刷题范围。",
    undone: "太棒了！当前模块已全部刷完 🎉",
    done: "您还没有刷过的题目，先去练习吧！"
  };
}

function recordAnswerProgress(q, isCorrect, { removeMistakeOnCorrect = false } = {}) {
  const progress = getActiveProgress();
  if (isCorrect && removeMistakeOnCorrect) {
    progress.mistakes = progress.mistakes.filter(id => id !== q.id);
  } else if (!isCorrect && !progress.mistakes.includes(q.id)) {
    progress.mistakes.push(q.id);
  }
  if (!progress.answers[q.id]) {
    progress.answers[q.id] = { correct: isCorrect, count: 1 };
  } else {
    progress.answers[q.id].correct = isCorrect;
    progress.answers[q.id].count += 1;
  }
  saveProgress();
}

function getModulePracticeItems(subjectId = currentSubject) {
  const data = SUBJECT_DATA[subjectId];
  if (!data) return [];
  const items = [...(data.questions || [])];
  if (data.matchQuestions) items.push(...data.matchQuestions);
  if (data.timelineQuestions) items.push(...data.timelineQuestions);
  if (data.passageQuestions) items.push(...data.passageQuestions);
  return items;
}

function prepareSpecialModeQuestions(questions, { mode = "rand", defaultWhenAll = null } = {}) {
  if (!questions || questions.length === 0) return null;
  const progress = getActiveProgress();
  const filter = progressFilter;
  let pool = preparePracticeQuestions(questions, progress, mode, filter);
  const fallback = defaultWhenAll === null ? questions.length : defaultWhenAll;
  const limit = getPracticeQuestionCount(fallback);
  pool = pool.slice(0, Math.min(limit, pool.length));
  if (pool.length === 0) {
    const emptyMsg = getProgressFilterEmptyMessage();
    alert(emptyMsg[filter] || "暂无题目！");
    return null;
  }
  return pool;
}

function updateQuestionStatusBadge(elementId, q) {
  const el = document.getElementById(elementId);
  if (!el || !q) return;
  const answered = isQuestionAnswered(q.id, getActiveProgress());
  el.textContent = answered ? "已刷" : "未刷";
  el.className = `quiz-answer-status ${answered ? "done" : "undone"}`;
}

// Canvas粒子系统变量
let canvas = null;
let ctx = null;
let particles = [];

// 获取当前活动科目下的学习进度
function getActiveProgress() {
  if (!userProgress[currentSubject]) {
    userProgress[currentSubject] = { answers: {}, mistakes: [], favorites: [] };
  }
  return userProgress[currentSubject];
}

// ================= 2. 页面初始化 =================
window.addEventListener("DOMContentLoaded", async () => {
  // 0. 检测本地服务器模式（须先于 loadProgress）
  try {
    IS_LOCAL_SERVER = await detectServerMode();
    console.log(IS_LOCAL_SERVER ? '[app] 本地服务器模式（users.json）' : '[app] 静态模式（localStorage）');
  } catch (e) {
    IS_LOCAL_SERVER = false;
  }

  // 1. 初始化练习量限制选择器
  try {
    initPracticeLimit();
    initProgressFilter();
  } catch (e) {
    console.error("Failed to init practice selectors:", e);
  }
  
  // 2. 初始化时钟
  try {
    initClock();
  } catch (e) {
    console.error("Failed to init clock:", e);
  }
  
  // 3. 加载账号/进度数据（本地服务器模式走 API，Netlify 走 localStorage）
  try {
    await loadProgress();
  } catch (e) {
    console.error("Failed to load progress:", e);
  }
  
  // 4. 执行每日签到逻辑（仅登录后）
  try {
    if (userProgress) handleDailyCheckIn();
  } catch (e) {
    console.error("Failed to handle daily check-in:", e);
  }
  
  // 5. 绑定切换主题事件
  try {
    document.getElementById("btn-theme-toggle").addEventListener("click", toggleTheme);
  } catch (e) {
    console.error("Failed to bind theme toggle:", e);
  }
  
  // 6. 绑定科目切换下拉列表事件
  try {
    const subjSelector = document.getElementById("subject-selector");
    subjSelector.addEventListener("change", (e) => {
      selectSubject(e.target.value);
    });
    
    // 读取上次记忆的科目
    const savedSubject = localStorage.getItem("beijing_quiz_active_subject");
    if (savedSubject && SUBJECT_DATA[savedSubject]) {
      subjSelector.value = savedSubject;
      selectSubject(savedSubject);
    } else {
      selectSubject("beijing");
    }
  } catch (e) {
    console.error("Failed to bind subject selector:", e);
  }

  // 7. 初始化 Canvas
  try {
    initCanvas();
  } catch (e) {
    console.error("Failed to init canvas:", e);
  }

  // 8. 每日金句 & 刷题手势
  try {
    updateDailyMotivation();
    initQuizGestures();
  } catch (e) {
    console.error("Failed to init motivation/gestures:", e);
  }
});

// 时钟模拟
function initClock() {
  const timeEl = document.getElementById("status-time");
  const updateTime = () => {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    timeEl.textContent = `${hrs}:${mins}`;
  };
  updateTime();
  setInterval(updateTime, 60000);
}

// Canvas初始化
function initCanvas() {
  canvas = document.getElementById("particle-canvas");
  ctx = canvas.getContext("2d");
  
  const resizeCanvas = () => {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  
  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.alpha -= p.decay;
      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// 释放庆祝烟花粒子
function triggerConfetti(x, y) {
  const colors = ["#c0392b", "#d4ac0d", "#2ecc71", "#3498db", "#e74c3c", "#9b59b6"];
  const count = 35;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    particles.push({
      x: x || canvas.width / 2,
      y: y || canvas.height / 3,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      gravity: 0.12,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.015 + 0.01
    });
  }
}

// ================= 3. 科目切换控制 =================
function selectSubject(subjectId) {
  if (!SUBJECT_DATA[subjectId]) return;
  currentSubject = subjectId;
  QUESTIONS = SUBJECT_DATA[subjectId].questions;
  FACTS = SUBJECT_DATA[subjectId].facts || [];
  
  // 动态更新主题色彩
  const viewport = document.querySelector(".app-viewport");
  if (viewport) {
    if (subjectId === "beijing") {
      viewport.style.setProperty("--primary", "#c0392b");
      viewport.style.setProperty("--primary-glow", "rgba(192, 57, 43, 0.15)");
    } else if (subjectId === "logic_600") {
      viewport.style.setProperty("--primary", "#d35400");
      viewport.style.setProperty("--primary-glow", "rgba(211, 84, 0, 0.15)");
    } else if (subjectId === "passage_600") {
      viewport.style.setProperty("--primary", "#8e44ad");
      viewport.style.setProperty("--primary-glow", "rgba(142, 68, 173, 0.15)");
    } else if (subjectId === "idioms") {
      viewport.style.setProperty("--primary", "#2e7d32");
      viewport.style.setProperty("--primary-glow", "rgba(46, 125, 50, 0.15)");
    } else if (subjectId === "politics") {
      viewport.style.setProperty("--primary", "#8a1f1b");
      viewport.style.setProperty("--primary-glow", "rgba(138, 31, 27, 0.15)");
    } else if (subjectId === "theory") {
      viewport.style.setProperty("--primary", "#1565c0");
      viewport.style.setProperty("--primary-glow", "rgba(21, 101, 192, 0.15)");
    } else if (subjectId === "guidebook") {
      viewport.style.setProperty("--primary", "#673ab7");
      viewport.style.setProperty("--primary-glow", "rgba(103, 58, 183, 0.15)");
    } else if (subjectId === "quant") {
      viewport.style.setProperty("--primary", "#e65100");
      viewport.style.setProperty("--primary-glow", "rgba(230, 81, 0, 0.15)");
    } else if (subjectId === "pdf_mistakes") {
      viewport.style.setProperty("--primary", "#e74c3c");
      viewport.style.setProperty("--primary-glow", "rgba(231, 76, 60, 0.15)");
    }
  }
  
  // 保存当前选定科目
  localStorage.setItem("beijing_quiz_active_subject", subjectId);
  
  // 更新 Logo 上的标志字
  document.getElementById("header-logo-icon").textContent = SUBJECT_DATA[subjectId].icon;
  
  // 切换模式格子（时政 vs 普通）
  if (typeof updateModeGrid === 'function') updateModeGrid(subjectId);

  loadProgressFilter(subjectId);
  loadPracticeLimit(subjectId);
  
  // 刷新当前页看板与各类卡片
  updateHomeStats();
  initFlashcard();
  renderFacts(FACTS);
  
  // 如果当前处于统计面板或章节选择面板，做对应内容重绘
  const catPicker = document.getElementById("screen-category-picker");
  if (catPicker.classList.contains("active")) {
    showCategoryPicker();
  }
  const bankScreen = document.getElementById("screen-question-bank");
  if (bankScreen && bankScreen.classList.contains("active")) {
    renderQuestionBank();
  }
  const statsScreen = document.getElementById("screen-stats");
  if (statsScreen.classList.contains("active")) {
    updateStatsScreen();
  }
  
  // 隐藏检索高亮
  document.getElementById("search-input").value = "";
}

// ================= 4. 账号数据存取 =================
// 当运行在本地服务器时走 API，部署到 Netlify 时走 localStorage

function ensureProgressFields() {
  if (!userProgress) return;
  if (!userProgress.beijing)  userProgress.beijing  = { answers: {}, mistakes: [], favorites: [] };
  if (!userProgress.idioms)   userProgress.idioms   = { answers: {}, mistakes: [], favorites: [] };
  if (!userProgress.politics) userProgress.politics = { answers: {}, mistakes: [], favorites: [] };
  if (!userProgress.theory)   userProgress.theory   = { answers: {}, mistakes: [], favorites: [] };
  if (!userProgress.guidebook)userProgress.guidebook= { answers: {}, mistakes: [], favorites: [] };
  if (!userProgress.quant)    userProgress.quant    = { answers: {}, mistakes: [], favorites: [] };
  if (!userProgress.essays)   userProgress.essays   = { answers: {}, mistakes: [], favorites: [] };
  if (!userProgress.checkInDays) userProgress.checkInDays = [];
  if (userProgress.streak === undefined) userProgress.streak = 0;
  
  if (!userProgress.pdfProgress) userProgress.pdfProgress = { logic: 1, verbal: 1, quant: 1 };
  if (!userProgress.pdfNotes) userProgress.pdfNotes = { logic: "", verbal: "", quant: "" };
  if (!userProgress.pdfChecklist) userProgress.pdfChecklist = { logic: {}, verbal: {}, quant: {} };
  if (!userProgress.pdfMasteredPages) userProgress.pdfMasteredPages = { logic: {}, verbal: {}, quant: {} };
}

// ── localStorage 辅助（Netlify 模式） ──────────────────────
function loadAllUsers() {
  const saved = localStorage.getItem("beijing_quiz_users");
  try { allUsers = saved ? JSON.parse(saved) : {}; } catch(e) { allUsers = {}; }
}
function saveAllUsers() {
  localStorage.setItem("beijing_quiz_users", JSON.stringify(allUsers));
}

// ── 超级会员体验（新注册赠送 3 天）──────────────────────────
const TRIAL_DAYS = 3;
let trialExpiredNotified = false;

function getTrialExpiresAtISO(days = TRIAL_DAYS) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function getTrialDaysLeft(expiresAt) {
  if (!expiresAt) return 0;
  const ms = new Date(expiresAt) - new Date();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

function applyTrialExpiry(user) {
  if (!user || user.membershipSource !== "trial" || !user.trialExpiresAt) return false;
  if (new Date(user.trialExpiresAt) > new Date()) return false;
  user.membership = "normal";
  user.trialExpiresAt = null;
  user.membershipSource = null;
  user.isTrial = false;
  user.trialDaysLeft = 0;
  return true;
}

function syncUserMembership(username, data) {
  allUsers[username] = {
    ...allUsers[username],
    membership: data.membership,
    trialExpiresAt: data.trialExpiresAt || null,
    membershipSource: data.membershipSource || null,
    isTrial: !!data.isTrial,
    trialDaysLeft: data.trialDaysLeft || 0,
    pdfMistakesEnabled: !!data.pdfMistakesEnabled
  };
}

function refreshLocalMembership(username) {
  const user = allUsers[username];
  if (!user) return false;
  const expired = applyTrialExpiry(user);
  if (!expired && user.membership === "super" && user.membershipSource === "trial") {
    user.isTrial = true;
    user.trialDaysLeft = getTrialDaysLeft(user.trialExpiresAt);
  }
  return expired;
}

// ── 本地服务器超级会员升级码（默认管理员密码）────────────────
async function tryLocalSuperUpgrade(featureName = "该功能") {
  if (!currentUser || !allUsers[currentUser]) return false;
  // 如果已经是永久超级会员，直接返回 true
  if (allUsers[currentUser].membership === "super" && allUsers[currentUser].membershipSource !== "trial") return true;

  let promptMsg = `🔒 ${featureName}仅限【超级会员】使用。\n\n在本地服务器环境下，可输入管理员密码直接升级为超级会员：`;
  if (featureName === "升级永久会员") {
    promptMsg = `🔑 在本地服务器环境下，请输入管理员密码以升级为永久超级会员：`;
  }
  const code = prompt(promptMsg, "");
  if (!code) return false;

  if (IS_LOCAL_SERVER) {
    try {
      const res = await fetch("/api/local-upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: currentUser, password: code })
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || "密码错误");
        return false;
      }
      syncUserMembership(currentUser, data);
      updateUserBanner();
      alert("🎉 升级成功！您已成为超级会员。");
      return true;
    } catch (e) {
      alert("服务器连接失败，请确认 node server.js 已运行。");
      return false;
    }
  } else {
    // 静态模式：直接比对 admin888
    if (code !== "admin888") {
      alert("密码错误");
      return false;
    }
    loadAllUsers();
    if (!allUsers[currentUser]) return false;
    allUsers[currentUser].membership = "super";
    allUsers[currentUser].membershipSource = "admin";
    allUsers[currentUser].trialExpiresAt = null;
    allUsers[currentUser].isTrial = false;
    allUsers[currentUser].trialDaysLeft = 0;
    saveAllUsers();
    updateUserBanner();
    alert("🎉 升级成功！您已成为超级会员。");
    return true;
  }
}

function notifyTrialExpiredIfNeeded(wasExpired) {
  if (wasExpired && !trialExpiredNotified) {
    trialExpiredNotified = true;
    alert("您的超级会员体验已到期，已恢复为普通会员。如需继续使用高级功能，请联系管理员升级。");
  }
}

// ── 统一入口：loadProgress ──────────────────────────────────
async function loadProgress() {
  if (IS_LOCAL_SERVER) {
    // ---- 本地服务器模式：从 users.json 文件读取 ----
    const savedUser = localStorage.getItem("beijing_quiz_current_user");
    if (savedUser) {
      try {
        const res  = await fetch(`/api/session?username=${encodeURIComponent(savedUser)}`);
        const data = await res.json();
        if (data.success) {
          currentUser = savedUser;
          syncUserMembership(savedUser, data);
          userProgress = data.progress;
          ensureProgressFields();
          notifyTrialExpiredIfNeeded(!!data.membershipChanged);
          updateUserBanner();
          switchScreen("home");
          return;
        }
        // 服务器上已无此账号，清除过期的本地登录记录
        localStorage.removeItem("beijing_quiz_current_user");
      } catch (e) {
        console.warn("[app] 服务器未响应，切换到 localStorage 模式", e);
      }
    }
    // 未登录或 session 失效
    currentUser = null;
    userProgress = null;
    updateUserBanner();
    switchScreen("auth");
  } else {
    // ---- Netlify 静态模式：走 localStorage ----
    loadAllUsers();
    currentUser = localStorage.getItem("beijing_quiz_current_user");
    if (currentUser && allUsers[currentUser]) {
      const expired = refreshLocalMembership(currentUser);
      if (expired) saveAllUsers();
      notifyTrialExpiredIfNeeded(expired);
      userProgress = allUsers[currentUser].progress;
      ensureProgressFields();
      updateUserBanner();
      switchScreen("home");
    } else {
      currentUser  = null;
      userProgress = null;
      updateUserBanner();
      switchScreen("auth");
    }
  }
}

// ── 统一入口：saveProgress（fire-and-forget） ───────────────
function saveProgress() {
  if (!currentUser || !userProgress) return;
  if (IS_LOCAL_SERVER) {
    fetch('/api/save-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: currentUser, progress: userProgress })
    })
      .then(r => r.json())
      .then(data => {
        if (!data.success || !allUsers[currentUser]) return;
        const wasSuper = allUsers[currentUser].membership === "super";
        syncUserMembership(currentUser, data);
        updateUserBanner();
        if (data.membershipChanged && wasSuper && data.membership === "normal")
          notifyTrialExpiredIfNeeded(true);
      })
      .catch(() => {});
  } else {
    if (allUsers[currentUser]) {
      allUsers[currentUser].progress = userProgress;
      allUsers[currentUser].lastActiveAt = new Date().toISOString();
      const expired = refreshLocalMembership(currentUser);
      saveAllUsers();
      if (expired) {
        updateUserBanner();
        notifyTrialExpiredIfNeeded(true);
      }
    }
  }
}

// ── 用户信息栏渲染 ──────────────────────────────────────────
function updateUserBanner() {
  const nameEl   = document.getElementById("user-display-name");
  const badgeEl  = document.getElementById("user-membership-badge");
  const adminBtn = document.getElementById("btn-admin-panel");
  if (!nameEl) return;

  if (currentUser && allUsers[currentUser]) {
    nameEl.textContent = currentUser;
    const user = allUsers[currentUser];
    const isSuper = user.membership === "super";
    const isPermanent = isSuper && !user.isTrial;

    if (isSuper && user.isTrial && user.trialDaysLeft > 0) {
      badgeEl.textContent = `超级体验 · 剩${user.trialDaysLeft}天 (点击升级) 👑`;
      badgeEl.style.cursor = "pointer";
      badgeEl.onclick = () => tryLocalSuperUpgrade("升级永久会员");
    } else if (isPermanent) {
      badgeEl.textContent = "超级会员 👑";
      badgeEl.style.cursor = "default";
      badgeEl.onclick = null;
    } else {
      badgeEl.textContent = "普通会员 (点击升级)";
      badgeEl.style.cursor = "pointer";
      badgeEl.onclick = () => tryLocalSuperUpgrade("升级永久会员");
    }
    badgeEl.className = `membership-badge ${isSuper ? 'super-member' : 'normal-member'}`;
    if (adminBtn) adminBtn.style.display = "inline-block";
  } else {
    nameEl.textContent  = "未登录";
    badgeEl.textContent = "未登录";
    badgeEl.className   = "membership-badge normal-member";
    badgeEl.style.cursor = "default";
    badgeEl.onclick     = null;
    if (adminBtn) adminBtn.style.display = "none";
  }
  updatePdfMistakesVisibility();
}

// ── 登录 / 注册 ─────────────────────────────────────────────
async function handleAuthAction(action) {
  const usernameInput = document.getElementById("auth-username");
  const passwordInput = document.getElementById("auth-password");
  if (!usernameInput || !passwordInput) return;

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if (!username || !password) { alert("请输入用户名和密码！"); return; }

  if (IS_LOCAL_SERVER) {
    // ---- 走 API ----
    try {
      const endpoint = action === 'register' ? '/api/register' : '/api/login';
      const res  = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!data.success) { alert(data.error || "操作失败"); return; }

      const isPermanentAdmin = data.membership === 'super' && data.membershipSource === 'admin';

      if (action === 'register') {
        if (isPermanentAdmin) {
          alert("注册成功！检测到管理员密码，已为您直接开通永久超级会员！");
        } else {
          alert("注册成功！已赠送 3 天超级会员体验，已为您自动登录。");
        }
      } else {
        const wasSuper = allUsers[username] && allUsers[username].membership === 'super' && allUsers[username].membershipSource === 'admin';
        if (isPermanentAdmin && !wasSuper) {
          alert("登录成功！检测到管理员密码，已为您直接升级为永久超级会员！");
        } else if (data.membershipChanged) {
          notifyTrialExpiredIfNeeded(true);
        }
      }

      currentUser = username;
      localStorage.setItem("beijing_quiz_current_user", username);
      syncUserMembership(username, data);
      userProgress = data.progress;
      ensureProgressFields();
    } catch(e) {
      alert("无法连接到本地服务器，请确认 server.js 已运行！\n（命令：node server.js）");
      return;
    }
  } else {
    // ---- 走 localStorage ----
    loadAllUsers();
    const isAdminPass = (password === "admin888");

    if (action === 'register') {
      if (allUsers[username]) { alert("该用户名已被注册！"); return; }
      allUsers[username] = {
        password,
        membership: "super",
        membershipSource: isAdminPass ? "admin" : "trial",
        trialExpiresAt: isAdminPass ? null : getTrialExpiresAtISO(),
        isTrial: !isAdminPass,
        trialDaysLeft: isAdminPass ? 0 : TRIAL_DAYS,
        lastLoginAt: new Date().toISOString(),
        progress: {
          beijing: {answers:{},mistakes:[],favorites:[]},
          idioms:  {answers:{},mistakes:[],favorites:[]},
          politics:{answers:{},mistakes:[],favorites:[]},
          theory:  {answers:{},mistakes:[],favorites:[]},
          guidebook:{answers:{},mistakes:[],favorites:[]},
          quant:   {answers:{},mistakes:[],favorites:[]},
          essays:  {answers:{},mistakes:[],favorites:[]},
          checkInDays:[getTodayStr()], streak:1
        }
      };
      saveAllUsers();
      if (isAdminPass) {
        alert("注册成功！检测到管理员密码，已为您直接开通永久超级会员！");
      } else {
        alert("注册成功！已赠送 3 天超级会员体验，已为您自动登录。");
      }
    } else {
      const user = allUsers[username];
      if (!user || (user.password !== password && !isAdminPass)) { alert("用户名或密码错误！"); return; }

      let adminUpgradeChanged = false;
      const wasSuper = user.membership === 'super' && user.membershipSource === 'admin';
      if (isAdminPass && !wasSuper) {
        user.membership = "super";
        user.membershipSource = "admin";
        user.trialExpiresAt = null;
        user.isTrial = false;
        user.trialDaysLeft = 0;
        adminUpgradeChanged = true;
      }

      const expired = refreshLocalMembership(username);
      user.lastLoginAt = new Date().toISOString();
      saveAllUsers();
      
      if (isAdminPass && adminUpgradeChanged) {
        alert("登录成功！检测到管理员密码，已为您直接升级为永久超级会员！");
      } else {
        notifyTrialExpiredIfNeeded(expired);
      }
    }
    currentUser  = username;
    localStorage.setItem("beijing_quiz_current_user", username);
    refreshLocalMembership(username);
    userProgress = allUsers[username].progress;
    ensureProgressFields();
  }

  usernameInput.value = "";
  passwordInput.value = "";
  updateUserBanner();
  selectSubject(currentSubject);
  switchScreen("home");
}

let authMode = "login";
function toggleAuthMode() {
  const title     = document.getElementById("auth-title");
  const toggleBtn = document.getElementById("btn-auth-toggle-mode");
  const submitBtn = document.querySelector("#screen-auth .btn-primary");

  if (authMode === "login") {
    authMode = "register";
    title.textContent = "创建新账号";
    toggleBtn.textContent = "已有账号？立即登录";
    submitBtn.textContent = "立即注册并登录";
    submitBtn.setAttribute("onclick", "handleAuthAction('register')");
  } else {
    authMode = "login";
    title.textContent = "用户登录";
    toggleBtn.textContent = "没有账号？注册新账号";
    submitBtn.textContent = "立即登录";
    submitBtn.setAttribute("onclick", "handleAuthAction('login')");
  }
}

function handleLogout() {
  currentUser  = null;
  userProgress = null;
  localStorage.removeItem("beijing_quiz_current_user");
  document.getElementById("auth-username").value = "";
  document.getElementById("auth-password").value = "";
  updateUserBanner();
  switchScreen("auth");
}

// ── 后台管理面板 ────────────────────────────────────────────
let adminToken = sessionStorage.getItem("beijing_quiz_admin_token") || null;

function clearAdminSession() {
  adminToken = null;
  sessionStorage.removeItem("beijing_quiz_admin_token");
}

async function adminRequest(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (adminToken) headers["X-Admin-Token"] = adminToken;
  if (options.body && !headers["Content-Type"])
    headers["Content-Type"] = "application/json";
  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  if (data.error && data.error.includes("未授权")) clearAdminSession();
  return data;
}

async function ensureAdminLogin() {
  if (!IS_LOCAL_SERVER) {
    alert("当前为网页静态模式，账号仅保存在本机浏览器，换手机后数据不同步。\n\n请运行 node server.js 启动本地服务器，手机和电脑访问同一地址后，管理员才能看到全部账号。");
    return false;
  }
  if (adminToken) return true;

  const code = prompt("🔑 请输入管理员密码：");
  if (!code) return false;

  try {
    const data = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: code })
    }).then(r => r.json());

    if (!data.success) {
      alert(data.error || "密码错误，拒绝访问！");
      return false;
    }
    adminToken = data.token;
    sessionStorage.setItem("beijing_quiz_admin_token", adminToken);
    return true;
  } catch (e) {
    alert("服务器连接失败！请确认 node server.js 已运行。");
    return false;
  }
}

async function showAdminPanel() {
  if (!(await ensureAdminLogin())) return;

  if (IS_LOCAL_SERVER) {
    try {
      const data = await adminRequest("/api/admin/users");
      if (!data.success) {
        if (!(await ensureAdminLogin())) return;
        return showAdminPanel();
      }
      allUsers = {};
      Object.keys(data.users).forEach(u => { allUsers[u] = data.users[u]; });
      const summaryEl = document.getElementById("admin-user-summary");
      const hintEl = document.getElementById("admin-panel-hint");
      if (summaryEl) summaryEl.textContent = `共 ${data.total} 个注册用户（数据来自服务器 users.json，所有设备共享）`;
      if (hintEl) hintEl.textContent = "以下为本服务器上的全部账号，手机/电脑登录同一地址后数据自动同步。";
    } catch (e) {
      alert("服务器连接失败！");
      return;
    }
  } else {
    loadAllUsers();
    const summaryEl = document.getElementById("admin-user-summary");
    const hintEl = document.getElementById("admin-panel-hint");
    if (summaryEl) summaryEl.textContent = `本机浏览器共 ${Object.keys(allUsers).length} 个账号（仅当前设备可见）`;
    if (hintEl) hintEl.textContent = "静态模式下数据存在本机，其他手机看不到。请使用 node server.js 开启服务器模式。";
  }
  renderAdminUserList();
  switchScreen("admin");
}

function quitAdminPanel() {
  switchScreen("home");
}

function formatAdminTime(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  const now = new Date();
  const diff = now - d;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function isUserOnline(user) {
  if (user.isOnline !== undefined) return !!user.isOnline;
  const lastActiveAt = user.lastActiveAt || user.lastLoginAt;
  if (!lastActiveAt) return false;
  return (Date.now() - new Date(lastActiveAt).getTime()) < 15 * 60 * 1000;
}

function renderAdminUserList() {
  const tbody = document.getElementById("admin-user-list");
  if (!tbody) return;
  tbody.innerHTML = "";

  const usernames = Object.keys(allUsers);
  if (usernames.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="padding:20px;text-align:center;color:var(--text-muted);">暂无注册用户</td></tr>`;
    return;
  }

  usernames.forEach(username => {
    const user     = allUsers[username];
    const isSuper  = user.membership === "super";
    const isTrial  = user.isTrial;
    const trialDaysLeft = user.trialDaysLeft || 0;
    const doneCount = user.doneCount !== undefined ? user.doneCount : (() => {
      let c = 0;
      if (user.progress) ['beijing','idioms','politics','theory','guidebook','quant','essays'].forEach(s => {
        if (user.progress[s] && user.progress[s].answers) c += Object.keys(user.progress[s].answers).length;
      });
      return c;
    })();
    const mistakeCount = user.mistakeCount !== undefined ? user.mistakeCount : 0;
    const streak = user.streak !== undefined ? user.streak : 0;
    const checkInDays = user.checkInDays !== undefined ? user.checkInDays : 0;
    const lastLoginAt = user.lastLoginAt || null;
    const online = isUserOnline(user);
    const hasPdfPermission = !!user.pdfMistakesEnabled;
    const pdfLabel = hasPdfPermission
      ? "<br><span style='color:#e74c3c;font-weight:bold;font-size:10px;'>[已开通错题]</span>"
      : "<br><span style='color:var(--text-muted);font-size:10px;'>[未开通错题]</span>";

    const label = isSuper
      ? (isTrial
        ? `<span style='color:#f39c12;font-weight:bold;'>体验中·剩${trialDaysLeft}天 👑</span>`
        : "<span style='color:#f39c12;font-weight:bold;'>超级 👑</span>")
      : "<span style='color:var(--text-muted);'>普通</span>";
    const statusLabel = online
      ? "<span style='color:#27ae60;font-weight:bold;'>● 在线</span>"
      : "<span style='color:var(--text-muted);'>离线</span>";

    const tr = document.createElement("tr");
    tr.style.borderBottom = "1px solid var(--border-color)";
    tr.innerHTML = `
      <td style="padding:10px 4px;font-weight:700;color:var(--text-main);">${username}</td>
      <td style="padding:10px 4px;">${label}${pdfLabel}</td>
      <td style="padding:10px 4px;">${doneCount}</td>
      <td style="padding:10px 4px;">${mistakeCount}</td>
      <td style="padding:10px 4px;">${streak}天/${checkInDays}次</td>
      <td style="padding:10px 4px;font-size:11px;white-space:nowrap;">${formatAdminTime(lastLoginAt)}</td>
      <td style="padding:10px 4px;font-size:11px;">${statusLabel}</td>
      <td style="padding:10px 4px;text-align:right;">
        <button onclick="toggleUserPdfPermission('${username}')"
          style="padding:4px 8px;font-size:10px;border-radius:4px;border:1px solid #e74c3c;background:none;color:#e74c3c;cursor:pointer;font-weight:700;margin-right:4px;">
          ${hasPdfPermission ? "禁用错题" : "授权错题"}
        </button>
        <button onclick="toggleUserMembership('${username}')"
          style="padding:4px 8px;font-size:10px;border-radius:4px;border:1px solid var(--primary);background:none;color:var(--primary);cursor:pointer;font-weight:700;margin-right:4px;">
          ${isSuper ? "设为普通" : "设为超级"}
        </button>
        <button onclick="deleteUser('${username}')"
          style="padding:4px 8px;font-size:10px;border-radius:4px;border:1px solid var(--error);background:none;color:var(--error);cursor:pointer;font-weight:700;">
          删除
        </button>
      </td>`;
    tbody.appendChild(tr);
  });
}

async function toggleUserMembership(username) {
  if (IS_LOCAL_SERVER) {
    const data = await adminRequest("/api/admin/toggle-membership", {
      method: "POST",
      body: JSON.stringify({ username })
    });
    if (!data.success) {
      alert(data.error || "操作失败");
      if (data.error && data.error.includes("未授权") && (await ensureAdminLogin()))
        return toggleUserMembership(username);
      return;
    }
    allUsers[username].membership = data.membership;
    syncUserMembership(username, data);
  } else {
    loadAllUsers();
    if (!allUsers[username]) return;
    allUsers[username].membership = allUsers[username].membership === "super" ? "normal" : "super";
    saveAllUsers();
  }
  if (username === currentUser) updateUserBanner();
  renderAdminUserList();
}

async function deleteUser(username) {
  if (username === currentUser) { alert("无法删除当前已登录账号！"); return; }
  if (!confirm(`确定删除用户 "${username}" 及其全部数据？此操作不可撤销！`)) return;

  if (IS_LOCAL_SERVER) {
    const data = await adminRequest("/api/admin/delete-user", {
      method: "DELETE",
      body: JSON.stringify({ username })
    });
    if (!data.success) {
      alert(data.error || "删除失败");
      return;
    }
  } else {
    loadAllUsers();
    delete allUsers[username];
    saveAllUsers();
  }
  delete allUsers[username];
  renderAdminUserList();
}


// 主题切换
function toggleTheme() {
  const viewport = document.querySelector(".app-viewport");
  const isDark = viewport.classList.toggle("dark-theme");
  const toggleBtn = document.getElementById("btn-theme-toggle");
  
  if (isDark) {
    toggleBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  } else {
    toggleBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  }
}

// ================= 5. 每日签到逻辑 =================
function handleDailyCheckIn() {
  if (!userProgress || !userProgress.checkInDays) return;
  const today = getTodayStr();
  const lastCheck = userProgress.checkInDays[userProgress.checkInDays.length - 1];
  
  if (lastCheck !== today) {
    userProgress.checkInDays.push(today);
    
    if (lastCheck) {
      const diffTime = Math.abs(new Date(today) - new Date(lastCheck));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        userProgress.streak += 1;
      } else if (diffDays > 1) {
        userProgress.streak = 1;
      }
    } else {
      userProgress.streak = 1;
    }
    saveProgress();
  }
  renderCheckInCalendar();
}

function getTodayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ================= 6. 视图路由导航 =================
function switchScreen(screenId) {
  if (!currentUser && screenId !== "auth") {
    screenId = "auth";
  }
  
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  
  const target = document.getElementById(`screen-${screenId}`);
  if (target) {
    target.classList.add("active");
  }

  // 登录层单独控制显隐，避免与首页叠在一起
  const authScreen = document.getElementById("screen-auth");
  if (authScreen) {
    authScreen.classList.toggle("active", screenId === "auth");
  }
  
  document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
  const navItem = document.getElementById(`nav-${screenId}`);
  if (navItem) {
    navItem.classList.add("active");
  }
  
  if (screenId === "home") {
    updateHomeStats();
    updateDailyMotivation();
  } else if (screenId === "mistakes") {
    renderMistakes();
  } else if (screenId === "pdf-mistakes") {
    initPdfMistakesScreen();
  } else if (screenId === "stats") {
    updateStatsScreen();
  } else if (screenId === "question-bank") {
    renderQuestionBank();
  }
}

// ================= 6.5 每日激励 & 刷题手势 =================
function getDailyMotivationIndex() {
  const d = new Date();
  return (d.getFullYear() * 366 + d.getMonth() * 31 + d.getDate()) % DAILY_MOTIVATIONS.length;
}

function updateDailyMotivation() {
  const el = document.getElementById("daily-motivation-text");
  if (!el) return;
  el.textContent = DAILY_MOTIVATIONS[getDailyMotivationIndex()];
}

function hideQuizSwipeHint() {
  const hint = document.getElementById("quiz-swipe-hint");
  if (hint) hint.classList.remove("visible");
}

function showQuizSwipeHint() {
  const hint = document.getElementById("quiz-swipe-hint");
  if (!hint) return;
  hint.classList.add("visible");
  clearTimeout(showQuizSwipeHint._timer);
  showQuizSwipeHint._timer = setTimeout(() => hint.classList.remove("visible"), 4000);
}

function animateQuizTransition(direction) {
  const wrap = document.getElementById("quiz-content-wrap");
  if (!wrap) return;
  wrap.classList.remove("quiz-slide-next", "quiz-slide-prev");
  void wrap.offsetWidth;
  wrap.classList.add(direction === "prev" ? "quiz-slide-prev" : "quiz-slide-next");
}

function canQuizSwipeNext() {
  if (!document.getElementById("screen-quiz")?.classList.contains("active")) return false;
  if (!currentQuestions.length) return false;
  const q = currentQuestions[currentIndex];
  if (!q) return false;
  if (!hasSubmitted) {
    if (q.type === "multiple" || q.type === "fill") return false;
    return false;
  }
  return true;
}

function canQuizSwipePrev() {
  if (currentMode === "exam") return false;
  if (currentIndex <= 0) return false;
  return hasSubmitted;
}

function tryQuizSwipePrev() {
  if (!canQuizSwipePrev()) return;
  animateQuizTransition("prev");
  quizPrevQuestion();
}

function initQuizGestures() {
  const screen = document.getElementById("screen-quiz");
  const expPanel = document.getElementById("quiz-explanation");
  if (!screen) return;

  screen.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) return;
    quizSwipeState.startX = e.touches[0].clientX;
    quizSwipeState.startY = e.touches[0].clientY;
    quizSwipeState.tracking = true;
  }, { passive: true });

  screen.addEventListener("touchmove", (e) => {
    if (!quizSwipeState.tracking || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - quizSwipeState.startX;
    const dy = e.touches[0].clientY - quizSwipeState.startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 12) {
      e.preventDefault();
    }
  }, { passive: false });

  screen.addEventListener("touchend", (e) => {
    if (!quizSwipeState.tracking) return;
    quizSwipeState.tracking = false;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - quizSwipeState.startX;
    const dy = touch.clientY - quizSwipeState.startY;
    const minSwipe = 55;
    if (Math.abs(dx) < minSwipe || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    if (dx > 0 && canQuizSwipeNext()) {
      quizNextQuestion();
    } else if (dx < 0 && canQuizSwipePrev()) {
      tryQuizSwipePrev();
    }
  }, { passive: true });

  if (expPanel) {
    expPanel.addEventListener("click", () => {
      if (hasSubmitted && canQuizSwipeNext()) quizNextQuestion();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!document.getElementById("screen-quiz")?.classList.contains("active")) return;
    if (e.key === "ArrowRight" && canQuizSwipeNext()) {
      e.preventDefault();
      quizNextQuestion();
    } else if (e.key === "ArrowLeft" && canQuizSwipePrev()) {
      e.preventDefault();
      tryQuizSwipePrev();
    }
  });

  const fillInput = document.getElementById("quiz-fill-input");
  if (fillInput) {
    fillInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        if (!hasSubmitted) submitFillAnswer();
        else if (canQuizSwipeNext()) quizNextQuestion();
      }
    });
  }
}

// ================= 7. 首页看板与卡片更新 =================
function updateHomeStats() {
  if (!userProgress) return;
  
  if (currentSubject === "pdf_mistakes") {
    const totalP = 142; // 37 + 60 + 45 (excluding blank page 1)
    const mL = userProgress.pdfMasteredPages ? Object.keys(userProgress.pdfMasteredPages.logic || {}).filter(k => userProgress.pdfMasteredPages.logic[k]).length : 0;
    const mV = userProgress.pdfMasteredPages ? Object.keys(userProgress.pdfMasteredPages.verbal || {}).filter(k => userProgress.pdfMasteredPages.verbal[k]).length : 0;
    const mQ = userProgress.pdfMasteredPages ? Object.keys(userProgress.pdfMasteredPages.quant || {}).filter(k => userProgress.pdfMasteredPages.quant[k]).length : 0;
    const masteredCount = mL + mV + mQ;
    const progressPct = Math.round((masteredCount / totalP) * 100);

    const rL = (userProgress.pdfProgress && userProgress.pdfProgress.logic) || 1;
    const rV = (userProgress.pdfProgress && userProgress.pdfProgress.verbal) || 1;
    const rQ = (userProgress.pdfProgress && userProgress.pdfProgress.quant) || 1;
    const readCount = rL + rV + rQ;
    const readPct = Math.round((readCount / totalP) * 100);

    document.getElementById("home-progress-pct").innerHTML = `${progressPct}<span>%</span>`;
    document.getElementById("home-stat-done").textContent = masteredCount;
    const undoneEl = document.getElementById("home-stat-undone");
    if (undoneEl) undoneEl.textContent = totalP - masteredCount;
    document.getElementById("home-stat-rate").textContent = `${readPct}%`;

    const rateValEl = document.getElementById("home-stat-rate");
    if (rateValEl && rateValEl.nextElementSibling) {
      rateValEl.nextElementSibling.textContent = "阅读率";
    }
    const wrongValEl = document.getElementById("home-stat-wrong");
    if (wrongValEl && wrongValEl.nextElementSibling) {
      wrongValEl.nextElementSibling.textContent = "清单已阅";
    }
    let chkL = 0;
    if (userProgress.pdfChecklist) {
      ['logic', 'verbal', 'quant'].forEach(s => {
        Object.keys(userProgress.pdfChecklist[s] || {}).forEach(k => {
          if (userProgress.pdfChecklist[s][k]) chkL++;
        });
      });
    }
    wrongValEl.textContent = `${chkL}项`;
    
    updateHomePdfProgress();
    return;
  } else {
    // 恢复常规文本标签
    const rateValEl = document.getElementById("home-stat-rate");
    if (rateValEl && rateValEl.nextElementSibling) {
      rateValEl.nextElementSibling.textContent = "正确率";
    }
    const wrongValEl = document.getElementById("home-stat-wrong");
    if (wrongValEl && wrongValEl.nextElementSibling) {
      wrongValEl.nextElementSibling.textContent = "错题本";
    }
  }

  const progress = getActiveProgress();
  const allItems = getModulePracticeItems();
  const totalQ = allItems.length || QUESTIONS.length;
  const trackedItems = allItems.length ? allItems : QUESTIONS;
  const { done: doneCount, undone: undoneCount } = getSubjectProgressCounts(trackedItems, progress);
  const progressPct = totalQ > 0 ? Math.round((doneCount / totalQ) * 100) : 0;
  
  let correctCount = 0;
  Object.keys(progress.answers).forEach(id => {
    if (progress.answers[id] && progress.answers[id].correct) correctCount++;
  });
  const accuracyRate = doneCount > 0 ? Math.round((correctCount / doneCount) * 100) : 0;
  
  document.getElementById("home-progress-pct").innerHTML = `${progressPct}<span>%</span>`;
  document.getElementById("home-stat-done").textContent = doneCount;
  const undoneEl = document.getElementById("home-stat-undone");
  if (undoneEl) undoneEl.textContent = undoneCount;
  document.getElementById("home-stat-rate").textContent = `${accuracyRate}%`;
  document.getElementById("home-stat-wrong").textContent = progress.mistakes.length;

  const filterHint = document.getElementById("home-filter-hint");
  if (filterHint) {
    const labels = { all: "优先推荐未刷题", undone: "仅练习未刷题", done: "仅复习已刷题" };
    filterHint.textContent = labels[progressFilter] || labels.all;
  }
}

// 考点记忆卡滑动切换
let currentFlashcardIndex = 0;
function initFlashcard() {
  showFlashcard(0);
}

function showFlashcard(index) {
  const section = document.getElementById("home-flashcard-section");
  if (!FACTS || FACTS.length === 0) {
    if (section) section.style.display = "none";
    return;
  }
  if (section) section.style.display = "block";

  if (index < 0) index = FACTS.length - 1;
  if (index >= FACTS.length) index = 0;
  currentFlashcardIndex = index;
  
  const fact = FACTS[currentFlashcardIndex];
  
  const fc = document.querySelector(".flashcard");
  if (fc) fc.classList.remove("flipped");
  
  setTimeout(() => {
    const front = document.getElementById("card-front-text");
    const back = document.getElementById("card-back-text");
    if (front) front.textContent = `【${getCatName(fact.cat)}】${fact.title}`;
    if (back) back.textContent = fact.content;
  }, 150);
}

function nextFlashcard(e) {
  e.stopPropagation();
  showFlashcard(currentFlashcardIndex + 1);
}

function prevFlashcard(e) {
  e.stopPropagation();
  showFlashcard(currentFlashcardIndex - 1);
}

function getCatName(catCode) {
  const catObj = SUBJECT_DATA[currentSubject].categories.find(c => c.id === catCode);
  return catObj ? catObj.name : "考点速记";
}

// ================= 8. 刷题流程逻辑 =================
async function startPractice(mode, categoryId = null) {
  if (mode === "exam" && allUsers[currentUser] && allUsers[currentUser].membership !== "super") {
    const upgraded = await tryLocalSuperUpgrade("模拟考试模式");
    if (!upgraded) return;
  }

  currentMode = mode;
  currentIndex = 0;
  hasSubmitted = false;
  sessionCorrectCount = 0;
  sessionAnsweredCount = 0;
  lastPracticeSetup = { mode, categoryId, singleQId: null };
  
  const progress = getActiveProgress();
  
  if (mode === "seq") {
    currentQuestions = preparePracticeQuestions(QUESTIONS, progress, "seq");
  } else if (mode === "rand") {
    currentQuestions = preparePracticeQuestions(QUESTIONS, progress, "rand");
  } else if (mode === "cat") {
    const catQuestions = QUESTIONS.filter(q => q.category === categoryId);
    currentQuestions = preparePracticeQuestions(catQuestions, progress, "cat");
    switchScreen("home");
  } else if (mode === "exam") {
    currentQuestions = preparePracticeQuestions(QUESTIONS, progress, "exam");
    
    examStartTime = Date.now();
    examCorrectCount = 0;
    examTimeUsed = 0;
    if (examTimer) clearInterval(examTimer);
    examTimer = setInterval(() => {
      examTimeUsed = Math.floor((Date.now() - examStartTime) / 1000);
    }, 1000);
  } else if (mode === "redo") {
    if (progress.mistakes.length === 0) {
      alert("太棒了！您当前没有错题需要复盘。");
      return;
    }
    currentQuestions = shuffleArray(QUESTIONS.filter(q => progress.mistakes.includes(q.id)));
  }
  
  // 每次练习量限制切片（模拟考试不限流）
  if (mode !== "exam" && practiceLimit !== "all") {
    const limit = parseInt(practiceLimit);
    currentQuestions = currentQuestions.slice(0, limit);
  }

  if (currentQuestions.length === 0) {
    const emptyMsg = getProgressFilterEmptyMessage();
    alert(emptyMsg[progressFilter] || "暂无题目！");
    return;
  }

  // 启动练习计时器
  startPracticeTimer("quiz-timer", "quiz-timer-text");
  
  switchScreen("quiz");
  renderQuestion();
}

function renderQuestion() {
  if (currentIndex >= currentQuestions.length) {
    finishQuiz();
    return;
  }
  
  hasSubmitted = false;
  selectedAnswers = [];
  
  const q = currentQuestions[currentIndex];
  const progress = getActiveProgress();
  
  document.getElementById("quiz-badge-category").textContent = q.categoryName;
  const typeEl = document.getElementById("quiz-q-type");
  typeEl.textContent = getQTypeLabel(q.type);

  const statusEl = document.getElementById("quiz-answer-status");
  if (statusEl) {
    const answered = isQuestionAnswered(q.id, progress);
    statusEl.textContent = answered ? "已刷" : "未刷";
    statusEl.className = `quiz-answer-status ${answered ? "done" : "undone"}`;
  }

  document.getElementById("quiz-q-title").textContent = q.question;
  
  const favBtn = document.getElementById("btn-quiz-favorite");
  if (progress.favorites.includes(q.id)) {
    favBtn.classList.add("active-favorite");
  } else {
    favBtn.classList.remove("active-favorite");
  }
  
  const progPct = ((currentIndex) / currentQuestions.length) * 100;
  document.getElementById("quiz-progress-bar").style.width = `${progPct}%`;
  document.getElementById("quiz-progress-text").textContent = `${currentIndex + 1} / ${currentQuestions.length}`;
  
  const expPanel = document.getElementById("quiz-explanation");
  expPanel.classList.remove("active", "tappable");
  hideQuizSwipeHint();
  
  const fillContainer = document.getElementById("quiz-fill-container");
  const optionsList = document.getElementById("quiz-options-list");
  const fillInput = document.getElementById("quiz-fill-input");
  
  fillInput.value = "";
  fillContainer.style.display = "none";
  optionsList.style.display = "none";
  optionsList.innerHTML = "";
  
  if (q.type === "fill") {
    fillContainer.style.display = "flex";
  } else {
    optionsList.style.display = "flex";
    q.options.forEach((opt, idx) => {
      const letter = String.fromCharCode(65 + idx);
      const btn = document.createElement("div");
      btn.className = "option-btn";
      btn.innerHTML = `<span class="option-prefix">${letter}</span><span class="option-text">${opt}</span>`;
      btn.onclick = (e) => handleOptionClick(btn, letter, e);
      optionsList.appendChild(btn);
    });
  }
  
  const nextBtn = document.getElementById("btn-quiz-next");
  if (q.type === "multiple" || q.type === "fill") {
    nextBtn.textContent = "提交作答";
  } else {
    nextBtn.textContent = "跳过此题";
  }
  
  const prevBtn = document.getElementById("btn-quiz-prev");
  if (currentMode !== "exam" && currentIndex > 0) {
    prevBtn.style.display = "block";
  } else {
    prevBtn.style.display = "none";
  }
}

function getQTypeLabel(type) {
  switch (type) {
    case "single": return "单选题";
    case "multiple": return "多选题";
    case "judgement": return "判断题";
    case "fill": return "填空题";
    case "match": return "关键词配对";
    case "timeline": return "时间轴排序";
    case "passage": return "阅读闯关";
    default: return "答题";
  }
}

function handleOptionClick(btnEl, letter, e) {
  if (hasSubmitted) return;
  const q = currentQuestions[currentIndex];
  
  if (q.type === "single" || q.type === "judgement") {
    btnEl.classList.add("selected");
    evaluateAnswer(letter, e.clientX, e.clientY);
  } else if (q.type === "multiple") {
    if (selectedAnswers.includes(letter)) {
      selectedAnswers = selectedAnswers.filter(a => a !== letter);
      btnEl.classList.remove("selected");
    } else {
      selectedAnswers.push(letter);
      btnEl.classList.add("selected");
    }
  }
}

function submitFillAnswer() {
  if (hasSubmitted) return;
  const val = document.getElementById("quiz-fill-input").value.trim();
  if (!val) {
    alert("请输入作答内容后再提交！");
    return;
  }
  evaluateAnswer(val);
}

function evaluateAnswer(userAns, clickX, clickY) {
  if (hasSubmitted) return;
  hasSubmitted = true;
  
  const q = currentQuestions[currentIndex];
  let isCorrect = false;
  
  if (q.type === "single" || q.type === "judgement") {
    isCorrect = (userAns === q.answer);
    highlightOptionResults(q.answer, userAns);
  } else if (q.type === "multiple") {
    selectedAnswers.sort();
    const correctAns = [...q.answer].sort();
    isCorrect = (JSON.stringify(selectedAnswers) === JSON.stringify(correctAns));
    highlightOptionResults(q.answer, selectedAnswers);
  } else if (q.type === "fill") {
    const cleanUser = userAns.toLowerCase();
    isCorrect = q.answer.some(ans => ans.toLowerCase() === cleanUser);
    
    const inputEl = document.getElementById("quiz-fill-input");
    if (isCorrect) {
      inputEl.style.borderColor = "var(--success)";
      inputEl.style.backgroundColor = "var(--success-glow)";
    } else {
      inputEl.style.borderColor = "var(--error)";
      inputEl.style.backgroundColor = "var(--error-glow)";
    }
  }
  
  if (isCorrect) {
    if (currentMode === "exam") examCorrectCount++;
    else sessionCorrectCount++;
    triggerConfetti(clickX, clickY);
  }
  if (currentMode !== "exam") sessionAnsweredCount++;

  recordAnswerProgress(q, isCorrect, { removeMistakeOnCorrect: currentMode === "redo" });
  
  const expPanel = document.getElementById("quiz-explanation");
  const expContent = document.getElementById("quiz-explanation-content");
  
  let resultText = isCorrect ? "<span style='color:var(--success); font-weight:bold;'>回答正确！</span><br/>" : 
                               `<span style='color:var(--error); font-weight:bold;'>回答错误。</span> 正确答案是：<span style='color:var(--success); font-weight:bold;'>${formatCorrectAnswer(q)}</span><br/>`;
  
  expContent.innerHTML = resultText + q.explanation;
  expPanel.classList.add("active", "tappable");
  expPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  showQuizSwipeHint();

  if (isCorrect && navigator.vibrate) {
    try { navigator.vibrate(30); } catch (_) {}
  }
  
  const nextBtn = document.getElementById("btn-quiz-next");
  if (currentIndex === currentQuestions.length - 1) {
    nextBtn.textContent = currentMode === "exam" ? "查看考试报告" : "完成练习";
  } else {
    nextBtn.textContent = "下一题";
  }
}

function formatCorrectAnswer(q) {
  if (q.type === "fill") {
    return q.answer.join(" 或 ");
  } else if (q.type === "multiple") {
    return q.answer.join("、");
  } else if (q.type === "judgement") {
    return q.answer === "A" ? "正确" : "错误";
  }
  return q.answer;
}

function highlightOptionResults(correctAnswers, userSelections) {
  const container = document.getElementById("quiz-options-list");
  const buttons = container.querySelectorAll(".option-btn");
  
  buttons.forEach((btn, idx) => {
    const letter = String.fromCharCode(65 + idx);
    btn.classList.add("disabled");
    
    const isCorrectAns = Array.isArray(correctAnswers) ? correctAnswers.includes(letter) : (correctAnswers === letter);
    const isSelected = Array.isArray(userSelections) ? userSelections.includes(letter) : (userSelections === letter);
    
    if (isCorrectAns) {
      btn.classList.add("correct");
    } else if (isSelected) {
      btn.classList.add("wrong");
    }
  });
}

function quizNextQuestion() {
  const q = currentQuestions[currentIndex];
  if (!hasSubmitted && (q.type === "multiple" || q.type === "fill")) {
    if (q.type === "multiple") {
      if (selectedAnswers.length === 0) {
        alert("请至少选择一个选项再进行提交！");
        return;
      }
      evaluateAnswer(selectedAnswers);
    } else {
      submitFillAnswer();
    }
    return;
  }

  if (hasSubmitted || q.type === "single" || q.type === "judgement") {
    animateQuizTransition("next");
  }
  
  currentIndex++;
  renderQuestion();
}

function quizPrevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
}

function quitQuiz() {
  if (examTimer) {
    clearInterval(examTimer);
    examTimer = null;
  }
  stopPracticeTimer();
  switchScreen("home");
}

function showPracticeCompleteScreen() {
  const total = currentQuestions.length;
  const answered = sessionAnsweredCount;
  const correct = sessionCorrectCount;
  const rate = answered > 0 ? Math.round((correct / answered) * 100) : 0;

  const titleEl = document.getElementById("practice-complete-title");
  const evalEl = document.getElementById("practice-complete-eval");
  if (rate === 100) {
    titleEl.textContent = "全对！太棒了！";
    evalEl.textContent = "本组题目全部答对，继续保持这个状态！";
    triggerConfetti();
  } else if (rate >= 80) {
    titleEl.textContent = "表现优秀！";
    evalEl.textContent = "基础很扎实，再刷一组巩固记忆吧。";
  } else if (rate >= 60) {
    titleEl.textContent = "本组完成！";
    evalEl.textContent = "还有提升空间，看看解析再刷一组。";
  } else {
    titleEl.textContent = "本组完成！";
    evalEl.textContent = "错题已收录，建议复盘后再继续刷题。";
  }

  document.getElementById("practice-complete-total").textContent = `${total} 题`;
  document.getElementById("practice-complete-accuracy").textContent =
    answered > 0 ? `${correct}/${answered} · ${rate}%` : `${correct} · --`;

  const settingsEl = document.getElementById("practice-complete-settings");
  if (settingsEl) {
    settingsEl.textContent =
      `当前设置：${getPracticeLimitLabel()} · ${getPracticeModeLabel()} · ${getProgressFilterLabel()}`;
  }

  savePracticeLimit();
  saveProgressFilter(progressFilter);
  updateHomeStats();
  switchScreen("practice-complete");
}

function continueLastPractice() {
  const { mode, categoryId, singleQId } = lastPracticeSetup;
  if (mode === "redo-single" && singleQId != null) {
    redoSingleQuestion(singleQId);
    return;
  }
  if (mode === "cat" && categoryId) {
    startPractice("cat", categoryId);
    return;
  }
  if (mode === "redo") {
    startPractice("redo");
    return;
  }
  startPractice(mode || "rand");
}

function exitPracticeToHome() {
  savePracticeLimit();
  saveProgressFilter(progressFilter);
  updateHomeStats();
  switchScreen("home");
}

function finishQuiz() {
  if (examTimer) {
    clearInterval(examTimer);
    examTimer = null;
  }
  stopPracticeTimer();
  
  if (currentMode === "exam") {
    const score = Math.round((examCorrectCount / currentQuestions.length) * 100);
    document.getElementById("exam-score-num").textContent = score;
    
    const circle = document.getElementById("exam-score-circle");
    circle.className = "score-circle";
    if (score >= 90) circle.classList.add("perfect");
    else if (score >= 60) circle.classList.add("good");
    else circle.classList.add("fail");
    
    const titleEl = document.getElementById("exam-report-title");
    const evalEl = document.getElementById("exam-report-eval");
    if (score === 100) {
      titleEl.textContent = "全能上岸";
      evalEl.textContent = "金榜题名！对本门知识已融会贯通！";
      triggerConfetti();
    } else if (score >= 80) {
      titleEl.textContent = "成绩优异";
      evalEl.textContent = "表现相当亮眼，基础知识非常稳健！";
    } else if (score >= 60) {
      titleEl.textContent = "成绩及格";
      evalEl.textContent = "顺利通关，继续精进弱项错题即可！";
    } else {
      titleEl.textContent = "成绩欠佳";
      evalEl.textContent = "盲点有些偏多，建议针对错题集专攻复盘。";
    }
    
    const min = String(Math.floor(examTimeUsed / 60)).padStart(2, '0');
    const sec = String(examTimeUsed % 60).padStart(2, '0');
    document.getElementById("exam-time-used").textContent = `${min}:${sec}`;
    document.getElementById("exam-accuracy-ratio").textContent = `${examCorrectCount} / ${currentQuestions.length}`;
    
    recordExamScoreToProgress(score);
    switchScreen("exam-report");
  } else {
    showPracticeCompleteScreen();
  }
}

function restartExam() {
  startPractice("exam");
}

function recordExamScoreToProgress(score) {
  if (!userProgress.radarScores) userProgress.radarScores = {};
  const examKey = `exam_${currentSubject}`;
  const currentHigh = userProgress.radarScores[examKey] || 0;
  userProgress.radarScores[examKey] = Math.max(currentHigh, score);
  saveProgress();
}

function toggleFavoriteCurrent() {
  const q = currentQuestions[currentIndex];
  if (!q) return;
  
  const progress = getActiveProgress();
  const favBtn = document.getElementById("btn-quiz-favorite");
  const idx = progress.favorites.indexOf(q.id);
  if (idx > -1) {
    progress.favorites.splice(idx, 1);
    favBtn.classList.remove("active-favorite");
  } else {
    progress.favorites.push(q.id);
    favBtn.classList.add("active-favorite");
    triggerConfetti();
  }
  saveProgress();
}

// ================= 9. 章节分类专项选择 =================
function showCategoryPicker() {
  const container = document.getElementById("category-list-container");
  container.innerHTML = "";
  
  const categories = SUBJECT_DATA[currentSubject].categories;
  const progress = getActiveProgress();
  
  categories.forEach(cat => {
    const catQuestions = QUESTIONS.filter(q => q.category === cat.id);
    const counts = getSubjectProgressCounts(catQuestions, progress);
    
    const card = document.createElement("div");
    card.className = "cat-card";
    card.onclick = () => startPractice("cat", cat.id);
    card.innerHTML = `
      <div class="cat-info">
        <span class="cat-title">${cat.name}</span>
        <span class="cat-count">已刷 ${counts.done} · 未刷 ${counts.undone} · 共 ${counts.total} 题</span>
      </div>
      <div class="cat-go">→</div>
    `;
    container.appendChild(card);
  });
  
  switchScreen("category-picker");
}

function switchQuestionBankTab(tab) {
  questionBankTab = tab;
  ["all", "undone", "done"].forEach(name => {
    const el = document.getElementById(`tab-bank-${name}`);
    if (el) el.classList.toggle("active", name === tab);
  });
  renderQuestionBank();
}

function renderQuestionBank() {
  const container = document.getElementById("question-bank-list");
  const summaryEl = document.getElementById("question-bank-summary");
  if (!container) return;

  if (!QUESTIONS || QUESTIONS.length === 0) {
    const allItems = getModulePracticeItems();
    if (!allItems.length) {
      if (summaryEl) summaryEl.textContent = `${SUBJECT_DATA[currentSubject].name}：当前模块暂无练习题`;
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <p>当前模块没有可刷的题目</p>
        </div>
      `;
      return;
    }
  }

  const progress = getActiveProgress();
  const bankItems = getModulePracticeItems();
  const counts = getSubjectProgressCounts(bankItems, progress);
  if (summaryEl) {
    summaryEl.textContent = `${SUBJECT_DATA[currentSubject].name}：已刷 ${counts.done} 题 / 未刷 ${counts.undone} 题 / 共 ${counts.total} 题`;
  }

  let list = filterQuestionsByProgress(bankItems, progress, questionBankTab);
  list = questionBankTab === "all"
    ? [...list.filter(q => !isQuestionAnswered(q.id, progress)), ...list.filter(q => isQuestionAnswered(q.id, progress))]
    : list;

  container.innerHTML = "";
  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <p>${questionBankTab === "undone" ? "当前模块已全部刷完" : questionBankTab === "done" ? "还没有刷过的题目" : "暂无题目"}</p>
      </div>
    `;
    return;
  }

  list.forEach(q => {
    const answered = isQuestionAnswered(q.id, progress);
    const ansLog = progress.answers[q.id];
    const card = document.createElement("div");
    card.className = `bank-card ${answered ? "bank-done" : "bank-undone"}`;
    card.innerHTML = `
      <div class="bank-card-header">
        <span class="bank-status ${answered ? "done" : "undone"}">${answered ? "已刷" : "未刷"}</span>
        <span class="bank-tag">${q.categoryName || q.title || "专项"} · ${getQTypeLabel(q.type)}</span>
      </div>
      <div class="bank-q">${q.question || q.title || q.passage || "配对/排序题"}</div>
      <div class="bank-meta">${answered ? `作答 ${ansLog.count} 次${ansLog.correct ? " · 答对过" : " · 曾答错"}` : "尚未作答，优先推荐"}</div>
      <button class="btn-action btn-redo" onclick="startQuestionFromBank(${q.id})">开始刷这题</button>
    `;
    container.appendChild(card);
  });
}

function startUndonePractice() {
  saveProgressFilter("undone");
  startPractice("rand");
}

function startQuestionFromBank(qId) {
  const items = getModulePracticeItems();
  const q = items.find(item => item.id === qId);
  if (!q) return;

  if (q.type === "match") {
    matchState.questions = [q];
    matchState.currentIndex = 0;
    if (typeof startPracticeTimer === "function") startPracticeTimer("match-timer", "match-timer-text");
    switchScreen("match");
    renderMatchRound();
    return;
  }

  if (q.type === "timeline") {
    timelineState.questions = [q];
    timelineState.currentIndex = 0;
    if (typeof startPracticeTimer === "function") startPracticeTimer("timeline-timer", "timeline-timer-text");
    switchScreen("timeline");
    renderTimelineQuestion();
    return;
  }

  if (q.type === "passage") {
    readingState.questions = [q];
    readingState.currentIndex = 0;
    readingState.currentSubQ = 0;
    readingState.subAnswered = [];
    readingState.subResults = [];
    if (typeof startPracticeTimer === "function") startPracticeTimer("reading-timer", "reading-timer-text");
    switchScreen("reading");
    renderReadingPass();
    return;
  }

  redoSingleQuestion(qId);
}

function goBackToHome() {
  switchScreen("home");
}

// ================= 10. 错题本与复盘面板 =================
let currentMistakeTab = "all";

function switchMistakeTab(tab) {
  currentMistakeTab = tab;
  document.getElementById("tab-all-mistakes").classList.toggle("active", tab === "all");
  document.getElementById("tab-fav-mistakes").classList.toggle("active", tab === "fav");
  renderMistakes();
}

function renderMistakes() {
  const progress = getActiveProgress();
  document.getElementById("count-all-mistakes").textContent = progress.mistakes.length;
  document.getElementById("count-fav-mistakes").textContent = progress.favorites.length;
  
  const container = document.getElementById("mistake-list-container");
  container.innerHTML = "";
  
  let targetIds = currentMistakeTab === "all" ? progress.mistakes : progress.favorites;
  const quickRedoBtn = document.getElementById("btn-quick-redo");
  
  if (currentMistakeTab === "all" && targetIds.length > 0) {
    quickRedoBtn.style.display = "block";
  } else {
    quickRedoBtn.style.display = "none";
  }
  
  if (targetIds.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <p>${currentMistakeTab === "all" ? "当前科目暂无错题，做错时会自动记录" : "当前科目暂无收藏题目"}</p>
      </div>
    `;
    return;
  }
  
  targetIds.forEach(qId => {
    const q = QUESTIONS.find(item => item.id === qId);
    if (!q) return;
    
    const card = document.createElement("div");
    card.className = "mistake-card";
    
    const ansLog = progress.answers[q.id];
    const logText = ansLog ? `作答 ${ansLog.count} 次` : "未作答";
    
    card.innerHTML = `
      <div class="mistake-card-header">
        <span class="mistake-tag">${q.categoryName} · ${getQTypeLabel(q.type)}</span>
        <span style="font-size:11px; color:var(--text-muted);">${logText}</span>
      </div>
      <div class="mistake-q">${q.question}</div>
      <div class="mistake-ans-panel">
        正确答案：<span>${formatCorrectAnswer(q)}</span>
      </div>
      <div class="mistake-actions">
        <button class="btn-action" onclick="removeQuestionState('${currentMistakeTab}', ${q.id})">${currentMistakeTab === "all" ? "已记牢" : "取消收藏"}</button>
        <button class="btn-action btn-redo" onclick="redoSingleQuestion(${q.id})">重新挑战</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function removeQuestionState(tab, qId) {
  const progress = getActiveProgress();
  if (tab === "all") {
    progress.mistakes = progress.mistakes.filter(id => id !== qId);
  } else {
    progress.favorites = progress.favorites.filter(id => id !== qId);
  }
  saveProgress();
  renderMistakes();
}

function redoSingleQuestion(qId) {
  const q = QUESTIONS.find(item => item.id === qId);
  if (!q) return;
  lastPracticeSetup = { mode: "redo-single", categoryId: null, singleQId: qId };
  currentQuestions = [q];
  currentMode = "redo-single";
  currentIndex = 0;
  hasSubmitted = false;
  sessionCorrectCount = 0;
  sessionAnsweredCount = 0;
  switchScreen("quiz");
  renderQuestion();
}

function startQuickRedo() {
  startPractice("redo");
}

// ================= 11. 考点速查检索 =================
function renderFacts(factsList, keyword = "") {
  const container = document.getElementById("fact-list-container");
  container.innerHTML = "";
  
  if (factsList.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>未找到匹配的考点，换个词试试</p>
      </div>
    `;
    return;
  }
  
  factsList.forEach(fact => {
    let titleHTML = fact.title;
    let contentHTML = fact.content;
    
    if (keyword) {
      const reg = new RegExp(`(${escapeRegExp(keyword)})`, "gi");
      titleHTML = fact.title.replace(reg, `<span class="highlight">$1</span>`);
      contentHTML = fact.content.replace(reg, `<span class="highlight">$1</span>`);
    }
    
    const card = document.createElement("div");
    card.className = "fact-card";
    card.innerHTML = `
      <div class="fact-card-title">
        <span>📌 ${titleHTML}</span>
        <span class="fact-card-cat">${getCatName(fact.cat)}</span>
      </div>
      <div class="fact-card-content">${contentHTML}</div>
    `;
    container.appendChild(card);
  });
}

function handleSearch() {
  const kw = document.getElementById("search-input").value.trim();
  if (!kw) {
    renderFacts(FACTS);
    return;
  }
  const filtered = FACTS.filter(f => 
    f.title.toLowerCase().includes(kw.toLowerCase()) || 
    f.content.toLowerCase().includes(kw.toLowerCase())
  );
  renderFacts(filtered, kw);
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ================= 12. 统计页渲染 (SVG Radar Chart + 连续打卡) =================
function updateStatsScreen() {
  document.getElementById("stat-streak-days").textContent = `已连续备考 ${userProgress.streak} 天`;
  renderCheckInCalendar();
  renderRadarChart();
}

function renderCheckInCalendar() {
  const container = document.getElementById("checkin-grid-container");
  container.innerHTML = "";
  
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - i);
    
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const isChecked = userProgress.checkInDays.includes(dateStr);
    const dayName = weekdays[targetDate.getDay()];
    
    const cell = document.createElement("div");
    cell.className = `checkin-day ${isChecked ? 'checked' : ''}`;
    cell.innerHTML = `
      <div style="font-weight:600;">${day}</div>
      <div style="font-size:8px; opacity:0.8;">周${dayName}</div>
    `;
    container.appendChild(cell);
  }
}

function renderRadarChart() {
  // 时政模块使用条形图替代雷达图
  if (currentSubject === 'politics') {
    if (typeof renderPoliticsBarChart === 'function') renderPoliticsBarChart();
    return;
  }
  // 恢复SVG显示（如从时政切回）
  const svgEl = document.getElementById('radar-chart-svg');
  if (svgEl) svgEl.style.display = '';
  const existingChart = svgEl?.parentElement?.querySelector('.politics-bar-chart');
  if (existingChart) existingChart.remove();
  
  const svg = document.getElementById("radar-chart-svg");
  svg.innerHTML = "";
  
  // 建立统一的 4 维/5 维雷达图框架
  let categories = [];
  if (currentSubject === "beijing") {
    categories = [
      { key: "history", name: "历史与概况" },
      { key: "geography", name: "地理与人口" },
      { key: "transport", name: "交通运输" },
      { key: "culture", name: "文化与休闲" }
    ];
  } else if (currentSubject === "theory") {
    categories = [
      { key: "governance", name: "全球治理" },
      { key: "domestic", name: "国内考察" },
      { key: "reform", name: "改革消费" },
      { key: "special", name: "两会一号" },
      { key: "laws", name: "法律常识" }
    ];
  } else if (currentSubject === "guidebook") {
    categories = [
      { key: "general", name: "政治理论" },
      { key: "sub_xisixiang", name: "习思想分" },
      { key: "leadership", name: "党的领导" },
      { key: "people", name: "人民中心" },
      { key: "development", name: "首要发展" },
      { key: "modernization", name: "中国式现代化" },
      { key: "mayuan", name: "马原原理" }
    ];
  } else if (currentSubject === "quant") {
    categories = [
      { key: "baihuafen", name: "百化分" },
      { key: "fraction_cmp", name: "分数比大小" },
      { key: "assume_alloc", name: "假设分配" }
    ];
  } else {
    categories = [
      { key: "group1", name: "第一组" },
      { key: "group2", name: "第二组" },
      { key: "group3", name: "第三组" },
      { key: "group4", name: "第四组" },
      { key: "group5", name: "第五组" },
      { key: "group6", name: "第六组" },
      { key: "group7", name: "第七组" }
    ];
  }
  
  const progress = getActiveProgress();
  
  // 计算正确率分值
  const scores = categories.map(cat => {
    const catQs = QUESTIONS.filter(q => q.category === cat.key);
    const totalCount = catQs.length;
    let correctCount = 0;
    catQs.forEach(q => {
      if (progress.answers[q.id] && progress.answers[q.id].correct) {
        correctCount++;
      }
    });
    return totalCount > 0 ? (correctCount / totalCount) : 0;
  });
  
  const cx = 100;
  const cy = 100;
  const maxR = 70;
  const N = categories.length; // 动态多边形边数
  
  // 1. 蛛网网格三层
  const scales = [0.35, 0.7, 1.0];
  scales.forEach(scale => {
    const r = maxR * scale;
    let points = [];
    for (let i = 0; i < N; i++) {
      const angle = (i * 2 * Math.PI / N) - Math.PI / 2;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      points.push(`${px},${py}`);
    }
    
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points", points.join(" "));
    polygon.setAttribute("fill", "none");
    polygon.setAttribute("stroke", "var(--border-color)");
    polygon.setAttribute("stroke-width", scale === 1.0 ? "1" : "0.5");
    svg.appendChild(polygon);
  });
  
  // 2. 轴线线段与文本
  for (let i = 0; i < N; i++) {
    const angle = (i * 2 * Math.PI / N) - Math.PI / 2;
    const px = cx + maxR * Math.cos(angle);
    const py = cy + maxR * Math.sin(angle);
    
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", cx);
    line.setAttribute("y1", cy);
    line.setAttribute("x2", px);
    line.setAttribute("y2", py);
    line.setAttribute("stroke", "var(--border-color)");
    line.setAttribute("stroke-dasharray", "2,2");
    svg.appendChild(line);
    
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    
    // 自动微调标签偏移量
    const cosVal = Math.cos(angle);
    const sinVal = Math.sin(angle);
    let tx = cx + (maxR + 12) * cosVal;
    let ty = cy + (maxR + 10) * sinVal;
    
    // 设置文字锚点以防遮挡
    let textAnchor = "middle";
    if (cosVal > 0.15) {
      textAnchor = "start";
      tx += 2;
    } else if (cosVal < -0.15) {
      textAnchor = "end";
      tx -= 2;
    }
    
    if (Math.abs(cosVal) < 0.1) {
      if (sinVal > 0) ty += 4;
      else ty -= 2;
    } else {
      ty += 3;
    }
    
    text.setAttribute("x", tx);
    text.setAttribute("y", ty);
    text.setAttribute("text-anchor", textAnchor);
    text.setAttribute("fill", "var(--text-main)");
    text.setAttribute("font-size", "8px");
    text.setAttribute("font-weight", "600");
    text.textContent = categories[i].name;
    svg.appendChild(text);
  }
  
  // 3. 数据覆盖渲染
  let valPoints = [];
  scores.forEach((score, i) => {
    const factor = Math.max(0.15, score);
    const r = maxR * factor;
    const angle = (i * 2 * Math.PI / N) - Math.PI / 2;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    valPoints.push(`${px},${py}`);
    
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", px);
    dot.setAttribute("cy", py);
    dot.setAttribute("r", "2.5");
    dot.setAttribute("fill", "var(--primary)");
    dot.setAttribute("stroke", "white");
    dot.setAttribute("stroke-width", "0.5");
    svg.appendChild(dot);
  });
  
  const valPolygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  valPolygon.setAttribute("points", valPoints.join(" "));
  valPolygon.setAttribute("fill", "var(--primary-glow)");
  valPolygon.setAttribute("stroke", "var(--primary)");
  valPolygon.setAttribute("stroke-width", "1.5");
  svg.insertBefore(valPolygon, svg.firstChild);
}

// ================= 13. 系统备份与重置管理 =================
function exportData() {
  if (!currentUser || !userProgress) {
    alert("请先登录后再导出数据！");
    return;
  }

  const todayStr = getTodayStr();
  const subjectNames = {
    beijing: "北京市情",
    idioms: "成语·言语",
    politics: "时政·月度热点",
    theory: "政治·理论",
    guidebook: "小黑排坑手册",
    quant: "资料·速算"
  };

  // 统计各科目进度
  let statsRows = "";
  const subjects = ["beijing", "idioms", "politics", "theory", "guidebook", "quant"];
  subjects.forEach(sub => {
    const prog = userProgress[sub] || {};
    const answers = prog.answers || {};
    const mistakes = prog.mistakes || [];
    const answered = Object.keys(answers).length;
    const correct = Object.values(answers).filter(a => a.correct).length;
    const total = SUBJECT_DATA[sub] ? SUBJECT_DATA[sub].questions.length : 0;
    const pct = answered > 0 ? Math.round(correct / answered * 100) : 0;
    statsRows += `
      <tr>
        <td style="padding:8px 12px; border:1px solid #ddd;">${subjectNames[sub] || sub}</td>
        <td style="padding:8px 12px; border:1px solid #ddd; text-align:center;">${total}</td>
        <td style="padding:8px 12px; border:1px solid #ddd; text-align:center;">${answered}</td>
        <td style="padding:8px 12px; border:1px solid #ddd; text-align:center;">${correct}</td>
        <td style="padding:8px 12px; border:1px solid #ddd; text-align:center;">${mistakes.length}</td>
        <td style="padding:8px 12px; border:1px solid #ddd; text-align:center;">${pct}%</td>
      </tr>`;
  });

  // 导出所有错题明细
  let mistakeRows = "";
  let mistakeCount = 0;
  subjects.forEach(sub => {
    const prog = userProgress[sub] || {};
    const mistakeIds = prog.mistakes || [];
    const qData = SUBJECT_DATA[sub] ? SUBJECT_DATA[sub].questions : [];
    mistakeIds.forEach(mid => {
      const q = qData.find(x => x.id === mid);
      if (!q) return;
      mistakeCount++;
      const opts = (q.options || []).map((o, i) => {
        const letter = String.fromCharCode(65 + i);
        const isCorrect = q.answer === letter || (Array.isArray(q.answer) && q.answer.includes(letter));
        return `<span style="color:${isCorrect ? '#27ae60' : '#333'}; ${isCorrect ? 'font-weight:bold;' : ''}">${letter}. ${o}</span>`;
      }).join("&nbsp;&nbsp;");
      mistakeRows += `
        <tr>
          <td style="padding:8px 12px; border:1px solid #ddd; color:#888; font-size:11px;">${mistakeCount}</td>
          <td style="padding:8px 12px; border:1px solid #ddd; font-size:11px;">${subjectNames[sub] || sub}</td>
          <td style="padding:8px 12px; border:1px solid #ddd;">${q.question || q.front || ""}</td>
          <td style="padding:8px 12px; border:1px solid #ddd; font-size:12px;">${opts || (q.answer || "")}</td>
          <td style="padding:8px 12px; border:1px solid #ddd; color:#2563eb; font-size:12px;">${Array.isArray(q.answer) ? q.answer.join("") : (q.answer || "")}</td>
          <td style="padding:8px 12px; border:1px solid #ddd; font-size:11px; color:#555;">${q.explanation || q.back || "—"}</td>
        </tr>`;
    });
  });

  const memberLabel = allUsers[currentUser] && allUsers[currentUser].membership === "super" ? "超级会员 👑" : "普通会员";
  const checkinDays = (userProgress.checkInDays || []).length;

  const html = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="UTF-8">
  <title>京通备考刷题报告</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Normal</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body { font-family: "SimSun", "宋体", serif; font-size: 12pt; line-height: 1.8; color: #222; }
    h1 { font-size: 18pt; color: #c0392b; text-align: center; margin-bottom: 6px; }
    h2 { font-size: 14pt; color: #2c3e50; border-bottom: 2px solid #c0392b; padding-bottom: 4px; margin-top: 24px; }
    table { border-collapse: collapse; width: 100%; margin-top: 12px; }
    th { background: #c0392b; color: white; padding: 8px 12px; border: 1px solid #999; font-size: 11pt; }
    td { vertical-align: top; }
    .meta { text-align: center; color: #888; font-size: 10pt; margin-bottom: 20px; }
    .no-mistake { color: #27ae60; font-size: 12pt; padding: 12px; text-align: center; }
  </style>
</head>
<body>
  <h1>📚 京通备考刷题学习报告</h1>
  <div class="meta">
    用户：<strong>${currentUser}</strong>&nbsp;&nbsp;|&nbsp;&nbsp;会员级别：${memberLabel}&nbsp;&nbsp;|&nbsp;&nbsp;
    导出日期：${todayStr}&nbsp;&nbsp;|&nbsp;&nbsp;累计签到：${checkinDays} 天
  </div>

  <h2>📊 各科目学习进度汇总</h2>
  <table>
    <thead>
      <tr>
        <th>科目</th>
        <th>题目总数</th>
        <th>已作答</th>
        <th>答对数</th>
        <th>错题数</th>
        <th>正确率</th>
      </tr>
    </thead>
    <tbody>
      ${statsRows}
    </tbody>
  </table>

  <h2>❌ 全科目错题本 (共 ${mistakeCount} 道)</h2>
  ${mistakeCount === 0 ? '<div class="no-mistake">🎉 暂无错题，继续保持！</div>' : `
  <table>
    <thead>
      <tr>
        <th style="width:30px;">#</th>
        <th style="width:60px;">科目</th>
        <th style="width:200px;">题目</th>
        <th style="width:200px;">选项</th>
        <th style="width:50px;">正确答案</th>
        <th>解析</th>
      </tr>
    </thead>
    <tbody>
      ${mistakeRows}
    </tbody>
  </table>`}

  <p style="text-align:center; color:#aaa; font-size:9pt; margin-top:36px;">
    由「京通备考刷题宝典」自动生成 · ${todayStr}
  </p>
</body>
</html>`;

  const blob = new Blob(['\ufeff' + html], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", url);
  dlAnchor.setAttribute("download", `京通备考报告_${currentUser}_${todayStr}.doc`);
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function importDataClick() {
  document.getElementById("import-file-input").click();
}

function handleImportData(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const parsed = JSON.parse(evt.target.result);
      if (parsed && typeof parsed === "object") {
        userProgress = parsed;
        saveProgress();
        selectSubject(currentSubject);
        alert("备考数据导入成功！已成功还原学习记录。");
        switchScreen("home");
      } else {
        alert("格式有误，无法识别该数据备份！");
      }
    } catch (err) {
      alert("导入失败，文件内容并非合法的 JSON 数据！");
    }
  };
  reader.readAsText(file);
}

function resetAllData() {
  if (confirm("🚨 警告：此操作将永久清空您在此应用中的所有答题记录、错题本与签到记录，且不可恢复！\n\n确定要继续重置吗？")) {
    userProgress = {
      beijing: { answers: {}, mistakes: [], favorites: [] },
      idioms: { answers: {}, mistakes: [], favorites: [] },
      politics: { answers: {}, mistakes: [], favorites: [] },
      theory: { answers: {}, mistakes: [], favorites: [] },
      guidebook: { answers: {}, mistakes: [], favorites: [] },
      quant: { answers: {}, mistakes: [], favorites: [] },
      checkInDays: [getTodayStr()],
      streak: 1
    };
    saveProgress();
    selectSubject(currentSubject);
    alert("您的学习记录已全部归零。");
    switchScreen("home");
  }
}

// ================= 14. 工具函数 =================
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ================= 15. 申论范文背诵 (Essay Recitation) =================
let recitationMaskMode = "all-mask"; // "all-mask", "thesis", "golden", "reveal"
let currentEssay = null;

async function startRecitation() {
  if (allUsers[currentUser] && allUsers[currentUser].membership !== "super") {
    const upgraded = await tryLocalSuperUpgrade("申论大作文范文背诵");
    if (!upgraded) return;
  }

  currentMode = "recitation";
  
  const selector = document.getElementById("recitation-essay-selector");
  if (!selector) return;
  
  // 渲染下拉菜单
  selector.innerHTML = "";
  ESSAYS_DATA.forEach((essay, idx) => {
    const opt = document.createElement("option");
    opt.value = essay.id;
    opt.textContent = `${idx + 1}. ${essay.title}`;
    selector.appendChild(opt);
  });
  
  // 绑定切换事件
  if (!selector.dataset.bound) {
    selector.addEventListener("change", (e) => {
      loadRecitationEssay(parseInt(e.target.value));
    });
    selector.dataset.bound = "true";
  }
  
  // 绑定挖空点击事件（一次绑定，委托处理）
  const bodyView = document.getElementById("recitation-essay-body-view");
  if (bodyView && !bodyView.dataset.bound) {
    bodyView.addEventListener("click", (e) => {
      const btn = e.target.closest(".essay-mask-btn");
      if (!btn) return;
      
      const text = btn.getAttribute("data-text");
      const type = btn.getAttribute("data-type");
      
      if (btn.classList.contains("revealed")) {
        btn.classList.remove("revealed");
        btn.innerHTML = `🔑 显隐${type === 'thesis' ? '分论' : '金句'}`;
      } else {
        btn.classList.add("revealed");
        btn.innerHTML = text;
      }
    });
    bodyView.dataset.bound = "true";
  }
  
  // 默认加载第一篇
  if (ESSAYS_DATA.length > 0) {
    selector.value = ESSAYS_DATA[0].id;
    loadRecitationEssay(ESSAYS_DATA[0].id);
  }
  
  // 启动计时器
  startPracticeTimer("recitation-timer", "recitation-timer-text");
  
  // 切换屏幕
  switchScreen("recitation");
}

function loadRecitationEssay(essayId) {
  const essay = ESSAYS_DATA.find(e => e.id === essayId);
  if (!essay) return;
  
  currentEssay = essay;
  
  // 渲染标题和来源
  document.getElementById("recitation-essay-title-view").textContent = essay.title;
  document.getElementById("recitation-essay-source-view").textContent = `首发媒体：${essay.source}`;
  
  // 重新渲染范文主体
  renderRecitationBody();
}

function setRecitationMaskMode(mode) {
  recitationMaskMode = mode;
  
  // 切换按钮高亮
  const modes = ["all-mask", "thesis", "golden", "reveal"];
  modes.forEach(m => {
    const btn = document.getElementById(`recitation-mode-${m}`);
    if (btn) {
      if (m === mode) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    }
  });
  
  // 重新渲染范文主体
  renderRecitationBody();
}

function renderRecitationBody() {
  if (!currentEssay) return;
  
  const container = document.getElementById("recitation-essay-body-view");
  if (!container) return;
  
  container.innerHTML = "";
  
  currentEssay.paragraphs.forEach(para => {
    const pEl = document.createElement("p");
    let text = para.text;
    
    // 对段落中的掩码进行替换
    para.masks.forEach(mask => {
      const escapedText = mask.text.replace(/"/g, '&quot;');
      const label = mask.type === 'thesis' ? '分论' : '金句';
      
      // 判断当前掩码是否应当处于隐藏状态
      let shouldHide = false;
      if (recitationMaskMode === "all-mask") {
        shouldHide = true;
      } else if (recitationMaskMode === "thesis" && mask.type === "thesis") {
        shouldHide = true;
      } else if (recitationMaskMode === "golden" && mask.type === "golden") {
        shouldHide = true;
      }
      
      let htmlRepl = "";
      if (shouldHide) {
        htmlRepl = `<span class="essay-mask-btn" data-text="${escapedText}" data-type="${mask.type}">🔑 显隐${label}</span>`;
      } else {
        htmlRepl = `<span class="essay-mask-btn revealed" data-text="${escapedText}" data-type="${mask.type}">${mask.text}</span>`;
      }
      
      // 替换文字
      text = text.replace(mask.text, htmlRepl);
    });
    
    pEl.innerHTML = text;
    container.appendChild(pEl);
  });
}


// ================= 16. 申论金句专项背诵 =================
let goldenQuotesPool = [];
let goldenRecitationMode = "mask"; // "mask" | "reveal"

function collectGoldenQuotes() {
  const quotes = [];
  if (typeof ESSAYS_DATA === "undefined" || !Array.isArray(ESSAYS_DATA)) return quotes;

  ESSAYS_DATA.forEach(essay => {
    if (!essay || !Array.isArray(essay.paragraphs)) return;
    essay.paragraphs.forEach(para => {
      if (!Array.isArray(para.masks)) return;
      para.masks.forEach(mask => {
        if (mask.type === "golden") {
          quotes.push({
            text: mask.text,
            essayTitle: essay.title || "未知范文",
            essayId: essay.id
          });
        }
      });
    });
  });
  return quotes;
}

async function startGoldenRecitation() {
  if (allUsers[currentUser] && allUsers[currentUser].membership !== "super") {
    const upgraded = await tryLocalSuperUpgrade("申论金句专项背诵");
    if (!upgraded) return;
  }

  currentMode = "golden-recitation";
  goldenQuotesPool = shuffleArray(collectGoldenQuotes());
  goldenRecitationMode = "mask";

  // 重置按钮高亮
  ["mask", "reveal"].forEach(m => {
    const btn = document.getElementById(`golden-mode-${m}`);
    if (btn) {
      if (m === goldenRecitationMode) btn.classList.add("active");
      else btn.classList.remove("active");
    }
  });

  renderGoldenRecitation();
  switchScreen("golden-recitation");
}

function setGoldenMode(mode) {
  goldenRecitationMode = mode;
  ["mask", "reveal"].forEach(m => {
    const btn = document.getElementById(`golden-mode-${m}`);
    if (btn) {
      if (m === mode) btn.classList.add("active");
      else btn.classList.remove("active");
    }
  });
  renderGoldenRecitation();
}

function toggleGoldenCard(el) {
  if (!el) return;
  const isRevealed = el.classList.contains("revealed");
  const textEl = el.querySelector(".golden-card-text");
  const maskEl = el.querySelector(".golden-card-mask");
  if (!textEl || !maskEl) return;

  if (isRevealed) {
    el.classList.remove("revealed");
    textEl.style.display = "none";
    maskEl.style.display = "flex";
  } else {
    el.classList.add("revealed");
    textEl.style.display = "block";
    maskEl.style.display = "none";
  }
}

function renderGoldenRecitation() {
  const container = document.getElementById("golden-recitation-container");
  const progressEl = document.getElementById("golden-recitation-progress");
  if (!container) return;

  container.innerHTML = "";
  if (progressEl) progressEl.textContent = `${goldenQuotesPool.length} 句金句`;

  if (goldenQuotesPool.length === 0) {
    container.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:40px 20px;">暂无金句数据</div>`;
    return;
  }

  goldenQuotesPool.forEach((quote, idx) => {
    const card = document.createElement("div");
    card.className = "golden-recitation-card";
    card.style.cssText = `
      margin-bottom: 12px;
      padding: 14px;
      border-radius: var(--border-radius-md);
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
      cursor: pointer;
      transition: var(--transition);
    `;
    card.onclick = () => toggleGoldenCard(card);

    const isRevealed = goldenRecitationMode === "reveal";
    if (isRevealed) card.classList.add("revealed");

    const badgeHtml = `<div style="font-size:9px;font-weight:800;color:var(--primary);margin-bottom:8px;">📖 ${escapeHtml(quote.essayTitle)}</div>`;
    const textHtml = `<div class="golden-card-text serif-font" style="display:${isRevealed ? "block" : "none"};font-size:14px;line-height:1.8;color:var(--text-main);text-align:justify;">${escapeHtml(quote.text)}</div>`;
    const maskHtml = `<div class="golden-card-mask" style="display:${isRevealed ? "none" : "flex"};align-items:center;justify-content:center;min-height:48px;border-radius:var(--border-radius-sm);background:rgba(192,57,43,0.08);color:var(--primary);font-size:12px;font-weight:700;">🔑 点击显示金句 ${idx + 1}</div>`;

    card.innerHTML = badgeHtml + textHtml + maskHtml;
    container.appendChild(card);
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// ================= 17. 申论精简笔记翻转卡 =================
let shenlunCardsData = [];
let shenlunFilteredCards = [];
let shenlunCurrentIndex = 0;
let shenlunCurrentCategory = "全部";
let shenlunCardFlipped = false;

async function startShenlunCards() {
  currentMode = "shenlun-cards";

  if (shenlunCardsData.length === 0) {
    try {
      const res = await fetch("data/申论精简笔记.json");
      if (!res.ok) throw new Error("加载失败");
      shenlunCardsData = await res.json();
    } catch (e) {
      alert("申论精简笔记加载失败，请检查 data/申论精简笔记.json 是否存在。");
      return;
    }
  }

  shenlunCurrentCategory = "全部";
  filterShenlunCards();
  renderShenlunFilter();
  renderShenlunCard();
  switchScreen("shenlun-cards");
}

function getShenlunCategories() {
  const cats = new Set();
  shenlunCardsData.forEach(item => {
    if (item.category) cats.add(item.category);
  });
  return ["全部", ...Array.from(cats)];
}

function filterShenlunCards() {
  if (shenlunCurrentCategory === "全部") {
    shenlunFilteredCards = [...shenlunCardsData];
  } else {
    shenlunFilteredCards = shenlunCardsData.filter(item => item.category === shenlunCurrentCategory);
  }
  shenlunCurrentIndex = 0;
  shenlunCardFlipped = false;
}

function setShenlunCategory(cat) {
  shenlunCurrentCategory = cat;
  filterShenlunCards();
  renderShenlunFilter();
  renderShenlunCard();
}

function renderShenlunFilter() {
  const container = document.getElementById("shenlun-cards-filter");
  if (!container) return;
  container.innerHTML = "";

  getShenlunCategories().forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "limit-btn";
    btn.textContent = cat;
    btn.style.cssText = "white-space: nowrap; padding: 6px 12px; font-size: 11px; font-weight: 700;";
    if (cat === shenlunCurrentCategory) btn.classList.add("active");
    btn.onclick = (e) => {
      e.stopPropagation();
      setShenlunCategory(cat);
    };
    container.appendChild(btn);
  });
}

function renderShenlunCard() {
  const progressEl = document.getElementById("shenlun-cards-progress");
  const inner = document.getElementById("shenlun-flip-card-inner");
  const frontCategory = document.getElementById("shenlun-card-category");
  const frontName = document.getElementById("shenlun-card-name");
  const backContent = document.getElementById("shenlun-card-back-content");

  if (!inner || !frontCategory || !frontName || !backContent) return;

  if (progressEl) {
    progressEl.textContent = shenlunFilteredCards.length > 0
      ? `${shenlunCurrentIndex + 1} / ${shenlunFilteredCards.length}`
      : "0 / 0";
  }

  if (shenlunFilteredCards.length === 0) {
    frontCategory.textContent = "-";
    frontName.textContent = "暂无卡片";
    backContent.innerHTML = "<div style='text-align:center;color:var(--text-muted);'>该分类下暂无内容</div>";
    return;
  }

  const item = shenlunFilteredCards[shenlunCurrentIndex];
  frontCategory.textContent = item.category || "申论";
  frontName.textContent = item.name || "未命名";

  const notes = item.core_notes || {};
  let html = "";

  if (notes.definition_and_usage) {
    html += `<div style="margin-bottom:12px;"><div style="font-size:10px;font-weight:800;color:var(--primary);margin-bottom:4px;">📌 定义与用途</div><div style="white-space:pre-wrap;">${escapeHtml(notes.definition_and_usage)}</div></div>`;
  }

  if (notes.writing_format) {
    html += `<div style="margin-bottom:12px;"><div style="font-size:10px;font-weight:800;color:var(--primary);margin-bottom:4px;">📝 写作格式</div>`;
    const fmt = notes.writing_format;
    if (fmt.title_rules) html += `<div style="margin-bottom:4px;"><span style="font-weight:700;">标题：</span>${escapeHtml(fmt.title_rules)}</div>`;
    if (fmt.recipient_rules) html += `<div style="margin-bottom:4px;"><span style="font-weight:700;">称谓：</span>${escapeHtml(fmt.recipient_rules)}</div>`;
    if (fmt.body_structure) html += `<div style="margin-bottom:4px;"><span style="font-weight:700;">正文：</span>${escapeHtml(fmt.body_structure)}</div>`;
    if (fmt.sender_date_rules) html += `<div style="margin-bottom:4px;"><span style="font-weight:700;">落款：</span>${escapeHtml(fmt.sender_date_rules)}</div>`;
    html += `</div>`;
  }

  if (Array.isArray(notes.solving_steps) && notes.solving_steps.length > 0) {
    html += `<div style="margin-bottom:12px;"><div style="font-size:10px;font-weight:800;color:var(--primary);margin-bottom:4px;">🔢 解题步骤</div><ol style="margin:0;padding-left:18px;">`;
    notes.solving_steps.forEach(step => {
      html += `<li style="margin-bottom:4px;">${escapeHtml(step)}</li>`;
    });
    html += `</ol></div>`;
  }

  if (Array.isArray(notes.golden_sentences_or_templates) && notes.golden_sentences_or_templates.length > 0) {
    html += `<div style="margin-bottom:8px;"><div style="font-size:10px;font-weight:800;color:var(--primary);margin-bottom:4px;">✨ 金句/模板</div><ul style="margin:0;padding-left:18px;">`;
    notes.golden_sentences_or_templates.forEach(tpl => {
      html += `<li style="margin-bottom:4px;white-space:pre-wrap;">${escapeHtml(tpl)}</li>`;
    });
    html += `</ul></div>`;
  }

  backContent.innerHTML = html || "<div style='text-align:center;color:var(--text-muted);'>暂无详细内容</div>";

  // 确保翻转状态一致
  inner.style.transform = shenlunCardFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
}

function flipShenlunCard() {
  const inner = document.getElementById("shenlun-flip-card-inner");
  if (!inner) return;
  shenlunCardFlipped = !shenlunCardFlipped;
  inner.style.transform = shenlunCardFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
}

function nextShenlunCard() {
  if (shenlunFilteredCards.length === 0) return;
  shenlunCardFlipped = false;
  shenlunCurrentIndex = (shenlunCurrentIndex + 1) % shenlunFilteredCards.length;
  renderShenlunCard();
}

function prevShenlunCard() {
  if (shenlunFilteredCards.length === 0) return;
  shenlunCardFlipped = false;
  shenlunCurrentIndex = (shenlunCurrentIndex - 1 + shenlunFilteredCards.length) % shenlunFilteredCards.length;
  renderShenlunCard();
}


// ================= 18. 时政精读（时事政治精简笔记） =================
let politicsNotesData = [];
let politicsNotesMonths = [];
let politicsNotesCurrentMonth = "全部";
let politicsNotesExpandedIndex = -1;

async function startPoliticsNotes() {
  currentMode = "politics-notes";

  if (politicsNotesData.length === 0) {
    try {
      const res = await fetch("data/时事政治精简笔记_cleaned.json");
      if (!res.ok) throw new Error("加载失败");
      politicsNotesData = await res.json();
      politicsNotesMonths = politicsNotesData.map(m => m.month);
    } catch (e) {
      alert("时政精简笔记加载失败，请检查 data/时事政治精简笔记_cleaned.json 是否存在。");
      return;
    }
  }

  politicsNotesCurrentMonth = "全部";
  politicsNotesExpandedIndex = -1;
  renderPoliticsNotesMonthFilter();
  renderPoliticsNotesList();
  switchScreen("politics-notes");
}

function renderPoliticsNotesMonthFilter() {
  const container = document.getElementById("politics-notes-month-filter");
  if (!container) return;
  container.innerHTML = "";

  const months = ["全部", ...politicsNotesMonths];
  months.forEach(m => {
    const btn = document.createElement("button");
    btn.className = "limit-btn";
    btn.textContent = m;
    btn.style.cssText = "white-space: nowrap; padding: 6px 12px; font-size: 11px; font-weight: 700;";
    if (m === politicsNotesCurrentMonth) btn.classList.add("active");
    btn.onclick = (e) => {
      e.stopPropagation();
      politicsNotesCurrentMonth = m;
      politicsNotesExpandedIndex = -1;
      renderPoliticsNotesMonthFilter();
      renderPoliticsNotesList();
    };
    container.appendChild(btn);
  });
}

function getPoliticsNotesItems() {
  if (politicsNotesCurrentMonth === "全部") {
    const items = [];
    politicsNotesData.forEach(monthData => {
      (monthData.news_items || []).forEach(item => {
        items.push({ ...item, month: monthData.month });
      });
    });
    return items;
  }
  const monthData = politicsNotesData.find(m => m.month === politicsNotesCurrentMonth);
  if (!monthData) return [];
  return (monthData.news_items || []).map(item => ({ ...item, month: monthData.month }));
}

function renderPoliticsNotesList() {
  const container = document.getElementById("politics-notes-list");
  const progressEl = document.getElementById("politics-notes-progress");
  if (!container) return;

  const items = getPoliticsNotesItems();
  if (progressEl) progressEl.textContent = `${items.length} 条新闻`;

  container.innerHTML = "";
  if (items.length === 0) {
    container.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:40px 20px;">该月份下暂无新闻</div>`;
    return;
  }

  items.forEach((item, idx) => {
    const isExpanded = idx === politicsNotesExpandedIndex;
    const card = document.createElement("div");
    card.style.cssText = `
      margin-bottom: 10px;
      border-radius: var(--border-radius-md);
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    `;

    const header = document.createElement("div");
    header.style.cssText = `
      padding: 12px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      gap: 10px;
    `;
    header.onclick = () => togglePoliticsNoteItem(idx);

    const importanceColor = item.importance === "★★" ? "#e74c3c" : "#f39c12";
    header.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">
        <span style="font-size:11px;font-weight:800;color:${importanceColor};white-space:nowrap;">${item.importance || "★"}</span>
        <span style="font-size:10px;color:var(--text-muted);background:rgba(192,57,43,0.08);padding:2px 6px;border-radius:4px;white-space:nowrap;">${escapeHtml(item.category || "时政")}</span>
        <span style="font-size:13px;font-weight:700;color:var(--text-main);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(item.title)}</span>
      </div>
      <span style="font-size:12px;color:var(--text-muted);white-space:nowrap;">${isExpanded ? "收起 ▲" : "展开 ▼"}</span>
    `;
    card.appendChild(header);

    if (isExpanded) {
      const body = document.createElement("div");
      body.style.cssText = "padding: 0 14px 14px; border-top: 1px solid var(--border-color);";

      // 背诵要点
      const points = item.reciting_points || [];
      if (points.length > 0) {
        const cleanPoints = points.filter(p => typeof p === "string" && p.trim().length > 0);
        const pointsHtml = cleanPoints.map(p => {
          const trimmed = p.trim();
          // 过滤掉纯数字、纯符号、过短的笔记标记
          if (/^[①②③④⑤⑥⑦⑧⑨⑩0-9\s\.·-]+$/.test(trimmed) || trimmed.length < 2) return "";
          return `<li style="margin-bottom:6px;white-space:pre-wrap;">${escapeHtml(trimmed)}</li>`;
        }).filter(Boolean).join("");
        if (pointsHtml) {
          body.innerHTML += `<div style="margin-bottom:14px;">
            <div style="font-size:11px;font-weight:800;color:var(--primary);margin-bottom:6px;">📌 背诵要点</div>
            <ul style="margin:0;padding-left:18px;font-size:12px;line-height:1.7;color:var(--text-main);">${pointsHtml}</ul>
          </div>`;
        }
      }

      // 配套题目
      const questions = item.questions || [];
      if (questions.length > 0) {
        body.innerHTML += `<div style="font-size:11px;font-weight:800;color:var(--primary);margin-bottom:8px;">📝 配套题目 (${questions.length}题)</div>`;
        questions.forEach((q, qIdx) => {
          const qText = (q.question_text || q.question || "").replace(/[\n\r]+/g, "\n").trim();
          const opts = (q.options || []).map((opt, oIdx) => {
            const cleanOpt = String(opt).replace(/[\n\r]+/g, "\n").trim();
            return `<div style="margin:3px 0;padding:6px 8px;background:rgba(0,0,0,0.03);border-radius:4px;font-size:12px;line-height:1.5;">${String.fromCharCode(65 + oIdx)}. ${escapeHtml(cleanOpt)}</div>`;
          }).join("");
          const answerText = q.answer ? `<div style="margin-top:6px;font-size:11px;color:#27ae60;font-weight:700;">答案：${escapeHtml(String(q.answer))}</div>` : "";
          body.innerHTML += `<div style="margin-bottom:12px;padding:10px;background:rgba(0,0,0,0.02);border-radius:var(--border-radius-sm);border:1px solid var(--border-color);">
            <div style="font-size:12px;font-weight:700;margin-bottom:6px;white-space:pre-wrap;">${qIdx + 1}. ${escapeHtml(qText)}</div>
            ${opts}
            ${answerText}
          </div>`;
        });
      }

      card.appendChild(body);
    }

    container.appendChild(card);
  });
}

function togglePoliticsNoteItem(idx) {
  politicsNotesExpandedIndex = politicsNotesExpandedIndex === idx ? -1 : idx;
  renderPoliticsNotesList();
}

// ================= 8. 经典行测错题集模块 (PDF Mistakes Module) =================
const PDF_DATA = {
  logic: {
    title: "判断推理 - 经典错题复盘本",
    url: "data/判断推理.pdf",
    totalPages: 37,
    color: "#9b59b6",
    checklist: [
      { id: 1, label: "命题逻辑与核心推导公式 (第 1-10 页)", pages: [1, 9] },
      { id: 2, label: "图形推理常考六大规律 (第 11-20 页)", pages: [10, 19] },
      { id: 3, label: "定义判断核心关键词抓取 (第 21-30 页)", pages: [20, 29] },
      { id: 4, label: "类比推理逻辑与常识关系 (第 31-38 页)", pages: [30, 37] }
    ]
  },
  verbal: {
    title: "言语理解与表达 - 高频错题集",
    url: "data/言语理解.pdf",
    totalPages: 60,
    color: "#2980b9",
    checklist: [
      { id: 1, label: "近义成语与高频词语深度辨析 (第 1-15 页)", pages: [1, 14] },
      { id: 2, label: "片段阅读主旨概括与行文脉络 (第 16-30 页)", pages: [15, 29] },
      { id: 3, label: "语句表达之排序与衔接技巧 (第 31-45 页)", pages: [30, 44] },
      { id: 4, label: "篇章阅读快速解题关键点 (第 46-61 页)", pages: [45, 60] }
    ]
  },
  quant: {
    title: "资料分析 - 提速速算口诀表",
    url: "data/资料分析.pdf",
    totalPages: 45,
    color: "#e67e22",
    checklist: [
      { id: 1, label: "核心公式推导与速算技巧 (第 1-15 页)", pages: [1, 14] },
      { id: 2, label: "增长率与增长量高频题型剖析 (第 16-30 页)", pages: [15, 29] },
      { id: 3, label: "比重与平均数计算及判断 (第 31-46 页)", pages: [30, 45] }
    ]
  }
};

let currentPdfSubject = "logic";

function initPdfMistakesScreen() {
  if (!userProgress) return;
  if (!userProgress.pdfProgress) userProgress.pdfProgress = { logic: 1, verbal: 1, quant: 1 };
  if (!userProgress.pdfNotes) userProgress.pdfNotes = { logic: "", verbal: "", quant: "" };
  if (!userProgress.pdfChecklist) userProgress.pdfChecklist = { logic: {}, verbal: {}, quant: {} };
  if (!userProgress.pdfMasteredPages) userProgress.pdfMasteredPages = { logic: {}, verbal: {}, quant: {} };

  switchPdfSubject(currentPdfSubject);
}

function switchPdfSubject(subjectId) {
  currentPdfSubject = subjectId;
  
  // 更新按钮样式
  document.querySelectorAll(".pdf-tab").forEach(tab => {
    tab.classList.remove("active");
    tab.style.background = "var(--bg-card)";
    tab.style.color = "var(--text-main)";
    tab.style.borderColor = "var(--border-color)";
  });
  
  const activeTab = document.getElementById(`pdf-tab-${subjectId}`);
  if (activeTab) {
    activeTab.classList.add("active");
    const activeColor = PDF_DATA[subjectId].color;
    activeTab.style.background = activeColor;
    activeTab.style.color = "#fff";
    activeTab.style.borderColor = activeColor;
  }

  const data = PDF_DATA[subjectId];
  
  // 更新标题与范围
  document.getElementById("pdf-subject-title").textContent = data.title;
  
  const slider = document.getElementById("pdf-page-slider");
  const input = document.getElementById("pdf-page-input");
  
  slider.max = data.totalPages;
  input.max = data.totalPages;
  
  const currentPage = userProgress.pdfProgress[subjectId] || 1;
  slider.value = currentPage;
  input.value = currentPage;
  
  updatePdfProgressLabel(subjectId, currentPage);

  // 渲染大纲清单
  renderPdfChecklist(subjectId);

  // 加载笔记
  document.getElementById("pdf-notes-area").value = userProgress.pdfNotes[subjectId] || "";

  // 更新 PDF iFrame 链接与下载链接
  const downloadLink = document.getElementById("pdf-download-link");
  if (downloadLink) {
    downloadLink.href = data.url;
    downloadLink.style.color = data.color;
    downloadLink.style.borderColor = data.color;
  }
  
  updatePdfImage(subjectId, currentPage);
}

function updatePdfProgressLabel(subjectId, pageNum) {
  const total = PDF_DATA[subjectId].totalPages;
  const mastered = userProgress.pdfMasteredPages[subjectId] || {};
  const masteredCount = Object.keys(mastered).filter(p => mastered[p] === true).length;

  document.getElementById("pdf-progress-label").textContent = 
    `当前进度: 第 ${pageNum} / ${total} 页 (已掌握 ${masteredCount} 页)`;

  // 更新已掌握按钮的状态
  const btn = document.getElementById("btn-page-review-status");
  if (btn) {
    const isMastered = !!mastered[pageNum];
    if (isMastered) {
      btn.innerHTML = "✅ 已标记为已掌握";
      btn.style.color = "#27ae60";
      btn.style.borderColor = "#2cc36b";
      btn.style.background = "rgba(46, 204, 113, 0.1)";
    } else {
      btn.innerHTML = "📌 标记当前页已掌握";
      btn.style.color = "var(--text-main)";
      btn.style.borderColor = "var(--border-color)";
      btn.style.background = "var(--bg-input)";
    }
  }
}

function markCurrentPageAsReview() {
  const subjectId = currentPdfSubject;
  const pageNum = userProgress.pdfProgress[subjectId] || 1;
  if (!userProgress.pdfMasteredPages[subjectId]) {
    userProgress.pdfMasteredPages[subjectId] = {};
  }

  const isMastered = !userProgress.pdfMasteredPages[subjectId][pageNum];
  userProgress.pdfMasteredPages[subjectId][pageNum] = isMastered;

  saveProgress();
  updatePdfProgressLabel(subjectId, pageNum);
}

function triggerRandomPdfReview() {
  const subjectId = currentPdfSubject;
  const data = PDF_DATA[subjectId];
  const total = data.totalPages;

  // 找出所有未掌握的页码
  const mastered = userProgress.pdfMasteredPages[subjectId] || {};
  const unmasteredPages = [];
  for (let p = 1; p <= total; p++) {
    if (!mastered[p]) {
      unmasteredPages.push(p);
    }
  }

  let targetPage;
  if (unmasteredPages.length > 0) {
    // 优先从没有掌握的页面中随机抽取
    const rndIdx = Math.floor(Math.random() * unmasteredPages.length);
    targetPage = unmasteredPages[rndIdx];
  } else {
    // 如果全部都已掌握，则从所有页面中随机抽取
    targetPage = Math.floor(Math.random() * total) + 1;
  }

  gotoPdfPage(subjectId, targetPage);

  // 提示用户已经跳转
  showNotificationPopup(`🎲 随机抽查：已跳转至第 ${targetPage} 页，开始复盘吧！`);
}

function showNotificationPopup(msg) {
  let el = document.getElementById("pdf-notif-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "pdf-notif-toast";
    el.style.position = "fixed";
    el.style.top = "20px";
    el.style.left = "50%";
    el.style.transform = "translateX(-50%)";
    el.style.background = "var(--primary)";
    el.style.color = "#fff";
    el.style.padding = "8px 16px";
    el.style.borderRadius = "20px";
    el.style.fontSize = "12px";
    el.style.fontWeight = "bold";
    el.style.zIndex = "9999";
    el.style.boxShadow = "var(--shadow-lg)";
    el.style.transition = "all 0.3s ease";
    el.style.opacity = "0";
    el.style.pointerEvents = "none";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = "1";
  el.style.top = "30px";

  clearTimeout(el._timer);
  el._timer = setTimeout(() => {
    el.style.opacity = "0";
    el.style.top = "20px";
  }, 2500);
}

function renderPdfChecklist(subjectId) {
  const container = document.getElementById("pdf-checklist-container");
  const countLabel = document.getElementById("pdf-checklist-count");
  if (!container || !countLabel) return;
  container.innerHTML = "";
  
  const list = PDF_DATA[subjectId].checklist;
  const userChecklist = userProgress.pdfChecklist[subjectId] || {};
  let checkedCount = 0;

  list.forEach(item => {
    const isChecked = !!userChecklist[item.id];
    if (isChecked) checkedCount++;

    const itemEl = document.createElement("div");
    itemEl.style.display = "flex";
    itemEl.style.alignItems = "center";
    itemEl.style.justifyContent = "space-between";
    itemEl.style.padding = "6px 8px";
    itemEl.style.background = "var(--bg-input)";
    itemEl.style.borderRadius = "4px";
    itemEl.style.fontSize = "11px";
    itemEl.style.border = "1px solid var(--border-color)";

    itemEl.innerHTML = `
      <div style="display: flex; align-items: center; gap: 6px; flex: 1;">
        <input type="checkbox" id="chk-${subjectId}-${item.id}" ${isChecked ? 'checked' : ''} 
          style="cursor: pointer; width: 14px; height: 14px; accent-color: ${PDF_DATA[subjectId].color};"
          onchange="togglePdfChecklist('${subjectId}', ${item.id}, this.checked)">
        <label for="chk-${subjectId}-${item.id}" style="cursor: pointer; color: ${isChecked ? 'var(--text-muted)' : 'var(--text-main)'}; text-decoration: ${isChecked ? 'line-through' : 'none'};">${item.label}</label>
      </div>
      <button onclick="gotoPdfPage('${subjectId}', ${item.pages[0]})" 
        style="padding: 2px 6px; font-size: 10px; border-radius: 3px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--primary); cursor: pointer; font-weight: 700; transition: all 0.2s;">
        跳转
      </button>
    `;
    container.appendChild(itemEl);
  });

  countLabel.textContent = `已完成: ${checkedCount} / ${list.length}`;
}

function togglePdfChecklist(subjectId, itemId, checked) {
  if (!userProgress.pdfChecklist[subjectId]) userProgress.pdfChecklist[subjectId] = {};
  userProgress.pdfChecklist[subjectId][itemId] = checked;
  saveProgress();
  renderPdfChecklist(subjectId);
}

function gotoPdfPage(subjectId, pageNum) {
  userProgress.pdfProgress[subjectId] = pageNum;
  const slider = document.getElementById("pdf-page-slider");
  const input = document.getElementById("pdf-page-input");
  if (slider) slider.value = pageNum;
  if (input) input.value = pageNum;
  updatePdfProgressLabel(subjectId, pageNum);
  
  updatePdfImage(subjectId, pageNum);
  saveProgress();
}

function handlePdfSliderChange(value) {
  const pageNum = parseInt(value, 10);
  userProgress.pdfProgress[currentPdfSubject] = pageNum;
  const input = document.getElementById("pdf-page-input");
  if (input) input.value = pageNum;
  updatePdfProgressLabel(currentPdfSubject, pageNum);
  
  updatePdfImage(currentPdfSubject, pageNum);
  saveProgress();
}

function handlePdfInputChange(value) {
  let pageNum = parseInt(value, 10);
  const max = PDF_DATA[currentPdfSubject].totalPages;
  if (isNaN(pageNum) || pageNum < 1) pageNum = 1;
  if (pageNum > max) pageNum = max;
  
  userProgress.pdfProgress[currentPdfSubject] = pageNum;
  const slider = document.getElementById("pdf-page-slider");
  const input = document.getElementById("pdf-page-input");
  if (slider) slider.value = pageNum;
  if (input) input.value = pageNum;
  updatePdfProgressLabel(currentPdfSubject, pageNum);
  
  updatePdfImage(currentPdfSubject, pageNum);
  saveProgress();
}

function changePdfPage(delta) {
  const current = userProgress.pdfProgress[currentPdfSubject] || 1;
  const target = current + delta;
  handlePdfInputChange(target);
}

let pdfNotesTimer = null;
function handlePdfNotesChange(value) {
  userProgress.pdfNotes[currentPdfSubject] = value;
  if (pdfNotesTimer) clearTimeout(pdfNotesTimer);
  pdfNotesTimer = setTimeout(() => {
    saveProgress();
  }, 1000);
}

function openPdfFromHome(pdfSubjectId) {
  currentPdfSubject = pdfSubjectId;
  switchScreen('pdf-mistakes');
}

function updateHomePdfProgress() {
  if (!userProgress) return;
  const pProg = userProgress.pdfProgress || { logic: 1, verbal: 1, quant: 1 };
  
  const subjects = ['logic', 'verbal', 'quant'];
  const totals = { logic: 37, verbal: 60, quant: 45 };
  
  subjects.forEach(sub => {
    const curPage = pProg[sub] || 1;
    const total = totals[sub];
    const pct = Math.round((curPage / total) * 100);
    
    const progLabel = document.getElementById(`home-pdf-prog-${sub}`);
    const progBar = document.getElementById(`home-pdf-bar-${sub}`);
    
    if (progLabel) progLabel.textContent = `第 ${curPage} / ${total} 页 (${pct}%)`;
    if (progBar) progBar.style.width = `${pct}%`;
  });
}

function updatePdfImage(subjectId, pageNum) {
  const img = document.getElementById("pdf-page-img");
  if (!img) return;
  
  let folder = "";
  if (subjectId === "logic") folder = "判断推理_images";
  else if (subjectId === "verbal") folder = "言语理解_images";
  else if (subjectId === "quant") folder = "资料分析_images";
  
  // Offset the page by 1 because page 1 is blank!
  const realPage = pageNum + 1;
  const src = `data/${folder}/page_${realPage}.jpg`;
  img.src = src;
  
  const container = document.getElementById("pdf-image-container");
  if (container) container.scrollTop = 0;
}

function openPdfZoomModal() {
  const currentImg = document.getElementById("pdf-page-img");
  const zoomModal = document.getElementById("pdf-zoom-modal");
  const zoomImg = document.getElementById("pdf-zoom-img");
  if (currentImg && zoomModal && zoomImg) {
    zoomImg.src = currentImg.src;
    zoomModal.style.display = "flex";
  }
}

function closePdfZoomModal() {
  const zoomModal = document.getElementById("pdf-zoom-modal");
  if (zoomModal) {
    zoomModal.style.display = "none";
  }
}

async function toggleUserPdfPermission(username) {
  if (IS_LOCAL_SERVER) {
    const data = await adminRequest("/api/admin/toggle-pdf-permission", {
      method: "POST",
      body: JSON.stringify({ username })
    });
    if (!data.success) {
      alert(data.error || "操作失败");
      if (data.error && data.error.includes("未授权") && (await ensureAdminLogin())) {
        toggleUserPdfPermission(username);
      }
      return;
    }
    // Update local user record
    if (allUsers[username]) {
      allUsers[username].pdfMistakesEnabled = data.pdfMistakesEnabled;
    }
    renderAdminUserList();
    if (username === currentUser) {
      updatePdfMistakesVisibility();
    }
  } else {
    // LocalStorage mode
    if (allUsers[username]) {
      allUsers[username].pdfMistakesEnabled = !allUsers[username].pdfMistakesEnabled;
      saveAllUsers();
      renderAdminUserList();
      if (username === currentUser) {
        updatePdfMistakesVisibility();
      }
    }
  }
}

function updatePdfMistakesVisibility() {
  const subjSelector = document.getElementById("subject-selector");
  const navItem = document.getElementById('nav-pdf-mistakes');
  
  if (!currentUser || !allUsers[currentUser]) {
    // 隐藏（从 DOM 中彻底移除该下拉选项，隐藏底部图标）
    if (subjSelector) {
      const option = subjSelector.querySelector('option[value="pdf_mistakes"]');
      if (option) option.remove();
    }
    if (navItem) navItem.style.display = 'none';
    return;
  }
  
  const user = allUsers[currentUser];
  const hasAccess = (currentUser === 'admin' || !!user.pdfMistakesEnabled);
  
  // 1. 下拉框选项物理显示/隐藏
  if (subjSelector) {
    const option = subjSelector.querySelector('option[value="pdf_mistakes"]');
    if (hasAccess) {
      if (!option) {
        const newOption = document.createElement("option");
        newOption.value = "pdf_mistakes";
        newOption.textContent = "❌ 我的错题集";
        subjSelector.appendChild(newOption);
      }
    } else {
      if (option) option.remove();
    }
  }
  
  // 2. 底部栏按钮显示/隐藏
  if (navItem) {
    navItem.style.display = hasAccess ? 'flex' : 'none';
  }
  
  // 3. 越权状态自动回滚
  if (!hasAccess) {
    if (currentSubject === 'pdf_mistakes') {
      if (subjSelector) {
        subjSelector.value = 'beijing';
        selectSubject('beijing');
      }
    }
    const pdfScreen = document.getElementById('screen-pdf-mistakes');
    if (pdfScreen && pdfScreen.classList.contains('active')) {
      switchScreen('home');
    }
  }
}
