// ============================================================
// politics_modes.js — 时政热点5种特色出题模式逻辑
// 依赖 questions.js (SUBJECT_DATA.politics) 和 app.js
// ============================================================

// ================= 全局状态 =================
let speedState = {
  questions: [],
  currentIndex: 0,
  timeLeft: 10,
  timer: null,
  score: 0,
  correctCount: 0,
  wrongCount: 0,
  totalTime: 0,
  submitted: false
};

let timelineState = {
  questions: [],
  currentIndex: 0,
  dragSrcIndex: null
};

let matchState = {
  questions: [],
  currentIndex: 0,
  selectedLeft: null,
  selectedRight: null,
  matchedPairs: [],
  matchedColors: []
};

let readingState = {
  questions: [],
  currentIndex: 0,
  currentSubQ: 0,   // 当前子题进度 0/1/2
  subAnswered: [],
  subResults: []
};

let dailyState = {
  questions: [],
  currentIndex: 0,
  correctCount: 0,
  submitted: false,
  results: []  // [{correct, tip}]
};

// ============================================================
// ⚡ 极速抢答模式
// ============================================================
function startSpeedQuiz() {
  const all = SUBJECT_DATA.politics.questions;
  const progress = typeof getActiveProgress === 'function' ? getActiveProgress() : { answers: {} };
  const filter = typeof progressFilter !== 'undefined' ? progressFilter : 'all';
  const pool = typeof preparePracticeQuestions === 'function'
    ? preparePracticeQuestions(all, progress, 'rand', filter)
    : shuffleArray([...all]);
  const limit = typeof getPracticeQuestionCount === 'function' ? getPracticeQuestionCount(15) : 15;
  speedState.questions = pool.slice(0, Math.min(limit, pool.length));

  if (speedState.questions.length === 0) {
    const emptyMsg = typeof getProgressFilterEmptyMessage === 'function'
      ? getProgressFilterEmptyMessage()
      : { all: "暂无题目！", undone: "暂无未刷题目！", done: "暂无已刷题目！" };
    alert(emptyMsg[filter] || "暂无题目！");
    return;
  }

  speedState.currentIndex = 0;
  speedState.score = 0;
  speedState.correctCount = 0;
  speedState.wrongCount = 0;
  speedState.totalTime = 0;
  speedState.submitted = false;
  
  // 启用倒计时条，确保隐藏普通的练习计时器
  document.getElementById('speed-timer-container').style.display = 'block';
  document.getElementById('quiz-badge-category').textContent = '⚡ 极速抢答';
  document.getElementById('btn-quiz-prev').style.display = 'none';
  
  // 禁用普通的收藏和下一题按钮（使用极速逻辑覆盖）
  const nextBtn = document.getElementById('btn-quiz-next');
  nextBtn.style.display = 'none';
  
  if (typeof stopPracticeTimer === 'function') {
    stopPracticeTimer();
  }
  
  switchScreen('quiz');
  renderSpeedQuestion();
}

