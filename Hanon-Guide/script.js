// ============================================================
// FASHION GUIDE - Main Script
// ============================================================

let STORE_DATA = loadStoreData();
let LANG = "ar";
let cart = [];
let cartLineId = 0;
let currentCategory = null;
let currentProduct = null;
let currentImageIndex = 0;

// ============================================================
// تحميل البيانات
// ============================================================
function loadStoreData() {
  const saved = localStorage.getItem("fashionStoreData");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn("فشل تحميل البيانات:", e);
    }
  }
  return {
    config: {
      brand_ar: "FASHION GUIDE",
      brand_en: "FASHION GUIDE",
      tagline_ar: "أناقة بلا حدود",
      tagline_en: "Fashion Without Limits",
      about_ar: "نقدر اهتمامك بمظهرك ونسعى بإجتهاد أن نقدم لك كل ما هو جديد ومتميز.",
      about_en: "We appreciate your attention to your appearance.",
      whatsappNumber: "",
      phones: [],
      address_ar: "Online Fashion Store",
      address_en: "Online Fashion Store",
      mapUrl: "",
      rights_ar: "جميع الحقوق محفوظة لـ FASHION GUIDE"
    },
    categories: []
  };
}

// ============================================================
// استقبال إشارة تحميل البيانات
// ============================================================
window.addEventListener('storeDataReady', () => {
  console.log("🔔 إشارة storeDataReady وصلت");
  STORE_DATA = loadStoreData();
  renderCategories();
  if (currentCategory) {
    const cat = STORE_DATA.categories.find(c => c.id === currentCategory);
    if (cat) {
      const titleEl = document.getElementById("categoryTitle");
      if (titleEl) titleEl.textContent = LANG === "ar" ? cat.name_ar : cat.name_en;
      renderProducts(currentCategory);
    }
  }
  if (currentProduct && currentCategory) {
    renderProductDetail();
  }
});

// ============================================================
// تبديل اللغة
// ============================================================
function applyLang() {
  document.documentElement.lang = LANG;
  document.documentElement.dir = LANG === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-ar]").forEach(el => {
    el.textContent = LANG === "ar" ? el.dataset.ar : el.dataset.en;
  });
  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.textContent = LANG === "ar" ? "EN" : "AR";
  renderCategories();
  if (currentCategory) renderProducts(currentCategory);
  if (currentProduct) renderProductDetail();
}

const langBtnEl = document.getElementById("langBtn");
if (langBtnEl) {
  langBtnEl.addEventListener("click", () => {
    LANG = LANG === "ar" ? "en" : "ar";
    applyLang();
  });
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

document.getElementById("menuBtn").addEventListener("click", openSide);
document.getElementById("closeMenu").addEventListener("click", closeSide);
sideOverlay.addEventListener("click", () => {
  closeSide();
  closeCartDrawer();
});

document.querySelectorAll(".side-link").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const nav = link.dataset.nav;
    document.getElementById("aboutBox").classList.add("hidden");
    document.getElementById("contactBox").classList.add("hidden");
    if (nav === "about") {
      document.getElementById("aboutBox").classList.remove("hidden");
      fillAbout();
    }
    if (nav === "contact") {
      document.getElementById("contactBox").classList.remove("hidden");
      fillContact();
    }
    if (nav === "home") {
      closeSide();
      showHome();
    }
  });
});

document.getElementById("brandHome").addEventListener("click", showHome);

// ============================================================
// "عنا" و "تواصل"
// ============================================================
function fillAbout() {
  const cfg = STORE_DATA.config;
  const aboutBox = document.getElementById("aboutBox");
  const p = aboutBox.querySelector("p:not(.side-title):not(.side-motto)");
  if (p) p.textContent = LANG === "ar" ? cfg.about_ar : cfg.about_en;
}

function fillContact() {
  const cfg = STORE_DATA.config;
  const addressEl = document.getElementById("contactAddress");
  if (addressEl) addressEl.textContent = LANG === "ar" ? cfg.address_ar : cfg.address_en;
  
  const phonesEl = document.getElementById("contactPhones");
  if (phonesEl) {
    if (cfg.phones && cfg.phones.length) {
      phonesEl.innerHTML = "📱 " + cfg.phones.map(p => `<a href="tel:${p}" style="color:#fff">${p}</a>`).join(" | ");
    } else {
      phonesEl.textContent = "";
    }
  }
  
  const waEl = document.getElementById("contactWhatsapp");
  if (waEl) {
    if (cfg.whatsappNumber) {
      waEl.href = "https://wa.me/" + cfg.whatsappNumber;
      waEl.classList.remove("hidden");
    } else {
      waEl.classList.add("hidden");
    }
  }
  
  const mapEl = document.getElementById("contactMap");
  if (mapEl) {
    if (cfg.mapUrl) {
      mapEl.href = cfg.mapUrl;
      mapEl.classList.remove("hidden");
    } else {
      mapEl.classList.add("hidden");
    }
  }
}

