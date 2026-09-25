// ============================================================
// site-data-loader.js
// يحمّل site-data.json ويحوّله للصيغة اللي script.js بيفهمها
// ============================================================

(async function loadSiteData() {
  try {
    const res = await fetch('site-data.json?t=' + Date.now());
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    // حوّل من بنية site-data.json إلى بنية موحّدة
    const converted = {
      config: data.config || {},
      categories: (data.categories || []).map(function(cat) {
        return {
          id: cat.id,
          icon: cat.icon || '👕',
          name_ar: cat.name_ar,
          name_en: cat.name_en,
          homeImg: cat.homeImg || '',
          visible: cat.visible !== false,
          products: (cat.products || []).map(function(p) {
            return {
              id: p.id,
              name_ar: p.name_ar,
              name_en: p.name_en,
              desc_ar: p.desc_ar || '',
              desc_en: p.desc_en || '',
              price: Number(p.price) || 0,
              price_xxxl: Number(p.price_xxxl) || 0,
              sizes: p.sizes || [],
              images: p.images || []
            };
          })
        };
      })
    };

    // خزّنه في localStorage عشان script.js يلاقيه
    localStorage.setItem('fashionStoreData', JSON.stringify(converted));
    console.log('✅ site-data.json loaded:', converted.categories.length, 'categories');

  } catch (e) {
    console.warn('⚠️ site-data.json failed:', e.message);
    // fallback: نستخدم بيانات افتراضية لو الملف مش موجود
    const fallback = {
      config: {
        brand_ar: 'Fashion Store',
        brand_en: 'Fashion Store',
        tagline_ar: 'أناقة بلا حدود',
        about_ar: 'نقدر اهتمامك بمظهرك ونسعى بإجتهاد أن نقدم لك كل ما هو جديد ومتميز.',
        whatsappNumber: '',
        phones: [],
        address_ar: 'Online Fashion Store',
        mapUrl: '',
        email: '',
        instagram: '',
        facebook: '',
        tiktok: ''
      },
      categories: []
    };
    localStorage.setItem('fashionStoreData', JSON.stringify(fallback));
  }
})();
