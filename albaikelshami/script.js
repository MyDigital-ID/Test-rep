document.addEventListener('DOMContentLoaded', () => {

    // =====================================================
    // 0. نظام اللغة العربية / الإنجليزية
    // =====================================================

    const langToggleBtn = document.getElementById('langToggleBtn');

    const translations = {
        ar: {
            pageTitle: 'مطعم البيك الشامي',
            aboutTitle: 'عن البيك الشامي',
            aboutText: 'مرحباً بكم في مطعم البيك الشامي! نقدم لكم أشهى وألذ المأكولات الشامية والوجبات السريعة المحضرة بأعلى معايير الجودة والنظافة، باستخدام أفضل المكونات والبهارات الأصلية لننقل لكم طعم الشام الحقيقي في كل وجبة.',
            slogan: '"أطيب من هيك .. ما في غير عند البيك"',
            subSlogan: 'البيك الشامي .. الطعم السوري الأصلي',
            menuCategoriesTitle: 'الوجبات والعروض',
            featuredMeals: 'البوكسات الرئيسية',
            singleMeals: 'وجبات الفرد',
            twoMeals: 'وجبات الفردين',
            familyMeals: 'وجبات العائلة',
            sandwichesTitle: 'سندويتشات البيك',
            albaikOffersTitle: 'عروض البيك المميزة',
            mapBtn: 'موقعنا على الخريطة',
            vcardBtn: 'حفظ جهة الاتصال (vCard)',
            qrTitle: 'رمز QR الخاص بالمنيو',
            qrDownload: 'تحميل الـ QR Code',
            mainTitle: 'مطعم البيك الشامي',
            addToCart: 'إضافة للسلة',
            cartTitle: 'سلة الطلبات المباشرة',
            orderNowBtn: 'اطلب الآن عبر الواتساب',
            directUploadText: 'طلباتك يتم رفعها بشكل مباشر'
        },

        en: {
            pageTitle: 'Albaik Alshami Restaurant',
            aboutTitle: 'About Albaik Alshami',
            aboutText: 'Welcome to Albaik Alshami Restaurant! We serve delicious Levantine cuisine and fast food prepared with the highest standards of quality and cleanliness, using the finest ingredients and authentic spices to bring you the true taste of the Levant in every meal.',
            slogan: '"Nothing tastes better than Albaik"',
            subSlogan: 'Albaik Alshami .. The Original Syrian Taste',
            menuCategoriesTitle: 'Meals & Offers',
            featuredMeals: 'Main Boxes',
            singleMeals: 'Single Meals',
            twoMeals: 'Meals for Two',
            familyMeals: 'Family Meals',
            sandwichesTitle: 'Albaik Sandwiches',
            albaikOffersTitle: 'Albaik Special Offers',
            mapBtn: 'Our Location on the Map',
            vcardBtn: 'Save Contact (vCard)',
            qrTitle: 'Menu QR Code',
            qrDownload: 'Download QR Code',
            mainTitle: 'Albaik Alshami Restaurant',
            addToCart: 'Add to Cart',
            cartTitle: 'Live Order Cart',
            orderNowBtn: 'Order Now via WhatsApp',
            directUploadText: 'Your order is sent directly'
        }
    };

    // أسماء الوجبات والعروض
    const mealTranslations = {
        'عرض الكرم': 'Al Karam Offer',
        'ملوك المعمورة': 'Kings of El Mamoura',
        'عرض الصيف': 'Summer Offer',
        'عرض الإجازة': 'Vacation Offer',
        'عرض البكاوات': 'Albakaawat Offer',
        'عرض الطبطبة': 'Al Tabtaba Offer',

        'عرض الكينج': 'The King Offer',
        'عرض المعلم': 'Al Moalem Offer',
        'عرض المزاج': 'Al Mizaj Offer',
        'عرض الرايق لحم': 'Al Rayeq Beef Offer',
        'عرض الرايق دجاج': 'Al Rayeq Chicken Offer',
        'عرض السعادة': 'Al Saada Offer',
        'عرض الأسطورة': 'Al Ostora Offer',
        'عرض ابن البيك': 'Ibn Albaik Offer',

        'سندويتش شاورما دجاج': 'Chicken Shawarma Sandwich',
        'سندويتش شاورما لحم': 'Beef Shawarma Sandwich',
        'سندويتش كرسبي إكسترا': 'Extra Crispy Sandwich',
        'سندويتش زنجر حار': 'Spicy Zinger Sandwich',
        'سندويتش فاهيتا دجاج': 'Chicken Fajita Sandwich',
        'سندويتش فرانسيسكو': 'Francisco Sandwich',
        'سندويتش شيش طاووق': 'Shish Tawook Sandwich',
        'سندويتش كبده شامية': 'Levantine Liver Sandwich',
        'سندويتش بطاطس مكسيكانو': 'Mexicano Potato Sandwich',
        'سندويتش معمرية جيل ناري': 'Mammariya Gil Nari Sandwich'
    };

    function translateMealNames(lang) {
        document.querySelectorAll('h3, .sandwich-name').forEach(element => {

            if (!element.dataset.arName) {
                const original = element.textContent.trim();

                if (mealTranslations[original]) {
                    element.dataset.arName = original;
                    element.dataset.enName = mealTranslations[original];
                }
            }

            if (element.dataset.arName && element.dataset.enName) {
                element.textContent =
                    lang === 'en'
                        ? element.dataset.enName
                        : element.dataset.arName;
            }
        });
    }

    function applyLanguage(lang) {

        const currentLang = lang === 'en' ? 'en' : 'ar';

        // اتجاه الصفحة
        document.documentElement.lang = currentLang;
        document.documentElement.dir =
            currentLang === 'ar' ? 'rtl' : 'ltr';

        // ترجمة كل العناصر التي تحمل data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {

            const key = element.getAttribute('data-i18n');

            if (translations[currentLang][key] !== undefined) {
                element.textContent =
                    translations[currentLang][key];
            }
        });

        // ترجمة أسماء الوجبات
        translateMealNames(currentLang);

        // عنوان الصفحة
        document.title =
            translations[currentLang].pageTitle;

        // زر اللغة
        if (langToggleBtn) {
            langToggleBtn.textContent =
                currentLang === 'ar' ? 'EN' : 'AR';
        }

        localStorage.setItem(
            'albaikLanguage',
            currentLang
        );
    }

    if (langToggleBtn) {

        langToggleBtn.addEventListener('click', () => {

            const currentLang =
                localStorage.getItem('albaikLanguage') || 'ar';

            const newLang =
                currentLang === 'ar' ? 'en' : 'ar';

            applyLanguage(newLang);
        });
    }

    // اللغة الافتراضية
    applyLanguage(
        localStorage.getItem('albaikLanguage') || 'ar'
    );


    // =====================================================
    // 1. القائمة الجانبية
    // =====================================================

    const menuToggleBtn =
        document.getElementById('menuToggleBtn');

    const closeSidebarBtn =
        document.getElementById('closeSidebarBtn');

    const sidebar =
        document.getElementById('sidebar');

    menuToggleBtn?.addEventListener('click', () =>
        sidebar.classList.add('open')
    );

    closeSidebarBtn?.addEventListener('click', () =>
        sidebar.classList.remove('open')
    );


    // =====================================================
    // 2. تشغيل واستبدال فيديو الهيدر
    // =====================================================

    const chefVideo =
        document.getElementById('chefVideo');

    const videoWrapper =
        document.getElementById('videoWrapper');

    const logo2Wrapper =
        document.getElementById('logo2Wrapper');

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


    // =====================================================
    // 3. إظهار كرات الاختيار الطافية
    // =====================================================

    setTimeout(() => {

        document
            .querySelectorAll('.floating-categories')
            .forEach(el =>
                el.classList.add('show')
            );

    }, 1000);


    // =====================================================
    // 4. الفلترة حسب الفئة
    // =====================================================

    const categoryBalls =
        document.querySelectorAll('.category-ball');

    const sidebarCatBtns =
        document.querySelectorAll('.sidebar-cat-btn');

    const allCategoryElements =
        document.querySelectorAll('[data-category-row]');

    function filterCategory(selectedCategory) {

        allCategoryElements.forEach(element => {

            const elementCategories =
                element
                    .getAttribute('data-category-row')
                    .split(' ');

            if (
                elementCategories.includes(selectedCategory)
            ) {

                element.classList.remove('hidden-row');

            } else {

                element.classList.add('hidden-row');
            }
        });

        const menuGrid =
            document.getElementById('menuGrid');

        if (menuGrid) {
            menuGrid.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }

    categoryBalls.forEach(ball => {

        ball.addEventListener('click', () => {

            const selectedCategory =
                ball.getAttribute('data-category');

            filterCategory(selectedCategory);
        });
    });

    sidebarCatBtns.forEach(btn => {

        btn.addEventListener('click', () => {

            const selectedCategory =
                btn.getAttribute('data-category');

            filterCategory(selectedCategory);

            sidebar.classList.remove('open');
        });
    });


    // =====================================================
    // 5. إدارة السلة
    // =====================================================

    let cart = [];

    const cartBadge =
        document.getElementById('cartBadge');

    const cartItemsList =
        document.getElementById('cartItemsList');

    const sendCartWhatsapp =
        document.getElementById('sendCartWhatsapp');

    function updateCartUI() {

        let totalCount =
            cart.reduce(
                (sum, item) => sum + item.qty,
                0
            );

        if (cartBadge) {
            cartBadge.textContent = totalCount;
        }

        if (cart.length > 0) {

            cartItemsList.innerHTML =
                cart.map((item, index) => `
                    <div class="cart-item-row">
                        <span>${item.name} (x${item.qty})</span>

                        <button
                            onclick="removeCartItem(${index})"
                            class="remove-item-btn">
                            &times;
                        </button>
                    </div>
                `).join('');

        } else {

            const isEnglish =
                (localStorage.getItem('albaikLanguage') || 'ar')
                === 'en';

            cartItemsList.innerHTML =
                isEnglish
                    ? '<p class="empty-cart-msg">The cart is currently empty</p>'
                    : '<p class="empty-cart-msg">السلة فارغة حالياً</p>';
        }
    }

    window.removeCartItem = function(index) {

        cart.splice(index, 1);

        updateCartUI();
    };


    // =====================================================
    // 6. الزيادة والنقصان والإضافة للسلة
    // =====================================================

    document.addEventListener('click', function(e) {

        if (e.target.classList.contains('minus')) {

            e.stopPropagation();

            const count =
                e.target.nextElementSibling;

            let val =
                parseInt(count.textContent);

            if (val > 1) {
                count.textContent = --val;
            }

        } else if (
            e.target.classList.contains('plus')
        ) {

            e.stopPropagation();

            const count =
                e.target.previousElementSibling;

            let val =
                parseInt(count.textContent);

            count.textContent = ++val;

        } else if (
            e.target.classList.contains('add-to-cart')
        ) {

            e.stopPropagation();

            const parentContainer =
                e.target.closest('.card') ||
                e.target.closest('.sandwich-item');

            if (!parentContainer) return;

            const titleElement =
                parentContainer.querySelector('h3') ||
                parentContainer.querySelector('.sandwich-name');

            const mealTitle =
                titleElement?.textContent.trim() ||
                'وجبة من المنيو';

            const qty =
                parseInt(
                    parentContainer
                        .querySelector('.qty-btn span')
                        ?.textContent || '1'
                );

            const existingIndex =
                cart.findIndex(
                    item => item.name === mealTitle
                );

            if (existingIndex > -1) {

                cart[existingIndex].qty += qty;

            } else {

                cart.push({
                    name: mealTitle,
                    qty: qty
                });
            }

            updateCartUI();

            parentContainer.style.transform =
                'scale(0.96)';

            setTimeout(() => {
                parentContainer.style.transform = '';
            }, 150);
        }
    });


    // =====================================================
    // 7. إرسال الطلب عبر WhatsApp
    // =====================================================

    sendCartWhatsapp?.addEventListener('click', () => {

        if (cart.length === 0) {

            const isEnglish =
                (localStorage.getItem('albaikLanguage') || 'ar')
                === 'en';

            alert(
                isEnglish
                    ? 'Please select your meals first'
                    : 'يرجى اختيار الوجبات أولاً'
            );

            return;
        }

        const isEnglish =
            (localStorage.getItem('albaikLanguage') || 'ar')
            === 'en';

        let message =
            isEnglish
                ? 'Hello Albaik Alshami Restaurant, I would like to confirm the following orders:\n'
                : 'مرحباً مطعم البيك الشامي، أود تأكيد الطلبات التالية:\n';

        cart.forEach((item, i) => {

            message +=
                isEnglish
                    ? `${i + 1}. ${item.name} - Quantity: ${item.qty}\n`
                    : `${i + 1}. ${item.name} - العدد: ${item.qty}\n`;
        });

        const whatsappUrl =
            `https://wa.me/201287307518?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
    });


    // =====================================================
    // 8. حفظ vCard
    // =====================================================

    document
        .getElementById('downloadVcardBtn')
        ?.addEventListener('click', () => {

            const vcardData =
`BEGIN:VCARD
VERSION:3.0
FN:مطعم البيك الشامي
TEL;TYPE=CELL:+201287307518
ADR;TYPE=WORK:;;شارع نفق المحروسة من البحر, السيوف بحري, أول المنتزه;الإسكندرية;;;مصر
URL;TYPE=WORK:https://mydigital-id.github.io/Albaik-ElShami/
END:VCARD`;

            const blob =
                new Blob(
                    [vcardData],
                    {
                        type: 'text/vcard;charset=utf-8;'
                    }
                );

            const url =
                URL.createObjectURL(blob);

            const link =
                document.createElement('a');

            link.href = url;

            link.setAttribute(
                'download',
                'AlBaik-ElShami.vcf'
            );

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            URL.revokeObjectURL(url);
        });


    // =====================================================
    // 9. خلفية الكانفاس المتساقطة
    // =====================================================

    const canvas =
        document.getElementById('matrix-canvas');

    if (canvas) {

        const ctx =
            canvas.getContext('2d');

        let width =
            canvas.width =
            window.innerWidth;

        let height =
            canvas.height =
            window.innerHeight;

        window.addEventListener('resize', () => {

            width =
                canvas.width =
                window.innerWidth;

            height =
                canvas.height =
                window.innerHeight;
        });

        const particles = [];

        const types = [
            'chicken',
            'redPepper',
            'greenPepper',
            'ketchup',
            'mayo'
        ];

        for (let i = 0; i < 40; i++) {

            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                type:
                    types[
                        Math.floor(
                            Math.random() * types.length
                        )
                    ],
                size:
                    Math.random() * 10 + 5,
                speedY:
                    Math.random() * 1.5 + 0.8,
                speedX:
                    Math.random() * 0.8 - 0.4,
                opacity:
                    Math.random() * 0.7 + 0.3
            });
        }

        function drawMatrix() {

            ctx.clearRect(
                0,
                0,
                width,
                height
            );

            particles.forEach(p => {

                ctx.save();

                ctx.globalAlpha =
                    p.opacity;

                if (p.type === 'chicken') {

                    ctx.fillStyle =
                        '#d97706';

                    ctx.beginPath();

                    ctx.arc(
                        p.x,
                        p.y,
                        p.size / 1.5,
                        0,
                        Math.PI * 2
                    );

                    ctx.fill();

                } else if (
                    p.type === 'redPepper'
                ) {

                    ctx.fillStyle =
                        '#dc2626';

                    ctx.fillRect(
                        p.x,
                        p.y,
                        p.size / 2,
                        p.size
                    );

                } else if (
                    p.type === 'greenPepper'
                ) {

                    ctx.fillStyle =
                        '#16a34a';

                    ctx.fillRect(
                        p.x,
                        p.y,
                        p.size,
                        p.size / 2
                    );

                } else if (
                    p.type === 'ketchup'
                ) {

                    ctx.fillStyle =
                        '#b91c1c';

                    ctx.beginPath();

                    ctx.arc(
                        p.x,
                        p.y,
                        p.size / 2,
                        0,
                        Math.PI * 2
                    );

                    ctx.fill();

                } else if (
                    p.type === 'mayo'
                ) {

                    ctx.fillStyle =
                        '#fef08a';

                    ctx.beginPath();

                    ctx.arc(
                        p.x,
                        p.y,
                        p.size / 2.2,
                        0,
                        Math.PI * 2
                    );

                    ctx.fill();
                }

                ctx.restore();

                p.y += p.speedY;
                p.x += p.speedX;

                if (p.y > height) {
                    p.y = 0;
                }

                if (p.x > width) {
                    p.x = 0;
                }

                if (p.x < 0) {
                    p.x = width;
                }
            });

            requestAnimationFrame(drawMatrix);
        }

        drawMatrix();
    }

});