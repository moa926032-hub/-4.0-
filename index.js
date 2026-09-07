import { Client } from 'meowsab';
import { group, access } from "./system/control.js";
import UltraDB from "./system/UltraDB.js";

/* =========== Client ========== */
const client = new Client({
  phoneNumber: '966592795674', // Bot number
  prefix: [".", "/", "!"],
  fromMe: false, 
  owners: [
    { name: "محمد فرعون", jid: "201515063273@s.whatsapp.net" }
  ],
  settings: { noWelcome: true },
  commandsPath: './plugins'
});

client.onGroupEvent(group);
client.onCommandAccess(access);

/* =========== Database ========== */
if (!global.db) {
    global.db = new UltraDB();
}

/* =========== Config ========== */
const { config } = client;
config.info = { 
  nameBot: "𝐃𝐄𝐕𝐎𝐍𝐈𝐂 𝐁𝐎𝐓  ⚚", 
  nameChannel: "𝐓𝐄𝐀𝐌 𝐃𝐄𝐕𝐎𝐍𝐈𝐂 || 𝑩𝑶𝑻", 
  idChannel: "0029VbC75tvHltY0oNSC4m3z@newsletter",
  developer: { name: "محمد فرعون", phone: "01515063273" },
  urls: {
    repo: "https://github.com/deveni0/Pomni-AI",
    api: "https://emam-api.web.id",
    channel: "https://whatsapp.com/channel/0029VbC75tvHltY0oNSC4m3z"
  },
  copyright: { 
    pack: '𝐃𝐄𝐕𝐎𝐍𝐈𝐂 𝐁𝐎𝐓  ⚚', 
    author: '𝐃𝐄𝐕𝐎𝐍𝐈𝐂 𝐁𝐎𝐓  ⚚'
  },
  images: [
    "https://raw.githubusercontent.com/moa926032-hub/-4.0-/main/assets/devonic-logo.png"
  ]
};

/* =========== Start ========== */
client.start();


/* =========== Catch Errors ========== */
process.on('uncaughtException', (e) => {
    if (e.message.includes('rate-overlimit')) {}
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err)
});


/* 
=========== Memory Monitor ========== 

setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 800) {
        console.log(`🔄 Bot memory full (${used.toFixed(1)}MB), restarting...`)
        process.exit(1) 
    }
}, 300_000) 

*/