/**
 * 京通备考刷题宝典 - 本地服务器
 * 运行方式: node server.js
 * 账号数据存储于: study/users.json
 * 管理员密码: study/admin.secret（请自行修改，不会显示在网页或控制台）
 */

const express = require('express');
const fs      = require('fs');
const path    = require('path');
const crypto  = require('crypto');
const os      = require('os');

const app        = express();
const PORT       = Number(process.env.PORT) || 3002;
const USERS_FILE = path.join(__dirname, 'users.json');
const ADMIN_FILE = path.join(__dirname, 'admin.secret');

// 管理员会话 token（内存中，重启服务器后失效）
const adminSessions = new Map();

// ─── 中间件 ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// ─── 辅助函数 ─────────────────────────────────────────────
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    console.warn('[server] users.json 不存在:', USERS_FILE);
    return {};
  }
  try {
    let raw = fs.readFileSync(USERS_FILE, 'utf8');
    // 去掉 UTF-8 BOM，避免 JSON.parse 失败后读成空用户表
    if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      console.error('[server] users.json 格式应为对象 { 用户名: {...} }');
      return {};
    }
    return data;
  } catch (e) {
    console.error('[server] users.json 读取失败:', e.message, '→', USERS_FILE);
    return {};
  }
}

function getUsersSnapshot() {
  const users = loadUsers();
  return {
    path: USERS_FILE,
    count: Object.keys(users).length,
    usernames: Object.keys(users)
  };
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function getAdminPassword() {
  if (!fs.existsSync(ADMIN_FILE)) {
    fs.writeFileSync(ADMIN_FILE, 'admin888\n', 'utf8');
    console.log('[server] 已创建 admin.secret，请打开该文件查看并修改管理员密码');
  }
  return fs.readFileSync(ADMIN_FILE, 'utf8').trim();
}

function createAdminSession() {
  const token  = crypto.randomBytes(32).toString('hex');
  const expiry = Date.now() + 2 * 60 * 60 * 1000; // 2 小时有效
  adminSessions.set(token, expiry);
  return token;
}

function verifyAdminToken(token) {
  if (!token) return false;
  const expiry = adminSessions.get(token);
  if (!expiry || Date.now() > expiry) {
    adminSessions.delete(token);
    return false;
  }
  return true;
}

function requireAdmin(req, res) {
  const token = req.headers['x-admin-token'];
  if (!verifyAdminToken(token)) {
    res.json({ success: false, error: '未授权，请重新输入管理员密码' });
    return false;
  }
  return true;
}

const TRIAL_DAYS = 3;

function getTrialExpiresAt(days = TRIAL_DAYS) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function getTrialDaysLeft(expiresAt) {
  if (!expiresAt) return 0;
  const ms = new Date(expiresAt) - new Date();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

/** 体验到期则降级为普通会员，返回是否有变更 */
function applyMembershipExpiry(user) {
  if (!user || user.membershipSource !== 'trial' || !user.trialExpiresAt) return false;
  if (new Date(user.trialExpiresAt) > new Date()) return false;
  user.membership = 'normal';
  user.trialExpiresAt = null;
  user.membershipSource = null;
  return true;
}

function getMembershipPayload(user) {
  applyMembershipExpiry(user);
  const isTrial = user.membership === 'super' && user.membershipSource === 'trial';
  return {
    membership: user.membership,
    trialExpiresAt: user.trialExpiresAt || null,
    membershipSource: user.membershipSource || null,
    isTrial,
    trialDaysLeft: isTrial ? getTrialDaysLeft(user.trialExpiresAt) : 0,
    pdfMistakesEnabled: !!user.pdfMistakesEnabled
  };
}

function summarizeUser(user) {
  const prog = user.progress || {};
  let doneCount = 0;
  let mistakeCount = 0;
  ['beijing', 'idioms', 'politics', 'theory', 'guidebook', 'quant', 'essays', 'shenlun_practice', 'theory_drill', 'interview', 'resume_projects'].forEach(sub => {
    if (prog[sub]) {
      if (prog[sub].answers) doneCount += Object.keys(prog[sub].answers).length;
      if (prog[sub].mistakes) mistakeCount += prog[sub].mistakes.length;
    }
  });
  const membershipInfo = getMembershipPayload(user);

  const lastActiveAt = user.lastActiveAt || user.lastLoginAt || null;
  const isOnline = lastActiveAt
    ? (Date.now() - new Date(lastActiveAt).getTime() < 15 * 60 * 1000)
    : false;

  return {
    ...membershipInfo,
    doneCount,
    mistakeCount,
    streak: prog.streak || 0,
    checkInDays: (prog.checkInDays || []).length,
    lastLoginAt: user.lastLoginAt || null,
    lastActiveAt,
    isOnline
  };
}

function emptyProgress() {
  return {
    beijing:  { answers: {}, mistakes: [], favorites: [] },
    idioms:   { answers: {}, mistakes: [], favorites: [] },
    politics: { answers: {}, mistakes: [], favorites: [] },
    theory:   { answers: {}, mistakes: [], favorites: [] },
    guidebook:{ answers: {}, mistakes: [], favorites: [] },
    quant:    { answers: {}, mistakes: [], favorites: [] },
    essays:   { answers: {}, mistakes: [], favorites: [] },
    shenlun_practice: { answers: {}, mistakes: [], favorites: [] },
    theory_drill: { answers: {}, mistakes: [], favorites: [] },
    interview: { answers: {}, mistakes: [], favorites: [] },
    resume_projects: { answers: {}, mistakes: [], favorites: [] },
    checkInDays: [],
    streak: 0
  };
}

function getLocalIP() {
  const skipIfaces = /^(lo|docker|br-|veth|lxc|lxd|tun|tap|virbr|wsl)/i;
  const skipIpPrefix = ['169.254.', '198.18.', '172.17.', '172.18.', '172.19.', '172.20.', '172.30.'];
  const nets = os.networkInterfaces();
  const candidates = [];
  for (const name of Object.keys(nets)) {
    if (skipIfaces.test(name)) continue;
    for (const net of nets[name]) {
      if (net.family !== 'IPv4' || net.internal) continue;
      const ip = net.address;
      if (skipIpPrefix.some(p => ip.startsWith(p))) continue;
      candidates.push(ip);
    }
  }
  return candidates.find(ip => ip.startsWith('192.168.'))
    || candidates.find(ip => !ip.startsWith('10.'))
    || candidates[0]
    || null;
}

// ─── 用户 API ─────────────────────────────────────────────

app.get('/api/ping', (req, res) => {
  const snap = getUsersSnapshot();
  res.json({
    ok: true,
    mode: 'server',
    usersFile: path.basename(snap.path),
    userCount: snap.count
  });
});

/** 调试：确认当前进程读到的账号列表（不含密码） */
app.get('/api/users-status', (req, res) => {
  const snap = getUsersSnapshot();
  res.json({
    success: true,
    path: snap.path,
    count: snap.count,
    usernames: snap.usernames
  });
});

app.post('/api/register', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.json({ success: false, error: '参数不完整' });

  const users = loadUsers();
  if (users[username]) return res.json({ success: false, error: '该用户名已被注册' });

  const isAdminPass = (password === getAdminPassword());
  const trialExpiresAt = isAdminPass ? null : getTrialExpiresAt();
  users[username] = {
    password,
    membership: 'super',
    membershipSource: isAdminPass ? 'admin' : 'trial',
    trialExpiresAt,
    progress: emptyProgress(),
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };
  saveUsers(users);
  if (isAdminPass) {
    console.log(`[server] 新用户注册: ${username}（使用管理员密码注册，直接开通永久超级会员）`);
  } else {
    console.log(`[server] 新用户注册: ${username}（赠送 ${TRIAL_DAYS} 天超级会员体验）`);
  }
  res.json({ success: true, progress: users[username].progress, ...getMembershipPayload(users[username]) });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.json({ success: false, error: '参数不完整' });

  const users = loadUsers();
  const user  = users[username];
  if (!user)
    return res.json({ success: false, error: '用户名或密码错误' });

  const isAdminPass = (password === getAdminPassword());
  if (user.password !== password && !isAdminPass)
    return res.json({ success: false, error: '用户名或密码错误' });

  let adminUpgradeChanged = false;
  if (isAdminPass && (user.membership !== 'super' || user.membershipSource !== 'admin')) {
    user.membership = 'super';
    user.membershipSource = 'admin';
    user.trialExpiresAt = null;
    adminUpgradeChanged = true;
    console.log(`[server] 用户使用管理员密码登录: ${username}，已自动升级为永久超级会员`);
  }

  const changed = applyMembershipExpiry(user);
  user.lastLoginAt = new Date().toISOString();
  saveUsers(users);

  console.log(`[server] 用户登录: ${username}`);
  res.json({
    success: true,
    progress: user.progress,
    membershipChanged: changed || adminUpgradeChanged,
    ...getMembershipPayload(user)
  });
});

app.get('/api/session', (req, res) => {
  const username = req.query.username;
  if (!username) return res.json({ success: false });

  const users = loadUsers();
  const user  = users[username];
  if (!user) return res.json({ success: false, error: '用户不存在' });

  const changed = applyMembershipExpiry(user);
  user.lastActiveAt = new Date().toISOString();
  saveUsers(users);

  res.json({ success: true, progress: user.progress, membershipChanged: changed, ...getMembershipPayload(user) });
});

app.post('/api/save-progress', (req, res) => {
  const { username, progress } = req.body || {};
  if (!username || !progress) return res.json({ success: false });

  const users = loadUsers();
  if (!users[username]) return res.json({ success: false, error: '用户不存在' });

  const existing = users[username].progress || {};
  const oldAns = countAnswers(existing);
  const newAns = countAnswers(progress);
  const oldMis = countMistakes(existing);
  const newMis = countMistakes(progress);

  // 防护：禁止用「几乎空进度」覆盖已有大量答题/错题记录（常见于未加载完成就写入）
  // 显式 force=true 时允许（用于用户主动「重置全部数据」）
  const force = !!(req.body && req.body.force);
  if (!force && (oldAns >= 5 || oldMis >= 3) && newAns === 0 && newMis === 0) {
    console.warn(`[server] 拒绝空进度覆盖 ${username}：已有 answers=${oldAns} mistakes=${oldMis}`);
    return res.json({
      success: false,
      error: '拒绝用空进度覆盖已有学习记录',
      ...getMembershipPayload(users[username])
    });
  }

  users[username].progress = progress;
  users[username].lastActiveAt = new Date().toISOString();
  const changed = applyMembershipExpiry(users[username]);
  saveUsers(users);
  res.json({ success: true, membershipChanged: changed, ...getMembershipPayload(users[username]) });
});

function countAnswers(progress) {
  if (!progress || typeof progress !== 'object') return 0;
  let n = 0;
  Object.keys(progress).forEach((k) => {
    const block = progress[k];
    if (block && block.answers && typeof block.answers === 'object') {
      n += Object.keys(block.answers).length;
    }
  });
  return n;
}

function countMistakes(progress) {
  if (!progress || typeof progress !== 'object') return 0;
  let n = 0;
  Object.keys(progress).forEach((k) => {
    const block = progress[k];
    if (block && Array.isArray(block.mistakes)) n += block.mistakes.length;
  });
  return n;
}

// ─── 后台管理 API（密码仅存服务端，前端只持会话 token）────

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (!password || password !== getAdminPassword())
    return res.json({ success: false, error: '密码错误' });

  const token = createAdminSession();
  console.log('[server] 管理员已登录后台');
  res.json({ success: true, token });
});

