// ====== 家庭中心 JavaScript ======

// 工具函数
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

function showToast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
}

function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {}
}

function loadData(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (e) {
        return fallback;
    }
}

// ====== 标签页切换 ======
function initTabs() {
    const tabs = $$('.hub-tab');
    const sections = $$('.hub-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const target = tab.dataset.tab;

            // 更新标签状态
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 更新内容显示
            sections.forEach(s => s.classList.remove('active'));
            $(`#${target}`).classList.add('active');

            // 更新URL hash
            history.pushState(null, '', `#${target}`);
        });
    });

    // 根据URL hash显示对应内容
    const hash = window.location.hash.slice(1);
    if (hash && $(`#${hash}`)) {
        const targetTab = $(`.hub-tab[data-tab="${hash}"]`);
        if (targetTab) {
            targetTab.click();
        }
    }
}

// ====== 购物清单 ======
function initShopping() {
    const input = $('#shoppingInput');
    const categorySelect = $('#shoppingCategory');
    const addBtn = $('#addShopping');
    const container = $('#shoppingCategories');

    let items = loadData('shopping_items', [
        { id: 1, name: '猫罐头', category: '猫用品', done: false },
        { id: 2, name: '鸡蛋', category: '食材', done: false },
        { id: 3, name: '牛奶', category: '食材', done: true },
        { id: 4, name: '洗衣液', category: '日用品', done: false },
    ]);

    function renderShopping() {
        const categories = {};
        const categoryIcons = {
            '食材': '🥬',
            '日用品': '🧴',
            '猫用品': '🐱',
            '其他': '📦'
        };

        // 按分类分组
        items.forEach(item => {
            if (!categories[item.category]) {
                categories[item.category] = [];
            }
            categories[item.category].push(item);
        });

        container.innerHTML = '';

        // 渲染每个分类
        Object.entries(categories).forEach(([category, categoryItems]) => {
            const doneCount = categoryItems.filter(i => i.done).length;
            const card = document.createElement('div');
            card.className = 'shopping-category';
            card.innerHTML = `
                <div class="category-header">
                    <h3>${categoryIcons[category] || '📦'} ${category}</h3>
                    <span class="category-count">${doneCount}/${categoryItems.length}</span>
                </div>
                ${categoryItems.map(item => `
                    <div class="shopping-item ${item.done ? 'done' : ''}" data-id="${item.id}">
                        <input type="checkbox" ${item.done ? 'checked' : ''}>
                        <span class="item-name">${item.name}</span>
                        <button class="item-delete" title="删除">×</button>
                    </div>
                `).join('')}
            `;
            container.appendChild(card);

            // 绑定事件
            card.querySelectorAll('.shopping-item').forEach(itemEl => {
                const id = parseInt(itemEl.dataset.id);
                const checkbox = itemEl.querySelector('input');
                const deleteBtn = itemEl.querySelector('.item-delete');

                checkbox.addEventListener('change', () => {
                    const item = items.find(i => i.id === id);
                    if (item) {
                        item.done = checkbox.checked;
                        saveData('shopping_items', items);
                        renderShopping();
                    }
                });

                deleteBtn.addEventListener('click', () => {
                    items = items.filter(i => i.id !== id);
                    saveData('shopping_items', items);
                    renderShopping();
                    showToast('已删除');
                });
            });
        });

        // 添加清空已完成按钮
        if (items.some(i => i.done)) {
            const actions = document.createElement('div');
            actions.className = 'shopping-actions';
            actions.style.gridColumn = '1 / -1';
            actions.innerHTML = `
                <button class="btn-clear" id="clearDone">清空已完成项目</button>
                <button class="btn-clear" id="clearAll">清空全部</button>
            `;
            container.appendChild(actions);

            $('#clearDone').addEventListener('click', () => {
                if (confirm('确定清空所有已完成的项目？')) {
                    items = items.filter(i => !i.done);
                    saveData('shopping_items', items);
                    renderShopping();
                    showToast('已清空已完成项目');
                }
            });

            $('#clearAll').addEventListener('click', () => {
                if (confirm('确定清空全部购物项目？')) {
                    items = [];
                    saveData('shopping_items', items);
                    renderShopping();
                    showToast('已清空全部');
                }
            });
        }
    }

    function addShoppingItem() {
        const name = input.value.trim();
        const category = categorySelect.value;

        if (!name) {
            showToast('请输入购物项目');
            return;
        }

        const newItem = {
            id: Date.now(),
            name,
            category,
            done: false
        };

        items.push(newItem);
        saveData('shopping_items', items);
        input.value = '';
        renderShopping();
        showToast('已添加 ✓');
    }

    addBtn.addEventListener('click', addShoppingItem);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addShoppingItem();
    });

    renderShopping();
}

