const toM = a => '@' + a.split('@')[0];

const run = async (m, { conn, groupMetadata }) => {
    // جلب جميع أعضاء المجموعة
    let ps = groupMetadata.participants.map(v => v.id);
    
    // اختيار عضو عشوائي
    let a = ps.getRandom();
    let b;
    
    do {
        b = ps.getRandom();
    } while (b === a);

    const resultText = `❐═━━━═╊⊰🩸⊱╉═━━━═❐\n*⚔️ ┇ أكـثـر واحـد هـنـا بـيـبـيـض عـلـيـك:* \n\n➤ ${toM(a)}\n❐═━━━═╊⊰🩸⊱╉═━━━═❐`;

    // إرسال الرسالة مع المنشن
    await conn.sendMessage(m.chat, {
        text: resultText,
        mentions: [a, b]
    }, { quoted: m });
};

run.command = ['بيبضني'];
run.usage = ['بيبضني'];
run.category = 'games';
run.group = true;

export default run;

// دالة جلب عنصر عشوائي من المصفوفة
Array.prototype.getRandom = function () {
    return this[Math.floor(Math.random() * this.length)];
};
