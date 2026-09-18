// ============================================================
// ⚙️ إعدادات الماركت
// ============================================================
const MARKET_NAME = 'ميامي ماركت';
const MARKET_NAME_EN = 'Miami Market';
const MARKET_SLOGAN = 'طلباتك أوامر';
const WHATSAPP_NUMBER = '201008070087';
const PHONE_NUMBER = '01008070087';
const EMAIL = 'info@miamimarket.com';
const MAX_ALTERNATIVES = 4;
const SPLASH_DURATION = 3000;

// ============================================================
// 📦 بيانات المنتجات
// ============================================================
const productData = [
    // ===== الجبن والألبان =====
    {"id":"p1","name":"جبنة بيضاء","brand":"بلدية","product_type":"جبنة بيضاء","category":"الجبن والألبان","type":"weight","weights":["⅛ ك","¼ ك","½ ك","1 ك"],"price":60,"barcode":"6221031491234","status":"available"},
    {"id":"p2","name":"جبنة تركي","brand":"المراعي","product_type":"جبنة تركي","category":"الجبن والألبان","type":"weight","weights":["⅛ ك","¼ ك","½ ك","1 ك"],"price":80,"barcode":"","status":"available"},
    {"id":"p3","name":"جبنة رومي","brand":"دومتي","product_type":"جبنة رومي","category":"الجبن والألبان","type":"weight","weights":["⅛ ك","¼ ك","½ ك","1 ك"],"price":90,"barcode":"","status":"available"},
    {"id":"p4","name":"جبنة شيدر","brand":"لاكتيل","product_type":"جبنة شيدر","category":"الجبن والألبان","type":"weight","weights":["⅛ ك","¼ ك","½ ك","1 ك"],"price":100,"barcode":"","status":"available"},
    {"id":"p5","name":"جبنة موتزريلا","brand":"بوك","product_type":"جبنة موتزريلا","category":"الجبن والألبان","type":"weight","weights":["⅛ ك","¼ ك","½ ك","1 ك"],"price":110,"barcode":"","status":"available"},
    {"id":"p6","name":"جبنة حمراء","brand":"بلدية","product_type":"جبنة حمراء","category":"الجبن والألبان","type":"weight","weights":["⅛ ك","¼ ك","½ ك","1 ك"],"price":70,"barcode":"","status":"available"},
    {"id":"p7","name":"زبادي","brand":"جهينة","product_type":"زبادي","category":"الجبن والألبان","weight":"كوب","price":12,"barcode":"","status":"available"},
    {"id":"p8","name":"حليب","brand":"جهينة","product_type":"حليب","category":"الجبن والألبان","weight":"لتر","price":25,"barcode":"","status":"available"},
    {"id":"p9","name":"حليب المراعي","brand":"المراعي","product_type":"حليب","category":"الجبن والألبان","weight":"لتر","price":28,"barcode":"","status":"available"},
    {"id":"p10","name":"لبن رايب","brand":"جهينة","product_type":"لبن رايب","category":"الجبن والألبان","weight":"علبة","price":15,"barcode":"","status":"available"},
    {"id":"p11","name":"قشطة","brand":"نستله","product_type":"قشطة","category":"الجبن والألبان","weight":"علبة","price":18,"barcode":"","status":"available"},

    // ===== لحوم مصنعة =====
    {"id":"p12","name":"لانشون","brand":"حلواني","product_type":"لانشون","category":"لحوم مصنعة","type":"weight","weights":["¼ ك","½ ك","1 ك"],"price":50,"barcode":"","status":"available"},
    {"id":"p13","name":"بسطرمة","brand":"حلواني","product_type":"بسطرمة","category":"لحوم مصنعة","type":"weight","weights":["¼ ك","½ ك","1 ك"],"price":120,"barcode":"","status":"available"},
    {"id":"p14","name":"رومي مدخن","brand":"حلواني","product_type":"رومي","category":"لحوم مصنعة","type":"weight","weights":["¼ ك","½ ك","1 ك"],"price":100,"barcode":"","status":"available"},
    {"id":"p15","name":"بيف","brand":"حلواني","product_type":"بيف","category":"لحوم مصنعة","type":"weight","weights":["¼ ك","½ ك","1 ك"],"price":110,"barcode":"","status":"available"},
    {"id":"p16","name":"فصوص رومي","brand":"المراعي","product_type":"رومي","category":"لحوم مصنعة","type":"weight","weights":["¼ ك","½ ك","1 ك"],"price":95,"barcode":"","status":"available"},
    {"id":"p17","name":"مرتديلا","brand":"حلواني","product_type":"مرتديلا","category":"لحوم مصنعة","type":"weight","weights":["¼ ك","½ ك","1 ك"],"price":45,"barcode":"","status":"available"},
    {"id":"p18","name":"سجق","brand":"حلواني","product_type":"سجق","category":"لحوم مصنعة","weight":"250 جرام","price":35,"barcode":"","status":"available"},

    // ===== مكرونات وأرز ودقيق =====
    {"id":"p19","name":"مكرونة سباجيتي","brand":"الملكة","product_type":"مكرونة","category":"مكرونات وأرز ودقيق","weight":"400 جم","price":15,"barcode":"","status":"available"},
    {"id":"p20","name":"مكرونة سباجيتي","brand":"الملكة","product_type":"مكرونة","category":"مكرونات وأرز ودقيق","weight":"1 كيلو","price":32,"barcode":"","status":"available"},
    {"id":"p21","name":"مكرونة بيني","brand":"ايطاليانو","product_type":"مكرونة","category":"مكرونات وأرز ودقيق","weight":"400 جم","price":15,"barcode":"","status":"available"},
    {"id":"p22","name":"مكرونة بيني","brand":"ايطاليانو","product_type":"مكرونة","category":"مكرونات وأرز ودقيق","weight":"1 كيلو","price":32,"barcode":"","status":"available"},
    {"id":"p23","name":"أرز الضحى","brand":"الضحى","product_type":"أرز","category":"مكرونات وأرز ودقيق","weight":"1 كيلو","price":32,"barcode":"","status":"available"},
    {"id":"p24","name":"أرز الساعة","brand":"الساعة","product_type":"أرز","category":"مكرونات وأرز ودقيق","weight":"1 كيلو","price":30,"barcode":"","status":"available"},
    {"id":"p25","name":"أرز الصقر","brand":"الصقر","product_type":"أرز","category":"مكرونات وأرز ودقيق","weight":"1 كيلو","price":28,"barcode":"","status":"available"},
    {"id":"p26","name":"أرز بسمتي","brand":"أبو كاس","product_type":"أرز بسمتي","category":"مكرونات وأرز ودقيق","weight":"1 كيلو","price":45,"barcode":"","status":"available"},
    {"id":"p27","name":"دقيق أبيض","brand":"الملكة","product_type":"دقيق","category":"مكرونات وأرز ودقيق","weight":"1 كيلو","price":18,"barcode":"","status":"available"},

    // ===== السمن والزيوت =====
    {"id":"p28","name":"زيت عباد الشمس","brand":"عافية","product_type":"زيت","category":"السمن والزيوت","weight":"لتر","price":60,"barcode":"","status":"available"},
    {"id":"p29","name":"زيت ذرة","brand":"كريستال","product_type":"زيت","category":"السمن والزيوت","weight":"لتر","price":65,"barcode":"","status":"available"},
    {"id":"p30","name":"زيت زيتون","brand":"الضحى","product_type":"زيت زيتون","category":"السمن والزيوت","weight":"لتر","price":120,"barcode":"","status":"available"},
    {"id":"p31","name":"سمن بلدي","brand":"البلدية","product_type":"سمن","category":"السمن والزيوت","weight":"كيلو","price":90,"barcode":"","status":"available"},
    {"id":"p32","name":"سمن نباتي","brand":"كريستال","product_type":"سمن","category":"السمن والزيوت","weight":"كيلو","price":55,"barcode":"","status":"available"},

    // ===== خضروات مجمدة =====
    {"id":"p33","name":"خضار مشكل","brand":"جرين لاند","product_type":"خضار مجمد","category":"خضروات مجمدة","weight":"كيلو","price":25,"barcode":"","status":"available"},
    {"id":"p34","name":"بازلاء","brand":"جرين لاند","product_type":"بازلاء","category":"خضروات مجمدة","weight":"كيلو","price":22,"barcode":"","status":"available"},
    {"id":"p35","name":"فاصوليا","brand":"جرين لاند","product_type":"فاصوليا","category":"خضروات مجمدة","weight":"كيلو","price":20,"barcode":"","status":"available"},
    {"id":"p36","name":"بروكلي","brand":"فريش","product_type":"بروكلي","category":"خضروات مجمدة","weight":"كيلو","price":28,"barcode":"","status":"available"},

    // ===== معلبات =====
    {"id":"p37","name":"تونة","brand":"الوطنية","product_type":"تونة","category":"معلبات","weight":"علبة","price":25,"barcode":"","status":"available"},
    {"id":"p38","name":"تونة","brand":"شبرا","product_type":"تونة","category":"معلبات","weight":"علبة","price":22,"barcode":"","status":"available"},
    {"id":"p39","name":"سردين","brand":"الملكة","product_type":"سردين","category":"معلبات","weight":"علبة","price":18,"barcode":"","status":"available"},
    {"id":"p40","name":"فول مدمس","brand":"حدائق","product_type":"فول","category":"معلبات","weight":"علبة","price":8,"barcode":"","status":"available"},
    {"id":"p41","name":"طماطم معلبة","brand":"هاينز","product_type":"صلصة","category":"معلبات","weight":"علبة","price":10,"barcode":"","status":"available"},
    {"id":"p42","name":"حمص","brand":"حدائق","product_type":"حمص","category":"معلبات","weight":"علبة","price":12,"barcode":"","status":"available"},

    // ===== شاي وقهوة ونسكافيه =====
    {"id":"p43","name":"شاي ليبتون","brand":"ليبتون","product_type":"شاي","category":"شاي وقهوة ونسكافيه","weight":"40 جم","price":18,"barcode":"","status":"available"},
    {"id":"p44","name":"شاي ليبتون","brand":"ليبتون","product_type":"شاي","category":"شاي وقهوة ونسكافيه","weight":"100 جم","price":40,"barcode":"","status":"available"},
    {"id":"p45","name":"شاي العروسة","brand":"العروسة","product_type":"شاي","category":"شاي وقهوة ونسكافيه","weight":"40 جم","price":15,"barcode":"","status":"available"},
    {"id":"p46","name":"شاي العروسة","brand":"العروسة","product_type":"شاي","category":"شاي وقهوة ونسكافيه","weight":"100 جم","price":35,"barcode":"","status":"available"},
    {"id":"p47","name":"نسكافيه","brand":"نستله","product_type":"نسكافيه","category":"شاي وقهوة ونسكافيه","weight":"50 جم","price":35,"barcode":"","status":"available"},
    {"id":"p48","name":"نسكافيه","brand":"نستله","product_type":"نسكافيه","category":"شاي وقهوة ونسكافيه","weight":"100 جم","price":65,"barcode":"","status":"available"},
    {"id":"p49","name":"قهوة مطحونة","brand":"الأمير","product_type":"قهوة","category":"شاي وقهوة ونسكافيه","weight":"250 جم","price":55,"barcode":"","status":"available"},

    // ===== بسكوت وشيكولاتة =====
    {"id":"p50","name":"بسكوت اوريو","brand":"اوريو","product_type":"بسكوت","category":"بسكوت وشيكولاتة","weight":"باكو","price":15,"barcode":"","status":"available"},
    {"id":"p51","name":"بسكوت تيفاني","brand":"تيفاني","product_type":"بسكوت","category":"بسكوت وشيكولاتة","weight":"باكو","price":12,"barcode":"","status":"available"},
    {"id":"p52","name":"شيكولاتة جلاكسي","brand":"جلاكسي","product_type":"شيكولاتة","category":"بسكوت وشيكولاتة","weight":"قطعة","price":10,"barcode":"","status":"available"},
    {"id":"p53","name":"شيكولاتة كيت كات","brand":"نستله","product_type":"شيكولاتة","category":"بسكوت وشيكولاتة","weight":"قطعة","price":8,"barcode":"","status":"available"},
    {"id":"p54","name":"بسكوت ويفر","brand":"تيفاني","product_type":"بسكوت","category":"بسكوت وشيكولاتة","weight":"باكو","price":14,"barcode":"","status":"available"},

    // ===== شيبسي ومولتو =====
    {"id":"p55","name":"شيبسي","brand":"شيبسي","product_type":"شيبسي","category":"شيبسي ومولتو","weight":"كيس كبير","price":10,"barcode":"","status":"available"},
    {"id":"p56","name":"شيبسي","brand":"شيبسي","product_type":"شيبسي","category":"شيبسي ومولتو","weight":"كيس صغير","price":5,"barcode":"","status":"available"},
    {"id":"p57","name":"مولتو","brand":"مولتو","product_type":"مولتو","category":"شيبسي ومولتو","weight":"علبة","price":8,"barcode":"","status":"available"},
    {"id":"p58","name":"بسكويت مالح","brand":"تايد","product_type":"بسكويت مالح","category":"شيبسي ومولتو","weight":"كيس","price":7,"barcode":"","status":"available"},

    // ===== مياه ومثلجات =====
    {"id":"p59","name":"مياه نستله","brand":"نستله","product_type":"مياه","category":"مياه ومثلجات","weight":"1.5 لتر","price":7,"barcode":"","status":"available"},
    {"id":"p60","name":"مياه حياة","brand":"حياة","product_type":"مياه","category":"مياه ومثلجات","weight":"1.5 لتر","price":6,"barcode":"","status":"available"},
    {"id":"p61","name":"مياه بركة","brand":"بركة","product_type":"مياه","category":"مياه ومثلجات","weight":"1.5 لتر","price":6,"barcode":"","status":"available"},
    {"id":"p62","name":"مياه نستله","brand":"نستله","product_type":"مياه","category":"مياه ومثلجات","weight":"5 لتر","price":20,"barcode":"","status":"available"},
    {"id":"p63","name":"مياه حياة","brand":"حياة","product_type":"مياه","category":"مياه ومثلجات","weight":"5 لتر","price":18,"barcode":"","status":"available"},
    {"id":"p64","name":"آيس كريم","brand":"بريمو","product_type":"آيس كريم","category":"مياه ومثلجات","weight":"علبة","price":15,"barcode":"","status":"available"},
    {"id":"p65","name":"عصائر","brand":"جهينة","product_type":"عصير","category":"مياه ومثلجات","weight":"علبة","price":8,"barcode":"","status":"available"},

    // ===== منوعات أخرى =====
    {"id":"p66","name":"بيض","brand":"بلدية","product_type":"بيض","category":"منوعات أخرى","weight":"طبق 30","price":60,"barcode":"","status":"available"},
    {"id":"p67","name":"سكر","brand":"السكر المصري","product_type":"سكر","category":"منوعات أخرى","weight":"كيلو","price":22,"barcode":"","status":"available"},
    {"id":"p68","name":"ملح","brand":"الملاح","product_type":"ملح","category":"منوعات أخرى","weight":"كيلو","price":8,"barcode":"","status":"available"},
    {"id":"p69","name":"بهارات مشكلة","brand":"الطهي","product_type":"بهارات","category":"منوعات أخرى","weight":"علبة","price":15,"barcode":"","status":"available"},
    {"id":"p70","name":"عسل","brand":"النحل","product_type":"عسل","category":"منوعات أخرى","weight":"علبة","price":30,"barcode":"","status":"available"},
    {"id":"p71","name":"طحينة","brand":"الأسرة","product_type":"طحينة","category":"منوعات أخرى","weight":"علبة","price":20,"barcode":"","status":"available"},

    // ===== منظفات ومناديل =====
    {"id":"p72","name":"مسحوق غسيل","brand":"أريال","product_type":"مسحوق غسيل","category":"منظفات ومناديل","weight":"كيلو","price":35,"barcode":"","status":"available"},
    {"id":"p73","name":"صابون سائل","brand":"فيري","product_type":"صابون سائل","category":"منظفات ومناديل","weight":"لتر","price":25,"barcode":"","status":"available"},
    {"id":"p74","name":"مناديل ورقية","brand":"فاين","product_type":"مناديل","category":"منظفات ومناديل","weight":"باكو","price":12,"barcode":"","status":"available"},
    {"id":"p75","name":"منظف زجاج","brand":"كلين","product_type":"منظف زجاج","category":"منظفات ومناديل","weight":"زجاجة","price":18,"barcode":"","status":"available"},
    {"id":"p76","name":"معقم","brand":"ديتول","product_type":"معقم","category":"منظفات ومناديل","weight":"زجاجة","price":15,"barcode":"","status":"available"}
];

