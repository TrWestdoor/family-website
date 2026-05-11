// ===== 数据存储键名 =====
const STORAGE_KEYS = {
  photos: 'fw_photos',
  diaries: 'fw_diaries',
  memos: 'fw_memos',
  menus: 'fw_menus',
  menuWeek: 'fw_menu_week',
};

// ===== 工具函数 =====
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return `${d.getMonth()+1}/${d.getDate()}`;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// ===== LocalStorage 封装 =====
function loadData(key, defaultVal = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch { return defaultVal; }
}

function saveData(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

// ===== Hero 日期 =====
function initHero() {
  const el = document.getElementById('heroDate');
  if (!el) return;
  const now = new Date();
  const weekdays = ['周日','周一','周二','周三','周四','周五','周六'];
  el.textContent = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 ${weekdays[now.getDay()]} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
}

// ===== 导航栏 =====
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // 滚动时高亮当前 section
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
}

// ===== 相册 =====
let photosData = [];
let currentFilter = 'all';
let currentPhotoIndex = 0;

const CATEGORY_MAP = {
  daily: '日常',
  travel: '旅行',
  food: '美食',
  pet: '萌宠',
};

const CATEGORY_EMOJI = {
  daily: '🏠',
  travel: '✈️',
  food: '🍽️',
  pet: '🐱',
};

function initGallery() {
  photosData = loadData(STORAGE_KEYS.photos, getDefaultPhotos());
  saveData(STORAGE_KEYS.photos, photosData);

  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('fileInput');

  uploadArea.addEventListener('click', () => fileInput.click());

  uploadArea.addEventListener('dragover', e => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
  });

  uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    handleFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener('change', e => handleFiles(e.target.files));

  // 筛选按钮
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderGallery();
    });
  });

  renderGallery();
  initPhotoModal();
}

