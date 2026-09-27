// ============================================================
// HANON STORE - Main Script
// ============================================================

let STORE_DATA = loadStoreData();
let cart = [];
let cartLineId = 0;
let currentCategory = null;

// ============================================================
// تحميل البيانات
// ============================================================
function loadStoreData() {
  const saved = localStorage.getItem("hanonStoreData");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn("فشل تحميل البيانات:", e);
    }
  }
  return {
    config: {
      brand_ar: "حنون",
      brand_en: "HANON STORE",
      tagline_ar: "خامات و جوده و ذوق مضمون",
      about_ar: "نقدم لكم أحدث الموديلات من بيوت الأزياء العالمية بأجود الخامات.",
      whatsappNumber: "",
      facebook: ""
    },
    social: {},
    featured: [],
    categories: []
  };
}

// ============================================================
// إشارة التحميل
// ============================================================
window.addEventListener('storeDataReady', () => {
  console.log("🔔 إشارة storeDataReady وصلت");
  STORE_DATA = loadStoreData();
  applySocialLinks();
  applyConfig();
  renderCategories();
  renderFeatured();
  renderCategoriesList();
});

// ============================================================
// تطبيق روابط التواصل الاجتماعي
// ============================================================
function applySocialLinks() {
  const social = STORE_DATA.social || {};
  const cfg = STORE_DATA.config || {};
  
  const fbUrl = social.facebook || cfg.facebook || "#";
  const waNum = cfg.whatsappNumber || "";
  const waUrl = social.whatsapp || (waNum ? `https://wa.me/${waNum}` : "#");
  
  const fbTop = document.getElementById("facebookLink");
  if (fbTop) fbTop.href = fbUrl;
  
  const waTop = document.getElementById("whatsappLink");
  if (waTop) waTop.href = waUrl;
  
  const fbContact = document.getElementById("contactFacebook");
  if (fbContact) fbContact.href = fbUrl;
  
  const waContact = document.getElementById("contactWhatsapp");
  if (waContact) waContact.href = waUrl;
}

// ============================================================
// تطبيق الإعدادات
// ============================================================
function applyConfig() {
  const cfg = STORE_DATA.config || {};
  
  const aboutText = document.getElementById("aboutText");
  if (aboutText) aboutText.textContent = cfg.about_ar || "";
  
  const titleEl = document.querySelector("title");
  if (titleEl && cfg.brand_en) {
    titleEl.textContent = `${cfg.brand_en} | ${cfg.brand_ar}`;
  }
}

// ============================================================
// القائمة الجانبية
// ============================================================
const sideMenu = document.getElementById("sideMenu");
const sideOverlay = document.getElementById("sideOverlay");

function openSide() {
  sideMenu.classList.add("open");
  sideOverlay.classList.add("show");
}
function closeSide() {
  sideMenu.classList.remove("open");
  sideOverlay.classList.remove("show");
}

const menuBtn = document.getElementById("menuBtn");
if (menuBtn) menuBtn.addEventListener("click", openSide);

const closeMenuBtn = document.getElementById("closeMenu");
if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeSide);

if (sideOverlay) {
  sideOverlay.addEventListener("click", () => {
    closeSide();
    closeCartDrawer();
  });
}

document.querySelectorAll(".side-link").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const nav = link.dataset.nav;
    document.getElementById("aboutBox").classList.add("hidden");
    document.getElementById("contactBox").classList.add("hidden");
    
    if (nav === "about") {
      document.getElementById("aboutBox").classList.remove("hidden");
    }
    if (nav === "contact") {
      document.getElementById("contactBox").classList.remove("hidden");
    }
    if (nav === "home") {
      closeSide();
      showHome();
    }
  });
});

const brandHome = document.getElementById("brandHome");
if (brandHome) brandHome.addEventListener("click", showHome);

// ============================================================
// التنقل بين الصفحات
// ============================================================
const viewHome = document.getElementById("view-home");
const viewCategory = document.getElementById("view-category");

function showHome() {
  if (viewCategory) viewCategory.classList.add("hidden");
  if (viewHome) viewHome.classList.remove("hidden");
  currentCategory = null;
  window.scrollTo(0, 0);
}