// ============================================================
// 1. المتغيرات العامة
// ============================================================
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let selectedWeights = {};
let currentView = 'home';

// === نهاية الجزء 1 ===
// ============================================================
// 2. تهيئة التطبيق
// ============================================================
function initApp() {
    applyMarketSettings();
    renderCategories();
    renderOrders();
    initSplash();
}

function initSplash() {
    const splash = document.getElementById('splashScreen');
    if (!splash) return;
    setTimeout(() => {
        splash.classList.add('hidden');
        setTimeout(() => { splash.style.display = 'none'; }, 800);
    }, SPLASH_DURATION);
}

function applyMarketSettings() {
    const nameEl = document.getElementById('marketName');
    const footerEl = document.getElementById('footerName');
    if (nameEl) nameEl.textContent = MARKET_NAME;
    if (footerEl) footerEl.textContent = MARKET_NAME;
    document.title = MARKET_NAME + ' - ' + MARKET_SLOGAN;

    const phoneLink = document.querySelector('a[href^="tel:"]');
    const waLink = document.querySelector('a[href^="https://wa.me/"]');
    const mailLink = document.querySelector('a[href^="mailto:"]');
    if (phoneLink) {
        phoneLink.href = `tel:${PHONE_NUMBER}`;
    }
    if (waLink) waLink.href = `https://wa.me/${WHATSAPP_NUMBER}`;
    if (mailLink) {
        mailLink.href = `mailto:${EMAIL}`;
    }
}

