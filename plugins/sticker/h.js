import { createSticker } from "../../system/utils.js";

const test = async (m, { conn, args }) => {
  if (!m.quoted) return m.reply("*يجب الرد على ملصق*");
  
  let [pack, author] = args.join(" ").split(" | ");
  
  if (!args.length) {
    return m.reply("📝 *الاستخدام الصحيح:*\n\n.حقوق اسم الباك | اسم المؤلف\n\n*مثال:*\n`.حقوق goko`");
  }
  
  if (!pack) pack = "𝐃𝐄𝐕𝐎𝐍𝐈𝐂 𝐁𝐎𝐓  ⚚";
  if (author === undefined) author = null;
  
  const q = await m.quoted;
  
  const buffer = await createSticker(await q.download(), { mime: q.mimetype, pack, author });

  await conn.sendMessage(
    m.chat,
    { sticker: buffer, contextInfo: context(m.sender, "https://i.supaimg.com/374589ce-56ae-4068-ba73-60f3b228637f/64789104-e032-44cd-a94f-8531fd17522c.jpg") },
    { quoted: global.reply_status }
  );
};

test.usage = ["حقوق نص | نص"];
test.command = ["حقوق"];
test.category = "sticker";
export default test;

const context = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '0029VbC75tvHltY0oNSC4m3z@newsletter',
        newsletterName: '𝐓𝐄𝐀𝐌 𝐃𝐄𝐕𝐎𝐍𝐈𝐂 || 𝑩𝑶𝑻',
        serverMessageId: 0
    },
    externalAdReply: {
        title: "𝐃𝐄𝐕𝐎𝐍𝐈𝐂 𝐁𝐎𝐓  ⚚",
        body: "𝐿𝐼𝐺𝐻𝑇 𝐵𝑂𝑇 𝐼𝑆 𝑇𝐻𝐸 𝐵𝐸𝑆𝑇🩸",
        thumbnailUrl: img,
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: true
    }
});