// ============================================================
// عرض الأقسام في السلايدر (Center Mode)
// ============================================================
function renderCategories() {
  const wrap = document.getElementById("catsSlider").parentElement;
  const slider = document.getElementById("catsSlider");
  if (!slider) return;
  
  // لفي السلايدر بـ wrap جديد
  if (!wrap.classList.contains("slider-wrap")) {
    wrap.classList.add("slider-wrap");
  }
  
  slider.innerHTML = "";
  
  const cats = (STORE_DATA.categories || []).filter(c => c.visible !== false);
  
  if (cats.length === 0) {
    slider.innerHTML = '<p style="padding:20px;color:#999;">لا توجد أقسام حالياً</p>';
    return;
  }
  
  cats.forEach(cat => {
    const item = document.createElement("button");
    item.className = "slider-item";
    const img = cat.homeImg || (cat.products[0] && cat.products[0].images[0]) || "";
    
    item.innerHTML = `
      ${img ? `<img src="${img}" alt="${cat.name_ar}" loading="lazy">` : ""}
      <div class="slider-label">${cat.icon || ""} ${cat.name_ar}</div>
    `;
    item.addEventListener("click", () => openCategory(cat.id));
    slider.appendChild(item);
  });
  
  // إضافة النقاط
  addDots(wrap, cats.length);
  
  // تهيئة السلايدر
  initCenterSlider(wrap, slider, cats.length);
}

// ============================================================
// عرض الصور المميزة (Center Mode)
// ============================================================
function renderFeatured() {
  const wrap = document.getElementById("featuredSlider").parentElement;
  const slider = document.getElementById("featuredSlider");
  if (!slider) return;
  
  if (!wrap.classList.contains("slider-wrap")) {
    wrap.classList.add("slider-wrap");
  }
  
  slider.innerHTML = "";
  
  const featured = STORE_DATA.featured || [];
  
  if (featured.length === 0) {
    slider.innerHTML = '<p style="padding:20px;color:#999;">لا توجد صور مميزة</p>';
    return;
  }
  
  featured.forEach((imgUrl, idx) => {
    const item = document.createElement("div");
    item.className = "slider-item";
    item.innerHTML = `<img src="${imgUrl}" alt="صورة مميزة ${idx + 1}" loading="lazy">`;
    slider.appendChild(item);
  });
  
  addDots(wrap, featured.length);
  initCenterSlider(wrap, slider, featured.length);
}

// ============================================================
// إضافة النقاط
// ============================================================
function addDots(wrap, total) {
  // امسح النقاط القديمة
  const oldDots = wrap.querySelector(".slider-dots");
  if (oldDots) oldDots.remove();
  
  const dotsWrap = document.createElement("div");
  dotsWrap.className = "slider-dots";
  
  for (let i = 0; i < total; i++) {
    const dot = document.createElement("button");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.dataset.idx = i;
    dotsWrap.appendChild(dot);
  }
  
  wrap.appendChild(dotsWrap);
}

