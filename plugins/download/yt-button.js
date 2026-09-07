const handler = async (m, { conn, text }) => {
    if (!text) return m.reply("*اكتب اسم الاغنية بعد الامر 📼*");
    
    const res = await fetch(`https://emam-api.web.id/home/sections/Search/api/YouTube/search?q=${text}`);
    const { data } = await res.json();
    const { title, image, timestamp: time, url } = data[0];

    await conn.sendButton(m.chat, {
        imageUrl: image,
        bodyText: `${title} ╎ ${time}`,
        footerText: "𝒀𝑶𝑼𝑻𝑼𝑩𝑬 𝑩𝑶𝑾𝑵𝑳𝑶𝑨𝑫",
        buttons: [
            { name: "quick_reply", params: { display_text: "🎼 ╎ تـحـمـيـل صـوت", id: `.يوت_اغنيه ${url}` } },
            { name: "quick_reply", params: { display_text: "🎬 ╎ تـحـمـيـل فـيـديـو", id: `.يوتيوب ${url}` } }
        ],
        mentions: [m.sender],
        newsletter: { name: "𝐓𝐄𝐀𝐌 𝐃𝐄𝐕𝐎𝐍𝐈𝐂 || 𝑩𝑶𝑻", jid: "0029VbC75tvHltY0oNSC4m3z@newsletter" },
        interactiveConfig: { buttons_limits: 10, list_title: "𝐃𝐄𝐕𝐎𝐍𝐈𝐂 𝐁𝐎𝐓  ⚚", button_title: "𝐃𝐄𝐕𝐎𝐍𝐈𝐂 𝐁𝐎𝐓  ⚚", canonical_url: url }
    }, m);
};

handler.usage = ["فيديو", "اغنيه", "شغل"];
handler.category = "downloads";
handler.command = ["اغنيه", "فيديو", "شغل", "play", "video"];

export default handler;