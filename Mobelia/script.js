// ============================================================
// Modern Furniture - Main Logic (script.js) - Version 3.0
// ============================================================

const defaultData = {
  config: {
    brand_ar: "الموبيليات العصريه",
    brand_en: "Modern Furniture",
    tagline_ar: "لمسه فنيه في عالم الاثاث",
    about_ar: "نقدم افضل تصميمات الموبيليا بلمسه عصريه و أختياريه لتتوافق مع إحتياجاتك و ذوقك و حجم المساحه الفعليه .. و نستخدم في جميع مصنوعاتنا من قطع الأثاث و الموبيليا افضل أنواع الخامات من أخشاب و اقمشه عالية الجودة لننول رضائكم",
    whatsappNumber: "201008070087",
    phones: ["01008070087"],
    address_ar: "القاهرة - مصر (سيتم إضافة العنوان قريباً)",
    heroImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop"
  },
  social: { facebook: "https://www.facebook.com/modernfurniture" },
  featured: [
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800&auto=format&fit=crop"
  ],
  categories: [
    {
      id: "bedrooms", icon: "🛏️", name_ar: "غرف نوم", name_en: "Bedrooms",
      homeImg: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop",
      visible: true,
      rooms: [
        {
          id: "bedroom_1", name_ar: "غرفة نوم ماستر", desc_ar: "غرفة نوم بتصميم مودرن خشب زان",
          colors: [
            { id: "beige", name_ar: "بيج", hex: "#D4B896", images: { "الغرفة كاملة": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop", "السرير": "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop", "الدولاب": "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800&auto=format&fit=crop", "التسريحة (المرايا)": "https://images.unsplash.com/photo-1616627561950-9f746e330187?q=80&w=800&auto=format&fit=crop" } },
            { id: "white", name_ar: "أبيض", hex: "#F5F5F5", images: { "الغرفة كاملة": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop", "السرير": "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop", "الدولاب": "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800&auto=format&fit=crop" } },
            { id: "brown", name_ar: "بني", hex: "#6B4423", images: { "الغرفة كاملة": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop", "السرير": "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop" } },
            { id: "maroon", name_ar: "نبيتي", hex: "#800000", images: { "الغرفة كاملة": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop" } },
            { id: "modern", name_ar: "ألوان عصرية", hex: "#4A90E2", images: { "الغرفة كاملة": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop" } }
          ],
          pieces: [
            { name_ar: "الغرفة كاملة", dimensions: "تشمل السرير + الدولاب + التسريحة + الكومودينو", price: 35000, offerPrice: 32000, fullRoom: true },
            { name_ar: "السرير", dimensions: "180 سم × 200 سم", price: 15000, offerPrice: 13500 },
            { name_ar: "الدولاب", dimensions: "200 سم × 240 سم", price: 12000, offerPrice: 0 },
            { name_ar: "التسريحة (المرايا)", dimensions: "120 سم × 60 سم", price: 5000, offerPrice: 4500 }
          ]
        },
        {
          id: "bedroom_2", name_ar: "غرفة نوم كلاسيك", desc_ar: "غرفة نوم بتصميم كلاسيكي فخم",
          colors: [
            { id: "beige", name_ar: "بيج", hex: "#D4B896", images: { "الغرفة كاملة": "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop", "السرير": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop", "التسريحة (المرايا)": "https://images.unsplash.com/photo-1616627561950-9f746e330187?q=80&w=800&auto=format&fit=crop" } },
            { id: "brown", name_ar: "بني", hex: "#6B4423", images: { "الغرفة كاملة": "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop" } }
          ],
          pieces: [
            { name_ar: "الغرفة كاملة", dimensions: "تشمل كل القطع", price: 42000, offerPrice: 0, fullRoom: true },
            { name_ar: "السرير", dimensions: "180 سم × 200 سم", price: 18000, offerPrice: 0 },
            { name_ar: "الدولاب", dimensions: "200 سم × 240 سم", price: 15000, offerPrice: 0 }
          ]
        },
        {
          id: "bedroom_3", name_ar: "غرفة نوم مودرن", desc_ar: "غرفة نوم بتصميم مودرن بسيط",
          colors: [
            { id: "white", name_ar: "أبيض", hex: "#F5F5F5", images: { "الغرفة كاملة": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop" } }
          ],
          pieces: [
            { name_ar: "الغرفة كاملة", dimensions: "تشمل كل القطع", price: 28000, offerPrice: 25000, fullRoom: true },
            { name_ar: "السرير", dimensions: "160 سم × 200 سم", price: 12000, offerPrice: 0 }
          ]
        }
      ]
    },
    {
      id: "kids_bedrooms", icon: "🧸", name_ar: "غرف نوم أطفال", name_en: "Kids Bedrooms",
      homeImg: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=800&auto=format&fit=crop",
      visible: true,
      rooms: [
        {
          id: "kids_1", name_ar: "غرفة أطفال مبهجة", desc_ar: "غرفة أطفال بألوان مبهجة",
          colors: [
            { id: "beige", name_ar: "بيج", hex: "#D4B896", images: { "الغرفة كاملة": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=800&auto=format&fit=crop", "السرير": "https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=800&auto=format&fit=crop" } },
            { id: "modern", name_ar: "ألوان عصرية", hex: "#4A90E2", images: { "الغرفة كاملة": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=800&auto=format&fit=crop" } }
          ],
          pieces: [
            { name_ar: "الغرفة كاملة", dimensions: "تشمل كل القطع", price: 20000, offerPrice: 18000, fullRoom: true },
            { name_ar: "سرير أطفال", dimensions: "120 سم × 190 سم", price: 8000, offerPrice: 0 },
            { name_ar: "دولاب أطفال", dimensions: "150 سم × 200 سم", price: 7000, offerPrice: 6500 }
          ]
        }
      ]
    },
    {
      id: "bunk_beds", icon: "🛏️", name_ar: "سرير بدورين", name_en: "Bunk Beds",
      homeImg: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800&auto=format&fit=crop",
      visible: true,
      rooms: [
        {
          id: "bunk_1", name_ar: "سرير بدورين خشب", desc_ar: "سرير بدورين يوفر مساحة",
          colors: [
            { id: "beige", name_ar: "بيج", hex: "#D4B896", images: { "السرير": "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800&auto=format&fit=crop" } }
          ],
          pieces: [
            { name_ar: "سرير بدورين", dimensions: "100 سم × 200 سم", price: 9500, offerPrice: 0 }
          ]
        }
      ]
    },
    {
      id: "wardrobes", icon: "🚪", name_ar: "دوالايب", name_en: "Wardrobes",
      homeImg: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?q=80&w=800&auto=format&fit=crop",
      visible: true,
      rooms: [
        {
          id: "wardrobe_1", name_ar: "دولاب 3 ضلفة", desc_ar: "دولاب خشب زان",
          colors: [
            { id: "beige", name_ar: "بيج", hex: "#D4B896", images: { "الدولاب": "https://images.unsplash.com/photo-1558997519-83ea9252edf8?q=80&w=800&auto=format&fit=crop" } }
          ],
          pieces: [
            { name_ar: "دولاب", dimensions: "150 سم × 240 سم", price: 11000, offerPrice: 0 }
          ]
        }
      ]
    },
    {
      id: "living_rooms", icon: "🛋️", name_ar: "أنتريهات", name_en: "Living Rooms",
      homeImg: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
      visible: true,
      rooms: [
        {
          id: "living_1", name_ar: "أنتريه مودرن", desc_ar: "أنتريه بتصميم عصري",
          colors: [
            { id: "beige", name_ar: "بيج", hex: "#D4B896", images: { "الأنتريه كامل": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop", "الكنبة": "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=800&auto=format&fit=crop", "الفوتيه": "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800&auto=format&fit=crop" } },
            { id: "maroon", name_ar: "نبيتي", hex: "#800000", images: { "الأنتريه كامل": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop" } }
          ],
          pieces: [
            { name_ar: "الأنتريه كامل", dimensions: "كنبة + 2 فوتيه + طاولة", price: 30000, offerPrice: 28000, fullRoom: true },
            { name_ar: "كنبة 3 مقاعد", dimensions: "220 سم × 90 سم", price: 18000, offerPrice: 16000 },
            { name_ar: "فوتيه", dimensions: "80 سم × 85 سم", price: 5000, offerPrice: 0 }
          ]
        }
      ]
    },
    {
      id: "salons", icon: "🪞", name_ar: "صالونات", name_en: "Salons",
      homeImg: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop",
      visible: true,
      rooms: [
        { id: "salon_1", name_ar: "صالون كلاسيك", desc_ar: "صالون بتصميم كلاسيكي", colors: [{ id: "beige", name_ar: "بيج", hex: "#D4B896", images: { "الصالون": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop" } }], pieces: [{ name_ar: "ركنة صالون", dimensions: "300 سم × 200 سم", price: 25000, offerPrice: 0 }] }
      ]
    },
    {
      id: "armchairs", icon: "🪑", name_ar: "فوتيهات", name_en: "Armchairs",
      homeImg: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800&auto=format&fit=crop",
      visible: true,
      rooms: [
        { id: "armchair_1", name_ar: "فوتيه منجد", desc_ar: "فوتيه مريح ومنجد", colors: [{ id: "beige", name_ar: "بيج", hex: "#D4B896", images: { "الفوتيه": "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800&auto=format&fit=crop" } }], pieces: [{ name_ar: "فوتيه", dimensions: "80 سم × 85 سم", price: 4500, offerPrice: 0 }] }
      ]
    },
    {
      id: "dining", icon: "🍽️", name_ar: "سفرة وطاولات طعام", name_en: "Dining",
      homeImg: "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=800&auto=format&fit=crop",
      visible: true,
      rooms: [
        { id: "dining_1", name_ar: "سفرة خشب زان", desc_ar: "سفرة بأشكال مختلفة", colors: [{ id: "beige", name_ar: "بيج", hex: "#D4B896", images: { "السفرة": "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=800&auto=format&fit=crop", "الطاولة": "https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=800&auto=format&fit=crop" } }], pieces: [{ name_ar: "طاولة سفرة", dimensions: "130 سم × 200 سم", price: 12000, offerPrice: 0 }, { name_ar: "كرسي خشب", dimensions: "45 سم × 95 سم", price: 1500, offerPrice: 0 }] }
      ]
    },
    {
      id: "wooden_chairs", icon: "🪵", name_ar: "كراسي خشبية", name_en: "Wooden Chairs",
      homeImg: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800&auto=format&fit=crop",
      visible: true,
      rooms: [
        { id: "chair_1", name_ar: "كرسي خشب", desc_ar: "كرسي خشب متين", colors: [{ id: "beige", name_ar: "بيج", hex: "#D4B896", images: { "الكرسي": "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800&auto=format&fit=crop" } }], pieces: [{ name_ar: "كرسي خشب", dimensions: "45 سم × 95 سم", price: 1500, offerPrice: 0 }] }
      ]
    },
    {
      id: "small_tables", icon: "🪑", name_ar: "طاولات صغيرة", name_en: "Small Tables",
      homeImg: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?q=80&w=800&auto=format&fit=crop",
      visible: true,
      rooms: [
        { id: "table_1", name_ar: "طاولة صغيرة", desc_ar: "طاولة جانبية", colors: [{ id: "beige", name_ar: "بيج", hex: "#D4B896", images: { "الطاولة": "https://images.unsplash.com/photo-1532372320572-cda25653a26d?q=80&w=800&auto=format&fit=crop" } }], pieces: [{ name_ar: "طاولة صغيرة", dimensions: "70 سم × 80 سم", price: 2500, offerPrice: 0 }] }
      ]
    },
    {
      id: "accessories", icon: "🖼️", name_ar: "إكسسوارات", name_en: "Accessories",
      homeImg: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=800&auto=format&fit=crop",
      visible: true,
      rooms: [
        { id: "acc_1", name_ar: "علاقة ملابس", desc_ar: "علاقة ملابس خشبية", colors: [{ id: "beige", name_ar: "بيج", hex: "#D4B896", images: { "العلاقة": "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=800&auto=format&fit=crop" } }], pieces: [{ name_ar: "علاقة ملابس", dimensions: "50 سم × 180 سم", price: 1800, offerPrice: 0 }] }
      ]
    }
  ]
};

let siteData = null;
let currentCategory = null;
let currentRoom = null;
let currentColorId = null;
let swiperInstance = null;

document.addEventListener('DOMContentLoaded', async () => {
  // ننتظر تحميل الخطوط الأول عشان مايحصلش "نطة" في الخط
  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  } catch(e) {}

  // بعدين نبدأ مؤقت الإخفاء
  setTimeout(() => {
    const splash = document.getElementById('splashScreen');
    if (splash) {
      splash.classList.add('fade-out');
      setTimeout(() => splash.style.display = 'none', 1000);
    }
  }, 2000);

  loadData();
});

async function loadData() {
  try {
    const res = await fetch('site-data.json?t=' + Date.now());
    const data = await res.json();
    // لو الملف فاضي أو مالوش أقسام، نستخدم الافتراضي
    if (!data || !data.categories || data.categories.length === 0) {
      console.log('📦 Using default embedded data (11 categories)');
      siteData = defaultData;
    } else {
      console.log('✅ Loaded from site-data.json');
      siteData = data;
    }
  } catch (e) {
    console.log('📦 Using default embedded data');
    siteData = defaultData;
  }
  initApp();
}

function initApp() {
  setupMenu(); setupHeader(); setupFooter(); renderHome(); setupInstallPrompt();
  const heroCta = document.getElementById('heroCta');
  if (heroCta) heroCta.onclick = () => document.getElementById('catsSection').scrollIntoView({ behavior: 'smooth' });
}

function setupMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const closeMenu = document.getElementById('closeMenu');
  const sideMenu = document.getElementById('sideMenu');
  const overlay = document.getElementById('sideOverlay');
  const toggleMenu = (open) => { sideMenu.classList.toggle('open', open); overlay.classList.toggle('show', open); };
  menuBtn.addEventListener('click', () => toggleMenu(true));
  closeMenu.addEventListener('click', () => toggleMenu(false));
  overlay.addEventListener('click', () => toggleMenu(false));
  document.querySelectorAll('.side-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const nav = link.getAttribute('data-nav');
      if (nav === 'home') { navigateTo('home'); toggleMenu(false); } 
      else if (nav === 'about') { document.getElementById('aboutBox').classList.remove('hidden'); document.getElementById('contactBox').classList.add('hidden'); } 
      else if (nav === 'contact') { document.getElementById('contactBox').classList.remove('hidden'); document.getElementById('aboutBox').classList.add('hidden'); }
    });
  });
  if (siteData.config) {
    document.getElementById('contactWhatsapp').href = `https://wa.me/${siteData.config.whatsappNumber}`;
    document.getElementById('contactFacebook').href = siteData.social?.facebook || '#';
    const aboutText = document.getElementById('aboutText');
    if (aboutText && siteData.config.about_ar) aboutText.textContent = siteData.config.about_ar;
  }
}

function setupHeader() {
  document.getElementById('brandHome').addEventListener('click', () => navigateTo('home'));
  const callBtn = document.getElementById('callBtn');
  if (siteData.config && siteData.config.phones && siteData.config.phones[0]) callBtn.onclick = () => window.location.href = `tel:${siteData.config.phones[0]}`;
}

function setupFooter() {
  if (!siteData.config) return;
  document.getElementById('whatsappLink').href = `https://wa.me/${siteData.config.whatsappNumber}`;
  document.getElementById('facebookLink').href = siteData.social?.facebook || '#';
  document.getElementById('footAddress').textContent = siteData.config.address_ar || '';
  const phoneLink = document.querySelector('.footer-line a');
  if (phoneLink) { phoneLink.href = `tel:${siteData.config.phones[0]}`; phoneLink.textContent = siteData.config.phones[0]; }
}

function navigateTo(view, data = null, fromHistory = false) {
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  if (view === 'home') {
    document.getElementById('view-home').classList.remove('hidden');
    currentCategory = null; currentRoom = null;
    if (!fromHistory) window.history.pushState({ view: 'home' }, '', '#home');
  } else if (view === 'category') {
    currentCategory = data; currentRoom = null;
    renderCategory(data);
    document.getElementById('view-category').classList.remove('hidden');
    if (!fromHistory) window.history.pushState({ view: 'category', catId: data }, '', `#category-${data}`);
  } else if (view === 'room') {
    currentRoom = data.roomId; currentColorId = null;
    renderRoom(data.catId, data.roomId);
    document.getElementById('view-room').classList.remove('hidden');
    if (!fromHistory) window.history.pushState({ view: 'room', catId: data.catId, roomId: data.roomId }, '', `#room-${data.catId}-${data.roomId}`);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('popstate', (e) => {
  if (e.state) {
    if (e.state.view === 'home') navigateTo('home');
    else if (e.state.view === 'category') navigateTo('category', e.state.catId);
    else if (e.state.view === 'room') navigateTo('room', { catId: e.state.catId, roomId: e.state.roomId });
  } else navigateTo('home');
});

function renderHome() {
  if (!siteData) return;
  const heroBox = document.getElementById('heroBox');
  if (siteData.config?.heroImage) heroBox.style.setProperty('--hero-img', `url('${siteData.config.heroImage}')`);

  const sliderTrack = document.getElementById('featuredSlider');
  if (siteData.featured && siteData.featured.length > 0) {
    let slidesHTML = '';
    siteData.featured.forEach(img => { slidesHTML += `<div class="swiper-slide slider-item"><img src="${img}" alt="صورة مميزة" loading="lazy"></div>`; });
    sliderTrack.innerHTML = `<div class="swiper-wrapper">${slidesHTML}</div><div class="slider-dots"></div>`;
    if (typeof Swiper !== 'undefined') {
      if (swiperInstance) swiperInstance.destroy(true, true);
      swiperInstance = new Swiper('#featuredSlider', {
        effect: 'coverflow', grabCursor: true, centeredSlides: true, slidesPerView: 'auto', loop: true,
        coverflowEffect: { rotate: 0, stretch: 0, depth: 100, modifier: 2.5, slideShadows: false },
        pagination: { el: '.slider-dots', clickable: true, bulletClass: 'dot', bulletActiveClass: 'active' }
      });
    }
  }

  const catsGrid = document.getElementById('catsGrid');
  catsGrid.innerHTML = '';
  console.log('📋 Rendering', siteData.categories.length, 'categories');
  if (siteData.categories) {
    siteData.categories.forEach(cat => {
      if (cat.visible === false) return;
      const card = document.createElement('button');
      card.className = 'cat-card';
      card.innerHTML = `
        <img src="${cat.homeImg}" alt="${cat.name_ar}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300/26190F/C89B5E?text=${encodeURIComponent(cat.name_ar)}'">
        <div class="cat-card-shade"></div>
        <div class="cat-card-text">
          <span class="cat-card-ar">${cat.icon || '🛋️'} ${cat.name_ar}</span>
          <span class="cat-card-en">${cat.name_en || ''}</span>
        </div>
        <div class="cat-card-go"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m15 6-6 6 6 6"/></svg></div>`;
      card.addEventListener('click', () => navigateTo('category', cat.id));
      catsGrid.appendChild(card);
    });
  }
}

function renderCategory(catId) {
  const cat = siteData.categories.find(c => c.id === catId);
  if (!cat) return;
  document.getElementById('categoryTitle').textContent = `${cat.icon || ''} ${cat.name_ar}`;
  const roomsList = document.getElementById('roomsList');
  roomsList.innerHTML = '';
  if (cat.rooms && cat.rooms.length > 0) {
    cat.rooms.forEach(room => {
      let roomImg = 'https://via.placeholder.com/400x300/26190F/C89B5E?text=No+Image';
      if (room.colors && room.colors.length > 0 && room.colors[0].images) {
        const firstImgKey = Object.keys(room.colors[0].images)[0];
        if (firstImgKey) roomImg = room.colors[0].images[firstImgKey];
      }
      const card = document.createElement('button');
      card.className = 'room-card';
      card.innerHTML = `
        <div class="room-card-img-box"><img src="${roomImg}" alt="${room.name_ar}" class="room-card-img" loading="lazy"></div>
        <div class="room-card-info">
          <span class="room-card-name">${room.name_ar}</span>
          <span class="room-card-desc">${room.desc_ar || 'غرفة بتصميم عصري'}</span>
          <span class="room-card-cta">عرض التفاصيل <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m15 6-6 6 6 6"/></svg></span>
        </div>`;
      card.addEventListener('click', () => navigateTo('room', { catId: cat.id, roomId: room.id }));
      roomsList.appendChild(card);
    });
  } else roomsList.innerHTML = '<p style="color: var(--text-muted); text-align: center;">لا توجد غرف.</p>';
}

function renderRoom(catId, roomId) {
  const cat = siteData.categories.find(c => c.id === catId);
  if (!cat) return;
  const room = cat.rooms.find(r => r.id === roomId);
  if (!room) return;
  document.getElementById('roomTitle').textContent = room.name_ar;

  const colorSelector = document.getElementById('colorSelector');
  const colorSelectorBox = document.getElementById('colorSelectorBox');
  colorSelector.innerHTML = '';
  if (room.colors && room.colors.length > 0) {
    colorSelectorBox.classList.remove('hidden');
    if (!currentColorId) currentColorId = room.colors[0].id;
    room.colors.forEach(color => {
      const btn = document.createElement('button');
      btn.className = `color-btn ${color.id === currentColorId ? 'selected' : ''}`;
      btn.innerHTML = `<div class="color-swatch" style="background-color: ${color.hex || '#D4B896'};"></div><span class="color-btn-label">${color.name_ar}</span>`;
      btn.addEventListener('click', () => {
        currentColorId = color.id;
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        renderGallery(room, currentColorId);
      });
      colorSelector.appendChild(btn);
    });
  } else colorSelectorBox.classList.add('hidden');

  renderGallery(room, currentColorId);

  const piecesList = document.getElementById('piecesList');
  piecesList.innerHTML = '';
  if (room.pieces && room.pieces.length > 0) {
    room.pieces.forEach(piece => {
      const row = document.createElement('div');
      row.className = 'piece-row';
      let priceHTML = piece.offerPrice > 0 ? `<span class="piece-price-old">${piece.price} ج.م</span><span class="piece-price">${piece.offerPrice} ج.م</span>` : `<span class="piece-price">${piece.price} ج.م</span>`;
      
      let actionButtons = '';
      if (piece.fullRoom) {
        actionButtons = `<button class="piece-action-btn piece-order-btn" onclick="orderFullRoom('${cat.name_ar}', '${room.name_ar}', '${piece.offerPrice || piece.price}')">🛒 اطلب الغرفة كاملة</button>`;
      } else {
        actionButtons = `
          <button class="piece-action-btn piece-order-btn" onclick="orderPiece('${cat.name_ar}', '${room.name_ar}', '${piece.name_ar}')">🛒 طلب</button>
          <button class="piece-action-btn piece-inquiry-btn" onclick="inquiryPiece('${cat.name_ar}', '${room.name_ar}', '${piece.name_ar}')">💬 استفسار</button>`;
      }

      row.innerHTML = `
        <div class="piece-info"><span class="piece-name">${piece.name_ar}</span><span class="piece-dimensions">${piece.dimensions || ''}</span></div>
        <div class="piece-price-box">${priceHTML}</div>
        <div class="piece-actions">${actionButtons}</div>`;
      piecesList.appendChild(row);
    });
  } else piecesList.innerHTML = '<p style="color: var(--text-muted);">لا توجد قطع.</p>';

  document.getElementById('roomOrderBtn').onclick = () => openWhatsApp(`مرحباً، أنا مهتم بطلب غرفة *${room.name_ar}* من قسم *${cat.name_ar}*.`);
  document.getElementById('roomInquiryBtn').onclick = () => openWhatsApp(`مرحباً، لدي استفسار بخصوص غرفة *${room.name_ar}* من قسم *${cat.name_ar}*.`);
}

function renderGallery(room, colorId) {
  const gallery = document.getElementById('roomGallery');
  gallery.innerHTML = '';
  if (!room.colors || room.colors.length === 0) return;
  let selectedColor = room.colors.find(c => c.id === colorId) || room.colors[0];
  const images = selectedColor.images || {};
  const imgKeys = Object.keys(images);
  if (imgKeys.length === 0) { gallery.innerHTML = '<p style="color: var(--text-muted); text-align: center;">لا توجد صور.</p>'; return; }
  
  imgKeys.forEach(key => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
      <div class="gallery-item-img-box">
        <img src="${images[key]}" alt="${key}" class="gallery-item-img" loading="lazy">
      </div>
      <div class="gallery-item-label">${key}</div>`;
    gallery.appendChild(item);
  });
}

function openWhatsApp(message) {
  const waNumber = siteData.config?.whatsappNumber || '201008070087';
  window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
}

window.orderPiece = (catName, roomName, pieceName) => openWhatsApp(`تأكيد طلب شراء هذا المنتج: *${pieceName}* من غرفة *${roomName}* (قسم *${catName}*).`);
window.inquiryPiece = (catName, roomName, pieceName) => openWhatsApp(`برجاء التواصل من أجل المزيد من التفاصيل حول هذا المنتج و تحديد المقاسات أو الالوان: *${pieceName}* من غرفة *${roomName}* (قسم *${catName}*).`);
window.orderFullRoom = (catName, roomName, price) => openWhatsApp(`تأكيد طلب شراء الغرفة كاملة: *${roomName}* من قسم *${catName}* بسعر *${price}* ج.م. برجاء التواصل لتأكيد الطلب.`);

function setupInstallPrompt() {
  let deferredPrompt;
  const installPrompt = document.getElementById('installPrompt');
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); deferredPrompt = e; setTimeout(() => installPrompt.classList.remove('hidden'), 3000);
  });
  document.getElementById('installNowBtn').addEventListener('click', async () => {
    installPrompt.classList.remove('hidden');
    if (deferredPrompt) { deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; }
    installPrompt.classList.add('hidden');
  });
  document.getElementById('installLaterBtn').addEventListener('click', () => installPrompt.classList.add('hidden'));
}

document.getElementById('backBtnCategory').addEventListener('click', () => navigateTo('home'));
document.getElementById('backBtnRoom').addEventListener('click', () => currentCategory ? navigateTo('category', currentCategory) : navigateTo('home'));
