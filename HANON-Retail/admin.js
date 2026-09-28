// ============================================================
// HANON STORE - Admin Panel
// لوحة تحكم متجر حنون مع إمكانية رفع الصور على GitHub
// ============================================================

// ============================================================
// إعدادات GitHub
// ============================================================
// ============================================================
// ⚙️ الإعدادات — عدّل 3 سطور بس لما تغيّر مكان المشروع
// ============================================================
const GITHUB_OWNER = "MyDigital-ID";              // ← اسم المستخدم في GitHub
const GITHUB_REPO  = "MyDigital-ID.github.io";    // ← اسم الريبو
const FOLDER_PATH  = "Hanon-Store";               // ← اسم الفولدر (سيبه فاضي "" لو الملفات في الجذر)

// ============================================================
// (مش محتاج تعدّل تحت كده)
// ============================================================
const GITHUB_BRANCH = "main";
const DATA_PATH   = FOLDER_PATH ? `${FOLDER_PATH}/site-data.json` : "site-data.json";
const IMAGES_PATH = FOLDER_PATH ? `${FOLDER_PATH}/assets/uploads` : "assets/uploads";

const TOKEN_KEY = "hanon_admin_token";
const DATA_API  = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${DATA_PATH}`;

let TOKEN = localStorage.getItem(TOKEN_KEY) || "";
let storeData = null;
let currentSha = null;
let pendingImages = {}; // {productId: [File, ...]}
let pendingFeatured = []; // [File, ...]

const $ = (id) => document.getElementById(id);

// ============================================================
// أدوات مساعدة
// ============================================================
function ghHeaders() {
  return {
    "Authorization": `Bearer ${TOKEN}`,
    "Accept": "application/vnd.github+json"
  };
}

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary);
}

function base64ToUtf8(b64) {
  const binary = atob(b64.replace(/\n/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

// تصغير الصور قبل الرفع
function compressImage(file, maxSize = 1200, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxSize || h > maxSize) {
          if (w > h) { h = (maxSize / w) * h; w = maxSize; }
          else { w = (maxSize / h) * w; h = maxSize; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => {
          const reader2 = new FileReader();
          reader2.onload = () => resolve(reader2.result.split(",")[1]);
          reader2.onerror = reject;
          reader2.readAsDataURL(blob);
        }, "image/jpeg", quality);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function showStatus(msg, type = "ok") {
  const el = $("statusMsg");
  el.textContent = msg;
  el.className = "show " + type;
  setTimeout(() => { el.className = ""; }, 4500);
}

function showLoading(text = "جاري التحميل...") {
  $("loadingText").textContent = text;
  $("loadingOverlay").classList.add("show");
}

function hideLoading() {
  $("loadingOverlay").classList.remove("show");
}

function uid(prefix = "id") {
  return prefix + "_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
}

// ============================================================
// GitHub API
// ============================================================
async function fetchFromGitHub() {
  const res = await fetch(`${DATA_API}?ref=${GITHUB_BRANCH}&t=${Date.now()}`, {
    headers: ghHeaders()
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("GitHub error " + res.status);
  const info = await res.json();
  currentSha = info.sha;
  return JSON.parse(base64ToUtf8(info.content));
}

async function saveDataToGitHub() {
  const newContent = JSON.stringify(storeData, null, 2);
  const res = await fetch(DATA_API, {
    method: "PUT",
    headers: { ...ghHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "تحديث بيانات حنون من لوحة التحكم",
      content: utf8ToBase64(newContent),
      sha: currentSha,
      branch: GITHUB_BRANCH
    })
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(out.message || ("Save error " + res.status));
  currentSha = out.content.sha;
}

async function uploadImageToGitHub(base64Content, fileName) {
  const path = `${IMAGES_PATH}/${fileName}`;
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  
  let sha = null;
  try {
    const check = await fetch(`${url}?ref=${GITHUB_BRANCH}`, { headers: ghHeaders() });
    if (check.ok) {
      const info = await check.json();
      sha = info.sha;
    }
  } catch (e) { /* مش موجودة */ }
  
  const body = {
    message: "رفع صورة: " + fileName,
    content: base64Content,
    branch: GITHUB_BRANCH
  };
  if (sha) body.sha = sha;
  
  const res = await fetch(url, {
    method: "PUT",
    headers: { ...ghHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Upload failed");
  }
  
  return `https://mydigital-id.github.io/${IMAGES_PATH}/${fileName}`;
}