function renderSpeedQuestion() {
  if (speedState.currentIndex >= speedState.questions.length) {
    finishSpeedQuiz();
    return;
  }
  
  speedState.submitted = false;
  speedState.timeLeft = 10;
  
  const q = speedState.questions[speedState.currentIndex];

  const statusEl = document.getElementById('quiz-answer-status');
  if (statusEl && typeof isQuestionAnswered === 'function') {
    const progress = getActiveProgress();
    const answered = isQuestionAnswered(q.id, progress);
    statusEl.textContent = answered ? '已刷' : '未刷';
    statusEl.className = `quiz-answer-status ${answered ? 'done' : 'undone'}`;
  }
  
  document.getElementById('quiz-q-type').textContent = getQTypeLabel(q.type);
  document.getElementById('quiz-q-title').textContent = q.question;
  document.getElementById('quiz-progress-bar').style.width = 
    `${(speedState.currentIndex / speedState.questions.length) * 100}%`;
  document.getElementById('quiz-progress-text').textContent = 
    `${speedState.currentIndex + 1} / ${speedState.questions.length}`;
  document.getElementById('quiz-explanation').classList.remove('active');
  
  // 渲染选项（仅支持单选/判断）
  const optList = document.getElementById('quiz-options-list');
  optList.style.display = 'flex';
  optList.innerHTML = '';
  document.getElementById('quiz-fill-container').style.display = 'none';
  
  q.options.forEach((opt, idx) => {
    const letter = String.fromCharCode(65 + idx);
    const btn = document.createElement('div');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="option-prefix">${letter}</span><span class="option-text">${opt}</span>`;
    btn.onclick = (e) => handleSpeedAnswer(letter, e.clientX, e.clientY);
    optList.appendChild(btn);
  });
  
  // 启动倒计时
  startSpeedTimer();
}

function startSpeedTimer() {
  clearSpeedTimer();
  
  const timerBar = document.getElementById('speed-timer-bar');
  const timerNum = document.getElementById('speed-timer-num');
  const scoreNum = document.getElementById('speed-score-num');
  timerBar.style.width = '100%';
  timerNum.textContent = speedState.timeLeft;
  timerNum.classList.remove('danger');
  scoreNum.textContent = speedState.score;
  
  speedState.timer = setInterval(() => {
    speedState.timeLeft--;
    speedState.totalTime++;
    timerBar.style.width = `${(speedState.timeLeft / 10) * 100}%`;
    timerNum.textContent = speedState.timeLeft;
    
    if (speedState.timeLeft <= 3) {
      timerNum.classList.add('danger');
    }
    
    if (speedState.timeLeft <= 0) {
      clearSpeedTimer();
      // 超时：判错并自动下一题
      if (!speedState.submitted) {
        speedState.submitted = true;
        speedState.wrongCount++;
        const q = speedState.questions[speedState.currentIndex];
        if (typeof recordAnswerProgress === 'function') {
          recordAnswerProgress(q, false);
        }
        showSpeedResult(false, q);
        setTimeout(() => {
          speedState.currentIndex++;
          renderSpeedQuestion();
        }, 1200);
      }
    }
  }, 1000);
}

function clearSpeedTimer() {
  if (speedState.timer) {
    clearInterval(speedState.timer);
    speedState.timer = null;
  }
}

function handleSpeedAnswer(letter, clickX, clickY) {
  if (speedState.submitted) return;
  speedState.submitted = true;
  clearSpeedTimer();
  
  const q = speedState.questions[speedState.currentIndex];
  const isCorrect = letter === q.answer;
  
  // 得分 = 10 - 超时秒数（最少1分）
  const gained = isCorrect ? Math.max(1, speedState.timeLeft) : 0;
  speedState.score += gained;
  
  if (isCorrect) {
    speedState.correctCount++;
    triggerConfetti(clickX, clickY);
  } else {
    speedState.wrongCount++;
  }

  if (typeof recordAnswerProgress === 'function') {
    recordAnswerProgress(q, isCorrect);
  }
  
  // 高亮答案
  const optList = document.getElementById('quiz-options-list');
  const buttons = optList.querySelectorAll('.option-btn');
  buttons.forEach((btn, idx) => {
    const btnLetter = String.fromCharCode(65 + idx);
    btn.classList.add('disabled');
    if (btnLetter === q.answer) btn.classList.add('correct');
    else if (btnLetter === letter && !isCorrect) btn.classList.add('wrong');
  });
  
  showSpeedResult(isCorrect, q);
  document.getElementById('speed-score-num').textContent = speedState.score;
  
  setTimeout(() => {
    speedState.currentIndex++;
    renderSpeedQuestion();
  }, 1500);
}

function showSpeedResult(isCorrect, q) {
  const expPanel = document.getElementById('quiz-explanation');
  const expContent = document.getElementById('quiz-explanation-content');
  const resultText = isCorrect ? 
    `<span style='color:var(--success);font-weight:bold'>✓ 答对！+${Math.max(1, speedState.timeLeft)}分</span><br/>` :
    `<span style='color:var(--error);font-weight:bold'>✗ 错误！正确答案: ${q.answer}</span><br/>`;
  expContent.innerHTML = resultText + q.explanation;
  expPanel.classList.add('active');
}

function finishSpeedQuiz() {
  clearSpeedTimer();
  if (typeof stopPracticeTimer === 'function') {
    stopPracticeTimer();
  }
  document.getElementById('speed-timer-container').style.display = 'none';
  document.getElementById('btn-quiz-next').style.display = 'flex';
  
  // 填写结算数据
  document.getElementById('speed-final-score').textContent = speedState.score;
  document.getElementById('speed-correct-count').textContent = speedState.correctCount;
  document.getElementById('speed-wrong-count').textContent = speedState.wrongCount;
  const avgTime = speedState.questions.length > 0 
    ? (speedState.totalTime / speedState.questions.length).toFixed(1) 
    : 0;
  document.getElementById('speed-avg-time').textContent = `${avgTime}s`;
  
  // 评级
  const badge = document.getElementById('speed-rank-badge');
  const rate = speedState.correctCount / speedState.questions.length;
  if (rate >= 0.9 && avgTime < 5) {
    badge.textContent = '🏆 闪电时政王';
    triggerConfetti();
  } else if (rate >= 0.8) {
    badge.textContent = '⭐ 敏锐观察者';
  } else if (rate >= 0.6) {
    badge.textContent = '📚 时政学习中';
  } else {
    badge.textContent = '🔄 需要多刷题';
  }

  if (typeof updateHomeStats === 'function') updateHomeStats();
  
  switchScreen('speed-report');
}

// ============================================================
// 🗺️ 时间轴排序模式
// ============================================================
function startTimeline() {
  const qs = SUBJECT_DATA.politics.timelineQuestions;
  if (!qs || qs.length === 0) {
    alert('时间轴题目暂未加载，请稍后再试！');
    return;
  }
  const pool = typeof prepareSpecialModeQuestions === 'function'
    ? prepareSpecialModeQuestions(qs, { defaultWhenAll: qs.length })
    : shuffleArray([...qs]);
  if (!pool) return;

  timelineState.questions = pool;
  timelineState.currentIndex = 0;
  
  if (typeof startPracticeTimer === 'function') {
    startPracticeTimer("timeline-timer", "timeline-timer-text");
  }
  
  switchScreen('timeline');
  renderTimelineQuestion();
}

function renderTimelineQuestion() {
  if (timelineState.currentIndex >= timelineState.questions.length) {
    if (typeof updateHomeStats === 'function') updateHomeStats();
    alert('🎉 全部时间轴题目已完成！');
    quitQuiz();
    return;
  }
  
  const q = timelineState.questions[timelineState.currentIndex];
  if (typeof updateQuestionStatusBadge === 'function') {
    updateQuestionStatusBadge('timeline-answer-status', q);
  }
  const pct = (timelineState.currentIndex / timelineState.questions.length) * 100;
  document.getElementById('timeline-progress-bar').style.width = `${pct}%`;
  document.getElementById('timeline-progress-text').textContent = 
    `${timelineState.currentIndex + 1} / ${timelineState.questions.length}`;
  
  // 打乱事件顺序显示
  const shuffledEvents = shuffleArray([...q.events]);
  const container = document.getElementById('timeline-sort-list');
  container.innerHTML = '';
  
  shuffledEvents.forEach((ev, idx) => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.draggable = true;
    item.dataset.originalDate = ev.date;
    item.innerHTML = `
      <span class="timeline-drag-handle">⠿</span>
      <span class="timeline-item-order">${idx + 1}</span>
      <span class="timeline-item-text">${ev.text}</span>
      <span style="font-size:10px;color:var(--text-muted);flex-shrink:0;">${ev.label}</span>
    `;
    
    // 拖拽事件绑定
    item.addEventListener('dragstart', onTimelineDragStart);
    item.addEventListener('dragover', onTimelineDragOver);
    item.addEventListener('drop', onTimelineDrop);
    item.addEventListener('dragend', onTimelineDragEnd);
    
    // 触摸拖拽支持
    item.addEventListener('touchstart', onTimelineTouchStart, { passive: true });
    item.addEventListener('touchmove', onTimelineTouchMove, { passive: false });
    item.addEventListener('touchend', onTimelineTouchEnd);
    
    container.appendChild(item);
  });
  
  document.getElementById('timeline-result-panel').style.display = 'none';
  document.getElementById('btn-timeline-submit').style.display = 'flex';
}

// 拖拽逻辑
let dragSrcEl = null;
let touchDragEl = null;
let touchDragClone = null;
let touchDragOriginIdx = -1;

function onTimelineDragStart(e) {
  dragSrcEl = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}
function onTimelineDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  document.querySelectorAll('.timeline-item').forEach(el => el.classList.remove('drag-over'));
  if (this !== dragSrcEl) this.classList.add('drag-over');
}
function onTimelineDrop(e) {
  e.stopPropagation();
  if (this !== dragSrcEl) {
    const container = document.getElementById('timeline-sort-list');
    const items = [...container.querySelectorAll('.timeline-item')];
    const srcIdx = items.indexOf(dragSrcEl);
    const dstIdx = items.indexOf(this);
    if (srcIdx > dstIdx) {
      container.insertBefore(dragSrcEl, this);
    } else {
      container.insertBefore(dragSrcEl, this.nextSibling);
    }
    // 更新序号
    updateTimelineOrderNumbers();
  }
}
function onTimelineDragEnd() {
  document.querySelectorAll('.timeline-item').forEach(el => {
    el.classList.remove('dragging', 'drag-over');
  });
}

function onTimelineTouchStart(e) {
  touchDragEl = this;
  const touch = e.touches[0];
  touchDragOriginIdx = [...document.getElementById('timeline-sort-list').children].indexOf(this);
  touchDragClone = this.cloneNode(true);
  touchDragClone.style.cssText = `position:fixed;z-index:9999;opacity:0.85;width:${this.offsetWidth}px;pointer-events:none;top:${touch.clientY - this.offsetHeight/2}px;left:${this.offsetLeft}px;`;
  document.body.appendChild(touchDragClone);
  this.style.opacity = '0.4';
}
function onTimelineTouchMove(e) {
  e.preventDefault();
  const touch = e.touches[0];
  if (touchDragClone) {
    touchDragClone.style.top = `${touch.clientY - touchDragEl.offsetHeight / 2}px`;
  }
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  const timelineItem = target?.closest('.timeline-item');
  document.querySelectorAll('.timeline-item').forEach(el => el.classList.remove('drag-over'));
  if (timelineItem && timelineItem !== touchDragEl) {
    timelineItem.classList.add('drag-over');
  }
}
function onTimelineTouchEnd(e) {
  if (touchDragClone) {
    document.body.removeChild(touchDragClone);
    touchDragClone = null;
  }
  const touch = e.changedTouches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  const container = document.getElementById('timeline-sort-list');
  const timelineItem = target?.closest('.timeline-item');
  if (timelineItem && timelineItem !== touchDragEl) {
    const items = [...container.querySelectorAll('.timeline-item')];
    const srcIdx = items.indexOf(touchDragEl);
    const dstIdx = items.indexOf(timelineItem);
    if (srcIdx > dstIdx) {
      container.insertBefore(touchDragEl, timelineItem);
    } else {
      container.insertBefore(touchDragEl, timelineItem.nextSibling);
    }
    updateTimelineOrderNumbers();
  }
  touchDragEl.style.opacity = '';
  document.querySelectorAll('.timeline-item').forEach(el => el.classList.remove('drag-over'));
}

function updateTimelineOrderNumbers() {
  const items = document.querySelectorAll('#timeline-sort-list .timeline-item');
  items.forEach((item, idx) => {
    item.querySelector('.timeline-item-order').textContent = idx + 1;
  });
}

function submitTimelineAnswer() {
  const q = timelineState.questions[timelineState.currentIndex];
  const items = [...document.querySelectorAll('#timeline-sort-list .timeline-item')];
  
  const userOrder = items.map(el => el.dataset.originalDate);
  const correctOrder = [...q.events].sort((a, b) => a.date.localeCompare(b.date)).map(e => e.date);
  
  let isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
  
  items.forEach((item, idx) => {
    if (item.dataset.originalDate === correctOrder[idx]) {
      item.classList.add('correct');
    } else {
      item.classList.add('wrong');
    }
  });
  
  const resultPanel = document.getElementById('timeline-result-panel');
  const resultText = document.getElementById('timeline-result-text');
  const correctOrderEl = document.getElementById('timeline-correct-order');
  
  resultText.innerHTML = isCorrect ? 
    `<span style="color:var(--success);font-weight:bold">✓ 排序完全正确！</span>` :
    `<span style="color:var(--error);font-weight:bold">✗ 排序有误，正确顺序如下：</span>`;
  
  const sortedEvents = [...q.events].sort((a, b) => a.date.localeCompare(b.date));
  correctOrderEl.innerHTML = sortedEvents.map((ev, idx) => 
    `${idx + 1}. ${ev.label} — ${ev.text}`
  ).join('<br/>');
  
  resultPanel.style.display = 'block';
  
  if (isCorrect) triggerConfetti();

  if (typeof recordAnswerProgress === 'function') {
    recordAnswerProgress(q, isCorrect);
  }
  
  // 3秒后自动下一题
  const submitBtn = document.getElementById('btn-timeline-submit');
  submitBtn.textContent = '下一题 →';
  submitBtn.onclick = () => {
    timelineState.currentIndex++;
    submitBtn.textContent = '提交排序';
    submitBtn.onclick = submitTimelineAnswer;
    renderTimelineQuestion();
  };
}

// ============================================================
// 🧩 关键词配对模式
// ============================================================
function startKeywordMatch() {
  const qs = SUBJECT_DATA[currentSubject].matchQuestions;
  if (!qs || qs.length === 0) {
    alert('配对题目暂未加载，请稍后再试！');
    return;
  }
  const pool = typeof prepareSpecialModeQuestions === 'function'
    ? prepareSpecialModeQuestions(qs, { defaultWhenAll: qs.length })
    : shuffleArray([...qs]);
  if (!pool) return;

  matchState.questions = pool;
  matchState.currentIndex = 0;
  
  if (typeof startPracticeTimer === 'function') {
    startPracticeTimer("match-timer", "match-timer-text");
  }
  
  switchScreen('match');
  renderMatchRound();
}

function renderMatchRound() {
  if (matchState.currentIndex >= matchState.questions.length) {
    if (typeof updateHomeStats === 'function') updateHomeStats();
    alert('🎉 全部配对题目已完成！');
    quitQuiz();
    return;
  }
  
  const q = matchState.questions[matchState.currentIndex];
  if (typeof updateQuestionStatusBadge === 'function') {
    updateQuestionStatusBadge('match-answer-status', q);
  }
  const pct = (matchState.currentIndex / matchState.questions.length) * 100;
  document.getElementById('match-progress-bar').style.width = `${pct}%`;
  document.getElementById('match-progress-text').textContent =
    `${matchState.currentIndex + 1} / ${matchState.questions.length} 组 · 0 / ${q.pairs.length} 对`;
  document.getElementById('match-result').style.display = 'none';
  document.getElementById('btn-match-next').style.display = 'none';
  
  matchState.selectedLeft = null;
  matchState.selectedRight = null;
  matchState.matchedPairs = [];
  matchState.matchedColors = ['#2ecc71', '#3498db', '#9b59b6', '#e67e22', '#1abc9c', '#e74c3c'];
  
  // 打乱左右两列顺序
  const pairs = q.pairs;
  const leftItems = shuffleArray(pairs.map((p, i) => ({ text: p.left, pairIdx: i })));
  const rightItems = shuffleArray(pairs.map((p, i) => ({ text: p.right, pairIdx: i })));
  
  const leftCol = document.getElementById('match-col-left');
  const rightCol = document.getElementById('match-col-right');
  leftCol.innerHTML = '';
  rightCol.innerHTML = '';
  document.getElementById('match-svg').innerHTML = '';
  
  leftItems.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'match-item';
    el.textContent = item.text;
    el.dataset.pairIdx = item.pairIdx;
    el.dataset.side = 'left';
    el.id = `match-left-${item.pairIdx}`;
    el.onclick = () => handleMatchClick('left', item.pairIdx, el);
    leftCol.appendChild(el);
  });
  
  rightItems.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'match-item';
    el.textContent = item.text;
    el.dataset.pairIdx = item.pairIdx;
    el.dataset.side = 'right';
    el.id = `match-right-${item.pairIdx}`;
    el.onclick = () => handleMatchClick('right', item.pairIdx, el);
    rightCol.appendChild(el);
  });
}

function handleMatchClick(side, pairIdx, el) {
  if (el.classList.contains('matched')) return;
  
  if (side === 'left') {
    // 取消原来的左侧选中
    document.querySelectorAll('#match-col-left .match-item.selected').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
    matchState.selectedLeft = pairIdx;
  } else {
    document.querySelectorAll('#match-col-right .match-item.selected').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
    matchState.selectedRight = pairIdx;
  }
  
  // 尝试配对
  if (matchState.selectedLeft !== null && matchState.selectedRight !== null) {
    if (matchState.selectedLeft === matchState.selectedRight) {
      // 配对成功
      const color = matchState.matchedColors[matchState.matchedPairs.length] || '#2ecc71';
      const leftEl = document.getElementById(`match-left-${matchState.selectedLeft}`);
      const rightEl = document.getElementById(`match-right-${matchState.selectedRight}`);
      
      leftEl.classList.remove('selected');
      rightEl.classList.remove('selected');
      leftEl.classList.add('matched');
      rightEl.classList.add('matched');
      leftEl.style.borderColor = color;
      leftEl.style.background = `${color}22`;
      leftEl.style.color = color;
      rightEl.style.borderColor = color;
      rightEl.style.background = `${color}22`;
      rightEl.style.color = color;
      
      matchState.matchedPairs.push(matchState.selectedLeft);
      triggerConfetti();
      
      // 更新进度
      const q = matchState.questions[matchState.currentIndex];
      document.getElementById('match-progress-text').textContent = 
        `${matchState.matchedPairs.length} / ${q.pairs.length} 对`;
      
      matchState.selectedLeft = null;
      matchState.selectedRight = null;
      
      // 全部配对完成
      if (matchState.matchedPairs.length === q.pairs.length) {
        showMatchResult(true, q);
      }
    } else {
      // 配对错误
      const leftEl = document.getElementById(`match-left-${matchState.selectedLeft}`);
      const rightEl = document.getElementById(`match-right-${matchState.selectedRight}`);
      
      leftEl.classList.add('wrong-flash');
      rightEl.classList.add('wrong-flash');
      
      setTimeout(() => {
        leftEl.classList.remove('wrong-flash', 'selected');
        rightEl.classList.remove('wrong-flash', 'selected');
      }, 600);
      
      matchState.selectedLeft = null;
      matchState.selectedRight = null;
    }
  }
}

function showMatchResult(allCorrect, q) {
  const resultDiv = document.getElementById('match-result');
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = `<span style="color:var(--success);font-weight:bold">🎉 全部配对正确！</span><br/><br/>
    <strong>解析：</strong>${q.explanation}`;
  document.getElementById('btn-match-next').style.display = 'flex';

  if (typeof recordAnswerProgress === 'function') {
    recordAnswerProgress(q, allCorrect);
  }
  if (typeof updateHomeStats === 'function') updateHomeStats();
}

function resetMatchRound() {
  renderMatchRound();
}

function nextMatchRound() {
  matchState.currentIndex++;
  renderMatchRound();
}

// ============================================================
// 📰 阅读理解闯关模式
// ============================================================
function startReadingPass() {
  const qs = SUBJECT_DATA.politics.passageQuestions;
  if (!qs || qs.length === 0) {
    alert('阅读闯关题目暂未加载，请稍后再试！');
    return;
  }
  const pool = typeof prepareSpecialModeQuestions === 'function'
    ? prepareSpecialModeQuestions(qs, { defaultWhenAll: qs.length })
    : shuffleArray([...qs]);
  if (!pool) return;

  readingState.questions = pool;
  readingState.currentIndex = 0;
  readingState.currentSubQ = 0;
  readingState.subAnswered = [];
  readingState.subResults = [];
  
  if (typeof startPracticeTimer === 'function') {
    startPracticeTimer("reading-timer", "reading-timer-text");
  }
  
  switchScreen('reading');
  renderReadingPass();
}

function renderReadingPass() {
  if (readingState.currentIndex >= readingState.questions.length) {
    if (typeof updateHomeStats === 'function') updateHomeStats();
    alert('🎉 恭喜！您已完成所有阅读闯关！');
    quitQuiz();
    return;
  }
  
  const q = readingState.questions[readingState.currentIndex];
  readingState.currentSubQ = 0;
  readingState.subAnswered = [];
  readingState.subResults = [];

  if (typeof updateQuestionStatusBadge === 'function') {
    updateQuestionStatusBadge('reading-answer-status', q);
  }

  document.getElementById('reading-pass-label').textContent = 
    `第${readingState.currentIndex + 1}关 / 共${readingState.questions.length}关`;
  document.getElementById('reading-passage-text').textContent = q.passage;
  document.getElementById('btn-reading-next').style.display = 'none';
  
  const qList = document.getElementById('reading-questions-list');
  qList.innerHTML = '';
  
  q.questions.forEach((subQ, idx) => {
    const div = document.createElement('div');
    div.className = `reading-sub-q ${idx === 0 ? 'unlocked' : 'locked'}`;
    div.id = `reading-sub-${idx}`;
    
    div.innerHTML = `
      <div class="reading-q-label">第 ${idx + 1} 题 · ${getQTypeLabel(subQ.type)}</div>
      <div class="reading-q-title">${subQ.question}</div>
      <div id="reading-sub-content-${idx}"></div>
      <div class="explanation-panel" id="reading-sub-exp-${idx}">
        <div class="exp-title">参考解析</div>
        <div class="exp-content">${subQ.explanation}</div>
      </div>
    `;
    qList.appendChild(div);
    
    // 渲染选项
    const contentEl = div.querySelector(`#reading-sub-content-${idx}`);
    if (subQ.type === 'fill') {
      contentEl.innerHTML = `
        <div class="reading-fill-row">
          <input type="text" class="fill-input" id="reading-fill-${idx}" placeholder="请输入答案">
          <button class="btn-submit" onclick="submitReadingSubQ(${idx})">确定</button>
        </div>
      `;
    } else {
      const optList = document.createElement('div');
      optList.className = 'options-list';
      optList.id = `reading-options-${idx}`;
      
      subQ.options.forEach((opt, optIdx) => {
        const letter = String.fromCharCode(65 + optIdx);
        const btn = document.createElement('div');
        btn.className = 'option-btn';
        btn.innerHTML = `<span class="option-prefix">${letter}</span><span class="option-text">${opt}</span>`;
        btn.onclick = () => submitReadingOption(idx, letter, btn, subQ);
        optList.appendChild(btn);
      });
      
      contentEl.appendChild(optList);
    }
  });
}