// ====== 家庭食谱 ======
function initRecipes() {
    const grid = $('#recipeGrid');

    let recipes = loadData('family_recipes', [
        {
            id: 1,
            name: '红烧肉',
            icon: '🥩',
            time: '60分钟',
            difficulty: '中等',
            tags: ['家常菜', '下饭菜', '硬菜'],
            ingredients: [
                { name: '五花肉', amount: '500g' },
                { name: '生姜', amount: '3片' },
                { name: '葱', amount: '2根' },
                { name: '八角', amount: '2个' },
                { name: '桂皮', amount: '1小块' },
                { name: '酱油', amount: '2勺' },
                { name: '料酒', amount: '2勺' },
                { name: '冰糖', amount: '适量' }
            ],
            steps: [
                '五花肉切块，冷水下锅焯水，撇去浮沫后捞出',
                '锅中放少许油，放入冰糖小火炒至焦糖色',
                '放入五花肉翻炒上色',
                '加入姜片、葱段、八角、桂皮炒香',
                '加入酱油、料酒翻炒均匀',
                '加入热水没过肉，大火烧开后转小火炖45分钟',
                '最后大火收汁即可'
            ],
            tips: '炖肉时一定要用热水，冷水会让肉发柴'
        },
        {
            id: 2,
            name: '西红柿炒鸡蛋',
            icon: '🍅',
            time: '15分钟',
            difficulty: '简单',
            tags: ['快手菜', '家常菜', '下饭菜'],
            ingredients: [
                { name: '西红柿', amount: '2个' },
                { name: '鸡蛋', amount: '3个' },
                { name: '葱', amount: '适量' },
                { name: '盐', amount: '适量' },
                { name: '糖', amount: '少许' }
            ],
            steps: [
                '西红柿切块，鸡蛋打散加少许盐',
                '热锅凉油，倒入蛋液炒熟盛出',
                '锅中放少许油，放入西红柿翻炒出汁',
                '加入少许糖提鲜',
                '倒入炒好的鸡蛋翻炒均匀',
                '撒上葱花出锅'
            ],
            tips: '西红柿用开水烫一下去皮口感更好'
        },
        {
            id: 3,
            name: '可乐鸡翅',
            icon: '🍗',
            time: '30分钟',
            difficulty: '简单',
            tags: ['家常菜', '懒人菜', '下饭菜'],
            ingredients: [
                { name: '鸡翅中', amount: '10个' },
                { name: '可乐', amount: '1罐' },
                { name: '生姜', amount: '3片' },
                { name: '酱油', amount: '2勺' },
                { name: '料酒', amount: '1勺' }
            ],
            steps: [
                '鸡翅两面划刀，冷水下锅焯水',
                '热锅放少许油，放入鸡翅煎至两面金黄',
                '加入姜片、酱油、料酒翻炒',
                '倒入可乐，没过鸡翅',
                '大火烧开后转小火炖15分钟',
                '最后大火收汁即可'
            ],
            tips: '用普通可乐，不要用无糖的'
        }
    ]);

    function renderRecipes() {
        grid.innerHTML = '';

        recipes.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card';
            card.innerHTML = `
                <div class="recipe-icon">${recipe.icon}</div>
                <h3>${recipe.name}</h3>
                <div class="recipe-meta">
                    <span>⏱️ ${recipe.time}</span>
                    <span>📊 ${recipe.difficulty}</span>
                </div>
                <div class="recipe-tags">
                    ${recipe.tags.map(tag => `<span class="recipe-tag">${tag}</span>`).join('')}
                </div>
            `;
            card.addEventListener('click', () => showRecipeDetail(recipe));
            grid.appendChild(card);
        });

        // 添加新食谱卡片
        const addCard = document.createElement('div');
        addCard.className = 'recipe-card recipe-add-card';
        addCard.innerHTML = `
            <div class="add-icon">+</div>
            <h3>添加新食谱</h3>
        `;
        addCard.addEventListener('click', openAddRecipeModal);
        grid.appendChild(addCard);
    }

    function showRecipeDetail(recipe) {
        const modal = $('#recipeModal');
        const content = $('#recipeModalContent');

        content.innerHTML = `
            <button class="recipe-modal-close" onclick="closeRecipeModal()">&times;</button>
            <div style="font-size: 3rem; margin-bottom: 16px;">${recipe.icon}</div>
            <h2>${recipe.name}</h2>
            <div class="recipe-meta" style="margin-bottom: 24px;">
                <span>⏱️ ${recipe.time}</span>
                <span>📊 ${recipe.difficulty}</span>
            </div>

            <div class="recipe-detail-section">
                <h3>🥘 食材清单</h3>
                <div class="recipe-ingredients">
                    ${recipe.ingredients.map(ing => `
                        <div class="recipe-ingredient">
                            <span>${ing.name}</span>
                            <span style="color: var(--color-text-light); margin-left: auto;">${ing.amount}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="recipe-detail-section">
                <h3>👨‍🍳 烹饪步骤</h3>
                <ol class="recipe-steps">
                    ${recipe.steps.map((step, i) => `
                        <li class="recipe-step">
                            <span class="step-number">${i + 1}</span>
                            <span class="step-text">${step}</span>
                        </li>
                    `).join('')}
                </ol>
            </div>

            ${recipe.tips ? `
                <div class="recipe-detail-section">
                    <h3>💡 小贴士</h3>
                    <p style="color: var(--color-text); line-height: 1.6;">${recipe.tips}</p>
                </div>
            ` : ''}

            <div style="display: flex; gap: 12px; margin-top: 24px;">
                <button class="btn-primary" onclick="deleteRecipe(${recipe.id})" style="background: rgba(212,106,106,0.2); color: var(--color-pink);">删除食谱</button>
            </div>
        `;

        modal.classList.add('show');
    }

    window.closeRecipeModal = function() {
        $('#recipeModal').classList.remove('show');
    };

    window.deleteRecipe = function(id) {
        if (confirm('确定删除这个食谱？')) {
            recipes = recipes.filter(r => r.id !== id);
            saveData('family_recipes', recipes);
            renderRecipes();
            closeRecipeModal();
            showToast('食谱已删除');
        }
    };

    window.openAddRecipeModal = function() {
        $('#addRecipeModal').classList.add('show');
        // 重置表单
        $('#recipeForm').reset();
        $('#ingredientsList').innerHTML = `
            <div class="ingredient-row">
                <input type="text" placeholder="食材名称">
                <input type="text" placeholder="用量" style="max-width: 120px;">
                <button type="button" class="btn-remove" onclick="this.parentElement.remove()">×</button>
            </div>
        `;
        $('#stepsList').innerHTML = `
            <div class="step-row">
                <textarea placeholder="步骤说明" rows="2"></textarea>
                <button type="button" class="btn-remove" onclick="this.parentElement.remove()">×</button>
            </div>
        `;
    };

    window.closeAddRecipeModal = function() {
        $('#addRecipeModal').classList.remove('show');
    };

    window.addIngredientRow = function() {
        const list = $('#ingredientsList');
        const row = document.createElement('div');
        row.className = 'ingredient-row';
        row.innerHTML = `
            <input type="text" placeholder="食材名称">
            <input type="text" placeholder="用量" style="max-width: 120px;">
            <button type="button" class="btn-remove" onclick="this.parentElement.remove()">×</button>
        `;
        list.appendChild(row);
    };

    window.addStepRow = function() {
        const list = $('#stepsList');
        const row = document.createElement('div');
        row.className = 'step-row';
        row.innerHTML = `
            <textarea placeholder="步骤说明" rows="2"></textarea>
            <button type="button" class="btn-remove" onclick="this.parentElement.remove()">×</button>
        `;
        list.appendChild(row);
    };

    // 表单提交
    $('#recipeForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const name = $('#recipeName').value.trim();
        if (!name) {
            showToast('请输入菜品名称');
            return;
        }

        // 收集食材
        const ingredients = [];
        $$('#ingredientsList .ingredient-row').forEach(row => {
            const inputs = row.querySelectorAll('input');
            if (inputs[0].value.trim()) {
                ingredients.push({
                    name: inputs[0].value.trim(),
                    amount: inputs[1].value.trim() || '适量'
                });
            }
        });

        // 收集步骤
        const steps = [];
        $$('#stepsList .step-row').forEach(row => {
            const textarea = row.querySelector('textarea');
            if (textarea.value.trim()) {
                steps.push(textarea.value.trim());
            }
        });

        if (ingredients.length === 0 || steps.length === 0) {
            showToast('请至少添加一个食材和一个步骤');
            return;
        }

        const foodIcons = ['🍲', '🥘', '🍜', '🍛', '🥗', '🍝', '🍚', '🥩', '🍗', '🍖', '🥦', '🥬'];
        const randomIcon = foodIcons[Math.floor(Math.random() * foodIcons.length)];

        const newRecipe = {
            id: Date.now(),
            name,
            icon: randomIcon,
            time: $('#recipeTime').value || '未知',
            difficulty: $('#recipeDifficulty').value,
            tags: $('#recipeTags').value.split(',').map(t => t.trim()).filter(t => t),
            ingredients,
            steps,
            tips: $('#recipeTips').value
        };

        recipes.push(newRecipe);
        saveData('family_recipes', recipes);
        renderRecipes();
        closeAddRecipeModal();
        showToast('食谱已保存 ✓');
    });

    // 关闭弹窗点击外部
    $('#addRecipeModal').addEventListener('click', (e) => {
        if (e.target === $('#addRecipeModal')) {
            closeAddRecipeModal();
        }
    });

    renderRecipes();
}

// ====== 宠物档案 ======
function initPets() {
    const grid = $('#petsGrid');

    const petsData = loadData('pets_data', {
        fishEgg: {
            name: '鱼蛋',
            emoji: '😺',
            breed: '英短蓝金渐层',
            birthday: '2024-05',
            weight: '4.5kg',
            personality: '贪吃、亲人、爱晒太阳',
            records: [
                { type: '疫苗', date: '2024-08-15', status: 'done', note: '三联疫苗第一针' },
                { type: '疫苗', date: '2024-09-15', status: 'done', note: '三联疫苗第二针' },
                { type: '疫苗', date: '2025-08-15', status: 'due', note: '年度加强疫苗' },
                { type: '驱虫', date: '2025-04-01', status: 'done', note: '体内驱虫' },
                { type: '驱虫', date: '2025-07-01', status: 'due', note: '下次驱虫' },
                { type: '体检', date: '2025-05-01', status: 'done', note: '年度体检，一切正常' }
            ]
        },
        yuyuan: {
            name: '芋圆',
            emoji: '😸',
            breed: '英短重点色银渐层',
            birthday: '2024-11',
            weight: '3.8kg',
            personality: '安静、优雅、喜欢发呆',
            records: [
                { type: '疫苗', date: '2025-02-10', status: 'done', note: '三联疫苗第一针' },
                { type: '疫苗', date: '2025-03-10', status: 'done', note: '三联疫苗第二针' },
                { type: '疫苗', date: '2026-02-10', status: 'due', note: '年度加强疫苗' },
                { type: '驱虫', date: '2025-04-01', status: 'done', note: '体内驱虫' },
                { type: '驱虫', date: '2025-07-01', status: 'due', note: '下次驱虫' },
                { type: '绝育', date: '2025-06-01', status: 'done', note: '已绝育，恢复良好' }
            ]
        }
    });

    function renderPets() {
        grid.innerHTML = '';

        Object.entries(petsData).forEach(([key, pet]) => {
            const card = document.createElement('div');
            card.className = 'pet-card';

            const nextVaccine = pet.records.find(r => r.type === '疫苗' && r.status === 'due');
            const nextDeworm = pet.records.find(r => r.type === '驱虫' && r.status === 'due');

            card.innerHTML = `
                <div class="pet-header">
                    <div class="pet-avatar">${pet.emoji}</div>
                    <h3>${pet.name}</h3>
                    <div class="pet-breed">${pet.breed}</div>
                </div>
                <div class="pet-body">
                    <div class="pet-info-grid">
                        <div class="pet-info-item">
                            <div class="label">生日</div>
                            <div class="value">${pet.birthday}</div>
                        </div>
                        <div class="pet-info-item">
                            <div class="label">体重</div>
                            <div class="value">${pet.weight}</div>
                        </div>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <div style="font-size: 0.85rem; color: var(--color-text-light); margin-bottom: 8px;">性格特点</div>
                        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                            ${pet.personality.split('、').map(p => `
                                <span style="padding: 3px 10px; background: rgba(232,168,124,0.1); color: var(--color-primary); border-radius: 12px; font-size: 0.8rem;">${p}</span>
                            `).join('')}
                        </div>
                    </div>
                    <div class="pet-records">
                        <h4>📋 健康记录</h4>
                        ${pet.records.slice(0, 5).map(record => `
                            <div class="pet-record">
                                <span class="record-type">${record.type}</span>
                                <span class="record-date">${record.date}</span>
                                <span class="record-status ${record.status}">${record.status === 'done' ? '已完成' : '待完成'}</span>
                            </div>
                        `).join('')}
                    </div>
                    ${nextVaccine || nextDeworm ? `
                        <div style="margin-top: 16px; padding: 12px; background: rgba(212,176,90,0.1); border-radius: var(--radius-sm);">
                            <div style="font-size: 0.85rem; color: var(--color-warning); margin-bottom: 8px;">⏰ 待办提醒</div>
                            ${nextVaccine ? `<div style="font-size: 0.9rem; color: var(--color-text);">疫苗：${nextVaccine.date} - ${nextVaccine.note}</div>` : ''}
                            ${nextDeworm ? `<div style="font-size: 0.9rem; color: var(--color-text);">驱虫：${nextDeworm.date} - ${nextDeworm.note}</div>` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
            grid.appendChild(card);
        });
    }

    renderPets();
}

// ====== 家庭日历 ======
function initCalendar() {
    const calendarDays = $('#calendarDays');
    const calendarTitle = $('#calendarTitle');
    const eventList = $('#eventList');

    let currentDate = new Date();

    // 家庭事件数据
    const events = loadData('family_events', [
        { date: '2024-03-19', title: '在一起纪念日', type: 'anniversary', emoji: '❤️' },
        { date: '2025-09-20', title: '结婚纪念日', type: 'anniversary', emoji: '💒' },
        { date: '1994-12-20', title: '冬哥生日', type: 'birthday', emoji: '🎂' },
        { date: '1997-10-13', title: '华宇生日', type: 'birthday', emoji: '🎂' },
        { date: '2024-05-01', title: '鱼蛋到家', type: 'other', emoji: '😺' },
        { date: '2025-01-15', title: '芋圆到家', type: 'other', emoji: '😸' },
        { date: '2026-08-02', title: '马尔代夫二次蜜月', type: 'other', emoji: '🏝️' },
    ]);

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        calendarTitle.textContent = `${year}年${month + 1}月`;

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        calendarDays.innerHTML = '';

        // 填充上个月的日期
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            const day = document.createElement('div');
            day.className = 'calendar-day other-month';
            day.textContent = prevMonthLastDay - i;
            calendarDays.appendChild(day);
        }

        // 填充本月日期
        const today = new Date();
        for (let i = 1; i <= totalDays; i++) {
            const day = document.createElement('div');
            day.className = 'calendar-day';

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const hasEvent = events.some(e => {
                const eventDate = new Date(e.date);
                return eventDate.getMonth() === month && eventDate.getDate() === i;
            });

            if (today.getFullYear() === year && today.getMonth() === month && today.getDate() === i) {
                day.classList.add('today');
            }
            if (hasEvent) {
                day.classList.add('has-event');
            }

            day.textContent = i;
            day.addEventListener('click', () => showDayEvents(dateStr));
            calendarDays.appendChild(day);
        }

        // 填充下个月的日期
        const remainingDays = 42 - (startDay + totalDays);
        for (let i = 1; i <= remainingDays; i++) {
            const day = document.createElement('div');
            day.className = 'calendar-day other-month';
            day.textContent = i;
            calendarDays.appendChild(day);
        }

        renderUpcomingEvents();
    }

    function showDayEvents(dateStr) {
        const dayEvents = events.filter(e => {
            const eventDate = new Date(e.date);
            const clickedDate = new Date(dateStr);
            return eventDate.getMonth() === clickedDate.getMonth() && eventDate.getDate() === clickedDate.getDate();
        });

        if (dayEvents.length > 0) {
            const msg = dayEvents.map(e => `${e.emoji} ${e.title}`).join('\n');
            showToast(msg);
        }
    }

    function renderUpcomingEvents() {
        const now = new Date();
        const upcoming = events
            .map(event => {
                const eventDate = new Date(event.date);
                const thisYearEvent = new Date(now.getFullYear(), eventDate.getMonth(), eventDate.getDate());
                if (thisYearEvent < now) {
                    thisYearEvent.setFullYear(thisYearEvent.getFullYear() + 1);
                }
                const daysUntil = Math.ceil((thisYearEvent - now) / (1000 * 60 * 60 * 24));
                return { ...event, daysUntil, nextDate: thisYearEvent };
            })
            .sort((a, b) => a.daysUntil - b.daysUntil)
            .slice(0, 5);

        eventList.innerHTML = upcoming.map(event => `
            <div class="event-item">
                <div class="event-date-box">
                    <div class="month">${event.nextDate.getMonth() + 1}月</div>
                    <div class="day">${event.nextDate.getDate()}</div>
                </div>
                <div class="event-info">
                    <h4>${event.emoji} ${event.title}</h4>
                    <p>${event.daysUntil === 0 ? '🎉 今天！' : `还有 ${event.daysUntil} 天`}</p>
                </div>
                <span class="event-type ${event.type}">${
                    event.type === 'birthday' ? '生日' :
                    event.type === 'anniversary' ? '纪念日' : '其他'
                }</span>
            </div>
        `).join('');
    }

    $('#prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    $('#nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    $('#todayBtn').addEventListener('click', () => {
        currentDate = new Date();
        renderCalendar();
    });

    renderCalendar();
}

// ====== 留言板 ======
function initMessages() {
    const input = $('#messageInput');
    const postBtn = $('#postMessage');
    const wall = $('#messageWall');

    let messages = loadData('family_messages', [
        { id: 1, author: '爸爸', emoji: '👨', text: '新家的WiFi信号满格，速度飞快！', time: '2025-07-02 18:30' },
        { id: 2, author: '妈妈', emoji: '👩', text: '回家路上买点菜，晚上给你们做汤~', time: '2025-07-02 17:45' },
        { id: 3, author: '鱼蛋', emoji: '🐱', text: '喵~今天也是幸福的一天！', time: '2025-07-02 12:00' },
        { id: 4, author: '芋圆', emoji: '🐱', text: '新家的地毯好舒服~', time: '2025-07-02 10:30' },
    ]);

    function renderMessages() {
        wall.innerHTML = messages.map(msg => `
            <div class="message-card">
                <button class="message-delete" onclick="deleteMessage(${msg.id})">×</button>
                <div class="message-card-header">
                    <div class="message-avatar">${msg.emoji}</div>
                    <div>
                        <div class="message-author">${msg.author}</div>
                        <div class="message-time">${msg.time}</div>
                    </div>
                </div>
                <div class="message-text">${msg.text}</div>
            </div>
        `).join('');
    }

    window.deleteMessage = function(id) {
        if (confirm('确定删除这条留言？')) {
            messages = messages.filter(m => m.id !== id);
            saveData('family_messages', messages);
            renderMessages();
            showToast('留言已删除');
        }
    };

    function addMessage() {
        const text = input.value.trim();
        if (!text) {
            showToast('写点什么吧~');
            return;
        }

        const authors = [
            { name: '爸爸', emoji: '👨' },
            { name: '妈妈', emoji: '👩' },
            { name: '鱼蛋', emoji: '🐱' },
            { name: '芋圆', emoji: '🐱' }
        ];
        const author = authors[Math.floor(Math.random() * authors.length)];

        const now = new Date();
        const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const newMessage = {
            id: Date.now(),
            author: author.name,
            emoji: author.emoji,
            text,
            time: timeStr
        };

        messages.unshift(newMessage);
        if (messages.length > 20) messages.pop();
        saveData('family_messages', messages);
        input.value = '';
        renderMessages();
        showToast('留言成功 💕');
    }

    postBtn.addEventListener('click', addMessage);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addMessage();
        }
    });

    renderMessages();
}

// ====== 导航栏滚动效果 ======
function initNav() {
    const nav = $('#navbar');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ====== 初始化 ======
document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initTabs();
    initShopping();
    initRecipes();
    initPets();
    initCalendar();
    initMessages();
});
