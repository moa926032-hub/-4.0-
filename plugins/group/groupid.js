/*
code: group info by link or current chat
*/

const handler = async (m, { conn, text, command }) => {
  try {
    let jid = m.chat;
    let inviteCode = '';
    let isLink = false;

    // التحقق مما إذا كان المستخدم قد أرسل رابطاً بعد الأمر
    if (text) {
      const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
      const match = text.match(linkRegex);
      if (match) {
        inviteCode = match[1];
        isLink = true;
      }
    }

    let name, id, owner, members, invite, desc, metaData;

    if (isLink) {
      // إذا تم إرسال رابط، يجلب المعلومات من الرابط مباشرة دون الحاجة لوجود البوت بالجروب
      try {
        metaData = await conn.groupGetInviteInfo(inviteCode);
        name = metaData.subject || 'غير معروف';
        id = metaData.id ? `${metaData.id}@g.us` : 'غير متوفر';
        owner = metaData.owner || metaData.creator || 'غير معروف';
        members = metaData.size || metaData.participants?.length || 0;
        invite = `https://chat.whatsapp.com/${inviteCode}`;
        desc = metaData.desc;
      } catch (err) {
        return m.reply('❌ فشل جلب معلومات الرابط، تأكد من أن الرابط فعال وصحيح.');
      }
    } else {
      // إذا تم كتابة الأمر بمفرده، يجلب معلومات الشات الحالي
      metaData = await conn.groupMetadata(jid);
      name = metaData.subject || 'غير معروف';
      id = jid;
      owner = metaData.owner || 'غير معروف';
      members = metaData.participants?.length || 0;
      desc = metaData.descId;

      try {
        const code = await conn.groupInviteCode(jid);
        invite = `https://chat.whatsapp.com/${code}`;
      } catch {
        invite = 'غير متوفر';
      }
    }

    let msg = `📌 *معلومات المجموعة*\n\n`;
    msg += `👥 الاسم: ${name}\n`;
    msg += `🆔 الايدي: ${id}\n`;
    msg += `👑 المالك: ${owner}\n`;
    msg += `👤 الأعضاء: ${members}\n`;
    msg += `🔗 رابط الدعوة:\n${invite}`;

    const img =
      desc
        ? `https://picsum.photos/600/300`
        : "https://i.supaimg.com/374589ce-56ae-4068-ba73-60f3b228637f/64789104-e032-44cd-a94f-8531fd17522c.jpg";

    await conn.sendButton(
      m.chat,
      {
        imageUrl: img,
        bodyText: msg,
        footerText: "𝑳𝑰𝑮𝑯𝑻 ¦🩸¦ 𝑩𝑶𝑻",
        buttons: [
          {
            name: "cta_copy",
            params: {
              display_text: "📋 انسخ ايدي المجموعة",
              copy_code: id
            }
          },
          {
            name: "cta_copy",
            params: {
              display_text: "🔗 انسخ رابط المجموعة",
              copy_code: invite
            }
          }
        ],
        mentions: [m.sender],
        interactiveConfig: {
          buttons_limits: 2,
          list_title: name,
          button_title: "Group Info",
          canonical_url: "https://vxv-profile.vercel.app"
        }
      },
      global.reply_status
    );

  } catch (e) {
    console.log(e);
    m.reply('❌ حدث خطأ أثناء جلب معلومات المجموعة');
  }
};

handler.command = ['اي-دي', 'جروب_ايدي'];
handler.group = false; // تم إرجاعها بناءً على طلبك لتجبر الأمر على العمل داخل الجروبات فقط
handler.owner = false; 

export default handler;
