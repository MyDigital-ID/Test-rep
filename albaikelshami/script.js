document.addEventListener('DOMContentLoaded', () => {

    // 1. القائمة الجانبية
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const sidebar = document.getElementById('sidebar');

    menuToggleBtn?.addEventListener('click', () => sidebar.classList.add('open'));
    closeSidebarBtn?.addEventListener('click', () => sidebar.classList.remove('open'));

    // 2. تشغيل واستبدال فيديو الهيدر
    const chefVideo = document.getElementById('chefVideo');
    const videoWrapper = document.getElementById('videoWrapper');
    const logo2Wrapper = document.getElementById('logo2Wrapper');

    if (chefVideo) {
        chefVideo.addEventListener('ended', () => {
            videoWrapper.style.opacity = '0';
            setTimeout(() => {
                videoWrapper.style.display = 'none';
                logo2Wrapper.style.display = 'flex';
                setTimeout(() => { logo2Wrapper.style.opacity = '1'; }, 50);
            }, 800);
        });
    }

    // 3. إظهار كرات الاختيار الطافية
    setTimeout(() => {
        document.querySelectorAll('.floating-categories').forEach(el => el.classList.add('show'));
    }, 1000);

    // 4. دالة الفلترة الشاملة (تظهر كل الوجبات التابعة للفئة بدون إخفاء أي عنصر)
    const categoryBalls = document.querySelectorAll('.category-ball');
    const sidebarCatBtns = document.querySelectorAll('.sidebar-cat-btn');
    const allCategoryElements = document.querySelectorAll('[data-category-row]');

    function filterCategory(selectedCategory) {
        allCategoryElements.forEach(element => {
            const elementCategories = element.getAttribute('data-category-row').split(' ');
            
            // إذا كان القسم أو الصف يحتوي على الفئة المختارة يتم إظهاره فوراً
            if (elementCategories.includes(selectedCategory)) {
                element.classList.remove('hidden-row');
            } else {
                element.classList.add('hidden-row');
            }
        });

        const menuGrid = document.getElementById('menuGrid');
        if (menuGrid) {
            menuGrid.scrollIntoView({ behavior: 'smooth' });
        }
    }

    categoryBalls.forEach(ball => {
        ball.addEventListener('click', () => {
            const selectedCategory = ball.getAttribute('data-category');
            filterCategory(selectedCategory);
        });
    });

    sidebarCatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedCategory = btn.getAttribute('data-category');
            filterCategory(selectedCategory);
            sidebar.classList.remove('open');
        });
    });

    // 5. إدارة السلة المباشرة
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

    // 6. أحداث الزيادة والنقصان والإضافة للسلة
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('minus')) {
            e.stopPropagation();
            const count = e.target.nextElementSibling;
            let val = parseInt(count.textContent);
            if (val > 1) count.textContent = --val;
        } else if (e.target.classList.contains('plus')) {
            e.stopPropagation();
            const count = e.target.previousElementSibling;
            let val = parseInt(count.textContent);
            count.textContent = ++val;
        } else if (e.target.classList.contains('add-to-cart')) {
            e.stopPropagation();
            const parentContainer = e.target.closest('.card') || e.target.closest('.sandwich-item');
            if (!parentContainer) return;

            const mealTitle = parentContainer.querySelector('h3')?.textContent || parentContainer.querySelector('.sandwich-name')?.textContent || 'وجبة من المنيو';
            const qty = parseInt(parentContainer.querySelector('.qty-btn span')?.textContent || '1');

            const existingIndex = cart.findIndex(item => item.name === mealTitle);
            if (existingIndex > -1) {
                cart[existingIndex].qty += qty;
            } else {
                cart.push({ name: mealTitle, qty: qty });
            }

            updateCartUI();
            parentContainer.style.transform = 'scale(0.96)';
            setTimeout(() => parentContainer.style.transform = '', 150);
        }
    });

    // 7. إرسال الطلبات عبر الواتساب
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

    // 8. حفظ vCard
    document.getElementById('downloadVcardBtn')?.addEventListener('click', () => {
        const vcardData = 
`BEGIN:VCARD
VERSION:3.0
FN:مطعم البيك الشامي
TEL;TYPE=CELL:+201287307518
ADR;TYPE=WORK:;;شارع نفق المحروسة من البحر, السيوف بحري, أول المنتزه;الإسكندرية;;;مصر
URL;TYPE=WORK:https://mydigital-id.github.io/Albaik-ElShami/
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

    // 9. خلفية الكانفاس المتساقطة
    const canvas = document.getElementById('matrix-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const types = ['chicken', 'redPepper', 'greenPepper', 'ketchup', 'mayo'];

        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                type: types[Math.floor(Math.random() * types.length)],
                size: Math.random() * 10 + 5,
                speedY: Math.random() * 1.5 + 0.8,
                speedX: Math.random() * 0.8 - 0.4,
                opacity: Math.random() * 0.7 + 0.3
            });
        }

        function drawMatrix() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                ctx.save();
                ctx.globalAlpha = p.opacity;
                if (p.type === 'chicken') { ctx.fillStyle = '#d97706'; ctx.beginPath(); ctx.arc(p.x, p.y, p.size / 1.5, 0, Math.PI * 2); ctx.fill(); }
                else if (p.type === 'redPepper') { ctx.fillStyle = '#dc2626'; ctx.fillRect(p.x, p.y, p.size / 2, p.size); }
                else if (p.type === 'greenPepper') { ctx.fillStyle = '#16a34a'; ctx.fillRect(p.x, p.y, p.size, p.size / 2); }
                else if (p.type === 'ketchup') { ctx.fillStyle = '#b91c1c'; ctx.beginPath(); ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2); ctx.fill(); }
                else if (p.type === 'mayo') { ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(p.x, p.y, p.size / 2.2, 0, Math.PI * 2); ctx.fill(); }
                ctx.restore();

                p.y += p.speedY; p.x += p.speedX;
                if (p.y > height) p.y = 0;
                if (p.x > width) p.x = 0;
                if (p.x < 0) p.x = width;
            });
            requestAnimationFrame(drawMatrix);
        }
        drawMatrix();
    }
});