// ============================================================
// 3. عرض الأقسام
// ============================================================
function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    const categories = [...new Set(productData.map(p => p.category))];

    grid.innerHTML = categories.map(cat => {
        return `
            <div class="category-item" data-cat="${cat}" onclick="openCategory('${cat}')"></div>
        `;
    }).join('');
}

// ============================================================
// 4. تغيير خلفية القسم
// ============================================================
function setCategoryBackground(category) {
    const categoryClasses = [
        'category-cheese', 'category-meat', 'category-pasta', 'category-oil',
        'category-veg', 'category-cans', 'category-tea', 'category-cookies',
        'category-chips', 'category-water', 'category-misc', 'category-clean'
    ];
    categoryClasses.forEach(cls => {
        document.body.classList.remove(cls);
    });
    
    const catMap = {
        'الجبن والألبان': 'category-cheese',
        'لحوم مصنعة': 'category-meat',
        'مكرونات وأرز ودقيق': 'category-pasta',
        'السمن والزيوت': 'category-oil',
        'خضروات مجمدة': 'category-veg',
        'معلبات': 'category-cans',
        'شاي وقهوة ونسكافيه': 'category-tea',
        'بسكوت وشيكولاتة': 'category-cookies',
        'شيبسي ومولتو': 'category-chips',
        'مياه ومثلجات': 'category-water',
        'منوعات أخرى': 'category-misc',
        'منظفات ومناديل': 'category-clean'
    };
    
    if (category && catMap[category]) {
        document.body.classList.add(catMap[category]);
    }
}