function submitReadingOption(subIdx, letter, clickedBtn, subQ) {
  if (readingState.subAnswered.includes(subIdx)) return;
  readingState.subAnswered.push(subIdx);
  
  const isCorrect = letter === subQ.answer;
  readingState.subResults.push(isCorrect);
  const optList = document.getElementById(`reading-options-${subIdx}`);
  optList.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.classList.add('disabled');
    const btnLetter = String.fromCharCode(65 + i);
    if (btnLetter === subQ.answer) btn.classList.add('correct');
    else if (btnLetter === letter && !isCorrect) btn.classList.add('wrong');
  });
  
  if (isCorrect) triggerConfetti();
  
  document.getElementById(`reading-sub-exp-${subIdx}`).classList.add('active');
  
  // 解锁下一题
  unlockNextReadingSubQ(subIdx);
}

function submitReadingSubQ(subIdx) {
  if (readingState.subAnswered.includes(subIdx)) return;
  
  const q = readingState.questions[readingState.currentIndex];
  const subQ = q.questions[subIdx];
  const val = document.getElementById(`reading-fill-${subIdx}`).value.trim();
  
  if (!val) { alert('请先输入答案！'); return; }
  
  readingState.subAnswered.push(subIdx);
  
  const isCorrect = subQ.answer.some(a => a.toLowerCase() === val.toLowerCase());
  readingState.subResults.push(isCorrect);
  const inputEl = document.getElementById(`reading-fill-${subIdx}`);
  inputEl.style.borderColor = isCorrect ? 'var(--success)' : 'var(--error)';
  inputEl.style.background = isCorrect ? 'var(--success-glow)' : 'var(--error-glow)';
  inputEl.disabled = true;
  
  if (isCorrect) triggerConfetti();
  
  document.getElementById(`reading-sub-exp-${subIdx}`).classList.add('active');
  unlockNextReadingSubQ(subIdx);
}

