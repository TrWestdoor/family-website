// ===== 工具函数 =====
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// 日期显示
const updateDate = () => {
    const now = new Date();
    const opts = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    $('#currentDate').textContent = now.toLocaleDateString('zh-CN', opts);
};
updateDate();

// 导航切换
$('#navToggle').addEventListener('click', () => {
    $('#navLinks').classList.toggle('show');
});

// ===== 弹窗控制 =====
const openModal = (name) => {
    $$('.modal').forEach(m => m.classList.remove('show'));
    $('#overlay').classList.remove('show');
    if ($(`${name}Modal`)) {
        $(`${name}Modal`).classList.add('show');
        $('#overlay').classList.add('show');
    }
    $$('.nav-links a').forEach(a => a.classList.remove('active'));
    // 设置当前导航为active
    $$('.nav-links a').forEach(a => {
        if (a.getAttribute('onclick')?.includes(`'${name}'`)) {
            a.classList.add('active');
        }
    });
    $('#navLinks').classList.remove('show');
};
const closeModal = (name) => {
    $(`${name}Modal`).classList.remove('show');
    $('#overlay').classList.remove('show');
};
$('#overlay').addEventListener('click', () => {
    $$('.modal').forEach(m => m.classList.remove('show'));
    $('#overlay').classList.remove('show');
});

// ===== 家人数据 =====
const familyData = [
    { emoji: '👨', name: '宋世伟', title: '爸爸', birthday: '🎂 1994.12.20', bio: '家庭的顶梁柱，温暖的技术宅。喜欢滑雪、摩托车和打游戏，但更爱陪家人的每一刻。', tags: ['🎿滑雪', '🏍️摩托', '🎮游戏', '💻AI'] },
    { emoji: '👩', name: '华宇', title: '妈妈', birthday: '🎂 1997.10.13', bio: '温柔贤惠的妈妈，把家里打理得井井有条。她是家的灵魂，让每个角落都有爱。', tags: ['🍳美食', '📸摄影', '🎨生活家', '❤️温柔'] },
    { emoji: '🐱', name: '鱼蛋', title: '家里的太阳', birthday: '🐾 2024', bio: '圆滚滚的蓝金小可爱，每天在沙发上晒太阳，被窝里的常驻嘉宾。毛茸茸的治愈系担当。', tags: ['😴睡觉', '🐟贪吃', '💛亲人'] },
    { emoji: '🐱', name: '芋圆', title: '家里的小公主', birthday: '🐾 2025', bio: '鱼蛋的妹妹，活泼好奇的一团毛球，喜欢探索每个角落。家里的气氛担当。', tags: ['🏃‍♀️活泼', '👀好奇', '🐟小吃货'] }
];
const renderFamily = () => {
    const grid = $('#familyGrid');
    grid.innerHTML = familyData.map(m => `
        <div class="family-card">
            <div style="font-size:3rem">${m.emoji}</div>
            <h3>${m.name}</h3>
            <div style="color:#888;font-size:0.85rem">${m.title} · ${m.birthday}</div>
            <div class="bio">${m.bio}</div>
            <div class="tags">${m.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        </div>
    `).join('');
};
renderFamily();

// ===== 相册数据 =====
const albums = [
    { desc: '新家客厅', icon: '🏠' }, { desc: '鱼蛋可爱瞬间', icon: '🐱' }, { desc: '马尔代夫蜜月', icon: '🌅' },
    { desc: '外滩冬夜', icon: '🌃' }, { desc: '成都过年辣味', icon: '🍲' }, { desc: '婚礼誓言', icon: '🤵👰' },
    { desc: '芋圆加入', icon: '🐾' }, { desc: '亚龙湾海滩', icon: '🏖️' }, { desc: '杭州西湖', icon: '🍂' },
    { desc: '张家界奇峰', icon: '⛰️' }, { desc: '西安古城', icon: '🏯' }, { desc: '全家福', icon: '👨‍👩‍👧' }
];
const renderAlbum = () => {
    const grid = $('#albumGrid');
    grid.innerHTML = albums.map(a => `
        <div class="album-item">
            <span>${a.icon}</span>
            <div class="desc">${a.icon} ${a.desc}</div>
        </div>
    `).join('');
};
renderAlbum();

