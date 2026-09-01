# جزارة الراعي | Alraay Butchery — ملفات المشروع

ارفع الملفات دي على GitHub بنفس الأسماء والمجلدات بالظبط عشان الأكواد تشتغل صح:

```
index.html
style.css
script.js
manifest.json
service-worker.js
assets/
  logo/
    logo.png                  ← شعار الثور (يُستخدم كخلفية متحركة + في القائمة الجانبية)
    icon-192.png               ← أيقونة التطبيق (مربعة) 192×192 بكسل
    icon-512.png               ← أيقونة التطبيق (مربعة) 512×512 بكسل
  video/
    Heder-video.mp4            ← فيديو الهيدر الدائري
  images/
    qr-code.png                 ← صورة كود QR (تُضاف لاحقًا)
    Hawashi-zone.jpg
    Griled-zone.jpg
    chicken-zone.jpg
    sandwiches-zone.jpg
    Twagen-zone.jpg
    Meat-zone.jpg
    meat-zone2.jpg
    Shishtawwq.jpg
    Reiash-griled.jpg
    Kofta-griled.png
    Mixgriled.png
    Tarb-griled.png
    Sogaq-griled.png
    Turkish-chicken.png
    Chicken-griled.jpg
    Shishtaowq-dish.png
    meshakel-alraai.jpg
    melok-elhawawshi.png
    Lehoom-mogahza-zone.jpg
    Arood-elazooma.jpg
    Burger-griled.jpg
```

## عروضنا (ركن جديد)
ركن "عروضنا" في آخر الصفحة الرئيسية بيجمع صور فقط (من غير تكرار تحميلها داخل الأركان التانية)، وكل صورة تحتها اسمها بخط أبيض بولد داخل بوكس برتقالي.

## عرض خاص
في نهاية قائمة ركن الحواوشي: "عرض ملوك الحواوشي" (٤ قطع لحمة وسجق) بسعر ٤٤٠ جنيه بدلاً من ٥٦٠ جنيه.

## تحويل الموقع لتطبيق (PWA)
الموقع بقى "Progressive Web App" — يعني بمجرد رفعه على Cloudflare Pages (أو أي استضافة بـ HTTPS)، المستخدم يقدر:
- يفتح الموقع من المتصفح (كروم/سفاري) ويدوس على "إضافة إلى الشاشة الرئيسية / Add to Home Screen"
- يظهر أيقونة التطبيق على شاشة موبايله ويفتح بشكل مستقل (Standalone) من غير شريط عنوان المتصفح، بالظبط زي أي تطبيق عادي
- يشتغل حتى لو النت ضعيف أو مقطوع لفترة، لأن الملفات الأساسية بتتخزن (Cache) تلقائيًا

### مطلوب منك بس:
- ترفع صورتين أيقونة مربعة الشكل باسم `icon-192.png` و`icon-512.png` جوه `assets/logo/`
- الأيقونتين لازم يكونوا مربعين (نفس الطول والعرض) وخلفية غير شفافة يفضل تبقى بلون الموقع الغامق أو شعار الثور على خلفية داكنة

### ملاحظة
الـ Service Worker (ملف service-worker.js) مش هيشتغل إلا لما الموقع يتفتح عن طريق رابط حقيقي (HTTPS) زي رابط Cloudflare، مش هيشتغل وانت بتجرب من ملف مفتوح على جهازك مباشرة.

## ملاحظات
- لو صورة مش موجودة، مكانها هيختفي تلقائيًا من غير ما يكسر الصفحة.
- رقم الواتساب المستخدم في زر "تأكيد الطلب" هو **+201095786333**.
- زرار اللغة أعلى الصفحة يبدّل كل النصوص + المنتجات بين العربي والإنجليزي.
- ركني "اللحوم الطازجة" و"اللحوم المجهزة" فيهم اختيار الوزن (نصف كيلو / كيلو) وطريقة التعبئة.
- في آخر الصفحة إطار برتقالي فاضي لصورة الـ QR مع زرار تحميل.
- تذييل الصفحة فيه رابط "Powered by MyDigital-ID" يوجّه إلى https://mydigital-id.github.io/
