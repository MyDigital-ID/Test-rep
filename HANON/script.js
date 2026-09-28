// ============================================================
// HANON STORE - Main Script v2.0
// ============================================================

let STORE_DATA = loadStoreData();
let cart = [];
let cartLineId = 0;
let currentCategory = null;
let heroIndex = 0;
let heroTimer = null;

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
      tagline_ar: "ستايلك يبدأ من حنون",
      about_ar: "أكثر من مجرد ملابس.",
      whatsappNumber: "",
      facebook: ""
    },
    social: {},
    hero: {},
    features: [],
    offers: [],
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
  renderHero();
  renderFeatures();
  renderCategories();
  renderFeaturedProducts();
  renderOffers();
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
  
  ["facebookLink", "sideFacebook", "footerFacebook"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = fbUrl;
  });
  
  ["whatsappLink", "sideWhatsapp", "footerWhatsapp"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = waUrl;
  });
}

// ============================================================
// تطبيق الإعدادات
// ============================================================
function applyConfig() {
  const cfg = STORE_DATA.config || {};
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

// روابط التنقل
document.querySelectorAll(".side-link, .nav-link").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const nav = link.dataset.nav;
    
    // تفعيل الرابط
    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
    if (link.classList.contains("nav-link")) link.classList.add("active");
    
    if (nav === "home") {
      closeSide();
      showHome();
    }
    if (nav === "products" || nav === "offers") {
      closeSide();
      // هنسكرول للقسم المناسب
      setTimeout(() => {
        const target = document.querySelector(".section:nth-of-type(2)");
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  });
});

const brandHome = document.getElementById("brandHome");
if (brandHome) {
  brandHome.addEventListener("click", (e) => {
    e.preventDefault();
    showHome();
  });
}

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
// Hero Slider
// ============================================================
function renderHero() {
  const slider = document.getElementById("heroSlider");
  if (!slider) return;
  
  const hero = STORE_DATA.hero || {};
  const slides = hero.slides || [
    {
      tag: "NEW COLLECTION",
      title: "ستايلك يبدأ من",
      title2: "حنون",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
      buttonText: "تسوق الآن"
    }
  ];
  
  slider.innerHTML = "";
  
  slides.forEach((slide, i) => {
    const el = document.createElement("div");
    el.className = "hero-slide" + (i === 0 ? " active" : "");
    el.style.backgroundImage = `url('${slide.image || ''}')`;
    el.innerHTML = `
      <div class="hero-slide-text">
        <span class="hero-slide-tag">${slide.tag || ''}</span>
        <h2 class="hero-slide-title">
          ${slide.title || ''}
          <span>${slide.title2 || ''}</span>
        </h2>
        <button class="hero-slide-btn">
          🛒 ${slide.buttonText || 'تسوق الآن'}
        </button>
      </div>
    `;
    
    const btn = el.querySelector(".hero-slide-btn");
    if (btn) {
      btn.addEventListener("click", () => {
        const target = document.querySelector(".section:nth-of-type(2)");
        if (target) target.scrollIntoView({ behavior: "smooth" });
      });
    }
    
    slider.appendChild(el);
  });
  
  // تشغيل السلايدر لو فيه أكتر من صورة
  if (slides.length > 1) {
    startHeroAutoPlay(slides.length);
  }
  
  // أزرار التنقل
  const prevBtn = document.getElementById("heroPrev");
  const nextBtn = document.getElementById("heroNext");
  
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      goHero(heroIndex - 1, slides.length);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      goHero(heroIndex + 1, slides.length);
    });
  }
}

function goHero(idx, total) {
  if (total < 1) return;
  if (idx < 0) idx = total - 1;
  if (idx >= total) idx = 0;
  
  heroIndex = idx;
  
  const slides = document.querySelectorAll(".hero-slide");
  slides.forEach((s, i) => {
    s.classList.toggle("active", i === idx);
  });
}

function startHeroAutoPlay(total) {
  if (heroTimer) clearInterval(heroTimer);
  heroTimer = setInterval(() => {
    goHero(heroIndex + 1, total);
  }, 5000);
}

// ============================================================
// Features
// ============================================================
function renderFeatures() {
  const wrap = document.getElementById("heroFeatures");
  if (!wrap) return;
  
  const features = STORE_DATA.features || [
    { icon: "🚚", title: "شحن مجاني", desc: "لأي مكان في الإسكندرية" },
    { icon: "⭐", title: "جودة عالية", desc: "في كل قطعة" },
    { icon: "💎", title: "أسعار مميزة", desc: "تناسب الجميع" }
  ];
  
  wrap.innerHTML = "";
  
  features.forEach(f => {
    const el = document.createElement("div");
    el.className = "feature-card";
    el.innerHTML = `
      <div class="feature-icon">${f.icon || '✨'}</div>
      <div class="feature-title">${f.title || ''}</div>
      <div class="feature-desc">${f.desc || ''}</div>
    `;
    wrap.appendChild(el);
  });
}

// ============================================================
// Categories Grid
// ============================================================
function renderCategories() {
  const grid = document.getElementById("categoriesGrid");
  if (!grid) return;
  
  grid.innerHTML = "";
  
  const cats = (STORE_DATA.categories || []).filter(c => c.visible !== false);
  
  if (cats.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;color:#999;font-weight:700;">لا توجد أقسام حالياً</p>';
    return;
  }
  
  // نعرض أول 4 أقسام بس في الشبكة
  const displayCats = cats.slice(0, 4);
  
  displayCats.forEach(cat => {
    const card = document.createElement("div");
    card.className = "category-card";
    
    const img = cat.homeImg || (cat.products[0] && cat.products[0].images[0]) || "";
    
    card.innerHTML = `
      ${img ? `<img src="${img}" alt="${cat.name_ar}" loading="lazy" onerror="this.style.opacity=0.3">` : ''}
      <div class="category-card-content">
        <div class="category-card-text">
          <div class="category-card-name">${cat.name_ar}</div>
          <div class="category-card-name-en">${cat.name_en || ''}</div>
        </div>
        <div class="category-card-arrow">‹</div>
      </div>
    `;
    card.addEventListener("click", () => openCategory(cat.id));
    grid.appendChild(card);
  });
}