// ============================================================
// تسجيل الدخول
// ============================================================
$("loginBtn").onclick = login;
$("pwInput").addEventListener("keydown", (e) => { if (e.key === "Enter") login(); });

// زر إظهار/إخفاء التوكن
const togglePw = $("togglePw");
togglePw.onclick = () => {
  const inp = $("pwInput");
  if (inp.type === "password") {
    inp.type = "text";
    togglePw.textContent = "🙈";
  } else {
    inp.type = "password";
    togglePw.textContent = "👁️";
  }
};

async function login() {
  const tok = $("pwInput").value.trim();
  if (!tok) return;
  
  $("loginErr").textContent = "";
  $("loginBtn").textContent = "جاري التحقق...";
  $("loginBtn").disabled = true;
  
  try {
    TOKEN = tok;
    storeData = await fetchFromGitHub();
    localStorage.setItem(TOKEN_KEY, TOKEN);
    $("loginScreen").style.display = "none";
    $("dashboard").classList.add("active");
    renderAll();
    showStatus("تم الدخول بنجاح ✅", "ok");
  } catch (e) {
    if (e.message === "UNAUTHORIZED") {
      $("loginErr").textContent = "التوكن غير صحيح أو منتهي الصلاحية";
    } else {
      $("loginErr").textContent = "خطأ: " + e.message;
    }
    $("loginBtn").textContent = "🔓 دخول";
    $("loginBtn").disabled = false;
    TOKEN = "";
  }
}

// محاولة دخول تلقائية
if (TOKEN) {
  $("pwInput").value = TOKEN;
  login();
}

// ============================================================
// الخروج
// ============================================================
$("logoutBtn").onclick = () => {
  if (!confirm("هيتم مسح التوكن المحفوظ. متأكد؟")) return;
  localStorage.removeItem(TOKEN_KEY);
  location.reload();
};

// ============================================================
// تحديث البيانات
// ============================================================
$("reloadBtn").onclick = async () => {
  if (!confirm("هيتم تجاهل التعديلات غير المحفوظة. متأكد؟")) return;
  showLoading("جاري التحديث...");
  try {
    storeData = await fetchFromGitHub();
    pendingImages = {};
    pendingFeatured = [];
    renderAll();
    showStatus("تم التحديث ✅", "ok");
  } catch (e) {
    showStatus("فشل التحديث: " + e.message, "err");
  }
  hideLoading();
};

// ============================================================
// حفظ التعديلات
// ============================================================
async function saveAll() {
  showLoading("جاري حفظ التعديلات...");
  try {
    // 1. رفع الصور المعلقة (Featured)
    if (pendingFeatured.length > 0) {
      showLoading(`جاري رفع ${pendingFeatured.length} صورة مميزة...`);
      if (!storeData.featured) storeData.featured = [];
      for (const file of pendingFeatured) {
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const fileName = `featured_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.${ext}`;
        const b64 = await compressImage(file);
        const url = await uploadImageToGitHub(b64, fileName);
        storeData.featured.push(url);
      }
      pendingFeatured = [];
    }
    
    // 2. رفع صور المنتجات
    const pendingCount = Object.values(pendingImages).reduce((a, arr) => a + arr.length, 0);
    if (pendingCount > 0) {
      showLoading(`جاري رفع ${pendingCount} صورة منتج...`);
      await uploadAllPendingImages();
    }
    
    // 3. حفظ البيانات
    showLoading("جاري حفظ البيانات على GitHub...");
    await saveDataToGitHub();
    showStatus("تم الحفظ ✅ التحديث هيظهر خلال دقيقة", "ok");
    pendingImages = {};
  } catch (e) {
    showStatus("فشل الحفظ: " + e.message, "err");
  }
  hideLoading();
}

