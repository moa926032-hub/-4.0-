import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import { uploadToQuax } from "../../system/utils.js";

const handler = async (m, { conn, command }) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || '';

  if (!mime) throw '*رد علي الصوره او الفيديو أو الصوت🔗 لتحويله لرابط*';
  
  const media = await q.download();
  const link = await uploadToQuax(media);
  
  await conn.sendButton(m.chat, {
    imageUrl: link,
    bodyText: "🗃️ نجح رفع الصورة على *(catbox.moe)*\n- ```" + link + "```",
    footerText: "𝐃𝐄𝐕𝐎𝐍𝐈𝐂 𝐁𝐎𝐓  ⚚",
    buttons: [
      { name: "cta_copy", params: { display_text: "Copy Link", copy_code: link } },
    ],
    mentions: [m.sender],
    newsletter: {
      name: '𝐓𝐄𝐀𝐌 𝐃𝐄𝐕𝐎𝐍𝐈𝐂 || 𝑩𝑶𝑻',
      jid: '0029VbC75tvHltY0oNSC4m3z@newsletter'
    },
    interactiveConfig: {
      buttons_limits: 10,
      list_title: "𝐃𝐄𝐕𝐎𝐍𝐈𝐂 𝐁𝐎𝐓  ⚚",
      button_title: "Click Here",
      canonical_url: "https://vxv-profile.vercel.app"
    }
  }, m);
};

handler.usage = ["لرابط"];
handler.category = "tools";
handler.command = ['لرابط', 'image2url'];

export default handler;