// ============================================================
// تهيئة السلايدر Center Mode
// ============================================================
function initCenterSlider(wrap, slider, total) {
  let currentIdx = 0;
  let autoPlayTimer = null;
  let paused = false;
  
  const dots = wrap.querySelectorAll(".slider-dots .dot");
  
  function goTo(idx) {
    if (idx < 0) idx = total - 1;
    if (idx >= total) idx = 0;
    
    currentIdx = idx;
    
    const items = slider.querySelectorAll(".slider-item");
    if (items.length === 0) return;
    
    // نضبط الـ active
    items.forEach((item, i) => {
      item.classList.toggle("active", i === idx);
    });
    
    // نحرك المسار بحيث العنصر المختار في النص
    const targetItem = items[idx];
    const wrapWidth = wrap.clientWidth;
    const itemWidth = targetItem.offsetWidth;
    
    // مركز العنصر
    const itemCenter = targetItem.offsetLeft + itemWidth / 2;
    const translateX = itemCenter - wrapWidth / 2;
    
    slider.style.transform = `translateX(${-translateX}px)`;
    
    // نحدّث النقاط
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === idx);
    });
  }
  
  // نبدأ من العنصر الأول
  setTimeout(() => goTo(0), 100);
  
  // نتفاعل مع النقاط
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      goTo(parseInt(dot.dataset.idx));
    });
  });
  
  // السحب بالإصبع
  let touchStartX = 0;
  let touchStartTime = 0;
  let isDragging = false;
  let startTranslate = 0;
  
  wrap.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartTime = Date.now();
    isDragging = true;
    paused = true;
    
    // احفظ الموضع الحالي
    const items = slider.querySelectorAll(".slider-item");
    if (items[currentIdx]) {
      const targetItem = items[currentIdx];
      const itemCenter = targetItem.offsetLeft + targetItem.offsetWidth / 2;
      startTranslate = itemCenter - wrap.clientWidth / 2;
    }
    
    slider.style.transition = "none";
  }, { passive: true });
  
  wrap.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const diff = touchStartX - e.touches[0].clientX;
    slider.style.transform = `translateX(${-startTranslate - diff}px)`;
  }, { passive: true });
  
  wrap.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    const timeDiff = Date.now() - touchStartTime;
    const velocity = Math.abs(diff) / timeDiff;
    
    slider.style.transition = "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    
    // حد أدنى للسحب
    const threshold = 40;
    
    if (diff > threshold || velocity > 0.5) {
      // سحب لليسار → التالي
      goTo(currentIdx + 1);
    } else if (diff < -threshold) {
      // سحب لليمين → السابق
      goTo(currentIdx - 1);
    } else {
      // رجع للموضع
      goTo(currentIdx);
    }
    
    setTimeout(() => {
      paused = false;
      startAutoPlay();
    }, 3000);
  }, { passive: true });
  
  // للكمبيوتر - Mouse
  let mouseStartX = 0;
  let mouseDragging = false;
  
  wrap.addEventListener("mousedown", (e) => {
    mouseStartX = e.clientX;
    mouseDragging = true;
    paused = true;
    slider.style.transition = "none";
  });
  
  wrap.addEventListener("mousemove", (e) => {
    if (!mouseDragging) return;
    const diff = mouseStartX - e.clientX;
    slider.style.transform = `translateX(${-startTranslate - diff}px)`;
  });
  
  wrap.addEventListener("mouseup", (e) => {
    if (!mouseDragging) return;
    mouseDragging = false;
    slider.style.transition = "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    
    const diff = mouseStartX - e.clientX;
    const threshold = 40;
    
    if (diff > threshold) {
      goTo(currentIdx + 1);
    } else if (diff < -threshold) {
      goTo(currentIdx - 1);
    } else {
      goTo(currentIdx);
    }
    
    setTimeout(() => {
      paused = false;
      startAutoPlay();
    }, 3000);
  });
  
  wrap.addEventListener("mouseleave", () => {
    if (mouseDragging) {
      mouseDragging = false;
      goTo(currentIdx);
    }
  });
  
  // تشغيل تلقائي
  function startAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => {
      if (paused) return;
      goTo(currentIdx + 1);
    }, 4000); // كل 4 ثواني
  }
  
  startAutoPlay();
  
  // استنى لما الصور تحمل، بعدها أعد الحساب
  setTimeout(() => goTo(currentIdx), 500);
  setTimeout(() => goTo(currentIdx), 1500);
}

// ============================================================
// عرض قائمة الأقسام الرأسية
// ============================================================
function renderCategoriesList() {
  const list = document.getElementById("categoriesList");
  if (!list) return;
  list.innerHTML = "";
  
  const cats = (STORE_DATA.categories || []).filter(c => c.visible !== false);
  
  cats.forEach(cat => {
    const row = document.createElement("button");
    row.className = "category-row";
    const img = cat.homeImg || (cat.products[0] && cat.products[0].images[0]) || "";
    
    row.innerHTML = `
      ${img ? `<img class="cat-img" src="${img}" alt="${cat.name_ar}" loading="lazy" onerror="this.style.opacity=0.3">` : '<div class="cat-img" style="background:#EDE8DF;"></div>'}
      <div class="cat-info">
        <span class="cat-icon">${cat.icon || "🛍️"}</span>
        <span class="cat-name">${cat.name_ar}</span>
        <span class="cat-count">${(cat.products || []).length} منتج</span>
      </div>
      <span class="cat-arrow">‹</span>
    `;
    row.addEventListener("click", () => openCategory(cat.id));
    list.appendChild(row);
  });
}

