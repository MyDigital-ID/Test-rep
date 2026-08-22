document.addEventListener('DOMContentLoaded', () => {

    // 1. إدارة القائمة الجانبية (Sidebar)
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const sidebar = document.getElementById('sidebar');

    if (menuToggleBtn && sidebar) {
        menuToggleBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
        });
    }

    if (closeSidebarBtn && sidebar) {
        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }

    // 2. إدارة التبديل بين العربي والإنجليزي وتحديث النصوص والـ QR Brand Title
    const langToggleBtn = document.getElementById('langToggleBtn');
    let currentLang = 'ar';

    const ballImages = {
        ar: {
            imgSandwiches: "assets/images/Elzoz-sandwiches-arabic.png",
            imgOffers: "assets/images/Elzoz-offers-arabic.png",
            imgRice: "assets/images/Rice-Dishes-arabic.png",
            imgPasta: "assets/images/Pasta-arabic.png",
            imgSauces: "assets/images/Sauce-arabic.png",
            imgDrinks: "assets/images/Drinks-Arabic.png"
        },
        en: {
            imgSandwiches: "assets/images/Elzoz-Sandw-engl.png",
            imgOffers: "assets/images/Elzoz-offers.png",
            imgRice: "assets/images/Rice-Dishes-engl.png",
            imgPasta: "assets/images/Pasta-engl.png",
            imgSauces: "assets/images/Sauce-engl.png",
            imgDrinks: "assets/images/Drinks-engl.png"
        }
    };

    const translations = {
        ar: {
            pageTitle: "سندويتشات الزوز | ELZOZ SANDWICHES",
            restaurantName: "سندويتشات الزوز",
            aboutTitle: "عن سندويتشات الزوز",
            aboutText: "مرحباً بكم في مطعم سندويتشات الزوز ❤️ نقدم لكم أشهى وألذ السندويتشات والأطباق البحرية الطازجة من الجمبري والسبيط والفيليه بأعلى معايير الجودة.",
            slogan: '"عند الزوز .. السندويتشات بتبوظ"',
            addressTitle: "العنوان",
            addressText: "الإسكندرية - سيدى بشر ترام، شارع خالد بن الوليد، أمام جزارة الثورة",
            menuCategoriesTitle: "القائمة والوجبات",
            homeMeal: "الرئيسية",
            singleMeals: "وجبات الفرد",
            offersTitle: "عروض الزوز",
            sandwichesTitle: "السندويتشات",
            riceTitle: "أطباق الأرز",
            pastaTitle: "المكرونات",
            soupsTitle: "الشوربة والأطباق",
            saucesTitle: "الصوصات",
            drinksTitle: "المشروبات",
            mapBtn: "موقعنا على الخريطة",
            vcardBtn: "حفظ جهة الاتصال (vCard)",
            qrBrandName: "الزوز - QR",
            addToCart: "إضافة للسلة",
            cartTitle: "سلة الطلبات المباشرة",
            emptyCartMsg: "السلة فارغة حالياً",
            orderNowBtn: "تأكيد الطلبات عبر الواتساب",
            directUploadText: "طلباتك يتم رفعها بشكل مباشر"
        },
        en: {
            pageTitle: "ELZOZ SANDWICHES",
            restaurantName: "Elzoz Sandwiches",
            aboutTitle: "About Elzoz Sandwiches",
            aboutText: "Welcome to Elzoz Sandwiches ❤️ We offer the best fresh seafood dishes, shrimp, squid, and fillet with the highest quality standards.",
            slogan: '"At Elzoz .. Deliciousness Overflows"',
            addressTitle: "Address",
            addressText: "Alexandria - Sidi Bishr Tram, Khalid Ibn Al-Walid St., El Montazah",
            menuCategoriesTitle: "Menu Categories",
            homeMeal: "Home",
            singleMeals: "Single Meals",
            offersTitle: "Elzoz Offers",
            sandwichesTitle: "Sandwiches",
            riceTitle: "Rice Dishes",
            pastaTitle: "Pasta Dishes",
            soupsTitle: "Soups & Dishes",
            saucesTitle: "Sauces",
            drinksTitle: "Drinks",
            mapBtn: "Location on Map",
            vcardBtn: "Save Contact (vCard)",
            qrBrandName: "ELZOZ S/Ws-QR",
            addToCart: "Add to Cart",
            cartTitle: "Live Direct Cart",
            emptyCartMsg: "Your cart is currently empty",
            orderNowBtn: "Confirm Order via WhatsApp",
            directUploadText: "Your order is instantly submitted"
        }
    };

    function updateLanguageUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                el.textContent = translations[currentLang][key];
            }
        });

        document.querySelectorAll('[data-ar]').forEach(el => {
            if (currentLang === 'en' && el.getAttribute('data-en')) {
                el.textContent = el.getAttribute('data-en');
            } else if (currentLang === 'ar' && el.getAttribute('data-ar')) {
                el.textContent = el.getAttribute('data-ar');
            }
        });

        const activeLangImages = ballImages[currentLang];
        for (let imgId in activeLangImages) {
            const imgElement = document.getElementById(imgId);
            if (imgElement) {
                imgElement.src = activeLangImages[imgId];
            }
        }
    }

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'ar' ? 'en' : 'ar';
            langToggleBtn.textContent = currentLang === 'ar' ? 'EN' : 'عربي';
            document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
            document.documentElement.setAttribute('lang', currentLang);

            updateLanguageUI();
        });
    }

    // 3. التنقل بين أقسام المنيو
    const allCategoryRows = document.querySelectorAll('[data-category-row]');
    const categoryBtns = document.querySelectorAll('[data-category]');
    const goHomeBtn = document.getElementById('goHomeBtn');

    function showCategory(catName) {
        allCategoryRows.forEach(row => {
            if (row.getAttribute('data-category-row') === catName) {
                row.classList.remove('hidden-row');
            } else {
                row.classList.add('hidden-row');
            }
        });

        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }

        window.scrollTo({ top: document.getElementById('menuGrid').offsetTop - 20, behavior: 'smooth' });
    }

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.getAttribute('data-category');
            if (cat) showCategory(cat);
        });
    });

    if (goHomeBtn) {
        goHomeBtn.addEventListener('click', () => {
            showCategory('home');
        });
    }

    // 4. إدارة سلة الطلبات وتعديل الكميات
    let cart = [];

    document.querySelectorAll('.card-controls').forEach(control => {
        const minusBtn = control.querySelector('.minus');
        const plusBtn = control.querySelector('.plus');
        const qtySpan = control.querySelector('span');
        const addBtn = control.querySelector('.add-to-cart');

        let qty = 1;

        if (minusBtn) {
            minusBtn.addEventListener('click', () => {
                if (qty > 1) {
                    qty--;
                    qtySpan.textContent = qty;
                }
            });
        }

        if (plusBtn) {
            plusBtn.addEventListener('click', () => {
                qty++;
                qtySpan.textContent = qty;
            });
        }

        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const parent = control.closest('.card') || control.closest('.sandwich-item');
                let itemName = '';
                
                const nameEl = parent.querySelector('h3') || parent.querySelector('.sandwich-name');
                if (nameEl) itemName = nameEl.textContent.trim();

                addToCart(itemName, qty);
                qty = 1;
                qtySpan.textContent = 1;
            });
        }
    });

    function addToCart(name, quantity) {
        const existing = cart.find(item => item.name === name);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({ name: name, quantity: quantity });
        }
        updateCartUI();
    }

    function updateCartUI() {
        const cartBadge = document.getElementById('cartBadge');
        const cartItemsList = document.getElementById('cartItemsList');

        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartBadge) cartBadge.textContent = totalCount;

        if (!cartItemsList) return;

        if (cart.length === 0) {
            cartItemsList.innerHTML = `<p class="empty-cart-msg">${translations[currentLang].emptyCartMsg}</p>`;
            return;
        }

        cartItemsList.innerHTML = '';
        cart.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'cart-item-row';
            div.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px dashed #eee;";
            div.innerHTML = `
                <span>${item.name} <strong>x${item.quantity}</strong></span>
                <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; cursor:pointer;"><i class="fas fa-trash"></i></button>
            `;
            cartItemsList.appendChild(div);
        });
    }

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        updateCartUI();
    };

    // 5. إرسال الطلبات للواتساب
    const sendCartWhatsapp = document.getElementById('sendCartWhatsapp');
    if (sendCartWhatsapp) {
        sendCartWhatsapp.addEventListener('click', () => {
            if (cart.length === 0) {
                alert(currentLang === 'ar' ? 'السلة فارغة حالياً!' : 'Cart is empty!');
                return;
            }

            let msg = currentLang === 'ar' 
                ? "*طلب جديد من موقع سندويتشات الزوز:* \n\n" 
                : "*New Order from Elzoz Website:* \n\n";

            cart.forEach(item => {
                msg += `• ${item.name} (العدد: ${item.quantity})\n`;
            });

            msg += currentLang === 'ar' ? "\nيرجى التأكيد والبدء في التحضير!" : "\nPlease confirm my order!";

            const whatsappUrl = `https://wa.me/201041514004?text=${encodeURIComponent(msg)}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // 6. تحميل vCard
    const downloadVcardBtn = document.getElementById('downloadVcardBtn');
    if (downloadVcardBtn) {
        downloadVcardBtn.addEventListener('click', () => {
            const vcardData = 
`BEGIN:VCARD
VERSION:3.0
FN:مطعم سندويتشات الزوز
ORG:ELZOZ SANDWICHES
TEL;TYPE=WORK,VOICE:01041514004
TEL;TYPE=CELL,VOICE:+201041514004
ADR;TYPE=WORK:;;شارع خالد بن الوليد;الإسكندرية;;;مصر
NOTE:عند الزوز .. السندويتشات بتبوظ
END:VCARD`;

            const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Elzoz_Sandwiches.vcf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    updateLanguageUI();

});
