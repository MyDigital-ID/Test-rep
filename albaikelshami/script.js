document.addEventListener('DOMContentLoaded', () => {

    const translations = {
        ar: {
            pageTitle: "مطعم البيك الشامي",
            mainTitle: "مطعم البيك الشامي",
            aboutTitle: "عن البيك الشامي",
            aboutText: "مرحباً بكم في مطعم البيك الشامي! نقدم لكم أشهى وألذ المأكولات الشامية والوجبات السريعة المحضرة بأعلى معايير الجودة والنظافة، باستخدام أفضل المكونات والبهارات الأصلية لننقل لكم طعم الشام الحقيقي في كل وجبة.",
            slogan: '"أطيب من هيك .. ما في غير عند البيك"',
            subSlogan: "البيك الشامي .. الطعم السوري الأصلي",
            directUploadText: "جميع طلباتك يتم رفعها بشكل مباشر",
            cartTitle: "سلة الطلبات المباشرة",
            confirmOrder: "تأكيد الطلب",
            mapBtn: "موقعنا على الخريطة",
            vcardBtn: "حفظ جهة الاتصال (vCard)",
            qrTitle: "رمز QR الخاص بالمنيو",
            qrDownload: "تحميل الـ QR Code",
            addToCart: "إضافة للسلة",
            
            mixBox: "بوكس الميكس العائلي",
            farhaBox: "بوكس الفرحة",
            familyBox: "بوكس العيلة",
            sitraBox: "بوكس السترة",
            kingShawarmaBox: "بوكس ملك الشاورما",
            azamaBox: "بوكس العظمة",
            akilaBox: "بوكس الأكيلة",
            moalemBox: "بوكس المعلم",
            karmOffer: "عرض الكرم",
            mariaKings: "ملوك المعمرية",
            summerOffer: "عرض الصيف",
            vacationOffer: "عرض الإجازة",
            bakawatOffer: "عرض البكاوات",
            tabtabaOffer: "عرض الطبطبة",
            kingOffer: "عرض الكينج",
            moalemOffer: "عرض المعلم",
            mzagOffer: "عرض المزاج",
            raiqMeatOffer: "عرض الرايق لحم",
            raiqChickenOffer: "عرض الرايق دجاج",
            saadaOffer: "عرض السعادة",
            ostoraOffer: "عرض الأسطورة",
            ebnBaikOffer: "عرض ابن البيك"
        },
        en: {
            pageTitle: "Al-Baik Al-Shami Restaurant",
            mainTitle: "Al-Baik Al-Shami Restaurant",
            aboutTitle: "About Al-Baik Al-Shami",
            aboutText: "Welcome to Al-Baik Al-Shami! We serve the finest Levantine cuisine and fast food prepared with the highest quality and cleanliness standards, using authentic spices to bring you the true taste of Syria.",
            slogan: '"Nothing beats the taste of Al-Baik"',
            subSlogan: "Al-Baik Al-Shami .. Authentic Syrian Taste",
            directUploadText: "All your requests are uploaded directly",
            cartTitle: "Direct Order Cart",
            confirmOrder: "Confirm Order",
            mapBtn: "Our Location on Map",
            vcardBtn: "Save Contact (vCard)",
            qrTitle: "Menu QR Code",
            qrDownload: "Download QR Code",
            addToCart: "Add to Cart",
            
            mixBox: "Family Mix Box",
            farhaBox: "Farha Box",
            familyBox: "Family Box",
            sitraBox: "Sitra Box",
            kingShawarmaBox: "Shawarma King Box",
            azamaBox: "Azama Box",
            akilaBox: "Akila Box",
            moalemBox: "El-Moalem Box",
            karmOffer: "El-Karm Offer",
            mariaKings: "Kings of Maria",
            summerOffer: "Summer Offer",
            vacationOffer: "Vacation Offer",
            bakawatOffer: "Bakawat Offer",
            tabtabaOffer: "Tabtaba Offer",
            kingOffer: "King Offer",
            moalemOffer: "Moalem Offer",
            mzagOffer: "Mzag Offer",
            raiqMeatOffer: "Raiq Meat Offer",
            raiqChickenOffer: "Raiq Chicken Offer",
            saadaOffer: "Saada Offer",
            ostoraOffer: "Ostora Offer",
            ebnBaikOffer: "Ebn El-Baik Offer"
        }
    };

    let currentLang = 'ar';

    // 1. زر تبديل اللغة
    const langToggleBtn = document.getElementById('langToggleBtn');
    langToggleBtn?.addEventListener('click', () => {
        currentLang = (currentLang === 'ar') ? 'en' : 'ar';
        langToggleBtn.textContent = (currentLang === 'ar') ? 'EN' : 'عربي';
        
        document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', currentLang);

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                el.textContent = translations[currentLang][key];
            }
        });
    });

    // 2. القائمة الجانبية
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const sidebar = document.getElementById('sidebar');

    menuToggleBtn?.addEventListener('click', () => sidebar.classList.add('open'));
    closeSidebarBtn?.addEventListener('click', () => sidebar.classList.remove('open'));

    // 3. فيديو الهيدر
    const chefVideo = document.getElementById('chefVideo');
    const videoWrapper = document.getElementById('videoWrapper');
    const logo2Wrapper = document.getElementById('logo2Wrapper');

    if (chefVideo) {
        chefVideo.addEventListener('ended', () => {
            videoWrapper.style.opacity = '0';
            setTimeout(() => {
                videoWrapper.style.display = 'none';
                logo2Wrapper.style.display = 'flex';
                setTimeout(() => {
                    logo2Wrapper.style.opacity = '1';
                }, 50);
            }, 800);
        });
    }

    // 4. إظهار كرات الاختيار
    setTimeout(() => {
        document.querySelector('.floating-categories')?.classList.add('show');
    }, 3000);

    // 5. التصفية التفاعلية بالصفوف
    const categoryBalls = document.querySelectorAll('.category-ball');
    const mainFeaturedRows = document.querySelectorAll('.main-featured-row');
    const categoryRows = document.querySelectorAll('[data-category-row]');

    categoryBalls.forEach(ball => {
        ball.addEventListener('click', () => {
            const selectedCategory = ball.getAttribute('data-category');

            mainFeaturedRows.forEach(row => row.classList.add('hidden-row'));

            categoryRows.forEach(row => {
                if (row.getAttribute('data-category-row') === selectedCategory) {
                    row.classList.remove('hidden-row');
                } else {
                    row.classList.add('hidden-row');
                }
            });
        });
    });

    // 6. إدارة السلة المباشرة داخل الصفحة
    let cart = [];
    const cartBadge = document.getElementById('cartBadge');
    const cartItemsList = document.getElementById('cartItemsList');
    const sendCartWhatsapp = document.getElementById('sendCartWhatsapp');

    function updateCartUI() {
        let totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
        if (cartBadge) cartBadge.textContent = totalCount;

        if (cart.length > 0) {
            cartItemsList.innerHTML = cart.map((item, index) => `
                <div class="cart-item-row">
                    <span>${item.name} (x${item.qty})</span>
                    <button onclick="removeCartItem(${index})" class="remove-item-btn">&times;</button>
                </div>
            `).join('');
        } else {
            cartItemsList.innerHTML = '<p class="empty-cart-msg">السلة فارغة حالياً</p>';
        }
    }

    window.removeCartItem = function(index) {
        cart.splice(index, 1);
        updateCartUI();
    };

    // 7. التحكم في أزرار الأعداد والإضافة للسلة
    document.querySelectorAll('.qty-btn').forEach(group => {
        const minus = group.querySelector('.minus');
        const plus = group.querySelector('.plus');
        const count = group.querySelector('span');

        minus.addEventListener('click', (e) => {
            e.stopPropagation();
            let val = parseInt(count.textContent);
            if (val > 1) count.textContent = --val;
        });

        plus.addEventListener('click', (e) => {
            e.stopPropagation();
            let val = parseInt(count.textContent);
            count.textContent = ++val;
        });
    });

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON' && (e.target.classList.contains('minus') || e.target.classList.contains('plus'))) {
                return;
            }

            const mealTitle = card.querySelector('h3')?.textContent || 'وجبة من المنيو';
            const qty = parseInt(card.querySelector('.qty-btn span')?.textContent || '1');

            const existingIndex = cart.findIndex(item => item.name === mealTitle);
            if (existingIndex > -1) {
                cart[existingIndex].qty += qty;
            } else {
                cart.push({ name: mealTitle, qty: qty });
            }

            updateCartUI();

            // تأثير حركة سريع للكارت عند الإضافة
            card.style.transform = 'scale(0.96)';
            setTimeout(() => card.style.transform = '', 150);
        });
    });

    // 8. إرسال الطلبات إلى الواتساب
    sendCartWhatsapp?.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('يرجى اختيار الوجبات أولاً');
            return;
        }

        let message = "مرحباً مطعم البيك الشامي، أود تأكيد الطلبات التالية:\n";
        cart.forEach((item, i) => {
            message += `${i + 1}. ${item.name} - العدد: ${item.qty}\n`;
        });

        const whatsappUrl = `https://wa.me/201287307518?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });

    // 9. تحميل vCard
    document.getElementById('downloadVcardBtn')?.addEventListener('click', () => {
        const vcardData = 
`BEGIN:VCARD
VERSION:3.0
FN:مطعم البيك الشامي
TEL;TYPE=CELL:+201287307518
ADR;TYPE=WORK:;;شارع نفق المحروسة من البحر, السيوف بحري, أول المنتزه;الإسكندرية;;;مصر
URL;TYPE=WORK:https://mydigital-id.github.io/Albaik-ElShami/
URL;TYPE=Facebook:https://www.facebook.com/share/18GpESiAv5/
URL;TYPE=Instagram:https://www.instagram.com/albaik_elshami/
END:VCARD`;

        const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'AlBaik-ElShami.vcf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
