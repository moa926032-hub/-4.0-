import { Client } from 'meowsab';
import { group, access } from "./system/control.js";
import { sub } from "./system/sub.js";
import UltraDB from "./system/UltraDB.js";

/* =========== Client ========== */
const client = new Client({
  phoneNumber: process.env.BOT_PHONE?.replace(/\D/g, '') || '',
  prefix: [".", "/", "!"],
  fromMe: false,
  sessionPath: './session',
  showLogs: false,
  owners: [
    { name: "محمد فرعون", jid: "201515063273@s.whatsapp.net" }
  ],
  settings: { noWelcome: true },
  commandsPath: './plugins',
  onError: (error) => console.error('[DEVO-NIC] Bot error:', error?.message || error)
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
    repo: "https://github.com/moa926032-hub/BOT_Devonic",
    api: "https://emam-api.web.id",
    channel: "https://whatsapp.com/channel/0029VbC75tvHltY0oNSC4m3z"
  },
  copyright: {
    pack: '𝐃𝐄𝐕𝐎𝐍𝐈𝐂 𝐁𝐎𝐓  ⚚',
    author: '𝐃𝐄𝐕𝐎𝐍𝐈𝐂 𝐁𝐎𝐓  ⚚'
  },
  images: [
    "https://raw.githubusercontent.com/moa926032-hub/BOT_Devonic/main/assets/devonic-logo.png"
  ]
};

/* =========== Start with pairing code ========== */
sub(client).catch((error) => {
  console.error('[DEVO-NIC] Failed to start:', error?.stack || error);
});

/* =========== Catch Errors ========== */
process.on('uncaughtException', (e) => {
    if (e.message.includes('rate-overlimit')) return;
    console.error('[DEVO-NIC] Uncaught exception:', e);
});

process.on('unhandledRejection', (err) => {
    console.error('[DEVO-NIC] Unhandled rejection:', err);
});
