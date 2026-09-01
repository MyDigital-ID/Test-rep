/* =========================================================
   جزارة الراعي | ALRAAY BUTCHERY - script.js
   ========================================================= */

const WHATSAPP_NUMBER = "201095786333";

let currentLang = "ar"; // 'ar' | 'en'

/* ---------------------------------------------------------
   DATA: zones + products
   type: "simple"  -> qty only
   type: "variant" -> grouped fixed-price options (e.g. Hawawshi sizes)
   type: "weight"  -> price per kg, weight select (0.5/1) + packaging note
--------------------------------------------------------- */
const ZONES = [
  {
    id: "hawawshi",
    icon: "🥙",
    name_ar: "ركن الحواوشي",
    name_en: "Hawawshi Zone",
    header: "assets/images/Hawashi-zone.jpg",
    type: "variant",
    groups: [
      { name_ar: "حواوشي لحمة", name_en: "Meat Hawawshi", prices: [140, 160, 180] },
      { name_ar: "حواوشي سجق", name_en: "Sogok Hawawshi", prices: [140, 160, 180] },
      { name_ar: "حواوشي بسطرمة", name_en: "Pastrami Hawawshi", prices: [160, 180, 200] },
      { name_ar: "حواوشي ميكس", name_en: "Mix Hawawshi", prices: [160, 180, 200] },
      { name_ar: "حواوشي جبنة", name_en: "Cheese Hawawshi", prices: [140, 160, 180] }
    ],
    extraSimple: [
      { name_ar: "كيلو حواوشي لحمة مخصوص", name_en: "Special Meat Hawawshi (1kg)", price: 660 },
      { name_ar: "كيلو حواوشي سجق مخصوص", name_en: "Special Sogok Hawawshi (1kg)", price: 600 },
      { name_ar: "كيلو حواوشي سكنتين", name_en: "Double Blade Hawawshi (1kg)", price: 720 },
      { name_ar: "عرض ملوك الحواوشي (٤ قطع: لحمة وسجق) - بدلاً من ٥٦٠ جنيه", name_en: "Hawawshi Kings Offer (4 pcs: meat & sogok) - instead of 560 EGP", price: 440 }
    ]
  },
  {
    id: "grills",
    icon: "🍢",
    name_ar: "ركن المشويات",
    name_en: "Grills Zone",
    header: "assets/images/Griled-zone.jpg",
    type: "simple",
    items: [
      { name_ar: "كيلو شيش طاووق", name_en: "Shish Taouk (1kg)", price: 600, img: "assets/images/Shishtawwq.jpg" },
      { name_ar: "كيلو ريش", name_en: "Grilled Ribs (1kg)", price: 700, img: "assets/images/Reiash-griled.jpg" },
      { name_ar: "كيلو كفتة", name_en: "Grilled Kofta (1kg)", price: 480, img: "assets/images/Kofta-griled.png" },
      { name_ar: "كيلو مشكل", name_en: "Mix Grill (1kg)", price: 600, img: "assets/images/Mixgriled.png" },
      { name_ar: "كيلو لحمة مشوية", name_en: "Grilled Meat (1kg)", price: 650, img: "" },
      { name_ar: "كيلو فيلتو", name_en: "Grilled Filet (1kg)", price: 700, img: "" },
      { name_ar: "كيلو طرب", name_en: "Grilled Tarb (1kg)", price: 650, img: "assets/images/Tarb-griled.png" },
      { name_ar: "كيلو كبدة", name_en: "Grilled Liver (1kg)", price: 700, img: "" },
      { name_ar: "كيلو برجر", name_en: "Grilled Burger (1kg)", price: 500, img: "" },
      { name_ar: "كيلو سجق مشوي", name_en: "Grilled Sogok (1kg)", price: 500, img: "assets/images/Sogaq-griled.png" }
    ]
  },
  {
    id: "chicken",
    icon: "🍗",
    name_ar: "ركن الدجاج المشوي",
    name_en: "Grilled Chicken Zone",
    header: "assets/images/chicken-header.jpg",
    type: "simple",
    items: [
      { name_ar: "فرخة تركي", name_en: "Turkish Chicken", price: 350, img: "assets/images/Turkish-chicken.png" },
      { name_ar: "فرخة مشوية على الفحم", name_en: "Charcoal Grilled Chicken", price: 350, img: "assets/images/Chicken-griled.jpg" }
    ]
  },
  {
    id: "sandwiches",
    icon: "🥪",
    name_ar: "ركن السندويتشات",
    name_en: "Sandwiches Zone",
    header: "assets/images/sandwiches-zone.jpg",
    type: "simple",
    items: [
      { name_ar: "سندويتش لحمة", name_en: "Meat Sandwich", price: 110 },
      { name_ar: "سندويتش كفتة", name_en: "Kofta Sandwich", price: 60 },
      { name_ar: "سندويتش طرب", name_en: "Tarb Sandwich", price: 100 },
      { name_ar: "سندويتش كبدة", name_en: "Liver Sandwich", price: 115 },
      { name_ar: "سندويتش سجق / برجر", name_en: "Sogok / Burger Sandwich", price: 90 }
    ]
  },
  {
    id: "twagen",
    icon: "🍲",
    name_ar: "ركن الطواجن",
    name_en: "Casseroles Zone",
    header: "assets/images/Twagen-zone.jpg",
    type: "simple",
    items: [
      { name_ar: "ورقة لحمة", name_en: "Meat Foil Sheet", price: 650 },
      { name_ar: "بورمة لحمة", name_en: "Meat Borma Casserole", price: 650 },
      { name_ar: "طاجن عصاعيص", name_en: "Oxtail Casserole", price: 600 },
      { name_ar: "برام أرز", name_en: "Rice Casserole", price: 250 }
    ]
  },
  {
    id: "freshmeat",
    icon: "🥩",
    name_ar: "ركن اللحوم الطازجة",
    name_en: "Fresh Meat Zone",
    header: "assets/images/Meat-zone.jpg",
    type: "weight",
    weights: [1, 0.75, 0.5],
    items: [
      { name_ar: "لحم مفروم", name_en: "Minced Meat", price: 480 },
      { name_ar: "لحم مكعبات", name_en: "Beef Cubes", price: 500 },
      { name_ar: "انتركوت", name_en: "Entrecôte / Ribeye", price: 520 },
      { name_ar: "بفتيك", name_en: "Beef Escalope", price: 500 },
      { name_ar: "روستو", name_en: "Beef Roast", price: 500 },
      { name_ar: "فيلتو", name_en: "Tenderloin Filet", price: 680 },
      { name_ar: "كبدة", name_en: "Fresh Liver", price: 580 },
      { name_ar: "قلوب", name_en: "Hearts", price: 480 },
      { name_ar: "كلاوي", name_en: "Kidneys", price: 480 },
      { name_ar: "مزاليكيا", name_en: "Mazaleekya", price: 480 },
      { name_ar: "عصاعيص", name_en: "Oxtail", price: 500 }
    ]
  },
  {
    id: "preparedmeat",
    icon: "🍖",
    name_ar: "ركن اللحوم المجهزة",
    name_en: "Prepared Meats Zone",
    header: "assets/images/preparedmeat-header.jpg",
    type: "weight",
    weights: [1, 0.75, 0.5],
    items: [
      { name_ar: "سجق مخصوص", name_en: "Special Seasoned Sogok", price: 400 },
      { name_ar: "سجق عادي", name_en: "Regular Sogok", price: 380 },
      { name_ar: "برجر مجهز", name_en: "Prepared Burger Patty", price: 400 },
      { name_ar: "كفتة متبلة", name_en: "Marinated Kofta", price: 480 }
    ]
  },
  {
    id: "offers",
    icon: "⭐",
    name_ar: "عروضنا",
    name_en: "Our Offers",
    header: "",
    type: "gallery",
    items: [
      { name_ar: "كفتة مشوية", name_en: "Grilled Kofta", img: "assets/images/Kofta-griled.png" },
      { name_ar: "سجق مشوي", name_en: "Grilled Sogok", img: "assets/images/Sogaq-griled.png" },
      { name_ar: "شيش طاووق", name_en: "Shish Taouk", img: "assets/images/Shishtaowq-dish.png" },
      { name_ar: "فرخة تركي", name_en: "Turkish Chicken", img: "assets/images/Turkish-chicken.png" },
      { name_ar: "فرخة مشوية على الفحم", name_en: "Charcoal Grilled Chicken", img: "assets/images/Chicken-griled.jpg" },
      { name_ar: "مشكل الراعي", name_en: "Alraay Mix Grill", img: "assets/images/meshakel-alraai.jpg" },
      { name_ar: "عرض ملوك الحواوشي", name_en: "Hawawshi Kings Offer", img: "assets/images/melok-elhawawshi.png" },
      { name_ar: "ريش مشوية", name_en: "Grilled Ribs", img: "assets/images/Reiash-griled.jpg" },
      { name_ar: "الطرب المشوي", name_en: "Grilled Tarb", img: "assets/images/Tarb-griled.png" },
      { name_ar: "اللحوم المجهزة", name_en: "Prepared Meats", img: "assets/images/Lehoom-mogahza-zone.jpg" },
      { name_ar: "إسأل عن عروض العزومات", name_en: "Ask About Our Party Offers", img: "assets/images/Arood-elazooma.jpg" },
      { name_ar: "برجر مشوي", name_en: "Grilled Burger", img: "assets/images/Burger-griled.jpg" }
    ]
  }
];