// ============================================================
// 5. فتح قسم
// ============================================================
function openCategory(cat) {
    currentView = 'category';
    setCategoryBackground(cat);
    
    const items = productData.filter(p => p.category === cat);
    
    // تعديل عنوان القسم
    const categoryTitle = document.getElementById('categoryTitle');
    const categoryName = document.getElementById('categoryName');
    if (categoryTitle) categoryTitle.innerHTML = `<i class="fas fa-folder-open"></i> ${cat}`;
    if (categoryName) categoryName.textContent = cat;
    
    // إظهار هيدر المنتجات (اللي فيه زر الرجوع)
    const productsHeader = document.getElementById('productsHeader');
    if (productsHeader) {
        productsHeader.style.display = 'flex';
        productsHeader.classList.add('show');
    }
    
    // إظهار زر الرجوع
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.style.display = 'inline-flex';
        backBtn.classList.add('show');
    }
    
    // إخفاء الأقسام
    const categoriesSection = document.getElementById('categoriesSection');
    if (categoriesSection) categoriesSection.style.display = 'none';
    
    // إخفاء قسم تواصل معنا
    const contactSection = document.getElementById('contactSection');
    if (contactSection) contactSection.style.display = 'none';
    
    // عرض المنتجات
    renderProducts(items);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// 6. عرض المنتجات