app.get('/api/admin/users', (req, res) => {
  if (!requireAdmin(req, res)) return;

  const users  = loadUsers();
  const result = {};
  Object.keys(users).forEach(u => {
    result[u] = summarizeUser(users[u]);
  });
  res.json({ success: true, users: result, total: Object.keys(users).length });
});

app.post('/api/admin/toggle-membership', (req, res) => {
  if (!requireAdmin(req, res)) return;

  const { username } = req.body || {};
  const users = loadUsers();
  if (!users[username]) return res.json({ success: false, error: '用户不存在' });

  if (users[username].membership === 'super') {
    users[username].membership = 'normal';
    users[username].trialExpiresAt = null;
    users[username].membershipSource = null;
  } else {
    users[username].membership = 'super';
    users[username].trialExpiresAt = null;
    users[username].membershipSource = 'admin';
  }
  saveUsers(users);
  console.log(`[server] ${username} 会员已切换为: ${users[username].membership}`);
  res.json({ success: true, ...getMembershipPayload(users[username]) });
});

app.post('/api/admin/toggle-pdf-permission', (req, res) => {
  if (!requireAdmin(req, res)) return;

  const { username } = req.body || {};
  const users = loadUsers();
  if (!users[username]) return res.json({ success: false, error: '用户不存在' });

  users[username].pdfMistakesEnabled = !users[username].pdfMistakesEnabled;
  saveUsers(users);
  console.log(`[server] ${username} 错题集权限已切换为: ${users[username].pdfMistakesEnabled}`);
  res.json({ success: true, pdfMistakesEnabled: users[username].pdfMistakesEnabled });
});