// ============================================================
// التنقل بين الصفحات
// ============================================================
const viewHome = document.getElementById("view-home");
const viewCategory = document.getElementById("view-category");
const viewProduct = document.getElementById("view-product");

function showHome() {
  viewCategory.classList.add("hidden");
  viewProduct.classList.add("hidden");
  viewHome.classList.remove("hidden");
  currentCategory = null;
  currentProduct = null;
  window.scrollTo(0, 0);
}

// ============================================================
// عرض الأقسام
// ============================================================
function renderCategories() {
  const grid = document.getElementById("categoriesGrid");
  if (!grid) return;
  grid.innerHTML = "";
  
  const visibleCats = STORE_DATA.categories.filter(c => c.visible !== false);
  
  if (visibleCats.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;color:#5D6B85;font-weight:700;">لا توجد أقسام حالياً</p>';
    return;
  }
  
  visibleCats.forEach(cat => {
    const card = document.createElement("button");
    card.className = "category-card";
    
    const img = cat.homeImg || (cat.products[0] && cat.products[0].images[0]) || "";
    const imgHtml = img ? `<img src="${img}" alt="${cat.name_ar}" onerror="this.style.opacity=0.3">` : "";
    
    card.innerHTML = `
      ${imgHtml}
      <div class="cat-info">
        <span class="cat-icon">${cat.icon || "👕"}</span>
        <span class="cat-name">${LANG === "ar" ? cat.name_ar : cat.name_en}</span>
      </div>
    `;
    card.addEventListener("click", () => openCategory(cat.id));
    grid.appendChild(card);
  });
}

// ============================================================
// عرض منتجات قسم
// ============================================================
function openCategory(catId) {
  const cat = STORE_DATA.categories.find(c => c.id === catId);
  if (!cat) return;
  currentCategory = catId;
  
  viewHome.classList.add("hidden");
  viewProduct.classList.add("hidden");
  viewCategory.classList.remove("hidden");
  window.scrollTo(0, 0);
  
  const titleEl = document.getElementById("categoryTitle");
  if (titleEl) titleEl.textContent = LANG === "ar" ? cat.name_ar : cat.name_en;
  renderProducts(catId);
}

function renderProducts(catId) {
  const cat = STORE_DATA.categories.find(c => c.id === catId);
  if (!cat) return;
  
  const list = document.getElementById("productsList");
  list.innerHTML = "";
  
  if (!cat.products || cat.products.length === 0) {
    list.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;color:#5D6B85;font-weight:700;">لا توجد منتجات في هذا القسم حالياً</p>';
    return;
  }
  
  cat.products.forEach(prod => {
    const card = document.createElement("button");
    card.className = "product-card";
    
    const img = prod.images && prod.images[0] ? prod.images[0] : "";
    const imgHtml = img ? `<img class="prod-img" src="${img}" alt="${prod.name_ar}" onerror="this.style.opacity=0.3">` : '<div class="prod-img" style="display:flex;align-items:center;justify-content:center;font-size:2rem;">👕</div>';
    
    // شارة عدد الصور (لو أكتر من صورة)
    const imagesCount = prod.images ? prod.images.length : 0;
    const badgeHtml = imagesCount > 1 ? `<span class="img-badge">📷 ${imagesCount}</span>` : "";
    
    card.innerHTML = `
      ${imgHtml}
      ${badgeHtml}
      <div class="prod-info">
        <span class="prod-name">${LANG === "ar" ? prod.name_ar : prod.name_en}</span>
        <span class="prod-price">${prod.price} ${LANG === "ar" ? "ج.م" : "EGP"}</span>
      </div>
    `;
    card.addEventListener("click", () => openProduct(prod.id));
    list.appendChild(card);
  });
}

document.getElementById("backBtnCategory").addEventListener("click", showHome);

// ============================================================
// عرض تفاصيل منتج
// ============================================================
function openProduct(prodId) {
  const cat = STORE_DATA.categories.find(c => c.id === currentCategory);
  if (!cat) return;
  const prod = cat.products.find(p => p.id === prodId);
  if (!prod) return;
  
  currentProduct = prodId;
  currentImageIndex = 0;
  
  viewCategory.classList.add("hidden");
  viewHome.classList.add("hidden");
  viewProduct.classList.remove("hidden");
  window.scrollTo(0, 0);
  
  renderProductDetail();
}

