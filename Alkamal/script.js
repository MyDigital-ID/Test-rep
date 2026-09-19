/* =========================================================
   الكمال — أعمال الصيانة المنزلية
   ========================================================= */
const WHATSAPP_NUMBER = "201282412760"; // بدون + أو أصفار زيادة

/* ---------------------------------------------------------
   1) بيانات الخدمات
   --------------------------------------------------------- */
const SERVICES = {
  electricity: {
    title: "أعمال الكهرباء",
    items: [
      "تأسيس من البداية (يشمل شقة بالكامل من أعمال حفر وتأسيس ودفن مواسير أسلاك الكهرباء وتنسيق مفاتيح الإضاءة وفيش الكهرباء ولوحة تحكم أساسية)",
      "تعديل أو زيادة فيش الكهرباء",
      "تركيبات الإضاءة الجديدة من نجف أو أطباق إضاءة أو أباليك على الحوائط الجانبية",
      "إصلاح قفلات الكهرباء بسبب ماس كهربائي أو خطأ في التركيبات",
      "تركيب مفاتيح ذات الأحمال العالية والخاصة بأجهزة التكييف",
    ],
    other: "صيانات أخرى (برجاء شرح الأمر برسالة نصية، أو صوتيًا مباشرة في واتساب)",
  },
  painting: {
    title: "أعمال الدهانات",
    items: [
      "أعمال دهانات وتأسيس من البداية",
      "دهان شقة بالكامل (بها دهانات سابقة)",
      "دهان غرفة أو أكثر",
      "دهانات جزئية وإصلاحات تجميلية لإعادة الشكل إلى أصله بسبب تلف أو رطوبة في الحوائط",
    ],
    other: "أعمال دهانات أخرى (برجاء وصف الأمر هنا)",
  },
  plumbing: {
    title: "أعمال السباكة",
    items: [
      "أعمال تأسيس السباكة من البداية",
      "تركيب أحواض - بانيو",
      "تغيير وصلات تالفة لحوض المطبخ",
      "تغيير وصلات تالفة لحوض الحمام",
      "تركيب أو تغيير وصلات السخان",
      "تركيب أو تغيير خلاطات المطبخ أو الحمام",
    ],
    other: "أعمال سباكة أخرى (برجاء شرح الأمر برسالة نصية، أو أرسلها صوتيًا مباشرة في واتساب بعد الإرسال)",
  },
};

/* سلة الاختيارات: كل عنصر { id, service, text, note } */
let cart = [];
let cartIdCounter = 0;

/* ---------------------------------------------------------
   2) الشاشة الافتتاحية (Splash)
   --------------------------------------------------------- */
function runSplash(){
  const splash = document.getElementById('splash');
  const app = document.getElementById('app');

  // بعد ثانيتين ونص: تشغيل تأثيرات البرق/الدهان/تسريب المياه
  setTimeout(() => { splash.classList.add('zap'); }, 1500);

  // بعد 3 ثواني: فيد أوت للسبلاش + ظهور التطبيق
  setTimeout(() => {
    splash.classList.add('fade-out');
    app.classList.add('visible');
    app.removeAttribute('aria-hidden');
    setTimeout(() => { splash.remove(); }, 1100);
  }, 3000);
}

/* ---------------------------------------------------------
   3) الأركان الثلاثة (Hero triangle)
   --------------------------------------------------------- */
function initHero(){
  const pieces = document.querySelectorAll('.piece');
  pieces.forEach(p => {
    p.addEventListener('click', () => openService(p.dataset.service));
    p.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        openService(p.dataset.service);
      }
    });
  });
}

function setActivePiece(serviceKey){
  document.querySelectorAll('.piece').forEach(p => {
    p.classList.toggle('is-active', p.dataset.service === serviceKey);
    p.classList.toggle('is-dim', serviceKey && p.dataset.service !== serviceKey);
  });
}

/* ---------------------------------------------------------
   4) قسم الخدمة (Panel)
   --------------------------------------------------------- */
function openService(key){
  const data = SERVICES[key];
  if(!data) return;

  setActivePiece(key);

  const panel = document.getElementById('panel');
  const title = document.getElementById('panel-title');
  const list = document.getElementById('service-list');

  title.textContent = data.title;
  list.innerHTML = '';

  data.items.forEach((text, idx) => {
    list.appendChild(buildServiceLi(key, text, idx + 1, false));
  });
  // العنصر الأخير: "أعمال أخرى" مع حقل شرح حر
  list.appendChild(buildServiceLi(key, data.other, data.items.length + 1, true));

  panel.hidden = false;
  panel.scrollIntoView({ behavior:'smooth', block:'start' });
}