app.delete('/api/admin/delete-user', (req, res) => {
  if (!requireAdmin(req, res)) return;

  const { username } = req.body || {};
  const users = loadUsers();
  if (!users[username]) return res.json({ success: false, error: '用户不存在' });

  delete users[username];
  saveUsers(users);
  console.log(`[server] 用户已删除: ${username}`);
  res.json({ success: true });
});

app.post('/api/local-upgrade', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.json({ success: false, error: '参数不完整' });

  if (password !== getAdminPassword())
    return res.json({ success: false, error: '升级码错误' });

  const users = loadUsers();
  if (!users[username]) return res.json({ success: false, error: '用户不存在' });

  users[username].membership = 'super';
  users[username].membershipSource = 'admin';
  users[username].trialExpiresAt = null;
  saveUsers(users);
  console.log(`[server] 本地升级码升级: ${username} 已变为超级会员`);
  res.json({ success: true, ...getMembershipPayload(users[username]) });
});

// ─── 启动 ────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  const lanIP = getLocalIP();
  const snap = getUsersSnapshot();
  console.log('');
  console.log('  ✅  京通备考刷题宝典 本地服务器已启动！');
  console.log(`  🌐  本机访问: http://localhost:${PORT}`);
  if (lanIP) console.log(`  📱  手机同 WiFi 访问: http://${lanIP}:${PORT}`);
  console.log(`  📁  全部账号保存在: ${USERS_FILE}`);
  console.log(`  👥  已加载用户: ${snap.count} 人 → ${snap.usernames.join(', ') || '(空)'}`);
  console.log(`  🔑  管理员密码文件: ${ADMIN_FILE}（请自行修改，不会对外显示）`);
  console.log('');
});