// ============================================================
// فتح قسم
// ============================================================
function openCategory(catId) {
  const cat = STORE_DATA.categories.find(c => c.id === catId);
  if (!cat) return;
  
  currentCategory = catId;
  
  if (viewHome) viewHome.classList.add("hidden");
  if (viewCategory) viewCategory.classList.remove("hidden");
  window.scrollTo(0, 0);
  
  const titleEl = document.getElementById("categoryTitle");
  if (titleEl) titleEl.textContent = `${cat.icon || ""} ${cat.name_ar}`;
  
  renderProducts(cat);
}

// ============================================================
// عرض منتجات القسم
// ============================================================
function renderProducts(cat) {
  const list = document.getElementById("productsList");
  if (!list) return;
  list.innerHTML = "";
  
  if (!cat.products || cat.products.length === 0) {
    list.innerHTML = '<p style="text-align:center;padding:40px;color:#999;font-weight:700;">لا توجد منتجات في هذا القسم حالياً</p>';
    return;
  }
  
  cat.products.forEach(prod => {
    list.appendChild(buildProductCard(prod));
  });
}

// ============================================================
// بناء كارت المنتج
// ============================================================
function buildProductCard(prod) {
  const card = document.createElement("div");
  card.className = "product-card";
  
  const img = prod.images && prod.images[0] ? prod.images[0] : "";
  
  // بناء أزرار المقاسات
  const sizesHtml = (prod.sizes || []).map(s => `
    <button class="pc-size-btn" data-size="${s.label}" data-price="${s.price}">
      <span class="pc-size-label">${s.label}</span>
      <span class="pc-size-price">${s.price} ج.م</span>
    </button>
  `).join("");
  
  card.innerHTML = `
    <div class="pc-img-box">
      ${img ? `<img class="pc-img" src="${img}" alt="${prod.name_ar}" loading="lazy" onerror="this.style.opacity=0.3">` : '<div class="pc-img" style="background:#EDE8DF;display:flex;align-items:center;justify-content:center;font-size:3rem;">👕</div>'}
    </div>
    <h3 class="pc-name">${prod.name_ar}</h3>
    ${prod.desc_ar ? `<p class="pc-desc">${prod.desc_ar}</p>` : '<p class="pc-desc"></p>'}
    <div class="pc-selected-info hidden" id="selInfo_${prod.id}">
      <span>المقاس المختار:</span>
      <span id="selText_${prod.id}"></span>
    </div>
    <div class="pc-sizes">
      ${sizesHtml || '<p style="grid-column:1/-1;text-align:center;color:#999;font-size:0.85rem;">لا توجد مقاسات</p>'}
    </div>
    <button class="pc-add-btn" data-prod="${prod.id}" disabled>
      🛒 أضف إلى السلة
    </button>
  `;
  
  // تفاعل مع المقاسات
  const sizeBtns = card.querySelectorAll(".pc-size-btn");
  const addBtn = card.querySelector(".pc-add-btn");
  const selInfo = card.querySelector(".pc-selected-info");
  const selText = card.querySelector(`#selText_${prod.id}`);
  
  let selectedSize = null;
  let selectedPrice = null;
  
  sizeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      sizeBtns.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      
      selectedSize = btn.dataset.size;
      selectedPrice = Number(btn.dataset.price) || 0;
      
      addBtn.disabled = false;
      selInfo.classList.remove("hidden");
      selText.textContent = `${selectedSize} - ${selectedPrice} ج.م`;
    });
  });
  
  // زر الإضافة
  addBtn.addEventListener("click", () => {
    if (!selectedSize) return;
    
    addToCart({
      productId: prod.id,
      name: prod.name_ar,
      size: selectedSize,
      price: selectedPrice,
      image: img,
      qty: 1
    });
    
    // إعادة تعيين المقاسات
    sizeBtns.forEach(b => b.classList.remove("selected"));
    selectedSize = null;
    selectedPrice = null;
    addBtn.disabled = true;
    selInfo.classList.add("hidden");
  });
  
  return card;
}

// ============================================================
// زر الرجوع
// ============================================================
const backBtnCategory = document.getElementById("backBtnCategory");
if (backBtnCategory) backBtnCategory.addEventListener("click", showHome);

// ============================================================
// السلة
// ============================================================
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

