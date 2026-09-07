let handler = async (m, { conn }) => {
    await conn.circular(m.chat, { vid: "https://files.catbox.moe/bqxzcl.mp4", sec: 200 }, m);
}

handler.command = ["بوم"];
handler.usePrefix = false;

export default handler;