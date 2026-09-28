// ============================================================
// HANON STORE - Data Loader
// يحمّل site-data.json ويحوّله للصيغة اللي script.js بيفهمها
// ============================================================

(async function loadSiteData() {
  try {
    const res = await fetch('site-data.json?t=' + Date.now());
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    const converted = {
      config: data.config || {},
      social: data.social || {},
      featured: data.featured || [],
      categories: (data.categories || []).map(function(cat) {
        return {
          id: cat.id,
          icon: cat.icon || '🛍️',
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
              images: p.images || [],
              sizes: p.sizes || []
            };
          })
        };
      })
    };

    localStorage.setItem('hanonStoreData', JSON.stringify(converted));
    console.log('✅ site-data.json loaded:', converted.categories.length, 'categories');

    window.dispatchEvent(new Event('storeDataReady'));

  } catch (e) {
    console.warn('⚠️ site-data.json failed:', e.message);
    const fallback = {
      config: {
        brand_ar: 'حنون',
        brand_en: 'HANON STORE',
        tagline_ar: 'خامات و جوده و ذوق مضمون',
        tagline_en: 'Quality, Craftsmanship & Taste',
        about_ar: 'نقدم لكم أحدث الموديلات من بيوت الأزياء العالمية بأجود الخامات.',
        whatsappNumber: '',
        phones: [],
        address_ar: 'Online Store',
        mapUrl: ''
      },
      social: {},
      featured: [],
      categories: []
    };
    localStorage.setItem('hanonStoreData', JSON.stringify(fallback));
    window.dispatchEvent(new Event('storeDataReady'));
  }
})();