function unlockNextReadingSubQ(justAnsweredIdx) {
  const q = readingState.questions[readingState.currentIndex];
  const nextIdx = justAnsweredIdx + 1;
  
  if (nextIdx < q.questions.length) {
    const nextEl = document.getElementById(`reading-sub-${nextIdx}`);
    if (nextEl) {
      nextEl.classList.remove('locked');
      nextEl.classList.add('unlocked');
      nextEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  } else {
    // 所有子题完成
    const passageQ = readingState.questions[readingState.currentIndex];
    const allCorrect = readingState.subResults.length > 0 && readingState.subResults.every(Boolean);
    if (typeof recordAnswerProgress === 'function') {
      recordAnswerProgress(passageQ, allCorrect);
    }
    document.getElementById('btn-reading-next').style.display = 'flex';
  }
}

function nextReadingPass() {
  readingState.currentIndex++;
  document.getElementById('btn-reading-next').style.display = 'none';
  renderReadingPass();
  if (typeof updateHomeStats === 'function') updateHomeStats();
}

// ============================================================
// 🏆 每日打榜模式
// ============================================================
function startDailyChallenge() {
  const today = getTodayStr();
  const progress = typeof getActiveProgress === 'function' ? getActiveProgress() : { answers: {} };
  const filter = typeof progressFilter !== 'undefined' ? progressFilter : 'all';
  let allQ = SUBJECT_DATA.politics.questions.filter(q => q.type === 'single' || q.type === 'judgement');
  if (typeof filterQuestionsByProgress === 'function') {
    allQ = filterQuestionsByProgress(allQ, progress, filter);
  }

  const dayLimit = typeof getPracticeQuestionCount === 'function' ? getPracticeQuestionCount(8) : 8;
  if (allQ.length === 0) {
    const emptyMsg = typeof getProgressFilterEmptyMessage === 'function'
      ? getProgressFilterEmptyMessage()
      : { all: "暂无题目！", undone: "暂无未刷题目！", done: "暂无已刷题目！" };
    alert(emptyMsg[filter] || "暂无题目！");
    return;
  }
  
  // 用日期作为随机种子，同一天的题目固定（伪随机）
  const dayHash = [...today].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  let shuffled = seededShuffle([...allQ], dayHash);
  if (typeof prioritizeUnanswered === 'function' && filter === 'all') {
    shuffled = prioritizeUnanswered(shuffled, progress);
  }
  dailyState.questions = shuffled.slice(0, Math.min(dayLimit, shuffled.length));
  dailyState.currentIndex = 0;
  dailyState.correctCount = 0;
  dailyState.submitted = false;
  dailyState.results = [];
  
  // 切换到每日打榜屏幕
  document.getElementById('daily-quiz-area').style.display = 'block';
  document.getElementById('daily-result-area').style.display = 'none';
  
  if (typeof startPracticeTimer === 'function') {
    startPracticeTimer("daily-timer", "daily-timer-text");
  }
  
  switchScreen('daily');
  renderDailyQuestion();
}

function seededShuffle(arr, seed) {
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function renderDailyQuestion() {
  if (dailyState.currentIndex >= dailyState.questions.length) {
    finishDailyChallenge();
    return;
  }
  
  const q = dailyState.questions[dailyState.currentIndex];

  if (typeof updateQuestionStatusBadge === 'function') {
    updateQuestionStatusBadge('daily-answer-status', q);
  }
  
  document.getElementById('daily-q-label').textContent = 
    `第 ${dailyState.currentIndex + 1} 题 / 共 ${dailyState.questions.length} 题`;
  document.getElementById('daily-q-type').textContent = getQTypeLabel(q.type);
  document.getElementById('daily-q-title').textContent = q.question;
  document.getElementById('daily-explanation').classList.remove('active');
  document.getElementById('btn-daily-next').style.display = 'none';
  
  // 渲染8个进度点
  const dotsContainer = document.getElementById('daily-dots');
  dotsContainer.innerHTML = '';
  for (let i = 0; i < dailyState.questions.length; i++) {
    const dot = document.createElement('div');
    dot.className = 'daily-dot';
    if (i < dailyState.currentIndex) {
      dot.classList.add(dailyState.results[i]?.correct ? 'done-correct' : 'done-wrong');
    } else if (i === dailyState.currentIndex) {
      dot.classList.add('current');
    }
    dotsContainer.appendChild(dot);
  }
  
  // 渲染选项
  const optList = document.getElementById('daily-options-list');
  optList.innerHTML = '';
  
  q.options.forEach((opt, idx) => {
    const letter = String.fromCharCode(65 + idx);
    const btn = document.createElement('div');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="option-prefix">${letter}</span><span class="option-text">${opt}</span>`;
    btn.onclick = () => handleDailyAnswer(letter, q, btn, idx);
    optList.appendChild(btn);
  });
}

function handleDailyAnswer(letter, q, clickedBtn, clickedIdx) {
  if (dailyState.submitted) return;
  dailyState.submitted = true;
  
  const isCorrect = letter === q.answer;
  if (isCorrect) {
    dailyState.correctCount++;
    triggerConfetti();
  }
  
  // 高亮答案
  const optList = document.getElementById('daily-options-list');
  optList.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.classList.add('disabled');
    const btnLetter = String.fromCharCode(65 + i);
    if (btnLetter === q.answer) btn.classList.add('correct');
    else if (btnLetter === letter && !isCorrect) btn.classList.add('wrong');
  });
  
  // 显示解析
  const expPanel = document.getElementById('daily-explanation');
  document.getElementById('daily-explanation-content').innerHTML = 
    (isCorrect ? '<span style="color:var(--success);font-weight:bold">✓ 回答正确！</span><br/>' :
     `<span style="color:var(--error);font-weight:bold">✗ 错误，正确答案: ${q.answer}</span><br/>`) +
    q.explanation;
  expPanel.classList.add('active');
  
  // 记录结果
  dailyState.results.push({ correct: isCorrect, tip: q.explanation.substring(0, 60) + '...' });

  if (typeof recordAnswerProgress === 'function') {
    recordAnswerProgress(q, isCorrect);
  }
  
  document.getElementById('btn-daily-next').style.display = 'flex';
}

function dailyNextQuestion() {
  dailyState.currentIndex++;
  dailyState.submitted = false;
  renderDailyQuestion();
}

function finishDailyChallenge() {
  if (typeof stopPracticeTimer === 'function') {
    stopPracticeTimer();
  }
  document.getElementById('daily-quiz-area').style.display = 'none';
  document.getElementById('daily-result-area').style.display = 'block';
  
  const score = dailyState.correctCount;
  const total = dailyState.questions.length;
  
  document.getElementById('daily-result-score').textContent = `${score} / ${total}`;
  
  let badge = '', rank = '';
  if (score === total) {
    badge = '🏆'; rank = '时政达人'; triggerConfetti();
  } else if (score >= 6) {
    badge = '⭐'; rank = '基础扎实';
  } else if (score >= 4) {
    badge = '📚'; rank = '继续加油';
  } else {
    badge = '🔄'; rank = '需要补课';
  }
  
  document.getElementById('daily-result-badge').textContent = badge;
  document.getElementById('daily-result-rank').textContent = rank;
  
  // 今日要点速览
  const tipsList = document.getElementById('daily-tips-list');
  tipsList.innerHTML = '';
  dailyState.results.forEach((r, idx) => {
    const item = document.createElement('div');
    item.className = 'daily-tip-item';
    item.innerHTML = `<strong>Q${idx + 1}</strong> ${r.tip}`;
    tipsList.appendChild(item);
  });

  if (typeof updateHomeStats === 'function') updateHomeStats();
}

// ============================================================
// 工具：更新首页模式格子的显示（时政 vs 普通）
// ============================================================
// 在 app.js 的 selectSubject 中已通过 mode-grid-standard/politics 控制
// 此处提供统一的模式格子切换函数（由 app.js 的 selectSubject 调用）
function updateModeGrid(subjectId) {
  const standard = document.getElementById('mode-grid-standard');
  const politics = document.getElementById('mode-grid-politics');
  const pdfMistakesGrid = document.getElementById('mode-grid-pdf-mistakes');
  const shenlunPracticeGrid = document.getElementById('mode-grid-shenlun-practice');
  const theoryDrillGrid = document.getElementById('mode-grid-theory-drill');
  const standardMatch = document.getElementById('mode-card-standard-match');
  const recitationStandard = document.getElementById('mode-card-recitation-standard');
  const goldenRecitation = document.getElementById('mode-card-golden-recitation');
  const shenlunCards = document.getElementById('mode-card-shenlun-cards');
  const shenlunPracticeCard = document.getElementById('mode-card-shenlun-practice');

  if (!standard || !politics) return;

  if (pdfMistakesGrid) {
    pdfMistakesGrid.style.display = subjectId === 'pdf_mistakes' ? 'grid' : 'none';
  }
  if (shenlunPracticeGrid) {
    shenlunPracticeGrid.style.display = subjectId === 'shenlun_practice' ? 'grid' : 'none';
  }
  if (theoryDrillGrid) {
    theoryDrillGrid.style.display = subjectId === 'theory_drill' ? 'grid' : 'none';
  }

  const filterBar = document.getElementById('progress-filter-bar');
  if (filterBar) {
    filterBar.style.display = (subjectId === 'essays' || subjectId === 'pdf_mistakes' || subjectId === 'shenlun_practice' || subjectId === 'theory_drill')
      ? 'none'
      : 'flex';
  }

  if (subjectId === 'politics') {
    standard.style.display = 'none';
    politics.style.display = 'grid';
  } else if (subjectId === 'pdf_mistakes' || subjectId === 'shenlun_practice' || subjectId === 'theory_drill') {
    standard.style.display = 'none';
    politics.style.display = 'none';
  } else if (subjectId === 'essays') {
    standard.style.display = 'grid';
    politics.style.display = 'none';

    // 隐藏其他大卡片，只显示申论相关卡片
    const cards = standard.querySelectorAll('.mode-card');
    cards.forEach(card => {
      if (card === recitationStandard || card === goldenRecitation || card === shenlunCards || card === shenlunPracticeCard) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  } else {
    standard.style.display = 'grid';
    politics.style.display = 'none';

    // 显示常规大卡片，隐藏申论相关卡片
    const cards = standard.querySelectorAll('.mode-card');
    cards.forEach(card => {
      if (card === recitationStandard || card === goldenRecitation || card === shenlunCards || card === shenlunPracticeCard) {
        card.style.display = 'none';
      } else if (card === standardMatch) {
        const hasMatch = SUBJECT_DATA[subjectId] && SUBJECT_DATA[subjectId].matchQuestions && SUBJECT_DATA[subjectId].matchQuestions.length > 0;
        card.style.display = hasMatch ? 'block' : 'none';
      } else {
        card.style.display = 'block';
      }
    });
  }
}

// ============================================================
// 时政统计页：用条形图替代雷达图
// ============================================================
function renderPoliticsBarChart() {
  const svgEl = document.getElementById('radar-chart-svg');
  if (!svgEl) return;
  
  const categories = [
    { key: 'monthly', name: '月度时政' },
    { key: 'beijing_policy', name: '北京政策' },
    { key: 'special_topic', name: '专题精读' },
    { key: 'laws', name: '法规条例' }
  ];
  
  const progress = getActiveProgress();
  const allQ = SUBJECT_DATA.politics.questions;
  
  // 用div替换SVG
  const container = svgEl.parentElement;
  svgEl.style.display = 'none';
  
  let existingChart = container.querySelector('.politics-bar-chart');
  if (existingChart) existingChart.remove();
  
  const chartDiv = document.createElement('div');
  chartDiv.className = 'politics-bar-chart';
  chartDiv.style.width = '100%';
  
  categories.forEach(cat => {
    const catQs = allQ.filter(q => q.category === cat.key);
    const done = catQs.filter(q => progress.answers[q.id]?.correct).length;
    const pct = catQs.length > 0 ? Math.round((done / catQs.length) * 100) : 0;
    
    const row = document.createElement('div');
    row.className = 'politics-bar-row';
    row.innerHTML = `
      <div class="politics-bar-label">${cat.name}</div>
      <div class="politics-bar-wrap">
        <div class="politics-bar-fill" style="width:${pct}%"></div>
      </div>
      <div class="politics-bar-pct">${pct}%</div>
    `;
    chartDiv.appendChild(row);
  });
  
  container.appendChild(chartDiv);
}
