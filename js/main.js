// ====== 配置 ======
const DATA = {
    family: {
        father: { name: "宋世伟", bday: "1994-12-20", desc: "算法工程师，家人守护者" },
        mother: { name: "华宇", bday: "1997-10-13", desc: "家庭天使" },
        cat_fishEgg: { name: "鱼蛋", type: "英短蓝金渐层" },
        cat_fishYuan: { name: "芋圆", type: "英短重点色银渐层" },
    },
    cities: {
        visited: [
            { name: "上海", lat: 31.2, lng: 121.5, emoji: "🌃", notes: "家在这里！外滩夜景超浪漫，婚礼也在这办的。第一次来外滩是2024年冬天，冷风中有你就不冷了。", img: "" },
            { name: "三亚亚龙湾", lat: 18.3, lng: 109.5, emoji: "🌅", notes: "2024年4月，一起看的日落，海浪声就是最好的BGM。第一次一起看海！亚龙湾沙细水暖，可惜没住够。", img: "" },
            { name: "成都", lat: 30.6, lng: 104.1, emoji: "🍲", notes: "2025年春节在这里过的年。火锅配兔头，辣到流泪还要吃。大熊猫真的好可爱！成都人太会生活了。", img: "" },
            { name: "杭州", lat: 30.3, lng: 120.2, emoji: "🍂", notes: "秋天去赏桂花，西湖的水好清。灵隐寺求了姻缘签，超灵！", img: "" },
            { name: "张家界", lat: 29.1, lng: 110.5, emoji: "⛰️", notes: "《 Avatar 》的现实版！玻璃桥好刺激，华宇恐高全程抓住我的手。", img: "" },
            { name: "西安", lat: 34.3, lng: 108.9, emoji: "🏯", notes: "城墙漫步感受历史，肉夹馍和凉皮太绝了。兵马俑震撼！", img: "" },
            { name: "马尔代夫", lat: 4.2, lng: 73.5, emoji: "🏝️", notes: "2025年5月蜜月之旅！水上别墅，浮潜看珊瑚鱼，日出美到失语。这是天堂。", img: "" },
        ],
        wish: [
            { name: "马尔代夫(2)", lat: 5.0, lng: 73.0, emoji: "🏖️", notes: "2026年8月计划！都喜天阙，水上泳池别墅。漂浮早餐+SPA+观星，二次蜜月走起！" },
            { name: "东京", lat: 35.7, lng: 139.7, emoji: "🗼", notes: "秋叶原+筑地市场+迪士尼，想吃地道寿司。" },
            { name: "京都", lat: 35.0, lng: 135.8, emoji: "⛩️", notes: "寺庙、抹茶、和服体验，想穿和服拍组照。" },
            { name: "大阪", lat: 34.7, lng: 135.5, emoji: "🐙", notes: "章鱼烧、黑门市场、环球影城。" },
            { name: "首尔", lat: 37.6, lng: 127.0, emoji: "🍜", notes: "明洞购物、韩餐、景福宫夜景。" },
            { name: "巴厘岛", lat: -8.4, lng: 115.2, emoji: "🌴", notes: "乌布梯田、海神庙日落。" },
            { name: "新西兰", lat: -41.3, lng: 174.8, emoji: "🌿", notes: "皇后镇蹦极、米尔福德峡湾。" },
            { name: "冰岛", lat: 64.1, lng: -21.9, emoji: "❄️", notes: "追极光！蓝湖温泉、黑沙滩。" },
            { name: "巴黎", lat: 48.9, lng: 2.3, emoji: "🗼", notes: "埃菲尔铁塔下吃可丽饼，卢浮宫看蒙娜丽莎。" },
            { name: "纽约", lat: 40.7, lng: -74.0, emoji: "🗽", notes: "时代广场、百老汇、自由女神。" },
            { name: "迪拜", lat: 25.2, lng: 55.3, emoji: "🏙️", notes: "帆船酒店、沙漠冲沙、棕榈岛。" },
            { name: "瑞士", lat: 46.8, lng: 8.2, emoji: "🏔️", notes: "少女峰、因特拉肯、巧克力！" },
            { name: "泰国", lat: 13.8, lng: 100.5, emoji: "🐘", notes: "曼谷大皇宫、清迈夜市、普吉岛。" },
            { name: "重庆", lat: 29.6, lng: 106.5, emoji: "🌶️", notes: "洪崖洞夜景、山城步道、最辣火锅！" },
        ],
    },
};

// ====== 工具函数 ======
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

function showToast(msg) {
    let t = $('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
}

function saveData(key, data) { try { localStorage.setItem(key, JSON.stringify(data)); } catch(e){} }
function loadData(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch(e){ return fallback; } }

// ====== 初始化 ======
document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initDate();
    initScrollReveal();
    initAlbum();
    initMessages();
    initMemos();
    initMap();
});