$("saveBtn").onclick = saveAll;
$("saveBtnBottom").onclick = saveAll;

async function uploadAllPendingImages() {
  for (const productId of Object.keys(pendingImages)) {
    const files = pendingImages[productId];
    if (!files || files.length === 0) continue;
    
    // دوّر على المنتج
    let product = null;
    for (const cat of storeData.categories) {
      const p = cat.products.find(pp => pp.id === productId);
      if (p) { product = p; break; }
    }
    if (!product) continue;
    
    if (!product.images) product.images = [];
    
    for (const file of files) {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const fileName = `${productId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.${ext}`;
      const b64 = await compressImage(file);
      const url = await uploadImageToGitHub(b64, fileName);
      product.images.push(url);
    }
  }
}

// ============================================================
// عرض كل حاجة
// ============================================================
function renderAll() {
  renderConfig();
  renderFeaturedSection();
  renderZones();
}

// ============================================================
// الإعدادات العامة
// ============================================================
const CONFIG_FIELDS = [
  ["brand_ar", "اسم المتجر (عربي)"],
  ["brand_en", "اسم المتجر (English)"],
  ["tagline_ar", "التاجلاين (عربي)"],
  ["about_ar", "نبذة عن المتجر (عربي)", true],
  ["whatsappNumber", "رقم واتساب الطلب (بالصيغة الدولية بدون +)"],
  ["facebook", "رابط صفحة الفيسبوك"],
  ["mapUrl", "رابط الموقع على خرائط جوجل (Google Maps)"]
];

function renderConfig() {
  const wrap = $("configFields");
  wrap.innerHTML = "";
  const cfg = storeData.config || (storeData.config = {});
  
  CONFIG_FIELDS.forEach(([key, label, isArea]) => {
    const lbl = document.createElement("label");
    lbl.textContent = label;
    wrap.appendChild(lbl);
    
    const input = document.createElement(isArea ? "textarea" : "input");
    if (!isArea) input.type = "text";
    input.value = cfg[key] || "";
    input.oninput = () => { cfg[key] = input.value; };
    wrap.appendChild(input);
  });
}

// ============================================================
// قسم الصور المميزة
// ============================================================
function renderFeaturedSection() {
  const wrap = $("featuredFields");
  if (!wrap) return;
  wrap.innerHTML = "";
  
  const hint = document.createElement("p");
  hint.style.cssText = "color:var(--text-muted);font-size:0.95rem;margin-bottom:14px;line-height:1.6;font-weight:700";
  hint.textContent = "الصور اللي بتظهر في السلايدر التاني (الصور المميزة) في الصفحة الرئيسية";
  wrap.appendChild(hint);
  
  if (!storeData.featured) storeData.featured = [];
  
  const grid = document.createElement("div");
  grid.className = "images-grid";
  
  // الصور المرفوعة
  storeData.featured.forEach((imgUrl, i) => {
    const thumb = document.createElement("div");
    thumb.className = "img-thumb";
    
    const img = document.createElement("img");
    img.src = imgUrl;
    img.onerror = () => { img.style.opacity = "0.3"; };
    
    const del = document.createElement("button");
    del.className = "img-del";
    del.textContent = "✕";
    del.onclick = () => {
      if (!confirm("حذف هذه الصورة؟")) return;
      storeData.featured.splice(i, 1);
      renderFeaturedSection();
    };
    
    thumb.appendChild(img);
    thumb.appendChild(del);
    grid.appendChild(thumb);
  });
  
  // الصور المعلقة
  pendingFeatured.forEach((file, i) => {
    const thumb = document.createElement("div");
    thumb.className = "img-thumb";
    thumb.style.borderColor = "var(--gold)";
    
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    
    const del = document.createElement("button");
    del.className = "img-del";
    del.textContent = "✕";
    del.onclick = () => {
      pendingFeatured.splice(i, 1);
      renderFeaturedSection();
    };
    
    const badge = document.createElement("div");
    badge.style.cssText = "position:absolute;bottom:4px;left:4px;background:var(--gold);color:#fff;font-size:0.7rem;padding:3px 8px;border-radius:6px;font-weight:900";
    badge.textContent = "قيد الرفع";
    
    thumb.appendChild(img);
    thumb.appendChild(del);
    thumb.appendChild(badge);
    grid.appendChild(thumb);
  });
  
  // زر الإضافة
  const addBtn = document.createElement("div");
  addBtn.className = "img-add-btn";
  addBtn.innerHTML = `📷<small>إضافة صورة</small>`;
  
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.multiple = true;
  
  addBtn.onclick = () => fileInput.click();
  fileInput.onchange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    files.forEach(f => pendingFeatured.push(f));
    renderFeaturedSection();
  };
  
  grid.appendChild(addBtn);
  wrap.appendChild(grid);
  wrap.appendChild(fileInput);
}

