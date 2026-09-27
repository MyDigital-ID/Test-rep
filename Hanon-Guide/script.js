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
  if (sideMenu) sideMenu.classList.add("open");
  if (sideOverlay) sideOverlay.classList.add("show");
}
function closeSide() {
  if (sideMenu) sideMenu.classList.remove("open");
  if (sideOverlay) sideOverlay.classList.remove("show");
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
    const aboutBox = document.getElementById("aboutBox");
    const contactBox = document.getElementById("contactBox");
    if (aboutBox) aboutBox.classList.add("hidden");
    if (contactBox) contactBox.classList.add("hidden");
    
    if (nav === "about" && aboutBox) {
      aboutBox.classList.remove("hidden");
    }
    if (nav === "contact" && contactBox) {
      contactBox.classList.remove("hidden");
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
// عرض الأقسام في السلايدر
// ============================================================
function renderCategories() {
  const wrap = document.getElementById("catsSlider").parentElement;
  const slider = document.getElementById("catsSlider");
  if (!slider) return;
  
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
    slider.appendChild(item);
  });
  
  addDots(wrap, cats.length);
  
  initCenterSlider(wrap, slider, cats.length, (idx) => {
    if (cats[idx]) openCategory(cats[idx].id);
  });
}

// ============================================================
// عرض الصور المميزة
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
  initCenterSlider(wrap, slider, featured.length, null);
}

// ============================================================
// إضافة النقاط
// ============================================================
function addDots(wrap, total) {
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
// تهيئة السلايدر Center Mode (Infinite Loop - بدون Auto Play)
// ============================================================
function initCenterSlider(wrap, slider, total, onItemClick) {
  if (total === 0) return;

  const CLONES = 2;
  const originalItems = Array.from(slider.querySelectorAll(".slider-item"));

  slider.innerHTML = "";

  // كلونات البداية
  for (let i = total - CLONES; i < total; i++) {
    if (i >= 0) {
      const clone = originalItems[i].cloneNode(true);
      clone.dataset.clone = "1";
      clone.dataset.origIdx = i;
      slider.appendChild(clone);
    }
  }

  // العناصر الأصلية
  originalItems.forEach((item, i) => {
    item.dataset.clone = "0";
    item.dataset.origIdx = i;
    slider.appendChild(item);
  });

  // كلونات النهاية
  for (let i = 0; i < CLONES; i++) {
    const clone = originalItems[i].cloneNode(true);
    clone.dataset.clone = "1";
    clone.dataset.origIdx = i;
    slider.appendChild(clone);
  }

  const allItems = slider.querySelectorAll(".slider-item");
  const REAL_START = CLONES;
  const totalPadded = allItems.length;

  // نبدأ من الصورة رقم 2
  let currentIdx = REAL_START + 1;
  let isAnimating = false;

  function getRealIdx(paddedIdx) {
    let real = paddedIdx - REAL_START;
    real = ((real % total) + total) % total;
    return real;
  }

  function setActive(idx) {
    allItems.forEach((item, i) => {
      item.classList.toggle("active", i === idx);
    });

    const realIdx = getRealIdx(idx);
    const dots = wrap.querySelectorAll(".slider-dots .dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === realIdx);
    });
  }

  function moveTo(idx, animate) {
    if (idx < 0) idx = 0;
    if (idx >= totalPadded) idx = totalPadded - 1;

    currentIdx = idx;
    setActive(idx);

    const targetItem = allItems[idx];
    const wrapWidth = wrap.clientWidth;
    const itemWidth = targetItem.offsetWidth;
    const itemCenter = targetItem.offsetLeft + itemWidth / 2;
    const translateX = itemCenter - wrapWidth / 2;

    if (animate) {
      slider.style.transition = "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      slider.style.transform = `translateX(${-translateX}px)`;
    } else {
      slider.style.transition = "none";
      slider.style.transform = `translateX(${-translateX}px)`;
      void slider.offsetHeight;
      slider.style.transition = "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    }
  }

  function goNext() {
    if (isAnimating) return;
    isAnimating = true;

    moveTo(currentIdx + 1, true);

    setTimeout(() => {
      if (currentIdx >= REAL_START + total) {
        moveTo(currentIdx - total, false);
      }
      isAnimating = false;
    }, 520);
  }

  function goPrev() {
    if (isAnimating) return;
    isAnimating = true;

    moveTo(currentIdx - 1, true);

    setTimeout(() => {
      if (currentIdx < REAL_START) {
        moveTo(currentIdx + total, false);
      }
      isAnimating = false;
    }, 520);
  }

  setTimeout(() => {
    moveTo(currentIdx, false);
  }, 100);

  // النقاط
  const dots = wrap.querySelectorAll(".slider-dots .dot");
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      if (isAnimating) return;
      isAnimating = true;
      moveTo(REAL_START + i, true);
      setTimeout(() => { isAnimating = false; }, 520);
    });
  });

  // السحب بالإصبع
  let touchStartX = 0;
  let isDragging = false;
  let dragOffset = 0;

  wrap.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    isDragging = true;
    dragOffset = 0;
    slider.style.transition = "none";
  }, { passive: true });

  wrap.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    dragOffset = e.touches[0].clientX - touchStartX;

    const targetItem = allItems[currentIdx];
    const wrapWidth = wrap.clientWidth;
    const itemWidth = targetItem.offsetWidth;
    const itemCenter = targetItem.offsetLeft + itemWidth / 2;
    const baseTranslate = -(itemCenter - wrapWidth / 2);

    slider.style.transform = `translateX(${baseTranslate + dragOffset}px)`;
  }, { passive: true });

  wrap.addEventListener("touchend", () => {
    if (!isDragging) return;
    isDragging = false;

    const threshold = 40;

    if (dragOffset < -threshold) {
      goNext();
    } else if (dragOffset > threshold) {
      goPrev();
    } else {
      moveTo(currentIdx, true);
    }
  }, { passive: true });

  // Mouse للكمبيوتر
  let mouseStartX = 0;
  let mouseDragging = false;

  wrap.addEventListener("mousedown", (e) => {
    mouseStartX = e.clientX;
    mouseDragging = true;
    dragOffset = 0;
    slider.style.transition = "none";
  });

  wrap.addEventListener("mousemove", (e) => {
    if (!mouseDragging) return;
    dragOffset = e.clientX - mouseStartX;

    const targetItem = allItems[currentIdx];
    const wrapWidth = wrap.clientWidth;
    const itemWidth = targetItem.offsetWidth;
    const itemCenter = targetItem.offsetLeft + itemWidth / 2;
    const baseTranslate = -(itemCenter - wrapWidth / 2);

    slider.style.transform = `translateX(${baseTranslate + dragOffset}px)`;
  });

  wrap.addEventListener("mouseup", () => {
    if (!mouseDragging) return;
    mouseDragging = false;

    const threshold = 40;

    if (dragOffset < -threshold) {
      goNext();
    } else if (dragOffset > threshold) {
      goPrev();
    } else {
      moveTo(currentIdx, true);
    }
  });

  wrap.addEventListener("mouseleave", () => {
    if (mouseDragging) {
      mouseDragging = false;
      moveTo(currentIdx, true);
    }
  });

  setTimeout(() => moveTo(currentIdx, false), 500);
  setTimeout(() => moveTo(currentIdx, false), 1500);

  // تفاعل مع الضغط
  allItems.forEach((item) => {
    item.onclick = () => {
      if (Math.abs(dragOffset) > 5) return;
      const origIdx = parseInt(item.dataset.origIdx);
      if (onItemClick) onItemClick(origIdx);
    };
  });
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