function getDefaultPhotos() {
  return [
    { id: '1', name: '我们的结婚照', date: '2025-09-20', category: 'daily', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80' },
    { id: '2', name: '马尔代夫之旅', date: '2026-08-02', category: 'travel', url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80' },
    { id: '3', name: '鱼蛋和芋圆', date: '2026-01-15', category: 'pet', url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&q=80' },
    { id: '4', name: '周末家常菜', date: '2026-03-01', category: 'food', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80' },
    { id: '5', name: '滑雪日', date: '2026-02-10', category: 'travel', url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&q=80' },
    { id: '6', name: '纪念日惊喜', date: '2026-03-19', category: 'daily', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80' },
  ];
}

function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  const filtered = currentFilter === 'all'
    ? photosData
    : photosData.filter(p => p.category === currentFilter);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <span class="empty-state-icon">📷</span>
        <p>还没有${currentFilter === 'all' ? '' : CATEGORY_MAP[currentFilter]}照片，上传第一张吧！</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map((photo, i) => `
    <div class="photo-card" data-index="${photosData.indexOf(photo)}">
      <img src="${photo.url}" alt="${photo.name}" loading="lazy">
      <div class="photo-info">
        <div class="photo-name">${photo.name}</div>
        <div class="photo-date">${formatDate(photo.date)}</div>
        <span class="photo-tag">${CATEGORY_EMOJI[photo.category] || '📌'} ${CATEGORY_MAP[photo.category] || photo.category}</span>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.photo-card').forEach(card => {
    card.addEventListener('click', () => {
      currentPhotoIndex = parseInt(card.dataset.index);
      openPhotoModal(currentPhotoIndex);
    });
  });
}

function handleFiles(files) {
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
      alert(`"${file.name}" 超过5MB，请选择更小的图片`);
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const newPhoto = {
        id: generateId(),
        name: file.name.replace(/\.[^.]+$/, ''),
        date: new Date().toISOString().split('T')[0],
        category: 'daily',
        url: e.target.result,
      };
      photosData.unshift(newPhoto);
      saveData(STORAGE_KEYS.photos, photosData);
      renderGallery();
    };
    reader.readAsDataURL(file);
  });
}

// ===== 照片预览模态框 =====
function initPhotoModal() {
  const modal = document.getElementById('photoModal');
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const closeBtn = document.getElementById('modalClose');
  const prevBtn = document.getElementById('modalPrev');
  const nextBtn = document.getElementById('modalNext');
  const overlay = modal.querySelector('.modal-overlay');

  closeBtn.addEventListener('click', () => closeModal(modal));
  overlay.addEventListener('click', () => closeModal(modal));

  prevBtn.addEventListener('click', e => {
    e.stopPropagation();
    currentPhotoIndex = (currentPhotoIndex - 1 + photosData.length) % photosData.length;
    updateModalPhoto();
  });

  nextBtn.addEventListener('click', e => {
    e.stopPropagation();
    currentPhotoIndex = (currentPhotoIndex + 1) % photosData.length;
    updateModalPhoto();
  });

  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal(modal);
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });
}

function openPhotoModal(index) {
  const modal = document.getElementById('photoModal');
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const photo = photosData[index];

  modalImg.src = photo.url;
  modalImg.alt = photo.name;
  modalCaption.textContent = `${photo.name} · ${formatDate(photo.date)}`;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function updateModalPhoto() {
  const photo = photosData[currentPhotoIndex];
  document.getElementById('modalImage').src = photo.url;
  document.getElementById('modalImage').alt = photo.name;
  document.getElementById('modalCaption').textContent = `${photo.name} · ${formatDate(photo.date)}`;
}

function closeModal(modal) {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// ===== 日记 =====
let diariesData = [];
let selectedMood = 'happy';

const MOOD_MAP = {
  happy: '😊', love: '🥰', calm: '😌', excited: '🤩', grateful: '🙏', tired: '😮‍💨',
};

function initDiary() {
  diariesData = loadData(STORAGE_KEYS.diaries, getDefaultDiaries());
  saveData(STORAGE_KEYS.diaries, diariesData);

  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedMood = btn.dataset.mood;
    });
  });

  document.getElementById('saveDiary').addEventListener('click', saveDiary);
  renderDiaries();
}

function getDefaultDiaries() {
  return [
    {
      id: '1',
      title: '我们的结婚一周年倒计时开始！',
      mood: 'love',
      content: '时间过得好快，转眼我们已经在一起快两年了。每天早上醒来看到身边的人，都觉得特别幸福。希望接下来的一年，我们能一起去更多的地方，创造更多美好的回忆 ❤️',
      date: new Date().toISOString().split('T')[0],
    },
    {
      id: '2',
      title: '鱼蛋和芋圆又在争宠了',
      mood: 'excited',
      content: '两只小祖宗今天为了一个纸箱大打出手，最后芋圆靠体型优势霸占了箱子，鱼蛋只能在旁边委屈巴巴地看着。家里有它们真的永远不会无聊 🐱',
      date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    },
  ];
}

function renderDiaries() {
  const list = document.getElementById('diaryList');
  if (diariesData.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <span class="empty-state-icon">📖</span>
        <p>还没有日记，写下第一篇吧！</p>
      </div>`;
    return;
  }

  list.innerHTML = diariesData.map(d => `
    <div class="diary-card">
      <div class="diary-header">
        <span class="diary-mood">${MOOD_MAP[d.mood] || '😊'}</span>
        <div class="diary-title">${d.title}</div>
        <div class="diary-date">${formatDate(d.date)}</div>
      </div>
      <div class="diary-content">${d.content}</div>
      <div class="diary-actions">
        <button class="diary-action-btn delete" data-id="${d.id}">🗑️ 删除</button>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.delete').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('确定要删除这篇日记吗？')) {
        diariesData = diariesData.filter(d => d.id !== btn.dataset.id);
        saveData(STORAGE_KEYS.diaries, diariesData);
        renderDiaries();
      }
    });
  });
}

function saveDiary() {
  const title = document.getElementById('diaryTitle').value.trim();
  const content = document.getElementById('diaryContent').value.trim();

  if (!title || !content) {
    alert('请填写标题和内容');
    return;
  }

  diariesData.unshift({
    id: generateId(),
    title,
    mood: selectedMood,
    content,
    date: new Date().toISOString().split('T')[0],
  });

  saveData(STORAGE_KEYS.diaries, diariesData);
  document.getElementById('diaryTitle').value = '';
  document.getElementById('diaryContent').value = '';
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
  selectedMood = 'happy';
  renderDiaries();
}

// ===== 备忘录 =====
let memosData = [];

const MEMO_CATEGORY_MAP = {
  general: { label: '📌 一般', color: 'rgba(232,168,124,0.15)' },
  shopping: { label: '🛒 购物', color: 'rgba(248,183,57,0.15)' },
  todo: { label: '✅ 待办', color: 'rgba(100,181,246,0.15)' },
  reminder: { label: '⏰ 提醒', color: 'rgba(186,104,200,0.15)' },
  bill: { label: '💰 账单', color: 'rgba(76,175,80,0.15)' },
};

function initMemo() {
  memosData = loadData(STORAGE_KEYS.memos, getDefaultMemos());
  saveData(STORAGE_KEYS.memos, memosData);

  const input = document.getElementById('memoInput');
  const addBtn = document.getElementById('addMemo');

  addBtn.addEventListener('click', addMemo);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') addMemo(); });

  renderMemos();
}

function getDefaultMemos() {
  return [
    { id: '1', text: '订机票和酒店（马尔代夫8月行程）', category: 'todo', done: false, date: '2026-08-02' },
    { id: '2', text: '鱼蛋的猫粮快吃完了，记得买', category: 'shopping', done: false, date: new Date().toISOString().split('T')[0] },
    { id: '3', text: '结婚纪念日礼物 🎁', category: 'reminder', done: false, date: '2026-09-20' },
    { id: '4', text: '宋世伟生日：12月20日', category: 'reminder', done: false, date: '2026-12-20' },
    { id: '5', text: '华宇生日：10月13日', category: 'reminder', done: false, date: '2026-10-13' },
  ];
}

function renderMemos() {
  const list = document.getElementById('memoList');
  if (memosData.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <span class="empty-state-icon">📋</span>
        <p>备忘录是空的，添加第一条吧！</p>
      </div>`;
    return;
  }

  list.innerHTML = memosData.map(m => {
    const cat = MEMO_CATEGORY_MAP[m.category] || MEMO_CATEGORY_MAP.general;
    return `
    <div class="memo-item">
      <div class="memo-checkbox ${m.done ? 'checked' : ''}" data-id="${m.id}">${m.done ? '✓' : ''}</div>
      <div class="memo-text ${m.done ? 'done' : ''}">${m.text}</div>
      <span class="memo-category" style="background:${cat.color}">${cat.label}</span>
      <button class="memo-delete" data-id="${m.id}">✕</button>
    </div>`;
  }).join('');

  list.querySelectorAll('.memo-checkbox').forEach(cb => {
    cb.addEventListener('click', () => {
      const m = memosData.find(x => x.id === cb.dataset.id);
      if (m) {
        m.done = !m.done;
        saveData(STORAGE_KEYS.memos, memosData);
        renderMemos();
      }
    });
  });

  list.querySelectorAll('.memo-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      memosData = memosData.filter(m => m.id !== btn.dataset.id);
      saveData(STORAGE_KEYS.memos, memosData);
      renderMemos();
    });
  });
}

function addMemo() {
  const input = document.getElementById('memoInput');
  const category = document.getElementById('memoCategory').value;
  const text = input.value.trim();

  if (!text) { alert('请输入备忘录内容'); return; }

  memosData.unshift({
    id: generateId(),
    text,
    category,
    done: false,
    date: new Date().toISOString().split('T')[0],
  });

  saveData(STORAGE_KEYS.memos, memosData);
  input.value = '';
  renderMemos();
}

// ===== 家庭菜单 =====
let menusData = [];
let currentWeek = 'this';

const MEAL_TYPE_MAP = {
  breakfast: '☀️ 早餐',
  lunch: '🌤️ 午餐',
  dinner: '🌙 晚餐',
  snack: '🍰 加餐',
};

function initMenu() {
  menusData = loadData(STORAGE_KEYS.menus, getDefaultMenus());
  currentWeek = loadData(STORAGE_KEYS.menuWeek, 'this');
  saveData(STORAGE_KEYS.menus, menusData);
  saveData(STORAGE_KEYS.menuWeek, currentWeek);

  document.querySelectorAll('.menu-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentWeek = tab.dataset.week;
      saveData(STORAGE_KEYS.menuWeek, currentWeek);
      renderMenus();
    });
  });

  document.getElementById('addMeal').addEventListener('click', addMeal);
  document.querySelector(`.menu-tab[data-week="${currentWeek}"]`)?.classList.add('active');
  renderMenus();
}