// ============================================================
// عرض الأقسام
// ============================================================
function renderZones() {
  const wrap = $("zonesWrap");
  wrap.innerHTML = "";
  
  if (!storeData.categories) storeData.categories = [];
  
  storeData.categories.forEach((cat, idx) => {
    wrap.appendChild(buildZoneCard(cat, idx));
  });
}

function buildZoneCard(cat, idx) {
  const card = document.createElement("div");
  card.className = "card";
  
  // ===== العنوان =====
  const title = document.createElement("div");
  title.className = "card-title";
  
  const info = document.createElement("div");
  info.className = "title-info";
  info.innerHTML = `
    <span class="zone-icon">${cat.icon || "📦"}</span>
    <span>${cat.name_ar || "(قسم بدون اسم)"}</span>
    <span class="type-badge">${(cat.products || []).length} منتج</span>
    <span class="toggle-chev">▼</span>
  `;
  
  const actions = document.createElement("div");
  actions.style.cssText = "display:flex;gap:8px;align-items:center;flex-wrap:wrap";
  
  // زرار الإخفاء/التفعيل
  const visToggle = document.createElement("div");
  visToggle.className = "vis-toggle " + (cat.visible !== false ? "on" : "off");
  visToggle.textContent = cat.visible !== false ? "👁️ ظاهر" : "🚫 مخفي";
  visToggle.onclick = (e) => {
    e.stopPropagation();
    cat.visible = cat.visible === false ? true : false;
    visToggle.className = "vis-toggle " + (cat.visible !== false ? "on" : "off");
    visToggle.textContent = cat.visible !== false ? "👁️ ظاهر" : "🚫 مخفي";
  };
  
  // زرار حذف القسم
  const delBtn = document.createElement("button");
  delBtn.className = "btn-danger";
  delBtn.textContent = "🗑️ حذف";
  delBtn.onclick = (e) => {
    e.stopPropagation();
    if (!confirm(`متأكد من حذف قسم "${cat.name_ar}"؟`)) return;
    storeData.categories.splice(idx, 1);
    renderZones();
  };
  
  actions.appendChild(visToggle);
  actions.appendChild(delBtn);
  
  title.appendChild(info);
  title.appendChild(actions);
  card.appendChild(title);
  
  // ===== الجسم =====
  const body = document.createElement("div");
  body.className = "zone-body";
  
  info.onclick = () => {
    body.classList.toggle("open");
    title.querySelector(".toggle-chev").classList.toggle("open");
  };
  
  // حقول القسم
  body.appendChild(fieldRow("اسم القسم (عربي)", cat.name_ar, (v) => { 
    cat.name_ar = v; 
    info.querySelector("span:nth-child(2)").textContent = v; 
  }));
  body.appendChild(fieldRow("اسم القسم (English)", cat.name_en, (v) => { cat.name_en = v; }));
  body.appendChild(fieldRow("أيقونة (إيموجي)", cat.icon, (v) => { 
    cat.icon = v; 
    info.querySelector(".zone-icon").textContent = v; 
  }));
  body.appendChild(fieldRow("رابط صورة القسم", cat.homeImg, (v) => { cat.homeImg = v; }));
  
  // زر رفع صورة القسم
  const homeImgActions = document.createElement("div");
  homeImgActions.style.cssText = "display:flex;gap:8px;margin-top:10px";
  
  const uploadHomeBtn = document.createElement("button");
  uploadHomeBtn.className = "btn-secondary";
  uploadHomeBtn.style.fontSize = "0.9rem";
  uploadHomeBtn.textContent = "📤 رفع صورة القسم";
  const homeFile = document.createElement("input");
  homeFile.type = "file";
  homeFile.accept = "image/*";
  homeFile.style.display = "none";
  uploadHomeBtn.onclick = () => homeFile.click();
  homeFile.onchange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    showLoading("جاري رفع صورة القسم...");
    try {
      const b64 = await compressImage(f);
      const ext = (f.name.split(".").pop() || "jpg").toLowerCase();
      const fileName = `cat_${cat.id}_${Date.now()}.${ext}`;
      const url = await uploadImageToGitHub(b64, fileName);
      cat.homeImg = url;
      renderZones();
      setTimeout(() => {
        const newCard = document.querySelectorAll(".card")[idx + 2];
        if (newCard) {
          newCard.querySelector(".zone-body").classList.add("open");
          newCard.querySelector(".toggle-chev").classList.add("open");
        }
      }, 100);
      showStatus("تم رفع الصورة ✅ لا تنسَ الحفظ", "ok");
    } catch (err) {
      showStatus("فشل الرفع: " + err.message, "err");
    }
    hideLoading();
  };
  
  homeImgActions.appendChild(uploadHomeBtn);
  homeImgActions.appendChild(homeFile);
  body.appendChild(homeImgActions);
  
  // ====== عنوان المنتجات ======
  const prodsLabel = document.createElement("label");
  prodsLabel.style.cssText = "margin-top:24px;font-size:1.1rem;color:var(--marble-dark)";
  prodsLabel.textContent = "🛍️ المنتجات:";
  body.appendChild(prodsLabel);
  
  // ====== قائمة المنتجات ======
  const prodsWrap = document.createElement("div");
  body.appendChild(prodsWrap);
  
  function rerender() {
    renderProductsAdmin(prodsWrap, cat, rerender);
    info.querySelector(".type-badge").textContent = (cat.products || []).length + " منتج";
  }
  rerender();
  
  // ====== زرار إضافة منتج ======
  const addProdBtn = document.createElement("button");
  addProdBtn.className = "btn-add";
  addProdBtn.textContent = "+ إضافة منتج جديد";
  addProdBtn.onclick = () => {
    if (!cat.products) cat.products = [];
    cat.products.push({
      id: uid("p"),
      name_ar: "",
      name_en: "",
      desc_ar: "",
      desc_en: "",
      images: [],
      sizes: []
    });
    rerender();
  };
  body.appendChild(addProdBtn);
  
  card.appendChild(body);
  return card;
}

