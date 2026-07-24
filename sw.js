const CACHE_NAME = 'beijing-quiz-v26';
const ASSETS = [
  './',
  './index.html',
  './app.css',
  './app.js',
  './questions.js',
  './politics_modes.js',
  './politics_questions_data.js',
  './theory_questions_data.js',
  './theory_drill_data.js',
  './theory_drill.js',
  './guidebook_questions_data.js',
  './quant_data.js',
  './essays_data.js',
  './shenlun_practice_data.js',
  './shenlun_practice.js',
  './interview_questions_data.js',
  './resume_projects_data.js',
  './manifest.json'
];

// 安装阶段缓存资源
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 激活阶段清理旧缓存
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 发起网络请求时，使用 Network First (网络优先) 策略，防止缓存锁定
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
        }
        return response;
      })
      .catch(() => {
        return caches.match(e.request).then((cached) => {
          if (cached) return cached;
          if (e.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