function renderProductDetail() {
  const cat = STORE_DATA.categories.find(c => c.id === currentCategory);
  if (!cat) return;
  const prod = cat.products.find(p => p.id === currentProduct);
  if (!prod) return;
  
  const box = document.getElementById("productDetail");
  const name = LANG === "ar" ? prod.name_ar : prod.name_en;
  const desc = LANG === "ar" ? prod.desc_ar : prod.desc_en;
  
  const images = prod.images && prod.images.length ? prod.images : [""];
  const mainImg = images[currentImageIndex] || images[0];
  const imgHtml = mainImg 
    ? `<img class="pd-main-img" src="${mainImg}" alt="${name}" onerror="this.style.opacity=0.3">`
    : '<div class="pd-main-img" style="display:flex;align-items:center;justify-content:center;font-size:4rem;">👕</div>';
  
  const dotsHtml = images.length > 1 
    ? `<div class="pd-dots">${images.map((_, i) => `<button class="pd-dot ${i === currentImageIndex ? 'active' : ''}" data-idx="${i}"></button>`).join("")}</div>`
    : "";
  
  const sizes = prod.sizes || [];
  const priceXXXL = prod.price_xxxl || 0;
  
  const sizesHtml = sizes.map(s => {
    const isXXXL = s === "XXXL" || s === "3XL";
    const extraLabel = isXXXL && priceXXXL ? `<span class="size-price-extra">${priceXXXL} ${LANG === "ar" ? "ج.م" : "EGP"}</span>` : "";
    return `<button class="size-btn" data-size="${s}">
      ${s}
      ${extraLabel}
    </button>`;
  }).join("");
  
  box.innerHTML = `
    <div class="pd-gallery">
      ${imgHtml}
      ${dotsHtml}
    </div>
    <h2 class="pd-name">${name}</h2>
    ${desc ? `<div class="pd-desc">${desc}</div>` : ""}
    <div class="pd-price-box">
      <small>${LANG === "ar" ? "السعر" : "Price"}</small>
      <span id="pdPriceValue">${prod.price}</span> ${LANG === "ar" ? "ج.م" : "EGP"}
    </div>
    ${sizes.length ? `
      <p class="pd-section-title">${LANG === "ar" ? "اختر المقاس:" : "Choose size:"}</p>
      <div class="pd-sizes" id="pdSizes">${sizesHtml}</div>
    ` : ""}
    <button class="pd-add-btn" id="pdAddBtn" ${sizes.length === 0 ? '' : 'disabled'}>
      ${LANG === "ar" ? "🛒 أضف إلى السلة" : "🛒 Add to Cart"}
    </button>
  `;
  
  // تفاعل مع النقاط
  box.querySelectorAll(".pd-dot").forEach(dot => {
    dot.addEventListener("click", () => {
      currentImageIndex = +dot.dataset.idx;
      renderProductDetail();
    });
  });
  
  // 🎯 تفاعل مع السحب (Swipe)
  const gallery = box.querySelector(".pd-gallery");
  if (gallery && images.length > 1) {
    let touchStartX = 0;
    
    gallery.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    gallery.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      const threshold = 50;
      
      if (Math.abs(diff) < threshold) return;
      
      if (diff > 0) {
        currentImageIndex = (currentImageIndex + 1) % images.length;
      } else {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
      }
      renderProductDetail();
    }, { passive: true });
    
    // للكمبيوتر (Mouse Drag)
    let mouseStartX = 0;
    let isDragging = false;
    
    gallery.addEventListener("mousedown", (e) => {
      mouseStartX = e.screenX;
      isDragging = true;
      gallery.style.cursor = "grabbing";
    });
    
    gallery.addEventListener("mouseup", (e) => {
      if (!isDragging) return;
      isDragging = false;
      gallery.style.cursor = "grab";
      const diff = mouseStartX - e.screenX;
      const threshold = 50;
      
      if (Math.abs(diff) < threshold) return;
      
      if (diff > 0) {
        currentImageIndex = (currentImageIndex + 1) % images.length;
      } else {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
      }
      renderProductDetail();
    });
    
    gallery.addEventListener("mouseleave", () => {
      isDragging = false;
      gallery.style.cursor = "grab";
    });
    
    gallery.style.cursor = "grab";
  }

  // تفاعل مع المقاسات
  let selectedSize = sizes.length === 1 ? sizes[0] : null;
  const addBtn = document.getElementById("pdAddBtn");
  const priceValue = document.getElementById("pdPriceValue");
  
  if (sizes.length === 1) {
    const btn = box.querySelector(`.size-btn[data-size="${sizes[0]}"]`);
    if (btn) btn.classList.add("selected");
  }
  
  if (sizes.length === 0) {
    addBtn.disabled = false;
    selectedSize = "";
  }
  
  box.querySelectorAll(".size-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      box.querySelectorAll(".size-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedSize = btn.dataset.size;
      addBtn.disabled = false;
      
      const isXXXL = selectedSize === "XXXL" || selectedSize === "3XL";
      const finalPrice = isXXXL && priceXXXL ? priceXXXL : prod.price;
      if (priceValue) priceValue.textContent = finalPrice;
    });
  });
  
  addBtn.addEventListener("click", () => {
    if (!selectedSize && sizes.length > 0) return;
    const isXXXL = selectedSize === "XXXL" || selectedSize === "3XL";
    const finalPrice = isXXXL && priceXXXL ? priceXXXL : prod.price;
    
    addToCart({
      name: name,
      size: selectedSize || "",
      price: finalPrice,
      image: mainImg,
      qty: 1
    });
  });
}

