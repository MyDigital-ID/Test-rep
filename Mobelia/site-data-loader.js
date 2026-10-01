// ============================================================
// Modern Furniture - Data Loader
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
          icon: cat.icon || '🛋️',
          name_ar: cat.name_ar,
          name_en: cat.name_en,
          homeImg: cat.homeImg || '',
          visible: cat.visible !== false,
          rooms: (cat.rooms || []).map(function(room) {
            return {
              id: room.id,
              name_ar: room.name_ar,
              name_en: room.name_en || '',
              desc_ar: room.desc_ar || '',
              colors: (room.colors || []).map(function(color) {
                return {
                  id: color.id,
                  name_ar: color.name_ar,
                  hex: color.hex || '#D4B896',
                  images: color.images || {}
                };
              }),
              pieces: (room.pieces || []).map(function(piece) {
                return {
                  name_ar: piece.name_ar,
                  dimensions: piece.dimensions || '',
                  price: Number(piece.price) || 0,
                  offerPrice: Number(piece.offerPrice) || 0
                };
              })
            };
          })
        };
      })
    };

    localStorage.setItem('mobilyaStoreData', JSON.stringify(converted));
    console.log('✅ site-data.json loaded:', converted.categories.length, 'categories');

    window.dispatchEvent(new Event('storeDataReady'));

  } catch (e) {
    console.warn('⚠️ site-data.json failed:', e.message);
    const fallback = {
      config: {
        brand_ar: 'الموبيليات العصريه',
        brand_en: 'Modern Furniture',
        tagline_ar: 'لمسه فنيه في عالم الاثاث',
        about_ar: 'نقدم افضل تصميمات الموبيليا بلمسه عصرية.',
        whatsappNumber: '201008070087',
        phones: ['01008070087'],
        address_ar: 'Online Store',
        mapUrl: ''
      },
      social: {},
      featured: [],
      categories: []
    };
    localStorage.setItem('mobilyaStoreData', JSON.stringify(fallback));
    window.dispatchEvent(new Event('storeDataReady'));
  }
})();
