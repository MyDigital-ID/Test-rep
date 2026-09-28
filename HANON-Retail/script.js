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
  renderOffersSlider();
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

  // الفوتر
  const footTag = document.getElementById("footTagline");
  if (footTag && cfg.tagline_ar) footTag.textContent = cfg.tagline_ar;

  const footAddr = document.getElementById("footAddress");
  if (footAddr) footAddr.textContent = cfg.address_ar || "";

  const footPhones = document.getElementById("footPhones");
  if (footPhones) {
    const phones = Array.isArray(cfg.phones) ? cfg.phones : [];
    footPhones.innerHTML = phones.map(p => `<a href="tel:${p}" dir="ltr">${p}</a>`).join(" &nbsp;|&nbsp; ");
  }

  // رابط الموقع في القائمة الجانبية
  const locLink = document.getElementById("locationLink");
  if (locLink) {
    if (cfg.mapUrl) {
      locLink.href = cfg.mapUrl;
      locLink.classList.remove("hidden");
    } else {
      locLink.classList.add("hidden");
    }
  }

  applyHeroImage();
}

// صورة البانر الرئيسي: أول صورة مميزة (أو صورة أول قسم)
function applyHeroImage() {
  const hero = document.getElementById("heroBox");
  if (!hero) return;
  const feat = (STORE_DATA.featured || [])[0];
  const firstCat = (STORE_DATA.categories || []).find(c => c.visible !== false);
  const img = feat || (firstCat && firstCat.homeImg) || "";
  if (img) hero.style.setProperty("--hero-img", `url("${img}")`);
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
  const si = document.getElementById("searchInput");
  if (si) si.value = "";
  window.scrollTo(0, 0);
}

// ============================================================
// عرض الأقسام كأيقونات/كروت تفاعلية
// ============================================================
function renderCategories() {
  const grid = document.getElementById("catsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const cats = (STORE_DATA.categories || []).filter(c => c.visible !== false);

  if (cats.length === 0) {
    grid.innerHTML = '<p class="empty-note">لا توجد أقسام حالياً</p>';
    return;
  }

  cats.forEach(cat => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "cat-card";
    const img = cat.homeImg || (cat.products && cat.products[0] && cat.products[0].images[0]) || "";

    card.innerHTML = `
      ${img ? `<img src="${img}" alt="${cat.name_ar}" loading="lazy">` : ""}
      <span class="cat-card-shade"></span>
      <span class="cat-card-text">
        <span class="cat-card-ar">${cat.icon || ""} ${cat.name_ar}</span>
        <span class="cat-card-en">${cat.name_en || ""}</span>
      </span>
      <span class="cat-card-go" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"/></svg>
      </span>
    `;
    card.addEventListener("click", () => openCategory(cat.id));
    grid.appendChild(card);
  });
}

// ============================================================
// عرض الصور المميزة
// ============================================================
function renderFeatured() {
  const wrap = document.getElementById("featuredSlider").parentElement;
  const slider = document.getElementById("featuredSlider");
  if (!slider) return;
  destroySlider(wrap);
  
  if (!wrap.classList.contains("slider-wrap")) {
    wrap.classList.add("slider-wrap");
  }
  
  slider.innerHTML = "";
  
  const featured = STORE_DATA.featured || [];
  
  if (featured.length === 0) {
    slider.innerHTML = '<p class="empty-note">لا توجد صور مميزة</p>';
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
// تحميل مكتبة Swiper تلقائياً (بدون الحاجة لتعديل index.html)
// ============================================================
const SWIPER_CSS = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css";
const SWIPER_JS  = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";
let swiperLoadPromise = null;

function loadSwiperLib() {
  if (window.Swiper) return Promise.resolve();
  if (swiperLoadPromise) return swiperLoadPromise;

  const cssReady = new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = SWIPER_CSS;
    link.onload = resolve;
    link.onerror = resolve; // لا نعطل الباقي لو فشل الـ CSS
    document.head.appendChild(link);
  });

  const jsReady = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SWIPER_JS;
    s.onload = resolve;
    s.onerror = () => reject(new Error("فشل تحميل Swiper"));
    document.head.appendChild(s);
  });

  swiperLoadPromise = Promise.all([cssReady, jsReady]).catch((err) => {
    swiperLoadPromise = null;
    throw err;
  });
  return swiperLoadPromise;
}

