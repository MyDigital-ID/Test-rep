// ============================================================
// Modern Furniture - Admin Panel (admin.js) - Part 1/2
// الإعدادات، الدخول، GitHub API، رفع الصور
// ============================================================

// ====== ثوابت ======
const TOKEN_KEY = 'mobilya_admin_token';
const CONFIG_KEY = 'mobilya_admin_config';
const IMAGES_PATH = 'assets/uploads';

// ====== الحالة ======
let TOKEN = '';
let ghConfig = { user: '', repo: '', folder: '', branch: 'main' };
let storeData = null;
let currentSha = null;
let currentPath = { catId: null, roomId: null };
let pendingImages = {}; // { roomId_colorId: [File, ...] }
let isDirty = false;

const $ = (id) => document.getElementById(id);

// ============================================================
// أدوات مساعدة
// ============================================================
function ghHeaders() {
  return {
    'Authorization': `Bearer ${TOKEN}`,
    'Accept': 'application/vnd.github+json'
  };
}

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary);
}

function base64ToUtf8(b64) {
  const binary = atob(b64.replace(/\n/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// تصغير الصورة قبل الرفع
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
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => {
          const r2 = new FileReader();
          r2.onload = () => resolve(r2.result.split(',')[1]);
          r2.onerror = reject;
          r2.readAsDataURL(blob);
        }, 'image/jpeg', quality);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function escapeHTML(str) {
  return String(str || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
}

function uid(prefix = 'id') {
  return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function showStatus(msg, type = 'ok') {
  const el = $('statusMsg');
  el.textContent = msg;
  el.className = 'status-msg show ' + type;
  clearTimeout(window.__statusTimer);
  window.__statusTimer = setTimeout(() => { el.className = 'status-msg ' + type; }, 4000);
}

function showLoading(text = 'جاري التحميل...') {
  $('loadingText').textContent = text;
  $('loadingOverlay').classList.add('show');
}

function hideLoading() {
  $('loadingOverlay').classList.remove('show');
}

function markDirty() {
  isDirty = true;
  const info = $('saveInfo');
  if (info) {
    info.textContent = '⚠️ يوجد تغييرات غير محفوظة';
    info.classList.add('dirty');
  }
}

function clearDirty() {
  isDirty = false;
  const info = $('saveInfo');
  if (info) {
    info.textContent = '✅ كل حاجة محفوظة';
    info.classList.remove('dirty');
  }
}

// ============================================================
// GitHub API
// ============================================================
function getDataPath() {
  return ghConfig.folder ? `${ghConfig.folder}/site-data.json` : 'site-data.json';
}

function getImagesPath() {
  return ghConfig.folder ? `${ghConfig.folder}/${IMAGES_PATH}` : IMAGES_PATH;
}

function getRawUrl(fileName) {
  // الرابط المباشر للصورة عبر GitHub Pages
  // نحاول نستخرج اسم المستخدم من الـ repo
  const user = ghConfig.user;
  const repo = ghConfig.repo;
  let base = '';
  if (repo.toLowerCase() === `${user.toLowerCase()}.github.io`) {
    base = `https://${user.toLowerCase()}.github.io`;
  } else {
    base = `https://${user.toLowerCase()}.github.io/${repo}`;
  }
  const folderPrefix = ghConfig.folder ? `/${ghConfig.folder}` : '';
  return `${base}${folderPrefix}/${IMAGES_PATH}/${fileName}`;
}

async function fetchFromGitHub() {
  const path = getDataPath();
  const url = `https://api.github.com/repos/${ghConfig.user}/${ghConfig.repo}/contents/${path}?ref=${ghConfig.branch}&t=${Date.now()}`;
  const res = await fetch(url, { headers: ghHeaders() });
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  if (res.status === 404) {
    // الملف مش موجود، نعمل ملف جديد
    currentSha = null;
    return { config: {}, social: {}, featured: [], categories: [] };
  }
  if (!res.ok) throw new Error('GitHub error ' + res.status);
  const info = await res.json();
  currentSha = info.sha;
  return JSON.parse(base64ToUtf8(info.content));
}

async function saveDataToGitHub() {
  const path = getDataPath();
  const url = `https://api.github.com/repos/${ghConfig.user}/${ghConfig.repo}/contents/${path}`;
  const body = {
    message: 'تحديث بيانات الموقع - ' + new Date().toLocaleString('ar-EG'),
    content: utf8ToBase64(JSON.stringify(storeData, null, 2)),
    branch: ghConfig.branch
  };
  if (currentSha) body.sha = currentSha;

  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(out.message || ('Save error ' + res.status));
  currentSha = out.content.sha;
}

async function uploadImageToGitHub(base64Content, fileName) {
  const path = `${getImagesPath()}/${fileName}`;
  const url = `https://api.github.com/repos/${ghConfig.user}/${ghConfig.repo}/contents/${path}`;

  // نشوف لو الصورة موجودة
  let sha = null;
  try {
    const check = await fetch(`${url}?ref=${ghConfig.branch}`, { headers: ghHeaders() });
    if (check.ok) {
      const info = await check.json();
      sha = info.sha;
    }
  } catch (e) { /* مش موجودة */ }

  const body = {
    message: 'Upload image: ' + fileName,
    content: base64Content,
    branch: ghConfig.branch
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Upload failed');
  }
  return getRawUrl(fileName);
}

// ============================================================
// الدخول
// ============================================================
$('loginBtn').addEventListener('click', login);
$('ghToken').addEventListener('keydown', (e) => { if (e.key === 'Enter') login(); });

async function login() {
  const user = $('ghUser').value.trim();
  const repo = $('ghRepo').value.trim();
  const folder = $('ghFolder').value.trim();
  const token = $('ghToken').value.trim();

  if (!user || !repo || !token) {
    $('loginErr').textContent = 'لازم تملأ البيانات كاملة';
    return;
  }

  $('loginErr').textContent = '';
  $('loginBtn').disabled = true;
  $('loginBtn').textContent = 'جاري التحقق...';

  try {
    TOKEN = token;
    ghConfig = { user, repo, folder, branch: 'main' };

    // نجيب بيانات الريبو عشان نعرف الفرع الافتراضي
    const repoRes = await fetch(`https://api.github.com/repos/${user}/${repo}`, { headers: ghHeaders() });
    if (repoRes.status === 401) throw new Error('التوكن غلط أو مالوش صلاحية');
    if (!repoRes.ok) throw new Error('مش قادر أوصل للمستودع - تأكد من البيانات');
    const repoInfo = await repoRes.json();
    ghConfig.branch = repoInfo.default_branch || 'main';

    storeData = await fetchFromGitHub();

    // نحفظ الإعدادات
    localStorage.setItem(TOKEN_KEY, TOKEN);
    localStorage.setItem(CONFIG_KEY, JSON.stringify(ghConfig));

    $('loginScreen').style.display = 'none';
    $('adminScreen').classList.remove('hidden');
    $('saveBar').classList.remove('hidden');
    clearDirty();
    render();

    showStatus('تم الدخول بنجاح ✅', 'ok');
  } catch (e) {
    console.error(e);
    $('loginErr').textContent = e.message === 'UNAUTHORIZED'
      ? 'التوكن غلط أو مالوش صلاحية'
      : (e.message || 'فشل الاتصال');
    $('loginBtn').disabled = false;
    $('loginBtn').textContent = '🔓 دخول';
    TOKEN = '';
  }
}

// ============================================================
// محاولة دخول تلقائية
// ============================================================
(function autoLogin() {
  const savedToken = localStorage.getItem(TOKEN_KEY);
  const savedConfig = localStorage.getItem(CONFIG_KEY);
  if (savedToken && savedConfig) {
    try {
      const cfg = JSON.parse(savedConfig);
      $('ghUser').value = cfg.user || '';
      $('ghRepo').value = cfg.repo || '';
      $('ghFolder').value = cfg.folder || '';
      $('ghToken').value = savedToken;
      login();
    } catch (e) { console.warn(e); }
  }
})();

// ============================================================
// الخروج
// ============================================================
$('logoutBtn').addEventListener('click', () => {
  if (!confirm('هيتم مسح التوكن من المتصفح. متأكد؟')) return;
  localStorage.removeItem(TOKEN_KEY);
  location.reload();
});

// ============================================================
// إعادة التحميل
// ============================================================
$('reloadBtn').addEventListener('click', async () => {
  if (isDirty && !confirm('هيتم تجاهل أي تعديل غير محفوظ. متأكد؟')) return;
  showLoading('جاري التحديث...');
  try {
    storeData = await fetchFromGitHub();
    clearDirty();
    render();
    showStatus('تم التحديث ✅', 'ok');
  } catch (e) {
    showStatus('فشل التحديث: ' + e.message, 'err');
  }
  hideLoading();
});

// ============================================================
// عرض الموقع
// ============================================================
$('viewSiteBtn').addEventListener('click', () => {
  window.open('index.html', '_blank');
});

// ============================================================
// حفظ ونشر
// ============================================================
$('saveBtn').addEventListener('click', saveAll);

async function saveAll() {
  showLoading('جاري حفظ التعديلات على GitHub...');
  try {
    // 1. نرفع الصور المعلقة الأول
    const pendingCount = Object.values(pendingImages).reduce((a, arr) => a + arr.length, 0);
    if (pendingCount > 0) {
      await uploadAllPendingImages();
    }

    // 2. نحفظ البيانات
    showLoading('جاري حفظ البيانات...');
    await saveDataToGitHub();
    clearDirty();
    pendingImages = {};
    render();
    showStatus('✅ تم الحفظ والنشر - التحديث هيظهر خلال دقيقة', 'ok');
  } catch (e) {
    console.error(e);
    showStatus('فشل الحفظ: ' + e.message, 'err');
  }
  hideLoading();
}

async function uploadAllPendingImages() {
  for (const key of Object.keys(pendingImages)) {
    const files = pendingImages[key];
    if (!files || files.length === 0) continue;

    // key = "catId::roomId::colorId"
    const [catId, roomId, colorId] = key.split('::');
    const cat = storeData.categories.find(c => c.id === catId);
    if (!cat) continue;
    const room = cat.rooms.find(r => r.id === roomId);
    if (!room) continue;
    const color = room.colors.find(c => c.id === colorId);
    if (!color) continue;

    for (const file of files) {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const fileName = `${colorId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.${ext}`;
      showLoading(`جاري رفع صورة: ${file.name}...`);
      const b64 = await compressImage(file);
      const url = await uploadImageToGitHub(b64, fileName);
      // نضيفها بصور بدون عنوان (المستخدم يعدلها بعدين)
      const label = 'صورة ' + (Object.keys(color.images || {}).length + 1);
      if (!color.images) color.images = {};
      color.images[label] = url;
    }
  }
}

// ============================================================
// تحذير قبل الخروج
// ============================================================
window.addEventListener('beforeunload', (e) => {
  if (isDirty) {
    e.preventDefault();
    e.returnValue = '';
  }
});

// ============================================================
// Modal
// ============================================================
function openModal(html) {
  $('modalContainer').innerHTML =
    `<div class="modal-overlay" onclick="if(event.target===this) closeModal()"><div class="modal">${html}</div></div>`;
}
function closeModal() {
  $('modalContainer').innerHTML = '';
}
window.closeModal = closeModal;

// ============================================================
// Router
// ============================================================
function render() {
  renderBreadcrumb();
  const content = $('tabContent');
  if (!currentPath.catId) renderCategories(content);
  else if (!currentPath.roomId) renderRooms(content);
  else renderColors(content);
}

function renderBreadcrumb() {
  const bc = $('breadcrumb');
  const parts = [`<button onclick="goHome()">🏠 الأقسام</button>`];
  if (currentPath.catId) {
    const cat = storeData.categories.find(c => c.id === currentPath.catId);
    if (cat) {
      parts.push('<span class="sep">›</span>');
      parts.push(`<button onclick="goToCategory('${cat.id}')">${escapeHTML(cat.name_ar)}</button>`);
    }
  }
  if (currentPath.roomId && currentPath.catId) {
    const cat = storeData.categories.find(c => c.id === currentPath.catId);
    const room = cat?.rooms?.find(r => r.id === currentPath.roomId);
    if (room) {
      parts.push('<span class="sep">›</span>');
      parts.push(`<span class="current">${escapeHTML(room.name_ar)}</span>`);
    }
  }
  bc.innerHTML = parts.join('');
}

window.goHome = () => { currentPath = { catId: null, roomId: null }; render(); };
window.goToCategory = (id) => { currentPath = { catId: id, roomId: null }; render(); };
window.goToRoom = (id) => { currentPath.roomId = id; render(); };

// ============================================================
// نهاية الجزء الأول - يُتبع في الجزء الثاني
// ============================================================
console.log('🎛️ Admin Panel Part 1/2 loaded');
// ============================================================
// Modern Furniture - Admin Panel (admin.js) - Part 2/2
// الواجهات والمنطق الكامل
// ============================================================

// ============================================================
// عرض الأقسام
// ============================================================
function renderCategories(content) {
  const cats = storeData.categories || [];
  let html = `
    <div class="quick-actions">
      <button class="btn btn-primary" onclick="addCategory()">➕ إضافة قسم جديد</button>
      <button class="btn btn-secondary" onclick="editSettings()">⚙️ الإعدادات العامة</button>
    </div>
    <div class="grid">`;

  if (cats.length === 0) {
    html += `<div class="empty" style="grid-column:1/-1;"><span class="icon">📦</span>مفيش أقسام، اضغط "إضافة قسم" للبدء</div>`;
  } else {
    cats.forEach(cat => {
      html += `
        <div class="item-card">
          <img src="${escapeHTML(cat.homeImg || '')}" class="img-preview"
               onerror="this.style.background='#2E1F15';this.src=''">
          <div class="title">${escapeHTML(cat.icon || '🛋️')} ${escapeHTML(cat.name_ar)}
            ${cat.visible === false ? '<span class="hidden-tag">مخفي</span>' : ''}</div>
          <div class="subtitle">${(cat.rooms?.length || 0)} غرفة</div>
          <div class="row-actions">
            <button class="btn btn-primary btn-sm" onclick="goToCategory('${cat.id}')">📂 فتح</button>
            <button class="btn btn-secondary btn-sm" onclick="editCategory('${cat.id}')">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="deleteCategory('${cat.id}')">🗑️</button>
          </div>
        </div>`;
    });
  }
  html += `</div>`;
  content.innerHTML = html;
}

window.addCategory = () => openCategoryModal(
  { id: uid('cat'), icon: '🛋️', name_ar: '', name_en: '', homeImg: '', visible: true, rooms: [] },
  true
);

window.editCategory = (id) => {
  const c = storeData.categories.find(c => c.id === id);
  if (c) openCategoryModal(c, false);
};

function openCategoryModal(cat, isNew) {
  openModal(`
    <h3>${isNew ? '➕ إضافة قسم' : '✏️ تعديل القسم'}</h3>
    <div class="field"><label>الاسم بالعربي</label>
      <input type="text" id="catNameAr" value="${escapeHTML(cat.name_ar)}"></div>
    <div class="field"><label>الاسم بالإنجليزي</label>
      <input type="text" id="catNameEn" value="${escapeHTML(cat.name_en || '')}"></div>
    <div class="field"><label>الأيقونة (إيموجي)</label>
      <input type="text" id="catIcon" value="${escapeHTML(cat.icon)}" placeholder="🛋️"></div>
    <div class="field"><label>رابط صورة القسم</label>
      <input type="text" id="catImg" value="${escapeHTML(cat.homeImg || '')}" placeholder="https://..."></div>
    <div style="display:flex;gap:8px;margin-bottom:14px;">
      <button class="btn btn-secondary btn-sm" style="flex:1" onclick="pickImageFor('catImg')">📤 رفع صورة من الجهاز</button>
    </div>
    <div class="checkbox-row">
      <input type="checkbox" id="catVisible" ${cat.visible !== false ? 'checked' : ''}>
      <label for="catVisible">ظاهر في الموقع</label>
    </div>
    <div class="actions">
      <button class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
      <button class="btn btn-primary" onclick="saveCategory('${cat.id}', ${isNew})">💾 حفظ</button>
    </div>`);
}

window.saveCategory = (id, isNew) => {
  const nameAr = document.getElementById('catNameAr').value.trim();
  if (!nameAr) { showStatus('لازم اسم القسم', 'err'); return; }
  const data = {
    name_ar: nameAr,
    name_en: document.getElementById('catNameEn').value.trim(),
    icon: document.getElementById('catIcon').value.trim() || '🛋️',
    homeImg: document.getElementById('catImg').value.trim(),
    visible: document.getElementById('catVisible').checked
  };
  if (isNew) {
    storeData.categories.push({ id, ...data, rooms: [] });
  } else {
    Object.assign(storeData.categories.find(c => c.id === id), data);
  }
  markDirty(); closeModal(); render();
  showStatus('✅ تم', 'ok');
};

window.deleteCategory = (id) => {
  if (!confirm('هل أنت متأكد من حذف القسم وكل ما فيه؟')) return;
  storeData.categories = storeData.categories.filter(c => c.id !== id);
  markDirty(); render();
  showStatus('🗑️ تم الحذف', 'ok');
};

// ============================================================
// رفع صورة حرة (تُخزّن مؤقتاً وتُرفع مع الحفظ)
// ============================================================
const freePendingImages = {}; // { fieldId: File }

window.pickImageFor = (fieldId) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    freePendingImages[fieldId] = file;
    // نعرض الاسم في الحقل
    const field = document.getElementById(fieldId);
    if (field) field.value = '[صورة معلقة - هتُرفع عند الحفظ] ' + file.name;
    showStatus('📎 الصورة جاهزة للرفع', 'warn');
  };
  input.click();
};

// ============================================================
// عرض الغرف
// ============================================================
function renderRooms(content) {
  const cat = storeData.categories.find(c => c.id === currentPath.catId);
  if (!cat) { goHome(); return; }
  const rooms = cat.rooms || [];
  let html = `<div class="quick-actions"><button class="btn btn-primary" onclick="addRoom()">➕ إضافة غرفة</button></div><div class="grid">`;

  if (rooms.length === 0) {
    html += `<div class="empty" style="grid-column:1/-1;"><span class="icon">🛏️</span>مفيش غرف في القسم ده</div>`;
  } else {
    rooms.forEach(room => {
      let img = '';
      const colors = room.colors || [];
      if (colors.length > 0 && colors[0].images) {
        const keys = Object.keys(colors[0].images);
        if (keys.length > 0) img = colors[0].images[keys[0]];
      }
      html += `
        <div class="item-card">
          <img src="${escapeHTML(img)}" class="img-preview"
               onerror="this.style.background='#2E1F15';this.src=''">
          <div class="title">${escapeHTML(room.name_ar)}</div>
          <div class="subtitle">${escapeHTML(room.desc_ar || '')}</div>
          <div class="subtitle">🎨 ${colors.length} لون • 🪑 ${(room.pieces?.length || 0)} قطعة</div>
          <div class="row-actions">
            <button class="btn btn-primary btn-sm" onclick="goToRoom('${room.id}')">🎨 الألوان</button>
            <button class="btn btn-secondary btn-sm" onclick="editRoom('${room.id}')">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="deleteRoom('${room.id}')">🗑️</button>
          </div>
        </div>`;
    });
  }
  html += `</div>`;
  content.innerHTML = html;
}

window.addRoom = () => openRoomModal(
  { id: uid('room'), name_ar: '', desc_ar: '', colors: [], pieces: [] },
  true
);

window.editRoom = (id) => {
  const cat = storeData.categories.find(c => c.id === currentPath.catId);
  const room = cat.rooms.find(r => r.id === id);
  if (room) openRoomModal(room, false);
};

function openRoomModal(room, isNew) {
  openModal(`
    <h3>${isNew ? '➕ إضافة غرفة' : '✏️ تعديل الغرفة'}</h3>
    <div class="field"><label>اسم الغرفة</label>
      <input type="text" id="roomName" value="${escapeHTML(room.name_ar)}"></div>
    <div class="field"><label>الوصف</label>
      <textarea id="roomDesc">${escapeHTML(room.desc_ar || '')}</textarea></div>
    <div class="actions">
      <button class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
      <button class="btn btn-primary" onclick="saveRoom('${room.id}', ${isNew})">💾 حفظ</button>
    </div>`);
}

window.saveRoom = (id, isNew) => {
  const name = document.getElementById('roomName').value.trim();
  if (!name) { showStatus('لازم اسم الغرفة', 'err'); return; }
  const cat = storeData.categories.find(c => c.id === currentPath.catId);
  const desc = document.getElementById('roomDesc').value.trim();
  if (isNew) {
    cat.rooms.push({ id, name_ar: name, desc_ar: desc, colors: [], pieces: [] });
  } else {
    const room = cat.rooms.find(r => r.id === id);
    room.name_ar = name; room.desc_ar = desc;
  }
  markDirty(); closeModal(); render();
  showStatus('✅ تم', 'ok');
};

window.deleteRoom = (id) => {
  if (!confirm('هل أنت متأكد من حذف الغرفة؟')) return;
  const cat = storeData.categories.find(c => c.id === currentPath.catId);
  cat.rooms = cat.rooms.filter(r => r.id !== id);
  markDirty(); render();
  showStatus('🗑️ تم الحذف', 'ok');
};

// ============================================================
// عرض الألوان والصور
// ============================================================
function renderColors(content) {
  const cat = storeData.categories.find(c => c.id === currentPath.catId);
  const room = cat?.rooms?.find(r => r.id === currentPath.roomId);
  if (!room) { goHome(); return; }
  const colors = room.colors || [];

  let html = `
    <div class="quick-actions">
      <button class="btn btn-primary" onclick="addColor()">➕ إضافة لون</button>
      <button class="btn btn-secondary" onclick="editPieces()">🪑 القطع والأسعار</button>
    </div>`;

  if (colors.length === 0) {
    html += `<div class="empty"><span class="icon">🎨</span>مفيش ألوان في الغرفة دي</div>`;
  } else {
    colors.forEach((color, ci) => {
      const imgs = color.images || {};
      const keys = Object.keys(imgs);
      const pendingKey = `${cat.id}::${room.id}::${color.id}`;
      const pending = pendingImages[pendingKey] || [];

      html += `
        <div class="color-block">
          <div class="color-head">
            <div class="big-dot" style="background:${escapeHTML(color.hex || '#D4B896')}"></div>
            <div class="name">${escapeHTML(color.name_ar)}</div>
            <div class="actions">
              <button class="btn btn-secondary btn-sm" onclick="editColor(${ci})">✏️</button>
              <button class="btn btn-danger btn-sm" onclick="deleteColor(${ci})">🗑️</button>
            </div>
          </div>
          <div class="images-grid">`;

      // الصور المحفوظة
      keys.forEach(key => {
        const keyEnc = encodeURIComponent(key);
        html += `
          <div class="image-item">
            <img src="${escapeHTML(imgs[key])}" onerror="this.style.background='#2E1F15'">
            <div class="label">${escapeHTML(key)}</div>
            <button class="del" onclick="deleteImage(${ci}, '${keyEnc.replace(/'/g, '%27')}')">✕</button>
          </div>`;
      });

      // الصور المعلقة
      pending.forEach((file, pi) => {
        html += `
          <div class="image-item">
            <img src="${URL.createObjectURL(file)}">
            <div class="label">قيد الرفع</div>
            <button class="del" onclick="cancelPendingImage('${pendingKey}', ${pi})">✕</button>
            <div class="pending-tag">⏳</div>
          </div>`;
      });

      // زر الإضافة
      html += `
            <div class="img-add-btn" onclick="addImage(${ci})">
              📷<small>إضافة صورة</small>
            </div>
          </div>
        </div>`;
    });
  }

  content.innerHTML = html;
}

window.cancelPendingImage = (key, index) => {
  if (!pendingImages[key]) return;
  pendingImages[key].splice(index, 1);
  if (pendingImages[key].length === 0) delete pendingImages[key];
  render();
};

window.addColor = () => openColorModal({ id: uid('color'), name_ar: '', hex: '#D4B896' }, true);

window.editColor = (ci) => {
  const cat = storeData.categories.find(c => c.id === currentPath.catId);
  const room = cat.rooms.find(r => r.id === currentPath.roomId);
  openColorModal(room.colors[ci], false, ci);
};

function openColorModal(color, isNew, ci) {
  openModal(`
    <h3>${isNew ? '➕ إضافة لون' : '✏️ تعديل اللون'}</h3>
    <div class="field"><label>اسم اللون</label>
      <input type="text" id="colorName" value="${escapeHTML(color.name_ar)}" placeholder="مثال: بيج"></div>
    <div class="field"><label>كود اللون (Hex)</label>
      <input type="text" id="colorHex" value="${escapeHTML(color.hex)}" placeholder="#D4B896"></div>
    <div class="actions">
      <button class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
      <button class="btn btn-primary" onclick="saveColor('${color.id}', ${isNew}, ${ci ?? 'null'})">💾 حفظ</button>
    </div>`);
}

window.saveColor = (id, isNew, ci) => {
  const name = document.getElementById('colorName').value.trim();
  if (!name) { showStatus('لازم اسم اللون', 'err'); return; }
  const cat = storeData.categories.find(c => c.id === currentPath.catId);
  const room = cat.rooms.find(r => r.id === currentPath.roomId);
  const hex = document.getElementById('colorHex').value.trim() || '#D4B896';
  if (isNew) {
    room.colors.push({ id, name_ar: name, hex, images: {} });
  } else {
    room.colors[ci].name_ar = name;
    room.colors[ci].hex = hex;
  }
  markDirty(); closeModal(); render();
  showStatus('✅ تم', 'ok');
};

window.deleteColor = (ci) => {
  if (!confirm('حذف اللون ده وكل صوره؟')) return;
  const cat = storeData.categories.find(c => c.id === currentPath.catId);
  const room = cat.rooms.find(r => r.id === currentPath.roomId);
  room.colors.splice(ci, 1);
  markDirty(); render();
  showStatus('🗑️ تم الحذف', 'ok');
};

// ============================================================
// إضافة صورة (رفع من الجهاز مباشر + معاينة فورية)
// ============================================================
window.addImage = (ci) => {
  const cat = storeData.categories.find(c => c.id === currentPath.catId);
  const room = cat.rooms.find(r => r.id === currentPath.roomId);
  const color = room.colors[ci];

  openModal(`
    <h3>➕ إضافة صورة</h3>
    <div class="field"><label>عنوان الصورة (زي: السرير، الدولاب)</label>
      <input type="text" id="imgKey" placeholder="الغرفة كاملة" value="صورة جديدة"></div>
    <div class="field"><label>رابط الصورة (اختياري)</label>
      <input type="text" id="imgUrl" placeholder="https://..."></div>
    <div style="text-align:center;color:var(--text-muted);margin:10px 0;">— أو —</div>
    <button class="btn btn-secondary" style="width:100%" id="pickFileBtn">📤 اختر صورة من جهازك</button>
    <div id="previewBox" style="margin-top:12px;"></div>
    <div class="actions">
      <button class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
      <button class="btn btn-primary" onclick="saveImage(${ci})">💾 حفظ</button>
    </div>`);

  let chosenFile = null;
  document.getElementById('pickFileBtn').onclick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      chosenFile = e.target.files[0];
      if (!chosenFile) return;
      document.getElementById('previewBox').innerHTML =
        `<img src="${URL.createObjectURL(chosenFile)}" style="width:100%;max-height:200px;object-fit:cover;border-radius:8px;">`;
    };
    input.click();
  };

  window.__currentImageFile = () => chosenFile;
};