// ============================================================
// حقول مساعدة
// ============================================================
function fieldRow(label, value, onChange) {
  const wrap = document.createElement("div");
  const lbl = document.createElement("label");
  lbl.textContent = label;
  const input = document.createElement("input");
  input.type = "text";
  input.value = value || "";
  input.oninput = () => onChange(input.value);
  wrap.appendChild(lbl);
  wrap.appendChild(input);
  return wrap;
}

// ============================================================
// المقاسات الجاهزة
// ============================================================
const SIZE_PRESETS = ["S", "M", "L", "XL", "XXL", "XXXL"];
const SHOE_PRESETS = ["40", "41", "42", "43", "44", "45", "46"];
const KIDS_PRESETS = ["2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y"];

// ============================================================
// عرض المنتجات
// ============================================================
function renderProductsAdmin(container, cat, rerender) {
  container.innerHTML = "";
  
  if (!cat.products || cat.products.length === 0) {
    const empty = document.createElement("p");
    empty.style.cssText = "text-align:center;color:var(--text-muted);padding:24px;font-size:0.95rem;font-weight:700";
    empty.textContent = "لا توجد منتجات - اضغط على + لإضافة منتج";
    container.appendChild(empty);
    return;
  }
  
  cat.products.forEach((prod, pIdx) => {
    container.appendChild(buildProductCard(prod, pIdx, cat, rerender));
  });
}