// ===== 大事记 =====
const timelineData = [
    { year: '2020.05', title: '🌹 爱情开始', content: '在社交活动中偶然相遇，从此开始了两个人的故事。' },
    { year: '2024.05', title: '😺 鱼蛋来了', content: '家里迎来第一位毛孩子，生活多了一份毛茸茸的温暖。' },
    { year: '2024.冬至', title: '🌃 上海外滩', content: '冬夜的外滩格外浪漫，在黄浦江畔留下了难忘的回忆。' },
    { year: '2025.01', title: '🐱 芋圆加入', content: '家里多了一团新成员，从此变成了四口之家。' },
    { year: '2025.05.02', title: '🤵👰 我们结婚了！', content: '在上海丽思卡尔顿举行婚礼，从此有了"宋华"这个家的名字。' },
    { year: '2025.05', title: '🏝️ 蜜月马尔代夫', content: '碧海蓝天的梦幻之旅，享受二人世界的甜蜜时光。' },
    { year: '2025.07.02', title: '🏡 搬到上海', content: '从松江来到新的社区，生活开启了新的篇章。' },
    { year: '2026.08', title: '🏖️ 二次蜜月计划', content: '计划中的马尔代夫之旅，期待再次携手同行。' }
];
const renderTimeline = () => {
    const content = $('#timelineContent');
    content.innerHTML = timelineData.map(t => `
        <div class="timeline-item">
            <div class="year">${t.year}</div>
            <div class="content"><h4>${t.title}</h4><p>${t.content}</p></div>
        </div>
    `).join('');
};
renderTimeline();

// ===== 快捷信息 =====
const renderShortcuts = () => {
    const content = $('#shortcutContent');
    content.innerHTML = `
        <div class="shortcut-card"><h4>📍 新家地址</h4><p>上海市<br>从松江搬到这里，开始了新的生活！</p></div>
        <div class="shortcut-card"><h4>📶 WiFi</h4><p>请询问家人<br>密码由家庭成员管理</p></div>
        <div class="shortcut-card"><h4>🚨 紧急电话</h4><p>🔞 紧急: 110 | 🔥 火警: 119 | 🏥 医疗: 120 | 🚗 事故: 122</p></div>
        <div class="shortcut-card"><h4>🛒 外卖/购物</h4><br><div class="shortcut-links"><a href="https://jd.com" target="_blank" class="shortcut-link-btn">京东</a><a href="https://ele.me" target="_blank" class="shortcut-link-btn">饿了么</a></div></div>
    `;
};
renderShortcuts();

// ===== 留言板 =====
let messages = JSON.parse(localStorage.getItem('family_msgs') || '[]');
const renderMessages = () => {
    const list = $('#messageList');
    list.innerHTML = messages.map(m => `
        <div class="message-item"><div class="author">${m.author}</div><div class="content">${m.content}</div><div class="time">${m.time}</div></div>
    `).join('');
};
const addMessage = () => {
    const text = $('#msgText').value.trim();
    if (!text) return;
    const names = ['🐱 鱼蛋', '👩 妈妈', '👨 爸爸'];
    const msg = { author: names[Math.floor(Math.random()*names.length)], content: text, time: new Date().toLocaleString('zh-CN') };
    messages.unshift(msg);
    localStorage.setItem('family_msgs', JSON.stringify(messages));
    $('#msgText').value = '';
    renderMessages();
};
renderMessages();

// ===== 备忘录 =====
let memos = JSON.parse(localStorage.getItem('family_memos') || '[]');
const updateMemoPreview = () => {
    const preview = $('#memoPreview');
    if (preview) preview.innerHTML = `<div class="item">共 ${memos.length} 条待办</div>`;
};
const renderMemos = () => {
    const list = $('#memoList');
    list.innerHTML = memos.map((m, i) => `
        <div class="memo-item ${m.done ? 'done' : ''}">
            <input type="checkbox" ${m.done ? 'checked' : ''} onchange="toggleMemo(${i})">
            <span class="memo-text">${m.text}</span>
            <button class="memo-delete" onclick="deleteMemo(${i})">&times;</button>
        </div>
    `).join('');
    updateMemoPreview();
};
const toggleMemo = (i) => { memos[i].done = !memos[i].done; localStorage.setItem('family_memos', JSON.stringify(memos)); renderMemos(); };
const deleteMemo = (i) => { memos.splice(i, 1); localStorage.setItem('family_memos', JSON.stringify(memos)); renderMemos(); };
const addMemo = () => {
    const text = $('#memoInput').value.trim();
    if (!text) return;
    memos.push({ text, done: false });
    localStorage.setItem('family_memos', JSON.stringify(memos));
    $('#memoInput').value = '';
    renderMemos();
};
renderMemos();

// ===== 旅行足迹 =====
const cities = {
    visited: ['🌃上海', '🌅三亚', '🍲成都', '🍂杭州', '⛰️张家界', '🏯西安', '🏝️马尔代夫'],
    wish: ['🗼东京', '⛩️京都', '🍜首尔', '🏖️巴厘岛', '❄️冰岛', '🗼巴黎', '🗽纽约', '🏔️瑞士', '🐘泰国', '🏙️迪拜', '🌿新西兰', '🌶️重庆', '🏖️马尔代夫(2)']
};
const renderMap = () => {
    const content = $('#mapContent');
    content.innerHTML = `
        <div><h3 style="margin-bottom:1rem">✅ 已到访</h3><div class="map-cities">${cities.visited.map(c => `<span class="city-tag visited">${c}</span>`).join('')}</div></div>
        <div><h3 style="margin-bottom:1rem">🌟 想去的地方</h3><div class="map-cities">${cities.wish.map(c => `<span class="city-tag wish">${c}</span>`).join('')}</div></div>
    `;
};
renderMap();