// ============================================================
function renderProducts(items) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    if (!items || !items.length) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1;text-align:center;padding:40px;color:#999;">
                <i class="fas fa-search" style="font-size:50px;display:block;margin-bottom:15px;color:#ddd;"></i>
                <p>لا توجد منتجات مطابقة</p>
            </div>`;
        return;
    }

    grid.innerHTML = items.map(p => renderProductCard(p)).join('');

    setTimeout(() => {
        items.forEach(p => {
            if (p.barcode && p.barcode.length >= 8) {
                generateBarcode(p.id, p.barcode);
            }
        });
    }, 50);
}

// ============================================================
// 7. بطاقة المنتج
// ============================================================
function renderProductCard(p) {
    const isWeight = p.type === 'weight';
    const isAvailable = p.status !== 'unavailable';
    const weights = p.weights || [];

    if (isWeight && !selectedWeights[p.id]) {
        selectedWeights[p.id] = weights[0];
    }
    const chosen = selectedWeights[p.id] || '';

    const weightButtons = isWeight ? `
        <div class="weight-options">
            ${weights.map(w => `
                <button class="weight-btn ${w === chosen ? 'active' : ''}"
                        ${!isAvailable ? 'disabled' : ''}
                        onclick="selectWeight('${p.id}','${w}',event)">${w}</button>
            `).join('')}
        </div>` : '';

    const badge = !isAvailable ? `
        <span class="unavailable-badge">
            <i class="fas fa-times-circle"></i> غير متوفر
        </span>` : '';

    const controls = isAvailable ? `
        <div class="product-controls">
            <button class="qty-btn-minus" onclick="changeQtyInput('${p.id}', -1)">−</button>
            <input type="number" class="qty-input" 
                   id="qty-${p.id}" value="1" min="1" max="99">
            <button class="qty-btn-plus" onclick="changeQtyInput('${p.id}', 1)">+</button>
            <button class="add-btn" onclick="addToCart('${p.id}')">
                <i class="fas fa-plus"></i> أضف
            </button>
        </div>
    ` : `
        <div class="product-controls">
            <button class="add-btn" disabled>
                <i class="fas fa-ban"></i> غير متوفر
            </button>
        </div>
    `;

    const barcodeBlock = p.barcode ? `
        <div class="barcode-box" id="barcode-box-${p.id}">
            <svg id="barcode-${p.id}"></svg>
        </div>
    ` : `
        <div class="barcode-empty">
            <i class="fas fa-barcode"></i> لا يوجد باركود
        </div>
    `;

    const alternativesBox = !isAvailable ? renderAlternativesBox(p) : '';

    return `
        <div class="product-card ${!isAvailable ? 'unavailable' : ''}">
            ${badge}
            <div class="product-name">${p.name} - ${p.brand || ''}</div>
            <div class="product-meta">
                <span class="product-unit">${p.weight || (isWeight ? weights[0] : '')}</span>
                <span class="product-price">${p.price} ج.م</span>
            </div>
            ${weightButtons}
            ${controls}
            ${barcodeBlock}
            ${alternativesBox}
        </div>
    `;
}

// ============================================================
// 8. الباركود
// ============================================================
function generateBarcode(productId, code) {
    try {
        const svgEl = document.getElementById(`barcode-${productId}`);
        if (!svgEl) return;
        JsBarcode(svgEl, code, {
            format: "EAN13",
            width: 1.5,
            height: 40,
            displayValue: true,
            fontSize: 11,
            margin: 4,
            background: "#FFFFFF",
            lineColor: "#3E2723"
        });
    } catch (e) {
        const box = document.getElementById(`barcode-box-${productId}`);
        if (box) {
            box.innerHTML = `<p style="padding:6px;font-size:10px;text-align:center;color:#999;">⚠️ رقم باركود غير صالح</p>`;
        }
    }
}

function changeQtyInput(productId, delta) {
    const input = document.getElementById(`qty-${productId}`);
    if (!input) return;
    let val = parseInt(input.value) || 1;
    val = Math.max(1, Math.min(99, val + delta));
    input.value = val;
}

// ============================================================
// 9. البدائل
// ============================================================
function findAlternatives(product) {
    return productData
        .filter(p => 
            p.id !== product.id &&
            p.product_type === product.product_type &&
            p.status !== 'unavailable' &&
            p.brand !== product.brand
        )
        .slice(0, MAX_ALTERNATIVES);
}

function renderAlternativesBox(product) {
    const alternatives = findAlternatives(product);

    if (!alternatives.length) {
        return `
            <div class="alternatives-box">
                <div class="alternatives-title">
                    <i class="fas fa-info-circle"></i> بدائل متاحة
                </div>
                <p class="no-alternatives">لا توجد بدائل متاحة حالياً</p>
            </div>
        `;
    }

    return `
        <div class="alternatives-box">
            <div class="alternatives-title">
                <i class="fas fa-lightbulb"></i> بدائل متاحة
            </div>
            ${alternatives.map(alt => `
                <div class="alternative-item">
                    <span class="alt-name">${alt.name} - ${alt.brand || ''}</span>
                    <span class="alt-price">${alt.price} ج.م</span>
                    <button class="alt-add" onclick="quickAdd('${alt.id}')">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

function quickAdd(productId) {
    const product = productData.find(p => p.id === productId);
    if (!product || product.status === 'unavailable') return;

    const weight = product.type === 'weight' ? (product.weights?.[0] || '') : '';
    const existing = cart.find(i => i.id === productId && i.weight === weight);
    
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            qty: 1,
            weight: weight
        });
    }
    saveCart();
    renderOrders();
    showNotification(`✅ تم إضافة ${product.name}`, 'success');
}

// ============================================================
// 10. اختيار الوزن
// ============================================================
function selectWeight(productId, weight, event) {
    selectedWeights[productId] = weight;
    const productCard = event.target.closest('.product-card');
    productCard.querySelectorAll('.weight-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// === نهاية الجزء 2 ===
// ============================================================
// 11. البحث الذكي
// ============================================================
function handleSearch(q) {
    q = q.trim();
    const clearBtn = document.getElementById('clearBtn');
    clearBtn.style.display = q ? 'block' : 'none';

    if (!q) {
        if (currentView === 'home') return;
        showHome();
        return;
    }

    const query = normalize(q);
    const queryWords = query.split(' ').filter(w => w.length > 0);

    const scored = productData.map(p => {
        const name = normalize(p.name);
        const brand = normalize(p.brand || '');
        const ptype = normalize(p.product_type || '');
        const cat = normalize(p.category);

        let score = 0;

        if (name === query) score = 100;
        else if (queryWords.every(w => name.includes(w) || brand.includes(w))) score = 85;
        else if (name.startsWith(query)) score = 80;
        else if (name.includes(query)) score = 70;
        else if (brand.includes(query)) score = 60;
        else if (ptype.includes(query)) score = 55;
        else if (cat.includes(query)) score = 40;
        else if (query.length >= 2) {
            const qPrefix = query.slice(0, 2);
            if (name.includes(qPrefix) || ptype.includes(qPrefix)) score = 30;
        }

        return { p, score };
    }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);

    currentView = 'search';
    setCategoryBackground(null);
    document.getElementById('categoriesSection').style.display = 'none';
    document.getElementById('backBtn').style.display = 'inline-flex';

    if (scored.length > 0) {
        const results = scored.map(r => r.p);
        
        if (scored[0].score >= 85) {
            document.getElementById('categoryTitle').innerHTML = 
                `<i class="fas fa-search"></i> نتائج البحث: "${q}" (${results.length})`;
            renderProducts(results);
        } else {
            renderNotFoundPanel(q, results);
        }
    } else {
        const smartSuggestions = findSmartSuggestions(q);
        if (smartSuggestions.length > 0) {
            renderNotFoundPanel(q, smartSuggestions, true);
        } else {
            renderEmptySearch(q);
        }
    }
}

// ============================================================
// 12. لوحة "غير متوفر + بدائل"
// ============================================================
function renderNotFoundPanel(query, suggestions, isSmart = false) {
    const grid = document.getElementById('productsGrid');
    document.getElementById('categoryTitle').innerHTML = 
        `<i class="fas fa-search"></i> نتائج البحث: "${query}"`;

    const titleText = isSmart 
        ? `عذراً، "${query}" غير متوفرة حالياً` 
        : `لا يوجد تطابق كامل لـ "${query}"`;
    
    const subtitleText = isSmart
        ? 'لكن قد تجد ما يناسبك من الاقتراحات التالية:'
        : 'قد تجد ما يناسبك من البدائل التالية:';

    grid.innerHTML = `
        <div class="not-found-panel">
            <div class="not-found-header">
                <i class="fas fa-exclamation-triangle"></i>
                <div class="not-found-text">
                    <div class="not-found-title">${titleText}</div>
                    <div class="not-found-subtitle">${subtitleText}</div>
                </div>
            </div>
            <div class="alternatives-title-main">
                <i class="fas fa-lightbulb"></i> بدائل متاحة
            </div>
        </div>
        ${suggestions.map(p => renderProductCard(p)).join('')}
    `;

    setTimeout(() => {
        suggestions.forEach(p => {
            if (p.barcode && p.barcode.length >= 8) {
                generateBarcode(p.id, p.barcode);
            }
        });
    }, 50);
}

function renderEmptySearch(query) {
    const grid = document.getElementById('productsGrid');
    document.getElementById('categoryTitle').innerHTML = 
        `<i class="fas fa-search"></i> نتائج البحث: "${query}"`;
    
    grid.innerHTML = `
        <div class="not-found-panel" style="grid-column: 1 / -1;">
            <div class="not-found-header">
                <i class="fas fa-search-minus"></i>
                <div class="not-found-text">
                    <div class="not-found-title">عذراً، لم نجد "${query}"</div>
                    <div class="not-found-subtitle">
                        جرب البحث بكلمة أخرى، أو تصفح الأقسام من الأعلى
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============================================================
// 13. الاقتراحات الذكية
// ============================================================
function findSmartSuggestions(query) {
    if (query.length >= 3) {
        const shorter = query.slice(0, -1);
        const result = productData.filter(p => {
            const name = normalize(p.name);
            const brand = normalize(p.brand || '');
            return name.includes(shorter) || brand.includes(shorter);
        });
        if (result.length > 0) return result.slice(0, 8);
    }

    if (query.length >= 2) {
        const prefix = query.slice(0, 2);
        const result = productData.filter(p => {
            const name = normalize(p.name);
            const ptype = normalize(p.product_type || '');
            return name.includes(prefix) || ptype.includes(prefix);
        });
        if (result.length > 0) return result.slice(0, 8);
    }

    if (query.length >= 1) {
        const prefix = query.slice(0, 1);
        const result = productData.filter(p => {
            const name = normalize(p.name);
            const ptype = normalize(p.product_type || '');
            return name.includes(prefix) || ptype.includes(prefix);
        });
        return result.slice(0, 8);
    }

    return [];
}

// ============================================================
// 14. توحيد النصوص
// ============================================================
function normalize(str) {
    return String(str)
        .replace(/[\u064B-\u065F\u0670]/g, '')
        .replace(/[إأآا]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .replace(/ؤ/g, 'و')
        .replace(/ئ/g, 'ي')
        .replace(/ـ/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('clearBtn').style.display = 'none';
    showHome();
}

// ============================================================
// 15. الرجوع للرئيسية
// ============================================================
function showHome() {
    currentView = 'home';
    setCategoryBackground(null);
    
    // إظهار الأقسام
    const categoriesSection = document.getElementById('categoriesSection');
    if (categoriesSection) categoriesSection.style.display = 'block';
    
    // إظهار قسم تواصل معنا
    const contactSection = document.getElementById('contactSection');
    if (contactSection) contactSection.style.display = 'block';
    
    // إخفاء هيدر المنتجات
    const productsHeader = document.getElementById('productsHeader');
    if (productsHeader) {
        productsHeader.style.display = 'none';
        productsHeader.classList.remove('show');
    }
    
    // إخفاء زر الرجوع
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.style.display = 'none';
        backBtn.classList.remove('show');
    }
    
    // تصفير البحث
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) clearBtn.style.display = 'none';
    
    // تفريغ شبكة المنتجات
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) productsGrid.innerHTML = '';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// 16. إضافة للسلة
// ============================================================
function addToCart(productId) {
    const product = productData.find(p => p.id === productId);
    if (!product) return;
    if (product.status === 'unavailable') {
        showNotification('⚠️ هذا المنتج غير متوفر حالياً', 'warning');
        return;
    }

    const qtyInput = document.getElementById(`qty-${productId}`);
    const qty = Math.max(1, parseInt(qtyInput?.value) || 1);
    const weight = product.type === 'weight' ? selectedWeights[productId] : '';

    const existing = cart.find(i => i.id === productId && i.weight === weight);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            qty: qty,
            weight: weight
        });
    }

    if (qtyInput) qtyInput.value = 1;
    saveCart();
    renderOrders();
    const label = weight ? `${product.name} (${weight})` : product.name;
    showNotification(`✅ تم إضافة ${label}`, 'success');
}

