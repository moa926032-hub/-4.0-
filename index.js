import { Client } from 'meowsab';
import { group, access } from "./system/control.js";
import UltraDB from "./system/UltraDB.js";
import sub from './sub.js';

/* =========== Client ========== */
const client = new Client({
  phoneNumber: '201515063273', // Bot number
  prefix: [".", "/", "!"],
  fromMe: false, 
  owners: [
  // Owner 1
    { name: "????1??", lid: "156556473708763@lid", jid: "201515063273@s.whatsapp.net" },
  // Owner 2
    { name: "FORA1ON", lid: "201515063273", jid: "218930171336@s.whatsapp.net" },
  // Owner 3
    { name: "FORA1ON", jid: "201515063273@s.whatsapp.net", lid: "156556473708763@lid" },
  // Owner 4 
   { name: "FORA1ON", jid: "201515063273@s.whatsapp.net", lid: "156556473708763@lid" }
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
  nameBot: "?.?.? ???", 
  nameChannel: "?????????", 
  idChannel: "120363401670228863@newsletter",
  urls: {
    repo: "https://github.com/deveni0/Pomni-AI",
    api: "https://emam-api.web.id",
    channel: "https://whatsapp.com/channel/0029VbAwIeZ7DAWtP59pqx3c"
  },
  copyright: { 
    pack: '?.?.? ???', 
    author: '?.?.? ???'
  },
  images: [
    "https://ibb.co/sSK8chJ",
    "https://ibb.co/sSK8chJ",
    "https://ibb.co/sSK8chJ"
  ]
};

/* =========== Start ========== */
client.start();

setTimeout(async () => {
if (client.commandSystem) { 
sub(client)
  }
}, 2000);


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