document.getElementById("backBtnProduct").addEventListener("click", () => {
  if (currentCategory) {
    viewProduct.classList.add("hidden");
    viewCategory.classList.remove("hidden");
    currentProduct = null;
    window.scrollTo(0, 0);
  } else {
    showHome();
  }
});

// ============================================================
// السلة
// ============================================================
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

function openCartDrawer() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("show");
}
function closeCartDrawer() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("show");
}

document.getElementById("cartBtn").addEventListener("click", openCartDrawer);
document.getElementById("closeCart").addEventListener("click", closeCartDrawer);
cartOverlay.addEventListener("click", closeCartDrawer);

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
  box.innerHTML = "";
  
  if (cart.length === 0) {
    box.innerHTML = `<p class="empty-cart">${LANG === "ar" ? "السلة فارغة" : "Your cart is empty"}</p>`;
  }
  
  cart.forEach(line => {
    const row = document.createElement("div");
    row.className = "cart-line";
    row.innerHTML = `
      <div class="cart-line-info">
        <strong>${line.qty} × ${line.name}${line.size ? " (" + line.size + ")" : ""}</strong>
        <span>${line.price * line.qty} ${LANG === "ar" ? "ج.م" : "EGP"}</span>
      </div>
      <button class="remove-line" aria-label="remove">✕</button>
    `;
    row.querySelector(".remove-line").onclick = () => removeFromCart(line.id);
    box.appendChild(row);
  });
  
  document.getElementById("cartCount").textContent = cart.reduce((a, l) => a + l.qty, 0);
  document.getElementById("cartTotal").textContent = cart.reduce((a, l) => a + l.price * l.qty, 0);
}

// ============================================================
// إرسال الطلب عبر واتساب
// ============================================================
document.getElementById("sendOrderBtn").addEventListener("click", () => {
  if (cart.length === 0) return;
  const waNum = STORE_DATA.config.whatsappNumber;
  if (!waNum) {
    alert(LANG === "ar" ? "رقم الواتساب غير مسجل بعد" : "WhatsApp number not set");
    return;
  }
  
  let msg = LANG === "ar" ? "طلب جديد من FASHION GUIDE:%0A%0A" : "New order from FASHION GUIDE:%0A%0A";
  cart.forEach(l => {
    msg += `${l.qty} × ${l.name}${l.size ? " (" + l.size + ")" : ""} - ${l.price * l.qty} ${LANG === "ar" ? "ج.م" : "EGP"}%0A`;
  });
  const total = cart.reduce((a, l) => a + l.price * l.qty, 0);
  msg += "%0A" + (LANG === "ar" ? "الإجمالي: " : "Total: ") + total + (LANG === "ar" ? " ج.م" : " EGP");
  
  window.open(`https://wa.me/${waNum}?text=${msg}`, "_blank");
});

// ============================================================
// Install Prompt (PWA)
// ============================================================
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const lastDismiss = sessionStorage.getItem("installDismissed");
  if (!lastDismiss) {
    document.getElementById("installPrompt").classList.remove("hidden");
  }
});

document.getElementById("installNowBtn").addEventListener("click", async () => {
  document.getElementById("installPrompt").classList.add("hidden");
  if (deferredPrompt) {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  }
});

document.getElementById("installLaterBtn").addEventListener("click", () => {
  document.getElementById("installPrompt").classList.add("hidden");
  sessionStorage.setItem("installDismissed", "1");
});

// ============================================================
// Splash Screen (3.5 ثانية)
// ============================================================
setTimeout(() => {
  const splash = document.getElementById("splashScreen");
  if (splash) {
    splash.classList.add("fade-out");
    setTimeout(() => splash.remove(), 900);
  }
}, 3500);

// ============================================================
// التشغيل
// ============================================================
renderCategories();
renderCart();
applyLang();