function buildProductCard(prod, pIdx, cat, rerender) {
  const box = document.createElement("div");
  box.className = "item-box";
  
  // رقم المنتج
  const num = document.createElement("div");
  num.className = "item-num";
  num.textContent = "#" + (pIdx + 1);
  box.appendChild(num);
  
  // زر الحذف
  const acts = document.createElement("div");
  acts.className = "item-actions";
  
  const delBtn = document.createElement("button");
  delBtn.className = "btn-danger";
  delBtn.textContent = "🗑️ حذف المنتج";
  delBtn.onclick = () => {
    if (!confirm(`حذف "${prod.name_ar || 'المنتج'}"؟`)) return;
    cat.products.splice(pIdx, 1);
    rerender();
  };
  acts.appendChild(delBtn);
  box.appendChild(acts);
  
  // حقول الاسم والوصف
  box.appendChild(fieldRow("الاسم (عربي)", prod.name_ar, (v) => { prod.name_ar = v; }));
  box.appendChild(fieldRow("الاسم (English)", prod.name_en, (v) => { prod.name_en = v; }));
  box.appendChild(fieldRow("وصف مختصر (اختياري)", prod.desc_ar, (v) => { prod.desc_ar = v; }));
  
  // الصور
  box.appendChild(buildImagesSection(prod, rerender));
  
  // المقاسات والأسعار
  box.appendChild(buildSizesSection(prod, rerender, cat));
  
  return box;
}

// ============================================================
// قسم الصور
// ============================================================
function buildImagesSection(prod, rerender) {
  const wrap = document.createElement("div");
  
  const lbl = document.createElement("label");
  lbl.textContent = "📷 صور المنتج";
  wrap.appendChild(lbl);
  
  const hint = document.createElement("p");
  hint.style.cssText = "font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;font-weight:700";
  hint.textContent = "أضف صورة أو أكثر للمنتج (يمكنك إضافة صور متعددة)";
  wrap.appendChild(hint);
  
  const grid = document.createElement("div");
  grid.className = "images-grid";
  
  // الصور الموجودة
  if (!prod.images) prod.images = [];
  prod.images.forEach((imgUrl, i) => {
    const thumb = document.createElement("div");
    thumb.className = "img-thumb";
    
    const img = document.createElement("img");
    img.src = imgUrl;
    img.onerror = () => { img.style.opacity = "0.3"; };
    
    const del = document.createElement("button");
    del.className = "img-del";
    del.textContent = "✕";
    del.onclick = () => {
      if (!confirm("حذف هذه الصورة؟")) return;
      prod.images.splice(i, 1);
      rerender();
    };
    
    thumb.appendChild(img);
    thumb.appendChild(del);
    grid.appendChild(thumb);
  });
  
  // الصور المعلقة
  const pending = pendingImages[prod.id] || [];
  pending.forEach((file, i) => {
    const thumb = document.createElement("div");
    thumb.className = "img-thumb";
    thumb.style.borderColor = "var(--gold)";
    
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    
    const del = document.createElement("button");
    del.className = "img-del";
    del.textContent = "✕";
    del.onclick = () => {
      pendingImages[prod.id].splice(i, 1);
      if (pendingImages[prod.id].length === 0) delete pendingImages[prod.id];
      rerender();
    };
    
    const badge = document.createElement("div");
    badge.style.cssText = "position:absolute;bottom:4px;left:4px;background:var(--gold);color:#fff;font-size:0.7rem;padding:3px 8px;border-radius:6px;font-weight:900";
    badge.textContent = "قيد الرفع";
    
    thumb.appendChild(img);
    thumb.appendChild(del);
    thumb.appendChild(badge);
    grid.appendChild(thumb);
  });
  
  // زر الإضافة
  const addBtn = document.createElement("div");
  addBtn.className = "img-add-btn";
  addBtn.innerHTML = `📷<small>إضافة صورة</small>`;
  
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.multiple = true;
  
  addBtn.onclick = () => fileInput.click();
  fileInput.onchange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (!pendingImages[prod.id]) pendingImages[prod.id] = [];
    files.forEach(f => pendingImages[prod.id].push(f));
    rerender();
  };
  
  grid.appendChild(addBtn);
  wrap.appendChild(grid);
  wrap.appendChild(fileInput);
  
  return wrap;
}