// يجب استدعاؤها قبل تفريغ السلايدر (innerHTML = "") حتى تنظف Swiper نفسها
function destroySlider(wrap) {
  if (wrap && wrap._swiper) {
    try { wrap._swiper.destroy(true, true); } catch (e) { /* ignore */ }
    wrap._swiper = null;
  }
}

// ============================================================
// السلايدر 3D Coverflow (Swiper.js) - صورة كبيرة في المنتصف
// وأجزاء من الصور الجانبية مائلة خلفها، وتقليب في نفس الإطار
// ============================================================
function initCenterSlider(wrap, slider, total, onItemClick) {
  if (total === 0) return;

  const items = Array.from(slider.querySelectorAll(".slider-item"));
  if (items.length === 0) return;

  destroySlider(wrap);
  const token = (wrap._sliderToken = (wrap._sliderToken || 0) + 1);

  items.forEach((item, i) => { item.dataset.origIdx = i; });

  // الضغط: الصورة الجانبية تتوسّط أولاً، والصورة المتوسطة تفتح القسم
  if (slider._clickHandler) slider.removeEventListener("click", slider._clickHandler);
  slider._clickHandler = (e) => {
    const slide = e.target.closest(".slider-item");
    if (!slide) return;
    const idx = parseInt(slide.dataset.origIdx, 10);
    const sw = wrap._swiper;
    if (sw && !slide.classList.contains("swiper-slide-active")) {
      if (sw.params.loop) sw.slideToLoop(idx); else sw.slideTo(idx);
      return;
    }
    if (onItemClick) onItemClick(idx);
  };
  slider.addEventListener("click", slider._clickHandler);

  loadSwiperLib().then(() => {
    // ربما أُعيد الرسم أثناء التحميل
    if (wrap._sliderToken !== token || !slider.isConnected) return;

    wrap.classList.add("swiper");
    slider.classList.remove("slider-track");
    slider.classList.add("swiper-wrapper");
    items.forEach((item) => item.classList.add("swiper-slide"));

    const useLoop = total >= 3;

    const swiper = new Swiper(wrap, {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      loop: useLoop,
      loopAdditionalSlides: 2,
      initialSlide: Math.min(1, total - 1),
      speed: 500,
      resistanceRatio: 0.6,
      coverflowEffect: {
        rotate: 15,        // ميل خفيف فقط (المهم هو تغيير الحجم)
        stretch: "55%",    // موجب = تقريب الصور الجانبية لتلتصق وتختبئ خلف الصورة المتوسطة
        depth: 120,        // ابتعاد الصور الجانبية للخلف
        scale: 0.82,       // حجم الصور الجانبية = 82% من حجم الصورة المعروضة
        modifier: 1,
        slideShadows: true
      }
    });
    wrap._swiper = swiper;

    // النقاط
    const dots = wrap.querySelectorAll(".slider-dots .dot");
    function syncDots() {
      dots.forEach((dot, i) => dot.classList.toggle("active", i === swiper.realIndex));
    }
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        if (useLoop) swiper.slideToLoop(i); else swiper.slideTo(i);
      });
    });
    swiper.on("slideChange", syncDots);
    syncDots();
  }).catch((err) => {
    console.warn("تعذر تحميل Swiper، سيتم عرض شريط بسيط:", err);
    slider.classList.add("slider-fallback-track");
  });
}

// ============================================================
// قسم "عروض وخصومات": كاروسيل Coverflow لأيقونات كل الأقسام،
// نفس تأثير الصور المميزة — الضغط على الصورة المتوسطة يفتح القسم
// ============================================================
function renderOffersSlider() {
  const slider = document.getElementById("offersSlider");
  if (!slider) return;
  const wrap = slider.parentElement;
  destroySlider(wrap);

  if (!wrap.classList.contains("slider-wrap")) {
    wrap.classList.add("slider-wrap");
  }

  slider.innerHTML = "";

  const cats = (STORE_DATA.categories || []).filter(c => c.visible !== false);

  if (cats.length === 0) {
    slider.innerHTML = '<p class="empty-note">لا توجد أقسام حالياً</p>';
    return;
  }

  cats.forEach(cat => {
    const img = cat.homeImg || (cat.products && cat.products[0] && cat.products[0].images[0]) || "";
    const hasOffer = (cat.products || []).some(p => (p.sizes || []).some(s => isOfferActive(s)));

    const item = document.createElement("div");
    item.className = "slider-item offer-slide";
    item.innerHTML = `
      ${img ? `<img src="${img}" alt="${cat.name_ar}" loading="lazy">` : ""}
      <span class="cat-card-shade"></span>
      ${hasOffer ? '<span class="offer-badge">عرض خاص</span>' : ""}
      <span class="cat-card-text">
        <span class="cat-card-ar">${cat.icon || ""} ${cat.name_ar}</span>
        <span class="cat-card-en">${cat.name_en || ""}</span>
      </span>
    `;
    slider.appendChild(item);
  });

  addDots(wrap, cats.length);
  initCenterSlider(wrap, slider, cats.length, (idx) => openCategory(cats[idx].id));
}