function buildServiceLi(serviceKey, text, num, isFreeText){
  const li = document.createElement('li');
  li.className = 'svc-item';
  li.dataset.service = serviceKey;
  li.dataset.text = text;

  const check = document.createElement('span');
  check.className = 'svc-check';
  check.innerHTML = '<svg viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M4 12l5 5L20 6"/></svg>';

  const body = document.createElement('div');
  body.style.flex = '1';

  const p = document.createElement('p');
  p.innerHTML = `<span class="svc-num">${num}.</span> ${text}`;
  body.appendChild(p);

  let textarea = null;
  if(isFreeText){
    const wrap = document.createElement('div');
    wrap.className = 'svc-freetext has-field';
    textarea = document.createElement('textarea');
    textarea.rows = 2;
    textarea.placeholder = 'اكتب تفاصيل الطلب هنا...';
    textarea.addEventListener('click', e => e.stopPropagation());
    textarea.addEventListener('input', () => {
      const item = cart.find(c => c.liRef === li);
      if(item) item.note = textarea.value;
    });
    wrap.appendChild(textarea);
    body.appendChild(wrap);
  }

  li.appendChild(check);
  li.appendChild(body);

  li.addEventListener('click', () => {
    const already = cart.find(c => c.liRef === li);
    if(already){
      cart = cart.filter(c => c !== already);
      li.classList.remove('selected');
    } else {
      cart.push({
        id: ++cartIdCounter,
        service: SERVICES[serviceKey].title,
        text,
        note: textarea ? textarea.value : '',
        liRef: li,
      });
      li.classList.add('selected');
    }
    renderCart();
  });

  return li;
}

document.getElementById('back-btn').addEventListener('click', () => {
  document.getElementById('panel').hidden = true;
  setActivePiece(null);
});

/* ---------------------------------------------------------
   5) بوكس الواتساب — الطلب
   --------------------------------------------------------- */
function renderCart(){
  const list = document.getElementById('cart-list');
  const emptyMsg = document.getElementById('cart-empty');
  const sendBtn = document.getElementById('cart-send');

  list.innerHTML = '';

  if(cart.length === 0){
    list.appendChild(emptyMsg);
    sendBtn.disabled = true;
    return;
  }
  sendBtn.disabled = false;

  cart.forEach(item => {
    const li = document.createElement('li');

    const textSpan = document.createElement('span');
    textSpan.className = 'cart-item-text';
    textSpan.innerHTML = `<strong>${item.service}:</strong> ${item.text}` +
      (item.note ? `<span class="cart-item-note">ملاحظة: ${escapeHtml(item.note)}</span>` : '');

    const removeBtn = document.createElement('button');
    removeBtn.className = 'cart-remove';
    removeBtn.setAttribute('aria-label', 'حذف هذا الاختيار');
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => {
      cart = cart.filter(c => c.id !== item.id);
      item.liRef.classList.remove('selected');
      renderCart();
    });

    li.appendChild(textSpan);
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.getElementById('cart-send').addEventListener('click', () => {
  if(cart.length === 0) return;
  let msg = "السلام عليكم، محتاج أطلب من *(الكمال لأعمال الصيانه)* الخدمات الآتية:\n\n";
  cart.forEach((item, i) => {
    msg += `${i + 1}) [${item.service}] ${item.text}`;
    if(item.note) msg += `\n   ملاحظة: ${item.note}`;
    msg += '\n';
  });
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
});

/* ---------------------------------------------------------
   6) بوكس الواتساب — الملاحظات والتقييم
   --------------------------------------------------------- */
let ratingValue = 0;
document.querySelectorAll('.star').forEach(star => {
  star.addEventListener('click', () => {
    ratingValue = Number(star.dataset.val);
    document.querySelectorAll('.star').forEach(s => {
      s.classList.toggle('active', Number(s.dataset.val) <= ratingValue);
    });
  });
});

document.getElementById('feedback-send').addEventListener('click', () => {
  const text = document.getElementById('feedback-text').value.trim();
  if(!text && !ratingValue){
    document.getElementById('feedback-text').focus();
    return;
  }
  let msg = "السلام عليكم، ده تقييمي وملاحظاتي على الخدمة اللي اتقدمت لي من *الكمال لأعمال الصيانه*:\n\n";
  if(ratingValue) msg += `التقييم: ${'★'.repeat(ratingValue)}${'☆'.repeat(5 - ratingValue)}\n`;
  if(text) msg += `الملاحظات: ${text}`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
});

/* ---------------------------------------------------------
   7) تثبيت التطبيق (PWA)
   --------------------------------------------------------- */
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  if(!sessionStorage.getItem('alkamal-install-dismissed')){
    document.getElementById('install-banner').hidden = false;
  }
});

document.getElementById('install-now').addEventListener('click', async () => {
  document.getElementById('install-banner').hidden = true;
  if(deferredInstallPrompt){
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
  }
});

document.getElementById('install-later').addEventListener('click', () => {
  document.getElementById('install-banner').hidden = true;
  sessionStorage.setItem('alkamal-install-dismissed', '1');
});

/* ---------------------------------------------------------
   تشغيل
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  runSplash();
  initHero();
  renderCart();
});
