// ================= 1. 状态管理 =================
let userProgress = {
  beijing: {
    answers: {},     // qId -> { correct: boolean, count: number }
    mistakes: [],    // 错题ID列表
    favorites: []    // 收藏题ID列表
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
let practiceSeconds = 0;
let practiceTimerInterval = null;

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
  
  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".limit-btn");
    if (!btn) return;
    
    container.querySelectorAll(".limit-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    
    practiceLimit = btn.getAttribute("data-limit");
  });
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
  } catch (e) {
    console.error("Failed to init practice limit selector:", e);
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
  FACTS = SUBJECT_DATA[subjectId].facts;
  
  // 动态更新主题色彩
  const viewport = document.querySelector(".app-viewport");
  if (viewport) {
    if (subjectId === "beijing") {
      viewport.style.setProperty("--primary", "#c0392b");
      viewport.style.setProperty("--primary-glow", "rgba(192, 57, 43, 0.15)");
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
    }
  }
  
  // 保存当前选定科目
  localStorage.setItem("beijing_quiz_active_subject", subjectId);
  
  // 更新 Logo 上的标志字
  document.getElementById("header-logo-icon").textContent = SUBJECT_DATA[subjectId].icon;
  
  // 切换模式格子（时政 vs 普通）
  if (typeof updateModeGrid === 'function') updateModeGrid(subjectId);
  
  // 刷新当前页看板与各类卡片
  updateHomeStats();
  initFlashcard();
  renderFacts(FACTS);
  
  // 如果当前处于统计面板或章节选择面板，做对应内容重绘
  const catPicker = document.getElementById("screen-category-picker");
  if (catPicker.classList.contains("active")) {
    showCategoryPicker();
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
  if (!userProgress.essays)   userProgress.essays   = { answers: {}, mistakes: [], favorites: [] };
  if (!userProgress.checkInDays) userProgress.checkInDays = [];
  if (userProgress.streak === undefined) userProgress.streak = 0;
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
    trialDaysLeft: data.trialDaysLeft || 0
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
    if (isSuper && user.isTrial && user.trialDaysLeft > 0) {
      badgeEl.textContent = `超级体验 · 剩${user.trialDaysLeft}天 👑`;
    } else if (isSuper) {
      badgeEl.textContent = "超级会员 👑";
    } else {
      badgeEl.textContent = "普通会员";
    }
    badgeEl.className = `membership-badge ${isSuper ? 'super-member' : 'normal-member'}`;
    if (adminBtn) adminBtn.style.display = "inline-block";
  } else {
    nameEl.textContent  = "未登录";
    badgeEl.textContent = "未登录";
    badgeEl.className   = "membership-badge normal-member";
    if (adminBtn) adminBtn.style.display = "none";
  }
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

      if (action === 'register') {
        alert("注册成功！已赠送 3 天超级会员体验，已为您自动登录。");
      } else if (data.membershipChanged) {
        notifyTrialExpiredIfNeeded(true);
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
    if (action === 'register') {
      if (allUsers[username]) { alert("该用户名已被注册！"); return; }
      allUsers[username] = {
        password,
        membership: "super",
        membershipSource: "trial",
        trialExpiresAt: getTrialExpiresAtISO(),
        isTrial: true,
        trialDaysLeft: TRIAL_DAYS,
        progress: {
          beijing: {answers:{},mistakes:[],favorites:[]},
          idioms:  {answers:{},mistakes:[],favorites:[]},
          politics:{answers:{},mistakes:[],favorites:[]},
          theory:  {answers:{},mistakes:[],favorites:[]},
          guidebook:{answers:{},mistakes:[],favorites:[]},
          essays:  {answers:{},mistakes:[],favorites:[]},
          checkInDays:[getTodayStr()], streak:1
        }
      };
      saveAllUsers();
      alert("注册成功！已赠送 3 天超级会员体验，已为您自动登录。");
    } else {
      const user = allUsers[username];
      if (!user || user.password !== password) { alert("用户名或密码错误！"); return; }
      const expired = refreshLocalMembership(username);
      if (expired) saveAllUsers();
      notifyTrialExpiredIfNeeded(expired);
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

function renderAdminUserList() {
  const tbody = document.getElementById("admin-user-list");
  if (!tbody) return;
  tbody.innerHTML = "";

  const usernames = Object.keys(allUsers);
  if (usernames.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="padding:20px;text-align:center;color:var(--text-muted);">暂无注册用户</td></tr>`;
    return;
  }

  usernames.forEach(username => {
    const user     = allUsers[username];
    const isSuper  = user.membership === "super";
    const isTrial  = user.isTrial;
    const trialDaysLeft = user.trialDaysLeft || 0;
    const doneCount = user.doneCount !== undefined ? user.doneCount : (() => {
      let c = 0;
      if (user.progress) ['beijing','idioms','politics','theory','guidebook','essays'].forEach(s => {
        if (user.progress[s] && user.progress[s].answers) c += Object.keys(user.progress[s].answers).length;
      });
      return c;
    })();
    const mistakeCount = user.mistakeCount !== undefined ? user.mistakeCount : 0;
    const streak = user.streak !== undefined ? user.streak : 0;
    const checkInDays = user.checkInDays !== undefined ? user.checkInDays : 0;
    const label = isSuper
      ? (isTrial
        ? `<span style='color:#f39c12;font-weight:bold;'>体验中·剩${trialDaysLeft}天 👑</span>`
        : "<span style='color:#f39c12;font-weight:bold;'>超级 👑</span>")
      : "<span style='color:var(--text-muted);'>普通</span>";

    const tr = document.createElement("tr");
    tr.style.borderBottom = "1px solid var(--border-color)";
    tr.innerHTML = `
      <td style="padding:10px 4px;font-weight:700;color:var(--text-main);">${username}</td>
      <td style="padding:10px 4px;">${label}</td>
      <td style="padding:10px 4px;">${doneCount}</td>
      <td style="padding:10px 4px;">${mistakeCount}</td>
      <td style="padding:10px 4px;">${streak}天/${checkInDays}次</td>
      <td style="padding:10px 4px;text-align:right;">
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
  } else if (screenId === "mistakes") {
    renderMistakes();
  } else if (screenId === "stats") {
    updateStatsScreen();
  }
}

// ================= 7. 首页看板与卡片更新 =================
function updateHomeStats() {
  const progress = getActiveProgress();
  const totalQ = QUESTIONS.length;
  const answeredIds = Object.keys(progress.answers);
  const doneCount = answeredIds.length;
  const progressPct = Math.round((doneCount / totalQ) * 100);
  
  // 计算正确率
  let correctCount = 0;
  answeredIds.forEach(id => {
    if (progress.answers[id] && progress.answers[id].correct) {
      correctCount++;
    }
  });
  const accuracyRate = doneCount > 0 ? Math.round((correctCount / doneCount) * 100) : 0;
  
  document.getElementById("home-progress-pct").innerHTML = `${progressPct}<span>%</span>`;
  document.getElementById("home-stat-done").textContent = doneCount;
  document.getElementById("home-stat-rate").textContent = `${accuracyRate}%`;
  document.getElementById("home-stat-wrong").textContent = progress.mistakes.length;
}

// 考点记忆卡滑动切换
let currentFlashcardIndex = 0;
function initFlashcard() {
  showFlashcard(0);
}

function showFlashcard(index) {
  if (FACTS.length === 0) return;
  if (index < 0) index = FACTS.length - 1;
  if (index >= FACTS.length) index = 0;
  currentFlashcardIndex = index;
  
  const fact = FACTS[currentFlashcardIndex];
  
  const fc = document.querySelector(".flashcard");
  fc.classList.remove("flipped");
  
  setTimeout(() => {
    document.getElementById("card-front-text").textContent = `【${getCatName(fact.cat)}】${fact.title}`;
    document.getElementById("card-back-text").textContent = fact.content;
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
function startPractice(mode, categoryId = null) {
  if (mode === "exam" && allUsers[currentUser] && allUsers[currentUser].membership !== "super") {
    alert("🔒 模拟考试模式仅限【超级会员】使用！请联系后台管理员为您升级。");
    return;
  }

  currentMode = mode;
  currentIndex = 0;
  hasSubmitted = false;
  
  const progress = getActiveProgress();
  
  if (mode === "seq") {
    currentQuestions = shuffleArray([...QUESTIONS]);
  } else if (mode === "rand") {
    currentQuestions = shuffleArray([...QUESTIONS]);
  } else if (mode === "cat") {
    currentQuestions = shuffleArray(QUESTIONS.filter(q => q.category === categoryId));
    switchScreen("home");
  } else if (mode === "exam") {
    // 模拟考试：最大取 20 题
    const maxExamQs = Math.min(QUESTIONS.length, 20);
    currentQuestions = shuffleArray([...QUESTIONS]).slice(0, maxExamQs);
    
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
    alert("暂无题目！");
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
  expPanel.classList.remove("active");
  
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
    nextBtn.textContent = "跳过 / 确认";
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
  const progress = getActiveProgress();
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
    triggerConfetti(clickX, clickY);
    
    if (currentMode === "redo") {
      progress.mistakes = progress.mistakes.filter(id => id !== q.id);
    }
  } else {
    if (!progress.mistakes.includes(q.id)) {
      progress.mistakes.push(q.id);
    }
  }
  
  if (!progress.answers[q.id]) {
    progress.answers[q.id] = { correct: isCorrect, count: 1 };
  } else {
    progress.answers[q.id].correct = isCorrect;
    progress.answers[q.id].count += 1;
  }
  saveProgress();
  
  const expPanel = document.getElementById("quiz-explanation");
  const expContent = document.getElementById("quiz-explanation-content");
  
  let resultText = isCorrect ? "<span style='color:var(--success); font-weight:bold;'>回答正确！</span><br/>" : 
                               `<span style='color:var(--error); font-weight:bold;'>回答错误。</span> 正确答案是：<span style='color:var(--success); font-weight:bold;'>${formatCorrectAnswer(q)}</span><br/>`;
  
  expContent.innerHTML = resultText + q.explanation;
  expPanel.classList.add("active");
  
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
    alert(`恭喜！您已顺利完成本次练习。`);
    switchScreen("home");
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
    const qCount = QUESTIONS.filter(q => q.category === cat.id).length;
    const doneCount = QUESTIONS.filter(q => q.category === cat.id && progress.answers[q.id] && progress.answers[q.id].correct).length;
    
    const card = document.createElement("div");
    card.className = "cat-card";
    card.onclick = () => startPractice("cat", cat.id);
    card.innerHTML = `
      <div class="cat-info">
        <span class="cat-title">${cat.name}</span>
        <span class="cat-count">已掌握 ${doneCount} / 共 ${qCount} 题</span>
      </div>
      <div class="cat-go">→</div>
    `;
    container.appendChild(card);
  });
  
  switchScreen("category-picker");
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
  currentQuestions = [q];
  currentMode = "redo-single";
  currentIndex = 0;
  hasSubmitted = false;
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
    guidebook: "小黑排坑手册"
  };

  // 统计各科目进度
  let statsRows = "";
  const subjects = ["beijing", "idioms", "politics", "theory", "guidebook"];
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

function startRecitation() {
  if (allUsers[currentUser] && allUsers[currentUser].membership !== "super") {
    alert("🔒 申论大作文范文背诵仅限【超级会员】使用！请联系后台管理员为您升级。");
    return;
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