// هل مقاس معين عليه عرض فعّال (سعر عرض أقل من السعر الأصلي)؟
function isOfferActive(size) {
  const price = Number(size.price) || 0;
  const offer = Number(size.offerPrice) || 0;
  return offer > 0 && offer < price;
}

// ============================================================
// فتح قسم
// ============================================================
function openCategory(catId) {
  const cat = STORE_DATA.categories.find(c => c.id === catId);
  if (!cat) return;
  
  currentCategory = catId;
  const si = document.getElementById("searchInput");
  if (si) si.value = "";
  
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
    list.innerHTML = '<p class="empty-note">لا توجد منتجات مطابقة حالياً</p>';
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
  const cardHasOffer = (prod.sizes || []).some(s => isOfferActive(s));

  const sizesHtml = (prod.sizes || []).map(s => {
    const onOffer = isOfferActive(s);
    const finalPrice = onOffer ? Number(s.offerPrice) : Number(s.price) || 0;
    return `
    <button class="pc-size-btn${onOffer ? " has-offer" : ""}" data-size="${s.label}" data-price="${finalPrice}">
      <span class="pc-size-label">${s.label}</span>
      <span class="pc-size-price">
        ${onOffer ? `<s class="pc-old-price">${s.price} ج.م</s> <b class="pc-offer-price">${finalPrice} ج.م</b>` : `${finalPrice} ج.م`}
      </span>
    </button>
  `;
  }).join("");
  
  card.innerHTML = `
    <div class="pc-img-box">
      ${img ? `<img class="pc-img" src="${img}" alt="${prod.name_ar}" loading="lazy" onerror="this.style.opacity=0.3">` : '<div class="pc-img" style="background:#1c1c1e;display:flex;align-items:center;justify-content:center;font-size:3rem;">👕</div>'}
    </div>
    ${cardHasOffer ? '<span class="offer-badge card-offer-badge">عرض خاص</span>' : ""}
    <h3 class="pc-name">${prod.name_ar}</h3>
    ${prod.desc_ar ? `<p class="pc-desc">${prod.desc_ar}</p>` : '<p class="pc-desc"></p>'}
    <div class="pc-selected-info hidden" id="selInfo_${prod.id}">
      <span>المقاس المختار:</span>
      <span id="selText_${prod.id}"></span>
    </div>
    <div class="pc-sizes">
      ${sizesHtml || '<p class="empty-note" style="grid-column:1/-1;">لا توجد مقاسات</p>'}
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
// البحث في المنتجات
// ============================================================
function runSearch(raw) {
  const q = (raw || "").trim().toLowerCase();
  if (!q) {
    if (currentCategory === "__search") showHome();
    return;
  }

  const results = [];
  (STORE_DATA.categories || []).filter(c => c.visible !== false).forEach(cat => {
    (cat.products || []).forEach(p => {
      const hay = [p.name_ar, p.name_en, p.desc_ar, p.desc_en].join(" ").toLowerCase();
      if (hay.includes(q)) results.push(p);
    });
  });

  currentCategory = "__search";
  if (viewHome) viewHome.classList.add("hidden");
  if (viewCategory) viewCategory.classList.remove("hidden");

  const titleEl = document.getElementById("categoryTitle");
  if (titleEl) titleEl.textContent = `نتائج البحث (${results.length})`;

  renderProducts({ products: results });
}

const searchInput = document.getElementById("searchInput");
if (searchInput) {
  let searchTimer;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => runSearch(searchInput.value), 250);
  });
}

// زر "تسوق الآن" ينزل لقسم الأقسام
const heroCta = document.getElementById("heroCta");
if (heroCta) {
  heroCta.addEventListener("click", () => {
    const target = document.getElementById("catsSection");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// اللوجو قابل للضغط بالكيبورد
if (brandHome) {
  brandHome.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showHome(); }
  });
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
renderOffersSlider();
renderCart();
