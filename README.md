# DEVONIC BOT

بوت واتساب يعمل على Node.js وTermux.

## التشغيل على Termux

```bash
pkg update -y && pkg upgrade -y
pkg install -y git nodejs-lts ffmpeg

git clone https://github.com/moa926032-hub/BOT_Devonic.git
cd -- BOT_Devonic
npm install --include=optional
termux-wake-lock
npm start
```

> ملاحظة: يحتوي المشروع على دعم WebAssembly لـ `sharp` حتى تعمل معالجة الصور
> على Termux/Android بدون اعتماد على نسخة `android-arm64` غير المدعومة.

بعد تشغيل البوت ستظهر شاشة نظيفة باسم **DEVONIC**، ثم:

1. اكتب رقم واتساب بصيغة دولية بدون علامة `+`.
2. انتظر شاشة `جاري التحميل...`.
3. استخدم كود الربط الظاهر بالشكل **DEVO-NIC1**.

من واتساب افتح:

**الأجهزة المرتبطة ← ربط جهاز ← الربط برقم الهاتف**

يمكنك أيضًا تحديد الرقم قبل التشغيل بدل كتابته داخل الشاشة:

```bash
export BOT_PHONE=201XXXXXXXXX
npm start
```

بعد نجاح الربط يحفظ البوت الجلسة داخل مجلد `session` ولن يطلب كودًا جديدًا في كل تشغيل.

لإعادة ربط رقم جديد فقط احذف الجلسة القديمة ثم شغّل البوت:

```bash
rm -rf session
npm start
```

## الاشتراك الإجباري

المستخدم غير المشترك في جروب البوت يستلم رابط الانضمام ويتوقف أمره حتى ينضم.

## ملاحظات

- شغّل `npm start` من داخل مجلد المشروع.
- لا ترفع مجلد `session` إلى GitHub لأنه يحتوي على بيانات جلسة واتساب.
- لإيقاف البوت استخدم `Ctrl + C`.