window.saveImage = (ci) => {
  const key = document.getElementById('imgKey').value.trim();
  if (!key) { showStatus('لازم عنوان الصورة', 'err'); return; }
  const url = document.getElementById('imgUrl').value.trim();
  const file = window.__currentImageFile && window.__currentImageFile();

  if (!url && !file) { showStatus('لازم تختار صورة أو تحط رابط', 'err'); return; }

  const cat = storeData.categories.find(c => c.id === currentPath.catId);
  const room = cat.rooms.find(r => r.id === currentPath.roomId);
  const color = room.colors[ci];

  if (file) {
    // نحفظها كمعلقة عشان ترفع مع الحفظ
    const pendingKey = `${cat.id}::${room.id}::${color.id}`;
    if (!pendingImages[pendingKey]) pendingImages[pendingKey] = [];
    // نضيف اسم عنوان الصورة كـ metadata
    file.__label = key;
    pendingImages[pendingKey].push(file);
    // نخزّن العنوان في مكان مؤقت على الصورة
    if (!color.images) color.images = {};
    // بنسجل مكان مؤقت وهنستبدله بعد الرفع
    // نخلي العنوان الأساسي
    color.images[key] = '';
    showStatus('📎 الصورة جاهزة للرفع - اضغط "حفظ ونشر"', 'warn');
  } else {
    if (!color.images) color.images = {};
    color.images[key] = url;
  }

  markDirty(); closeModal(); render();
  showStatus('✅ تمت الإضافة', 'ok');
};