/* ---------------------------------------------------------
   CART
--------------------------------------------------------- */
let cart = []; // {id, name, price, qty}

function addToCart(id, name, unitPrice, qty) {
  if (qty <= 0) return;
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty = qty;
    existing.price = unitPrice;
  } else {
    cart.push({ id, name, price: unitPrice, qty });
  }
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  renderCart();
}

function cartTotal() {
  return cart.reduce((sum, c) => sum + c.price * c.qty, 0);
}

function renderCart() {
  const list = document.getElementById("cartList");
  list.innerHTML = "";
  if (cart.length === 0) {
    const empty = document.createElement("p");
    empty.className = "cart-empty";
    empty.id = "cartEmptyMsg";
    empty.textContent = t("السلة فارغة", "Your cart is empty");
    list.appendChild(empty);
  } else {
    cart.forEach(item => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <span>${item.name} × ${item.qty} — ${item.price * item.qty} ${t("جنيه","EGP")}</span>
        <button class="remove-btn" aria-label="remove">🗑</button>
      `;
      row.querySelector(".remove-btn").onclick = () => removeFromCart(item.id);
      list.appendChild(row);
    });
  }
  document.getElementById("cartGrandTotal").textContent = cartTotal();
  const bottomCount = document.getElementById("bottomCartCount");
  if (bottomCount) bottomCount.textContent = cart.reduce((s, c) => s + c.qty, 0);
}

function buildWhatsAppMessage() {
  let lines = [t("طلب جديد من جزارة الراعي:", "New order from Alraay Butchery:")];
  cart.forEach(item => {
    lines.push(`- ${item.name} × ${item.qty} = ${item.price * item.qty} ${t("جنيه","EGP")}`);
  });
  lines.push(`${t("الإجمالي","Total")}: ${cartTotal()} ${t("جنيه","EGP")}`);
  return encodeURIComponent(lines.join("\n"));
}

document.getElementById("whatsappConfirm").addEventListener("click", () => {
  if (cart.length === 0) return;
  const msg = buildWhatsAppMessage();
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
});

/* ---------------------------------------------------------
   TRANSLATION HELPER
--------------------------------------------------------- */
function t(ar, en) {
  return currentLang === "ar" ? ar : en;
}

function applyStaticTranslations() {
  document.querySelectorAll("[data-ar]").forEach(el => {
    const val = el.getAttribute(currentLang === "ar" ? "data-ar" : "data-en");
    if (val !== null) el.textContent = val;
  });
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
}

document.getElementById("langBtn").addEventListener("click", () => {
  currentLang = currentLang === "ar" ? "en" : "ar";
  document.getElementById("langBtn").textContent = currentLang === "ar" ? "English" : "عربي";
  applyStaticTranslations();
  renderZoneGrid();
  renderCart();
  if (currentZone) openZone(currentZone, true);
});

/* ---------------------------------------------------------
   HOME GRID
--------------------------------------------------------- */
function renderZoneGrid() {
  const grid = document.getElementById("zoneGrid");
  grid.innerHTML = "";
  ZONES.forEach(zone => {
    const card = document.createElement("button");
    card.className = "zone-card";
    card.innerHTML = `<span class="zone-label">${t(zone.name_ar, zone.name_en)}</span>`;
    card.onclick = () => navigateToZone(zone.id);
    grid.appendChild(card);
  });
}

/* ---------------------------------------------------------
   ZONE / PRODUCTS PAGE
--------------------------------------------------------- */
let currentZone = null;

/* Some mobile browsers keep "coasting" (momentum scroll) or reflow the
   page as images load, which can silently override a single scrollTo(0,0)
   right after navigating — especially on tall pages like "عروضنا" or when
   the tapped card was near the bottom of a scrolled page. Re-assert the
   top position for a short window to guarantee it sticks. */
function forceScrollTop() {
  const start = Date.now();
  function step() {
    window.scrollTo(0, 0);
    if (Date.now() - start < 400) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function openZone(zoneId, silent) {
  const zone = ZONES.find(z => z.id === zoneId);
  if (!zone) return;
  currentZone = zoneId;

  const headerImgEl = document.getElementById("zoneHeaderImg");
  if (zone.header) {
    headerImgEl.src = zone.header;
    headerImgEl.alt = t(zone.name_ar, zone.name_en);
    headerImgEl.style.display = "";
  } else {
    headerImgEl.style.display = "none";
  }
  document.getElementById("zoneTitle").textContent = t(zone.name_ar, zone.name_en);

  const container = document.getElementById("zoneItems");
  container.innerHTML = "";

  if (zone.type === "simple") {
    zone.items.forEach((item, idx) => renderSimpleItem(container, `${zone.id}-${idx}`, item));
  }

  if (zone.type === "variant") {
    zone.groups.forEach((group, gi) => {
      const wrap = document.createElement("div");
      wrap.className = "item-group";
      const h = document.createElement("h4");
      h.textContent = t(group.name_ar, group.name_en);
      wrap.appendChild(h);
      group.prices.forEach((price, pi) => {
        const label_ar = `رغيف ${group.name_ar} — ${price} جنيه`;
        const label_en = `${group.name_en} Loaf — ${price} EGP`;
        renderSimpleItem(wrap, `${zone.id}-${gi}-${pi}`, { name_ar: label_ar, name_en: label_en, price });
      });
      container.appendChild(wrap);
    });
    if (zone.extraSimple) {
      const wrap = document.createElement("div");
      wrap.className = "item-group";
      const h = document.createElement("h4");
      h.textContent = t("أصناف مخصوصة بالكيلو", "Special Kg Items");
      wrap.appendChild(h);
      zone.extraSimple.forEach((item, idx) => renderSimpleItem(wrap, `${zone.id}-extra-${idx}`, item));
      container.appendChild(wrap);
    }
  }

  if (zone.type === "weight") {
    zone.items.forEach((item, idx) => renderWeightItem(container, `${zone.id}-${idx}`, item, zone.weights));
  }

  if (zone.type === "gallery") {
    container.classList.add("gallery-container");
    zone.items.forEach(item => renderGalleryItem(container, item));
  } else {
    container.classList.remove("gallery-container");
  }

  if (!silent) {
    document.getElementById("homePage").classList.remove("active");
    document.getElementById("zonePage").classList.add("active");
    forceScrollTop();
  }
}

/* Navigate to a zone from a user click: switch the view AND record a
   history entry, so the device/browser back button returns to the
   home page instead of leaving the site entirely. */
function navigateToZone(zoneId) {
  openZone(zoneId);
  history.pushState({ zone: zoneId }, "", "#" + zoneId);
  setActiveNav(zoneId === "offers" ? "navOffers" : null);
}

function goHome() {
  currentZone = null;
  document.getElementById("zonePage").classList.remove("active");
  document.getElementById("homePage").classList.add("active");
  forceScrollTop();
  setActiveNav("navHome");
}

document.getElementById("homeBtn").addEventListener("click", () => {
  goHome();
  history.pushState({ zone: null }, "", location.pathname);
});

/* Back/forward button support: respond to real browser navigation
   instead of only to our own buttons. */
window.addEventListener("popstate", (event) => {
  const zoneId = event.state && event.state.zone;
  if (zoneId) {
    openZone(zoneId, true);
    document.getElementById("homePage").classList.remove("active");
    document.getElementById("zonePage").classList.add("active");
    forceScrollTop();
    setActiveNav(zoneId === "offers" ? "navOffers" : null);
  } else {
    document.getElementById("zonePage").classList.remove("active");
    document.getElementById("homePage").classList.add("active");
    currentZone = null;
    forceScrollTop();
    setActiveNav("navHome");
  }
});

// Establish a baseline "home" history entry so the very first back-press
// has something predictable to land on instead of exiting the page.
history.replaceState({ zone: null }, "", location.pathname);

/* simple qty item: id, {name_ar,name_en,price,img} */
function renderSimpleItem(container, id, item) {
  let qty = 0;
  const row = document.createElement("div");
  row.className = "item-row";
  row.innerHTML = `
    <span class="item-name">${t(item.name_ar, item.name_en)}</span>
    <span class="item-price">${item.price} ${t("جنيه","EGP")}</span>
    <div class="qty-control">
      <button class="minus">−</button>
      <span class="qty">${qty}</span>
      <button class="plus">+</button>
    </div>
    <button class="add-btn">${t("إضافة للسلة","Add to Cart")}</button>
  `;
  const qtySpan = row.querySelector(".qty");
  row.querySelector(".plus").onclick = () => { qty++; qtySpan.textContent = qty; };
  row.querySelector(".minus").onclick = () => { qty = Math.max(0, qty - 1); qtySpan.textContent = qty; };
  row.querySelector(".add-btn").onclick = () => {
    if (qty === 0) qty = 1;
    qtySpan.textContent = qty;
    addToCart(id, t(item.name_ar, item.name_en), item.price, qty);
  };
  container.appendChild(row);
}

/* weight item: price per kg, weight select + packaging note */
const WEIGHT_LABELS = {
  1: { ar: "كيلو كامل", en: "1 kg" },
  0.75: { ar: "كيلو إلا ربع", en: "0.75 kg" },
  0.5: { ar: "نصف كيلو", en: "0.5 kg" }
};

function renderWeightItem(container, id, item, weightsList) {
  const weights = weightsList && weightsList.length ? weightsList : [1, 0.5];
  let weight = weights[0];
  let qty = 0;
  let packaging = "whole"; // 'half' | 'whole'

  const weightButtonsHtml = weights
    .map((w, i) => {
      const label = WEIGHT_LABELS[w] || { ar: `${w} كيلو`, en: `${w} kg` };
      return `<button class="opt-btn w-opt${i === 0 ? " selected" : ""}" data-w="${w}">${t(label.ar, label.en)}</button>`;
    })
    .join("");

  const row = document.createElement("div");
  row.className = "item-row";
  row.innerHTML = `
    <span class="item-name">${t(item.name_ar, item.name_en)}</span>
    <span class="item-price unit-price">${item.price} ${t("جنيه / كيلو","EGP / kg")}</span>
    <div class="item-options weight-opts">
      ${weightButtonsHtml}
    </div>
    <div class="item-options pack-opts">
      <button class="opt-btn p-opt selected" data-p="whole">${t("تعبئة كيلو كامل","Whole pack")}</button>
      <button class="opt-btn p-opt" data-p="half">${t("تعبئة كل نصف كيلو منفصل","Separate half-kg packs")}</button>
    </div>
    <span class="calc-price">${item.price} ${t("جنيه","EGP")}</span>
    <div class="qty-control">
      <button class="minus">−</button>
      <span class="qty">${qty}</span>
      <button class="plus">+</button>
    </div>
    <button class="add-btn">${t("إضافة للسلة","Add to Cart")}</button>
  `;

  const calcPriceEl = row.querySelector(".calc-price");
  function updateCalc() {
    calcPriceEl.textContent = `${(item.price * weight).toFixed(0)} ${t("جنيه","EGP")}`;
  }

  row.querySelectorAll(".w-opt").forEach(btn => {
    btn.onclick = () => {
      row.querySelectorAll(".w-opt").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      weight = parseFloat(btn.dataset.w);
      updateCalc();
    };
  });
  row.querySelectorAll(".p-opt").forEach(btn => {
    btn.onclick = () => {
      row.querySelectorAll(".p-opt").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      packaging = btn.dataset.p;
    };
  });

  const qtySpan = row.querySelector(".qty");
  row.querySelector(".plus").onclick = () => { qty++; qtySpan.textContent = qty; };
  row.querySelector(".minus").onclick = () => { qty = Math.max(0, qty - 1); qtySpan.textContent = qty; };
  row.querySelector(".add-btn").onclick = () => {
    if (qty === 0) qty = 1;
    qtySpan.textContent = qty;
    const packLabel = packaging === "whole" ? t("تعبئة كاملة","whole pack") : t("تعبئة منفصلة","separate packs");
    const wLabelInfo = WEIGHT_LABELS[weight] || { ar: `${weight} كيلو`, en: `${weight} kg` };
    const wLabel = t(wLabelInfo.ar, wLabelInfo.en);
    const name = `${t(item.name_ar, item.name_en)} (${wLabel} - ${packLabel})`;
    addToCart(`${id}-${weight}-${packaging}`, name, item.price * weight, qty);
  };

  container.appendChild(row);
}

/* gallery item: full-size image + bold caption in an orange box (no cart controls) */
function renderGalleryItem(container, item) {
  const card = document.createElement("div");
  card.className = "gallery-card";
  card.innerHTML = `
    <img src="${item.img}" alt="${t(item.name_ar, item.name_en)}" loading="lazy" onerror="this.style.display='none'">
    <div class="gallery-caption">${t(item.name_ar, item.name_en)}</div>
  `;
  container.appendChild(card);
}

/* ---------------------------------------------------------
   SIDEBAR
--------------------------------------------------------- */
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
document.getElementById("menuBtn").onclick = () => { sidebar.classList.add("open"); overlay.classList.add("show"); };

/* ---------------------------------------------------------
   BOTTOM NAV BAR
--------------------------------------------------------- */
function setActiveNav(id) {
  document.querySelectorAll(".nav-btn").forEach((btn) => btn.classList.remove("active"));
  const btn = document.getElementById(id);
  if (btn) btn.classList.add("active");
}

document.getElementById("navHome").addEventListener("click", () => {
  goHome();
  history.pushState({ zone: null }, "", location.pathname);
  setActiveNav("navHome");
});

document.getElementById("navOffers").addEventListener("click", () => {
  navigateToZone("offers");
  setActiveNav("navOffers");
});

document.getElementById("navCart").addEventListener("click", () => {
  document.getElementById("cartSection").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("navMenu").addEventListener("click", () => {
  sidebar.classList.add("open");
  overlay.classList.add("show");
});
document.getElementById("closeSidebar").onclick = () => { sidebar.classList.remove("open"); overlay.classList.remove("show"); };
overlay.onclick = () => {
  sidebar.classList.remove("open"); overlay.classList.remove("show");
};

/* ---------------------------------------------------------
   HEADER VIDEO — freeze on last frame when it ends
--------------------------------------------------------- */
const logoVideo = document.getElementById("logoVideo");
if (logoVideo) {
  logoVideo.addEventListener("ended", () => {
    logoVideo.pause();
    if (logoVideo.duration && isFinite(logoVideo.duration)) {
      logoVideo.currentTime = logoVideo.duration;
    }
  });
}

/* ---------------------------------------------------------
   PWA — register service worker (installable app)
--------------------------------------------------------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

/* ---------------------------------------------------------
   INIT
--------------------------------------------------------- */
applyStaticTranslations();
renderZoneGrid();
renderCart();