// ============================================================
// 17. عرض الطلبات
// ============================================================
function renderOrders() {
    const container = document.getElementById('ordersContent');
    const countEl = document.getElementById('ordersCount');
    const totalEl = document.getElementById('ordersTotal');
    const footerEl = document.getElementById('ordersFooter');

    const totalQty = cart.reduce((s, i) => s + i.qty, 0);
    countEl.textContent = totalQty;

    if (!cart.length) {
        container.innerHTML = `
            <p class="empty-orders">
                <i class="fas fa-shopping-basket"></i>
                لم تقم بإضافة أي منتجات بعد
            </p>`;
        footerEl.style.display = 'none';
        return;
    }

    container.innerHTML = cart.map((item, idx) => `
        <div class="order-row">
            <div>
                <div class="order-name">${item.name}</div>
                ${item.weight ? `<div class="order-weight">${item.weight}</div>` : ''}
            </div>
            <div class="order-qty">
                <button onclick="changeQty(${idx}, -1)">−</button>
                <span class="num">${item.qty}</span>
                <button onclick="changeQty(${idx}, 1)">+</button>
            </div>
            <div class="order-price">${(item.price * item.qty).toFixed(2)} ج.م</div>
            <button class="order-delete" onclick="removeOrder(${idx})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    totalEl.textContent = total.toFixed(2) + ' ج.م';
    footerEl.style.display = 'block';
}

// ============================================================
// 18. تعديل كمية / حذف
// ============================================================
function changeQty(idx, delta) {
    if (!cart[idx]) return;
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    saveCart();
    renderOrders();
}

function removeOrder(idx) {
    const item = cart[idx];
    if (!item) return;
    cart.splice(idx, 1);
    saveCart();
    renderOrders();
    showNotification(`🗑️ تم حذف ${item.name}`, 'warning');
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ============================================================
// 19. إتمام الطلب عبر واتساب
// ============================================================
function checkout() {
    if (!cart.length) {
        showNotification('⚠️ لم تضف أي منتجات بعد', 'warning');
        return;
    }

    const lines = cart.map(i => {
        const label = i.weight ? `${i.name} (${i.weight})` : i.name;
        return `• ${label} × ${i.qty} = ${(i.price * i.qty).toFixed(2)} ج.م`;
    });
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

    const message =
`🛒 *طلب جديد من ${MARKET_NAME}*

${lines.join('\n')}

━━━━━━━━━━━━━━
💰 *الإجمالي:* ${total.toFixed(2)} ج.م

📍 من فضلك أرسل العنوان:
[اكتب عنوانك هنا]

${MARKET_SLOGAN} ❤️`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// ============================================================
// 20. القائمة الجانبية
// ============================================================
function openSidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('overlay').classList.add('active');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
}

function closeAll() {
    closeSidebar();
}

// ============================================================
// 21. الإشعارات
// ============================================================
function showNotification(text, type = '') {
    const container = document.getElementById('notifications');
    const el = document.createElement('div');
    el.className = `notification ${type}`;
    el.textContent = text;
    container.appendChild(el);
    setTimeout(() => {
        el.classList.add('fadeOut');
        setTimeout(() => el.remove(), 300);
    }, 2200);
}

// ============================================================
// 22. PWA Install Banner
// ============================================================
let deferredPrompt = null;
// استخدمنا sessionStorage مش localStorage عشان الرسالة تظهر تاني في كل مرة
// يتفتح فيها الموقع من جديد، وتفضل مختفية بس لحد ما يقفل ويفتح الصفحة تاني
const INSTALL_BANNER_DISMISSED_KEY = 'installBannerDismissedThisSession';

function getOS() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return 'iOS';
    if (/android/i.test(userAgent)) return 'Android';
    return 'Desktop';
}

function isIOSSafari() {
    const ua = navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const webkit = /WebKit/.test(ua);
    const notChrome = !/CriOS/.test(ua);
    const notFirefox = !/FxiOS/.test(ua);
    return iOS && webkit && notChrome && notFirefox;
}

function isAppInstalled() {
    if (window.matchMedia('(display-mode: standalone)').matches) return true;
    if (window.navigator.standalone === true) return true;
    return false;
}

function showInstallBanner() {
    if (isAppInstalled()) return;
    if (sessionStorage.getItem(INSTALL_BANNER_DISMISSED_KEY) === 'true') return;
    
    const banner = document.getElementById('installBanner');
    if (!banner) return;
    
    const os = getOS();
    const textP = banner.querySelector('.install-banner-text p');
    const primaryBtn = banner.querySelector('.install-btn-primary');
    
    if (os === 'iOS') {
        textP.textContent = 'أضف التطبيق لشاشتك الرئيسية: اضغط [مشاركة] في Safari ثم "إضافة إلى الشاشة الرئيسية"';
        primaryBtn.innerHTML = '<i class="fas fa-check"></i> فهمت';
        primaryBtn.onclick = dismissInstallBanner;
    } else {
        textP.textContent = 'ثبت التطبيق الآن لتجربة سهلة و سريعة';
        primaryBtn.innerHTML = '<i class="fas fa-download"></i> ثبت الآن';
        primaryBtn.onclick = installPWA;
    }
    
    banner.style.display = 'block';
}

async function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            dismissInstallBanner();
        }
        deferredPrompt = null;
    } else {
        dismissInstallBanner();
    }
}

function dismissInstallBanner() {
    const banner = document.getElementById('installBanner');
    if (banner) {
        banner.classList.add('hidden');
        setTimeout(() => {
            banner.style.display = 'none';
        }, 400);
    }
    sessionStorage.setItem(INSTALL_BANNER_DISMISSED_KEY, 'true');
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallBanner();
});

window.addEventListener('appinstalled', () => {
    dismissInstallBanner();
});

window.addEventListener('load', () => {
    setTimeout(() => {
        if (isIOSSafari()) {
            showInstallBanner();
        }
    }, 2000);
});

// ============================================================
// 23. تشغيل التطبيق
// ============================================================
document.addEventListener('DOMContentLoaded', initApp);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js?v=5')
            .then(() => console.log('✅ Service Worker مسجّل'))
            .catch(e => console.log('❌ Service Worker:', e));
    });
}

// === نهاية الملف ===