window.deleteImage = (ci, keyEncoded) => {
  const key = decodeURIComponent(keyEncoded);
  if (!confirm('حذف الصورة؟')) return;
  const cat = storeData.categories.find(c => c.id === currentPath.catId);
  const room = cat.rooms.find(r => r.id === currentPath.roomId);
  delete room.colors[ci].images[key];
  markDirty(); render();
  showStatus('🗑️ تم الحذف', 'ok');
};

// ============================================================
// القطع والأسعار
// ============================================================
window.editPieces = () => {
  const cat = storeData.categories.find(c => c.id === currentPath.catId);
  const room = cat.rooms.find(r => r.id === currentPath.roomId);
  const pieces = room.pieces || [];

  const rows = pieces.map((p, i) => `
    <div style="border:1px solid var(--border);padding:10px;border-radius:8px;margin-bottom:10px;">
      <div class="row-2">
        <div><label>الاسم</label>
          <input type="text" data-pi="${i}" data-pk="name_ar" value="${escapeHTML(p.name_ar)}"></div>
        <div><label>المقاسات</label>
          <input type="text" data-pi="${i}" data-pk="dimensions" value="${escapeHTML(p.dimensions || '')}"></div>
      </div>
      <div class="row-2" style="margin-top:8px;">
        <div><label>السعر</label>
          <input type="number" data-pi="${i}" data-pk="price" value="${p.price || 0}"></div>
        <div><label>سعر العرض (0 = مفيش)</label>
          <input type="number" data-pi="${i}" data-pk="offerPrice" value="${p.offerPrice || 0}"></div>
      </div>
      <div class="checkbox-row" style="margin-top:6px;">
        <input type="checkbox" data-pi="${i}" data-pk="fullRoom" ${p.fullRoom ? 'checked' : ''}>
        <label>قطعة "الغرفة كاملة"</label>
      </div>
      <button class="btn btn-danger btn-sm" style="margin-top:8px;" onclick="removePiece(${i})">🗑️ حذف القطعة</button>
    </div>`).join('');

  openModal(`
    <h3>🪑 القطع والأسعار</h3>
    <div id="piecesContainer">${rows || '<p style="color:var(--text-muted);text-align:center;padding:20px;">مفيش قطع</p>'}</div>
    <button class="btn btn-secondary" style="width:100%;margin-top:10px;" onclick="addPiece()">➕ إضافة قطعة</button>
    <div class="actions">
      <button class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
      <button class="btn btn-primary" onclick="savePieces()">💾 حفظ</button>
    </div>`);
};

