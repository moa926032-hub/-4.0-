let handler = async (m, { conn }) => {
  let img = 'https://i.supaimg.com/374589ce-56ae-4068-ba73-60f3b228637f/0b22c6a0-3522-4e3d-b1b8-120642cb25b2.jpg';

  let captionText = `📜 *قَوَانِينُ الـمَطـَوِّرِ | RULES* 📜
❐═━━━═╊⊰🩸⊱╉═━━━═❐

1️⃣ *الدخول بتحية السلام عند التواصل.*
2️⃣ *يمنع الدخول للخاص بهدف الإزعاج أو التكرار.*
3️⃣ *احترام المطور وعدم الاتصال المباشر نهائياً.*
4️⃣ *توضيح طلبك أو مشكلتك في رسالة واحدة مباشرة.*

❐═━━━═╊⊰🩸⊱╉═━━━═❐`;

  await conn.sendButtonNormal(m.chat, {
    media: { url: img },
    mediaType: 'image',
    caption: captionText,
    buttons: [
      {
        name: "cta_url",
        params: {
          display_text: "💬 تواصل مع المطور",
          url: "https://wa.me/249129723211"
        }
      }
    ],
    mentions: [m.sender]
  }, m);
};

handler.command = /^(owner|مطور|المطور)$/i;

export default handler;