function openCartDrawer() {
  if (cartDrawer) cartDrawer.classList.add("open");
  if (cartOverlay) cartOverlay.classList.add("show");
}
function closeCartDrawer() {
  if (cartDrawer) cartDrawer.classList.remove("open");
  if (cartOverlay) cartOverlay.classList.remove("show");
}

const cartBtn = document.getElementById("cartBtn");
if (cartBtn) cartBtn.addEventListener("click", openCartDrawer);

const closeCartBtn = document.getElementById("closeCart");
if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartDrawer);

if (cartOverlay) cartOverlay.addEventListener("click", closeCartDrawer);

function addToCart(line) {
  line.id = "c" + (cartLineId++);
  cart.push(line);
  renderCart();
  openCartDrawer();
}

function removeFromCart(id) {
  cart = cart.filter(l => l.id !== id);
  renderCart();
}

function renderCart() {
  const box = document.getElementById("cartItems");
  if (!box) return;
  box.innerHTML = "";
  
  if (cart.length === 0) {
    box.innerHTML = '<p class="empty-cart">السلة فارغة</p>';
  } else {
    cart.forEach(line => {
      const row = document.createElement("div");
      row.className = "cart-line";
      row.innerHTML = `
        <div class="cart-line-info">
          <strong>${line.qty} × ${line.name}</strong>
          <span class="line-price">المقاس: ${line.size} - ${line.price * line.qty} ج.م</span>
        </div>
        <button class="remove-line" aria-label="remove">✕</button>
      `;
      row.querySelector(".remove-line").onclick = () => removeFromCart(line.id);
      box.appendChild(row);
    });
  }
  
  const countEl = document.getElementById("cartCount");
  if (countEl) countEl.textContent = cart.reduce((a, l) => a + l.qty, 0);
  
  const totalEl = document.getElementById("cartTotal");
  if (totalEl) totalEl.textContent = cart.reduce((a, l) => a + l.price * l.qty, 0);
}

// ============================================================
// إرسال الطلب عبر واتساب
// ============================================================
const sendOrderBtn = document.getElementById("sendOrderBtn");
if (sendOrderBtn) {
  sendOrderBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("السلة فارغة");
      return;
    }
    
    const waNum = STORE_DATA.config.whatsappNumber;
    if (!waNum) {
      alert("رقم الواتساب غير مسجل");
      return;
    }
    
    let msg = "🛍️ *طلب جديد من حنون*%0A%0A";
    cart.forEach(l => {
      msg += `▪️ ${l.qty} × ${l.name}%0A`;
      msg += `   المقاس: ${l.size} - ${l.price * l.qty} ج.م%0A%0A`;
    });
    
    const total = cart.reduce((a, l) => a + l.price * l.qty, 0);
    msg += `━━━━━━━━━━━━━━━━%0A`;
    msg += `💰 *الإجمالي:* ${total} ج.م`;
    
    window.open(`https://wa.me/${waNum}?text=${msg}`, "_blank");
  });
}

// ============================================================
// Install Prompt (PWA)
// ============================================================
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const lastDismiss = sessionStorage.getItem("installDismissed");
  if (!lastDismiss) {
    const prompt = document.getElementById("installPrompt");
    if (prompt) prompt.classList.remove("hidden");
  }
});

const installNowBtn = document.getElementById("installNowBtn");
if (installNowBtn) {
  installNowBtn.addEventListener("click", async () => {
    const prompt = document.getElementById("installPrompt");
    if (prompt) prompt.classList.add("hidden");
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    }
  });
}

const installLaterBtn = document.getElementById("installLaterBtn");
if (installLaterBtn) {
  installLaterBtn.addEventListener("click", () => {
    const prompt = document.getElementById("installPrompt");
    if (prompt) prompt.classList.add("hidden");
    sessionStorage.setItem("installDismissed", "1");
  });
}

// ============================================================
// Splash Screen (3.5 ثانية)
// ============================================================
setTimeout(() => {
  const splash = document.getElementById("splashScreen");
  if (splash) {
    splash.classList.add("fade-out");
    setTimeout(() => splash.remove(), 1000);
  }
}, 3500);

// ============================================================
// التشغيل الأولي
// ============================================================
applySocialLinks();
applyConfig();
renderCategories();
renderFeatured();
renderCategoriesList();
renderCart();