window.addPiece = () => {
  const cat = storeData.categories.find(c => c.id === currentPath.catId);
  const room = cat.rooms.find(r => r.id === currentPath.roomId);
  if (!room.pieces) room.pieces = [];
  // نجمع أي تعديلات من المدخلات القديمة الأول
  collectPiecesInputs();
  room.pieces.push({ name_ar: 'قطعة جديدة', dimensions: '', price: 0, offerPrice: 0, fullRoom: false });
  editPieces();
};

function collectPiecesInputs() {
  const cat = storeData.categories.find(c => c.id === currentPath.catId);
  const room = cat.rooms.find(r => r.id === currentPath.roomId);
  if (!room || !room.pieces) return;
  document.querySelectorAll('#piecesContainer [data-pi]').forEach(input => {
    const i = +input.dataset.pi;
    const k = input.dataset.pk;
    if (!room.pieces[i]) return;
    let v = input.value;
    if (k === 'price' || k === 'offerPrice') v = Number(v) || 0;
    if (k === 'fullRoom') v = input.checked;
    room.pieces[i][k] = v;
  });
}

window.removePiece = (i) => {
  const cat = storeData.categories.find(c => c.id === currentPath.catId);
  const room = cat.rooms.find(r => r.id === currentPath.roomId);
  collectPiecesInputs();
  room.pieces.splice(i, 1);
  editPieces();
};