function getDefaultMenus() {
  return [
    { id: '1', name: '番茄鸡蛋面', type: 'breakfast', day: '周一', week: 'this' },
    { id: '2', name: '红烧肉 + 米饭', type: 'dinner', day: '周一', week: 'this' },
    { id: '3', name: '三明治 + 牛奶', type: 'breakfast', day: '周二', week: 'this' },
    { id: '4', name: '清蒸鲈鱼', type: 'dinner', day: '周二', week: 'this' },
    { id: '5', name: '麻婆豆腐 + 米饭', type: 'lunch', day: '周三', week: 'this' },
    { id: '6', name: 'Pizza 之夜 🍕', type: 'dinner', day: '周五', week: 'this' },
    { id: '7', name: '奶油蘑菇意面', type: 'dinner', day: '周六', week: 'this' },
    { id: '8', name: '家庭烧烤派对', type: 'dinner', day: '周日', week: 'this' },
    { id: '9', name: '牛排大餐 🥩', type: 'dinner', day: '周五', week: 'next' },
  ];
}

function renderMenus() {
  const grid = document.getElementById('menuGrid');
  const filtered = menusData.filter(m => m.week === currentWeek);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <span class="empty-state-icon">🍳</span>
        <p>${currentWeek === 'this' ? '本周' : '下周'}还没有菜单，添加一个吧！</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(m => `
    <div class="menu-card">
      <button class="menu-delete" data-id="${m.id}">✕</button>
      <div class="menu-type">${MEAL_TYPE_MAP[m.type] || m.type}</div>
      <div class="menu-name">${m.name}</div>
      ${m.day ? `<div class="menu-day">📅 ${m.day}</div>` : ''}
    </div>
  `).join('');

  grid.querySelectorAll('.menu-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      menusData = menusData.filter(m => m.id !== btn.dataset.id);
      saveData(STORAGE_KEYS.menus, menusData);
      renderMenus();
    });
  });
}

function addMeal() {
  const name = document.getElementById('mealName').value.trim();
  const type = document.getElementById('mealType').value;
  const day = document.getElementById('mealDay').value.trim();

  if (!name) { alert('请输入菜名'); return; }

  menusData.push({
    id: generateId(),
    name,
    type,
    day: day || '',
    week: currentWeek,
  });

  saveData(STORAGE_KEYS.menus, menusData);
  document.getElementById('mealName').value = '';
  document.getElementById('mealDay').value = '';
  renderMenus();
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
  initHero();
  initNavbar();
  initGallery();
  initDiary();
  initMemo();
  initMenu();
});
