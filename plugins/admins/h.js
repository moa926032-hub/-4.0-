const h =  async (m, { text, bot, conn }) => {
    
    try {
        const { images } = bot.config.info;
        const adReply = {
            title: bot.config.info.nameBot || "𝐃𝐄𝐕𝐎𝐍𝐈𝐂 𝐁𝐎𝐓  ⚚",
            body: null,
            thumbnailUrl: images.random(),
            mediaType: 1,
            renderLargerThumbnail: false
        };
        
        const customText = text || "𝐃𝐄𝐕𝐎𝐍𝐈𝐂 𝐁𝐎𝐓  ⚚";
        
        if (!m.quoted) {
            return await conn.sendMessage(m.chat, { 
                text: customText, 
                contextInfo: { externalAdReply: adReply }
            });
        }
        
        
        const groupMetadata = await conn.groupMetadata(m.chat);
        const participants = groupMetadata.participants.map(v => v.id);
        
        await conn.sendMessage(m.chat, { 
            forward: m.quoted.fakeObj(), 
            mentions: participants,
            contextInfo: {
                isForwarded: true,
                forwardingScore: 999, 
                externalAdReply: adReply
            }
        });
    } catch (err) {
        await m.reply(err.message);
    }
}

h.usage = ["مخفي"]
h.category = "admin";
h.command = ['م', 'h']
h.group = true;
h.admin = true;
h.usePrefix = false

export default h;