// ============================================================
// Featured Products (scroll)
// ============================================================
function renderFeaturedProducts() {
  const scroll = document.getElementById("featuredProductsScroll");
  if (!scroll) return;
  
  scroll.innerHTML = "";
  
  // نلمّ أول 10 منتجات من كل الأقسام
  const allProducts = [];
  (STORE_DATA.categories || []).forEach(cat => {
    (cat.products || []).forEach(prod => {
      allProducts.push({ ...prod, categoryId: cat.id });
    });
  });
  
  const featured = allProducts.slice(0, 10);
  
  if (featured.length === 0) {
    scroll.innerHTML = '<p style="padding:20px;color:#999;font-weight:700;">لا توجد منتجات حالياً</p>';
    return;
  }
  
  featured.forEach(prod => {
    const card = document.createElement("div");
    card.className = "product-item";
    
    const img = prod.images && prod.images[0] ? prod.images[0] : "";
    const minPrice = prod.sizes && prod.sizes.length > 0
      ? Math.min(...prod.sizes.map(s => Number(s.price) || 0).filter(p => p > 0))
      : 0;
    
    card.innerHTML = `
      <img class="product-item-img" src="${img}" alt="${prod.name_ar}" loading="lazy" onerror="this.style.opacity=0.3">
      <div class="product-item-info">
        <div class="product-item-name">${prod.name_ar}</div>
        <div class="product-item-price">${minPrice} <small>ج.م</small></div>
      </div>
      <button class="product-item-btn">🛒 أضف للسلة</button>
    `;
    
    // الضغط على الصورة → يفتح القسم
    card.querySelector(".product-item-img").addEventListener("click", () => {
      openCategory(prod.categoryId);
    });
    
    card.querySelector(".product-item-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      openCategory(prod.categoryId);
    });
    
    scroll.appendChild(card);
  });
  
  // أزرار التنقل
  const prevBtn = document.getElementById("prodPrev");
  const nextBtn = document.getElementById("prodNext");
  
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      scroll.scrollBy({ left: 250, behavior: "smooth" });
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      scroll.scrollBy({ left: -250, behavior: "smooth" });
    });
  }
}

// ============================================================
// Offers
// ============================================================
function renderOffers() {
  const grid = document.getElementById("offersGrid");
  if (!grid) return;
  
  const offers = STORE_DATA.offers || [
    {
      tag: "عرض خاص",
      title: "3 تيشيرتات بـ 599 ج.م",
      subtitle: "شحن مجاني لأي مكان في الإسكندرية",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
    },
    {
      tag: "🔥 عرض التوفير",
      title: "3 قطع بـ 599 ج.م",
      subtitle: "استفد من العرض قبل نهايته",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
    },
    {
      tag: "🚚 توصيل",
      title: "شحن مجاني",
      subtitle: "لأي مكان في الإسكندرية",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
    }
  ];
  
  grid.innerHTML = "";
  
  offers.forEach(offer => {
    const card = document.createElement("div");
    card.className = "offer-card";
    card.style.backgroundImage = `url('${offer.image || ''}')`;
    
    card.innerHTML = `
      <div class="offer-card-content">
        <span class="offer-card-tag">${offer.tag || ''}</span>
        <h3 class="offer-card-title">${offer.title || ''}</h3>
        <p class="offer-card-subtitle">${offer.subtitle || ''}</p>
      </div>
    `;
    
    card.addEventListener("click", () => {
      const target = document.querySelector(".section:nth-of-type(2)");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
    
    grid.appendChild(card);
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
    list.innerHTML = '<p style="text-align:center;padding:40px;color:#999;font-weight:700;grid-column:1/-1;">لا توجد منتجات في هذا القسم حالياً</p>';
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
      ${img ? `<img class="pc-img" src="${img}" alt="${prod.name_ar}" loading="lazy" onerror="this.style.opacity=0.3">` : '<div class="pc-img" style="display:flex;align-items:center;justify-content:center;font-size:3rem;">👕</div>'}
    </div>
    <h3 class="pc-name">${prod.name_ar}</h3>
    ${prod.desc_ar ? `<p class="pc-desc">${prod.desc_ar}</p>` : '<p class="pc-desc"></p>'}
    <div class="pc-selected-info hidden">
      <span>المقاس المختار:</span>
      <span class="sel-text"></span>
    </div>
    <div class="pc-sizes">
      ${sizesHtml || '<p style="grid-column:1/-1;text-align:center;color:#999;font-size:0.85rem;">لا توجد مقاسات</p>'}
    </div>
    <button class="pc-add-btn" disabled>
      🛒 أضف إلى السلة
    </button>
  `;
  
  const sizeBtns = card.querySelectorAll(".pc-size-btn");
  const addBtn = card.querySelector(".pc-add-btn");
  const selInfo = card.querySelector(".pc-selected-info");
  const selText = card.querySelector(".sel-text");
  
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
// Splash Screen (3.5 ثانية — بيخلي الصفحة تجهز)
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
renderHero();
renderFeatures();
renderCategories();
renderFeaturedProducts();
renderOffers();
renderCart();