// ============================================================
// قسم المقاسات والأسعار
// ============================================================
function buildSizesSection(prod, rerender, cat) {
  const wrap = document.createElement("div");
  
  const lbl = document.createElement("label");
  lbl.textContent = "📏 المقاسات والأسعار";
  wrap.appendChild(lbl);
  
  const hint = document.createElement("p");
  hint.style.cssText = "font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;font-weight:700";
  hint.textContent = "اضغط على المقاس لإضافته وحدد سعره — واملأ خانة سعر العرض فقط لو في خصم على المقاس ده";
  wrap.appendChild(hint);
  
  // المقاسات المختارة مع أسعارها
  const selectedWrap = document.createElement("div");
  selectedWrap.className = "selected-sizes";
  
  if (!prod.sizes) prod.sizes = [];
  
  if (prod.sizes.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.style.cssText = "text-align:center;color:#999;font-size:0.9rem;padding:12px;font-weight:700";
    emptyMsg.textContent = "لا توجد مقاسات - اختر من الأسفل";
    selectedWrap.appendChild(emptyMsg);
  } else {
    prod.sizes.forEach((sz, i) => {
      const row = document.createElement("div");
      row.className = "selected-size-row";
      
      const lblSz = document.createElement("span");
      lblSz.className = "sz-label";
      lblSz.textContent = sz.label;
      
      const priceInput = document.createElement("input");
      priceInput.type = "number";
      priceInput.className = "sz-price-input";
      priceInput.value = sz.price || 0;
      priceInput.placeholder = "السعر";
      priceInput.oninput = () => { 
        prod.sizes[i].price = parseFloat(priceInput.value) || 0;
      };
      
      const currency = document.createElement("span");
      currency.style.cssText = "font-weight:900;color:var(--text-muted)";
      currency.textContent = "ج.م";

      const offerInput = document.createElement("input");
      offerInput.type = "number";
      offerInput.className = "sz-price-input";
      offerInput.style.cssText = "border-color:var(--gold, #f26a1b);";
      offerInput.value = sz.offerPrice || "";
      offerInput.placeholder = "سعر العرض (اختياري)";
      offerInput.title = "اتركه فارغاً لإلغاء العرض على هذا المقاس";
      offerInput.oninput = () => {
        const v = parseFloat(offerInput.value);
        prod.sizes[i].offerPrice = (!isNaN(v) && v > 0) ? v : 0;
      };

      const del = document.createElement("button");
      del.className = "sz-del";
      del.textContent = "✕";
      del.onclick = () => {
        prod.sizes.splice(i, 1);
        rerender();
      };
      
      row.appendChild(lblSz);
      row.appendChild(priceInput);
      row.appendChild(currency);
      row.appendChild(offerInput);
      row.appendChild(del);
      selectedWrap.appendChild(row);
    });
  }
  
  wrap.appendChild(selectedWrap);
  
  // المقاسات الجاهزة - حسب نوع القسم
  const presetsLbl = document.createElement("p");
  presetsLbl.style.cssText = "font-size:0.9rem;color:var(--marble-mid);margin-top:16px;margin-bottom:8px;font-weight:900";
  presetsLbl.textContent = "المقاسات الجاهزة:";
  wrap.appendChild(presetsLbl);
  
  // اختيار المقاسات حسب القسم
  let presets = SIZE_PRESETS;
  if (cat && (cat.id === "sneakers")) {
    presets = SHOE_PRESETS;
  } else if (cat && cat.id === "boxers") {
    presets = SIZE_PRESETS;
  }
  
  // مجموعة 1: الملابس
  const chipsWrap1 = document.createElement("div");
  chipsWrap1.className = "size-chips";
  
  presets.forEach(sz => {
    const chip = document.createElement("button");
    chip.className = "size-chip";
    chip.textContent = sz;
    if (prod.sizes.some(s => s.label === sz)) chip.classList.add("selected");
    chip.onclick = () => {
      const existingIdx = prod.sizes.findIndex(s => s.label === sz);
      if (existingIdx !== -1) {
        prod.sizes.splice(existingIdx, 1);
      } else {
        prod.sizes.push({ label: sz, price: 0 });
      }
      rerender();
    };
    chipsWrap1.appendChild(chip);
  });
  
  wrap.appendChild(chipsWrap1);
  
  // مجموعة 2: مقاسات إضافية
  const extraLbl = document.createElement("p");
  extraLbl.style.cssText = "font-size:0.85rem;color:var(--text-muted);margin-top:12px;margin-bottom:6px;font-weight:700";
  extraLbl.textContent = "مقاسات أخرى:";
  wrap.appendChild(extraLbl);
  
  const chipsWrap2 = document.createElement("div");
  chipsWrap2.className = "size-chips";
  
  const allExtras = [...new Set([...SHOE_PRESETS, ...KIDS_PRESETS, "Standard", "One Size"])];
  allExtras.forEach(sz => {
    const chip = document.createElement("button");
    chip.className = "size-chip";
    chip.textContent = sz;
    chip.style.fontSize = "0.85rem";
    chip.style.padding = "8px 14px";
    if (prod.sizes.some(s => s.label === sz)) chip.classList.add("selected");
    chip.onclick = () => {
      const existingIdx = prod.sizes.findIndex(s => s.label === sz);
      if (existingIdx !== -1) {
        prod.sizes.splice(existingIdx, 1);
      } else {
        prod.sizes.push({ label: sz, price: 0 });
      }
      rerender();
    };
    chipsWrap2.appendChild(chip);
  });
  
  wrap.appendChild(chipsWrap2);
  
  // إضافة مقاس مخصص
  const customWrap = document.createElement("div");
  customWrap.style.cssText = "display:flex;gap:8px;margin-top:14px";
  
  const customInput = document.createElement("input");
  customInput.type = "text";
  customInput.placeholder = "مقاس مخصص (مثال: 4XL)";
  customInput.style.flex = "1";
  
  const customBtn = document.createElement("button");
  customBtn.className = "btn-secondary";
  customBtn.textContent = "+ إضافة";
  customBtn.onclick = () => {
    const v = customInput.value.trim();
    if (!v) return;
    if (!prod.sizes.some(s => s.label === v)) {
      prod.sizes.push({ label: v, price: 0 });
    }
    customInput.value = "";
    rerender();
  };
  
  customWrap.appendChild(customInput);
  customWrap.appendChild(customBtn);
  wrap.appendChild(customWrap);
  
  return wrap;
}