window.savePieces = () => {
  collectPiecesInputs();
  markDirty(); closeModal(); render();
  showStatus('✅ تم', 'ok');
};

// ============================================================
// الإعدادات العامة
// ============================================================
window.editSettings = () => {
  const c = storeData.config || {};
  const s = storeData.social || {};
  openModal(`
    <h3>⚙️ الإعدادات العامة</h3>
    <div class="field"><label>اسم المتجر بالعربي</label>
      <input type="text" id="cfgBrandAr" value="${escapeHTML(c.brand_ar || '')}"></div>
    <div class="field"><label>اسم المتجر بالإنجليزي</label>
      <input type="text" id="cfgBrandEn" value="${escapeHTML(c.brand_en || '')}"></div>
    <div class="field"><label>السطر التعريفي</label>
      <input type="text" id="cfgTag" value="${escapeHTML(c.tagline_ar || '')}"></div>
    <div class="field"><label>نص "عنا"</label>
      <textarea id="cfgAbout">${escapeHTML(c.about_ar || '')}</textarea></div>
    <div class="field"><label>رقم الواتساب (بصيغة دولية بدون +)</label>
      <input type="text" id="cfgWa" value="${escapeHTML(c.whatsappNumber || '')}" placeholder="201008070087"></div>
    <div class="field"><label>رقم الهاتف</label>
      <input type="text" id="cfgPhone" value="${escapeHTML((c.phones || [])[0] || '')}"></div>
    <div class="field"><label>العنوان</label>
      <input type="text" id="cfgAddr" value="${escapeHTML(c.address_ar || '')}"></div>
    <div class="field"><label>رابط الفيسبوك</label>
      <input type="text" id="cfgFb" value="${escapeHTML(s.facebook || '')}"></div>
    <div class="field"><label>رابط صورة الـ Hero</label>
      <input type="text" id="cfgHero" value="${escapeHTML(c.heroImage || '')}"></div>
    <div style="display:flex;gap:8px;margin-bottom:14px;">
      <button class="btn btn-secondary btn-sm" style="flex:1" onclick="pickImageFor('cfgHero')">📤 رفع صورة Hero من الجهاز</button>
    </div>
    <div class="actions">
      <button class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
      <button class="btn btn-primary" onclick="saveSettings()">💾 حفظ</button>
    </div>`);
};

window.saveSettings = () => {
  if (!storeData.config) storeData.config = {};
  if (!storeData.social) storeData.social = {};
  storeData.config.brand_ar = document.getElementById('cfgBrandAr').value.trim();
  storeData.config.brand_en = document.getElementById('cfgBrandEn').value.trim();
  storeData.config.tagline_ar = document.getElementById('cfgTag').value.trim();
  storeData.config.about_ar = document.getElementById('cfgAbout').value.trim();
  storeData.config.whatsappNumber = document.getElementById('cfgWa').value.trim();
  storeData.config.phones = [document.getElementById('cfgPhone').value.trim()];
  storeData.config.address_ar = document.getElementById('cfgAddr').value.trim();
  storeData.config.heroImage = document.getElementById('cfgHero').value.trim();
  storeData.social.facebook = document.getElementById('cfgFb').value.trim();
  markDirty(); closeModal();
  showStatus('✅ تم', 'ok');
};

// ============================================================
// نهاية الملف
// ============================================================
console.log('🎛️ Admin Panel Part 2/2 loaded - جاهز للعمل');