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
    { name: "𝑮𝑶𝑲𝑶", lid: "12 972 3211@lid", jid: "218930171336@s.whatsapp.net" },
  // Owner 2
    { name: "GOKO", lid: "218945778513@lid", jid: "218930171336@s.whatsapp.net" },
  // Owner 3
    { name: "GOKO", jid: "201101989188@s.whatsapp.net", lid: "959666432747@lid" },
  // Owner 4 
   { name: "GOKO", jid: "201101989188@s.whatsapp.net", lid: "959666432747@lid" }
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
  nameBot: "𝑳𝑰𝑮𝑯𝑻 ┇🩸┇ 𝑩𝑶𝑻", 
  nameChannel: "𝑳𝑰𝑮𝑯𝑻 ┇🩸┇ 𝑪𝑯𝑨𝑵𝑵𝑬𝑳", 
  idChannel: "120363405545946827@newsletter",
  urls: {
    repo: "https://github.com/deveni0/Pomni-AI",
    api: "https://emam-api.web.id",
    channel: "https://whatsapp.com/channel/0029Vb7dTmNJENy9sp5yqi3T"
  },
  copyright: { 
    pack: '𝑳𝑰𝑮𝑯𝑻 ┇🩸┇ 𝑩𝑶𝑻', 
    author: '𝑳𝑰𝑮𝑯𝑻 ┇🩸┇ 𝑩𝑶𝑻'
  },
  images: [
    "https://i.supaimg.com/374589ce-56ae-4068-ba73-60f3b228637f/df4a4068-978a-4f77-afa8-bb5dd22968e1.jpg",
    "https://i.supaimg.com/374589ce-56ae-4068-ba73-60f3b228637f/0b22c6a0-3522-4e3d-b1b8-120642cb25b2.jpg",
    "https://i.supaimg.com/374589ce-56ae-4068-ba73-60f3b228637f/64789104-e032-44cd-a94f-8531fd17522c.jpg"
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