// ============================================================
// إضافة قسم جديد
// ============================================================
$("addZoneBtn").onclick = () => {
  const name = prompt("اسم القسم بالعربي:");
  if (!name) return;
  const nameEn = prompt("اسم القسم بالإنجليزي (اختياري):") || "";
  const icon = prompt("أيقونة (إيموجي، اختياري):", "🛍️") || "🛍️";
  
  if (!storeData.categories) storeData.categories = [];
  storeData.categories.push({
    id: uid("cat"),
    icon: icon,
    name_ar: name,
    name_en: nameEn,
    homeImg: "",
    visible: true,
    products: []
  });
  
  renderZones();
  showStatus("تم إضافة القسم — لا تنسَ الحفظ 💾", "ok");
};

// ============================================================
// إغلاق الـ Loading لو حصل خطأ في الشبكة
// ============================================================
window.addEventListener("online", () => {
  if ($("loadingOverlay").classList.contains("show")) {
    hideLoading();
  }
});

// ============================================================
// تحذير قبل الخروج
// ============================================================
window.addEventListener("beforeunload", (e) => {
  const hasPending = Object.keys(pendingImages).length > 0 || pendingFeatured.length > 0;
  if (hasPending) {
    e.preventDefault();
    e.returnValue = "";
  }
});

// ============================================================
// انتهى الملف ✅
// ============================================================
console.log("🎛️ HANON STORE Admin Panel loaded");
