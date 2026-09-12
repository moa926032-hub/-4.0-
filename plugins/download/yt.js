import { ytmp3, ytmp4 } from 'ruhend-scraper'; // مكتبة بديلة وسريعة جداً للتحميل
import yts from 'yt-search';

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
          newsletterJid: '120363405545946827@newsletter',
          newsletterName: '𝑳𝑰𝑮𝑯𝑻 ┇🩸┇ 𝑪𝑯𝑨𝑵𝑵𝑬𝑳',
          serverMessageId: 0
        }
      }
    }, { quoted: m });

    // استخراج رابط التنزيل عبر Scraper بديل مستقر
    let mediaData;
    if (isAudio) {
      mediaData = await ytmp3(text);
    } else {
      mediaData = await ytmp4(text);
    }

    if (!mediaData || !mediaData.audio || !mediaData.video) {
      // محاولة احتياطية في حال تعثر السيرفر الأول
      const backupRes = await fetch(`https://api.vyt.workers.dev/?url=${encodeURIComponent(text)}`).then(r => r.json()).catch(() => null);
      if (backupRes && backupRes.url) {
        mediaData = { audio: backupRes.url, video: backupRes.url };
      }
    }

    const downloadUrl = isAudio ? (mediaData.audio || mediaData.link) : (mediaData.video || mediaData.link);

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