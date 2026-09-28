// ============================================================
// HANON STORE - Data Loader
// ============================================================

(async function loadSiteData() {
  try {
    const res = await fetch('site-data.json?t=' + Date.now());
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    const converted = {
      config: data.config || {},
      social: data.social || {},
      hero: data.hero || {},
      features: data.features || [],
      offers: data.offers || [],
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
        tagline_ar: 'ستايلك يبدأ من حنون',
        about_ar: 'أكثر من مجرد ملابس.',
        whatsappNumber: '',
        facebook: ''
      },
      social: {},
      hero: {},
      features: [],
      offers: [],
      featured: [],
      categories: []
    };
    localStorage.setItem('hanonStoreData', JSON.stringify(fallback));
    window.dispatchEvent(new Event('storeDataReady'));
  }
})();