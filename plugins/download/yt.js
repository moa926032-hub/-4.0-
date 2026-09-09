import yts from 'yt-search';

const getDownloadData = async (url) => {
  const response = await fetch(
    `https://api.vyt.workers.dev/?url=${encodeURIComponent(url)}`
  );

  if (!response.ok) {
    throw new Error(`خدمة تحميل يوتيوب أعادت الحالة ${response.status}`);
  }

  const payload = await response.json();
  return payload?.data || payload;
};

const handler = async (m, { conn, command, text }) => {
  try {
    if (!text) return m.reply('*ضع الرابط بعد الأمر ❌*');
    
    if (!text.match(/youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\//)) {
      return m.reply('*❌ الرابط غير صحيح، يرجى وضع رابط يوتيوب صحيح*');
    }
    
    const isAudio = command === "يوت_اغنيه" || command === "ytmp3";
    
    // جلب معلومات المقطع (Thumbnail والعنوان والقناة)
    const search = await yts(text);
    const video = search.videos[0] || search;

    if (!video) return m.reply('❌ لم يتم العثور على تفاصيل الرابط.');

    const type = isAudio ? 'اغـانـي' : 'فيـديـوز';
    let caption = `*YouTube | يـوتـيـوب ${type}*\n\n`;
    caption += `❐═━━━═╊⊰🩸⊱╉═━━━═❐\n`;
    caption += `*❲ 📽️ ❳ الـعـنـوان:* ${video.title || 'غير معروف'}\n`;
    caption += `*❲ 📢 ❳ الـقـنـاة:* ${video.author?.name || 'غير معروف'}\n`;
    caption += `*❲ ⏳ ❳ الـمـدة:* ${video.timestamp || 'غير معروف'}\n`;
    caption += `❐═━━━═╊⊰🩸⊱╉═━━━═❐\n`;
    caption += `> _*❲ ⏱️ ❳ الرجاء الانتظار قليلاً...*_`;

    // إرسال صورة المقطع أولاً
    await conn.sendMessage(m.chat, { 
      image: { url: video.thumbnail },
      caption: caption,
      contextInfo: {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardingScore: 1,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '0029VbC75tvHltY0oNSC4m3z@newsletter',
          newsletterName: '𝐓𝐄𝐀𝐌 𝐃𝐄𝐕𝐎𝐍𝐈𝐂 || 𝑩𝑶𝑻',
          serverMessageId: 0
        }
      }
    }, { quoted: m });

    // خدمة التحميل لا تصدر ytmp3/ytmp4 من ruhend-scraper؛
    // نستخدم خدمة التحميل الحالية مباشرة لتجنب استيراد دوال غير موجودة.
    const mediaData = await getDownloadData(text);

    const downloadUrl = isAudio
      ? (mediaData?.audio || mediaData?.audioUrl || mediaData?.link || mediaData?.url)
      : (mediaData?.video || mediaData?.videoUrl || mediaData?.link || mediaData?.url);

    if (!downloadUrl) return m.reply('❌ فشل في استخراج رابط التحميل النهائي، حاول لاحقاً.');

    // إرسال ملف الصوت أو الفيديو
    await conn.sendMessage(m.chat, isAudio ? { 
      audio: { url: downloadUrl }, 
      mimetype: 'audio/mpeg',
      fileName: `${video.title}.mp3`
    } : { 
      video: { url: downloadUrl }, 
      caption: `*${video.title}*`
    }, { quoted: m });

  } catch (error) {
    console.error("Error in YouTube plugin:", error);
    m.reply('❌ حدث خطأ أثناء جلب المقطع من يوتيوب.');
  }
};

handler.usage = ["يوتيوب", "يوت_اغنيه"];
handler.category = "downloads";
handler.command = ['يوت_اغنيه', 'يوتيوب', "ytmp3", "ytmp4"];

export default handler;