// ====== 导航栏 ======
function initNav() {
    const nav = $('#navbar'), toggle = $('#navToggle'), links = $('#navLinks');
    if (toggle) toggle.addEventListener('click', () => links.classList.toggle('open'));
    $$('.nav-links a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
        // 高亮当前section
        let current = '';
        $$('.section').forEach(s => {
            if (window.scrollY >= s.offsetTop - 120) current = s.id;
        });
        $$('.nav-links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
    });
}

// ====== 日期/问候 ======
function initDate() {
    const now = new Date();
    const days = ['日','一','二','三','四','五','六'];
    const dateStr = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 星期${days[now.getDay()]}`;
    $('#todayDate').textContent = dateStr;
    const h = now.getHours();
    let g = '晚安好梦 🌙';
    if (h >= 5 && h < 9) g = '早上好 ☀️';
    else if (h >= 9 && h < 12) g = '上午好 🌤️';
    else if (h >= 12 && h < 14) g = '中午好 🌞';
    else if (h >= 14 && h < 18) g = '下午好 🌈';
    else if (h >= 18 && h < 20) g = '傍晚好 🌇';
    else if (h >= 20 && h < 23) g = '晚上好 🌙';
    $('#greeting').textContent = `${g}  —  今天也要开开心心`;
}

// ====== 滚动动画 ======
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }});
    }, { threshold: 0.1 });
    $$('.section').forEach(s => observer.observe(s));
}

// ====== 相册 & 灯箱 ======
function initAlbum() {
    const grid = $('#albumGrid'), lightbox = $('#lightbox');
    $$('.album-item').forEach(item => {
        item.addEventListener('click', () => {
            const emoji = item.querySelector('span').textContent;
            $('#lightboxTitle').textContent = item.dataset.title;
            $('#lightboxDesc').textContent = item.dataset.desc;
            const imgArea = $('#lightboxImgArea');
            imgArea.textContent = emoji;
            imgArea.style.background = getComputedStyle(item.querySelector('.album-placeholder')).background;
            lightbox.classList.add('show');
        });
    });
    $('#lightboxClose').addEventListener('click', () => lightbox.classList.remove('show'));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('show'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.classList.remove('show'); });
}

// ====== 留言板 ======
function initMessages() {
    const input = $('#messageInput'), wall = $('#messageWall');
    const msgs = loadData('family_msgs', [
        { author: "🐱 鱼蛋", text: "喵~今天也是幸福的一天！", rot: -3 },
        { author: "🐱 芋圆", text: "新家的地毯好舒服~", rot: 2 },
        { author: "👩 妈妈", text: "回家路上买点菜，晚上给你们做汤~", rot: -1 },
        { author: "👨 爸爸", text: "新家的WiFi信号满格，速度飞快！", rot: 3 },
    ]);
    function renderMsgs() {
        wall.innerHTML = '';
        msgs.forEach(m => {
            const note = document.createElement('div');
            note.className = 'message-note';
            note.style.setProperty('--rotation', (m.rot || (Math.random()*6-3)) + 'deg');
            note.innerHTML = `<span class="note-author">${m.author}</span><p class="note-text">${m.text}</p>`;
            wall.appendChild(note);
        });
    }
    renderMsgs();
    $('#postMessage').addEventListener('click', () => {
        const text = input.value.trim();
        if (!text) return showToast("写点什么嘛~");
        const authors = ["👨 爸爸", "👩 妈妈", "🐱 鱼蛋", "🐱 芋圆"];
        msgs.push({ author: authors[Math.floor(Math.random()*authors.length)], text, rot: Math.random()*6-3 });
        if (msgs.length > 20) msgs.shift();
        saveData('family_msgs', msgs);
        input.value = ''; renderMsgs();
        showToast("留言成功 💕");
    });
}

// ====== 备忘录 ======
function initMemos() {
    const list = $('#memoList');
    const memos = loadData('family_memos', [
        { text: "🐱 给鱼蛋和芋圆买猫罐头", done: false },
        { text: "🏡 新家WiFi密码同步给父母", done: true },
        { text: "📦 搬家剩下的纸箱处理", done: false },
        { text: "💡 买个感应小夜灯放卧室", done: false },
        { text: "🧹 新阳台花盆买土", done: false },
    ]);
    function renderMemos() {
        list.innerHTML = '';
        memos.forEach((m, i) => {
            const item = document.createElement('div');
            item.className = 'memo-item' + (m.done ? ' completed' : '');
            item.innerHTML = `<input type="checkbox" id="m${i}" ${m.done ? 'checked' : ''}><label for="m${i}">${m.text}</label>`;
            list.appendChild(item);
            item.querySelector('input').addEventListener('change', () => {
                memos[i].done = !memos[i].done;
                saveData('family_memos', memos); renderMemos();
            });
            item.querySelector('label').addEventListener('contextmenu', (e) => {
                e.preventDefault(); if (confirm(`删除: ${m.text}?`)) { memos.splice(i,1); saveData('family_memos',memos); renderMemos(); }
            });
        });
    }
    renderMemos();
    $('#addMemo').addEventListener('click', () => {
        const text = $('#memoInput').value.trim();
        if (!text) return showToast("写点什么备忘~");
        memos.push({ text, done: false });
        saveData('family_memos', memos);
        $('#memoInput').value = ''; renderMemos();
        showToast("备忘已添加 ✅");
    });
    $('#memoInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#addMemo').click(); });
}

// ====== 中国地图 ======
function initMap() {
    const svg = $('#chinaMapSvg');
    const svgW = 700, svgH = 550;
    // 简化坐标映射: lng[73,135] -> x[80,620], lat[18,54] -> y[480,60]
    function toSvgX(lng) { return 80 + (lng - 73) / 62 * 540; }
    function toSvgY(lat) { return 480 - (lat - 18) / 36 * 420; }

    const allCities = [...DATA.cities.visited.map(c=>({...c, type:'visited'})), ...DATA.cities.wish.map(c=>({...c, type:'wish'}))];
    const pointsG = $('#cityPoints');
    const labelsG = $('#cityLabels');

    allCities.forEach(c => {
        const cx = toSvgX(c.lng), cy = toSvgY(c.lat);
        // 点
        const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
        circle.setAttribute('cx', cx); circle.setAttribute('cy', cy);
        circle.setAttribute('r', c.type === 'visited' ? 7 : 4);
        circle.setAttribute('fill', c.type === 'visited' ? '#d4956a' : '#c0b0a0');
        circle.setAttribute('stroke', c.type === 'visited' ? '#b87848' : '#a09080');
        circle.setAttribute('stroke-width', '2');
        circle.style.cursor = 'pointer';
        if (c.type === 'visited') {
            circle.style.filter = 'drop-shadow(0 0 6px rgba(212,149,106,0.6))';
            circle.style.animation = 'dotGlow 2s infinite alternate';
        }
        pointsG.appendChild(circle);
        // 标签
        const text = document.createElementNS('http://www.w3.org/2000/svg','text');
        text.setAttribute('x', cx + 10); text.setAttribute('y', cy + 4);
        text.setAttribute('font-size', c.type === 'visited' ? '11' : '9');
        text.setAttribute('font-weight', c.type === 'visited' ? '600' : '400');
        text.setAttribute('fill', c.type === 'visited' ? '#d4956a' : '#a09080');
        text.textContent = c.name;
        labelsG.appendChild(text);
        // 点击事件
        circle.addEventListener('click', () => showCityPopup(c));
        text.addEventListener('click', () => showCityPopup(c));
    });

    // CSS动画
    const style = document.createElement('style');
    style.textContent = `@keyframes dotGlow{from{filter:drop-shadow(0 0 4px rgba(212,149,106,0.4));}to{filter:drop-shadow(0 0 10px rgba(212,149,106,0.8));}}`;
    document.head.appendChild(style);

    // 城市标签列表
    const visitedTags = $('#cityTags'), wishTags = $('#wishTags');
    DATA.cities.visited.forEach(c => {
        const tag = document.createElement('span');
        tag.className = 'city-tag visited'; tag.textContent = c.emoji + ' ' + c.name;
        tag.addEventListener('click', () => showCityPopup(c));
        visitedTags.appendChild(tag);
    });
    DATA.cities.wish.forEach(c => {
        const tag = document.createElement('span');
        tag.className = 'city-tag wish'; tag.textContent = c.emoji + ' ' + c.name;
        tag.addEventListener('click', () => showCityPopup(c));
        wishTags.appendChild(tag);
    });

    // 弹窗
    window.showCityPopup = (c) => {
        $('#popupCityName').textContent = c.emoji + ' ' + c.name;
        let body = `<div class="popup-body-text">${c.notes || '暂无详细信息'}</div>`;
        if (c.img) body += `<div class="popup-body-img">${c.img}</div>`;
        $('#popupBody').innerHTML = body;
        $('#cityPopup').classList.add('show');
    };
    $('#popupClose').addEventListener('click', () => $('#cityPopup').classList.remove('show'));
    $('#cityPopup').addEventListener('click', (e) => { if (e.target === $('#cityPopup')) $('#cityPopup').classList.remove('show'); });
}
