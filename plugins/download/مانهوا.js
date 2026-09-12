// ─── plugins/manhwa.js ───
// 𝑳𝑰𝑮𝑯𝑻 ┇🩸┇ 𝑩𝑶𝑻 - Manhwa Plugin 📚

import axios from 'axios';
import cheerio from 'cheerio';
import JSZip from 'jszip';
import { Buffer } from 'buffer';

const DEFAULT_IMAGE = 'https://i3.wp.com/despair-manga.net/wp-content/uploads/2025/08/0001-1-1.jpg?w=720';
const BASE_URL = 'https://despair-manga.net';
const HEADER = "❐═━━━═╊⊰🩸⊱╉═━━━═❐";

const cleanContext = (jid) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363405545946827@newsletter',
        newsletterName: '𝑳𝑰𝑮𝑯𝑻 ┇🩸┇ 𝑪𝑯𝑨𝑵𝑵𝑬𝑳',
        serverMessageId: 0
    }
});

async function fetchWithRetry(url) {
    return await axios.get(url, {
        timeout: 30000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'ar,en;q=0.9',
            'Referer': BASE_URL
        }
    });
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const handler = async (m, { conn, text, command, usedPrefix }) => {
    const prefix = usedPrefix || '.';

    // 1️⃣ أمر البحث أو عرض المانهوا
    if (/^(مانهوا|manhwa)$/i.test(command)) {
        m.react('🔍');

        try {
            let results = [];
            let isPopular = false;

            if (!text || text.trim() === '') {
                const sources = [`${BASE_URL}/page/1/`, `${BASE_URL}/page/2/`];
                for (const source of sources) {
                    try {
                        const { data } = await fetchWithRetry(source);
                        const $ = cheerio.load(data);
                        $('.listupd .bs').each((i, el) => {
                            const title = $(el).find('.bsx .tt').text().trim();
                            const link = $(el).find('a').attr('href');
                            const cover = $(el).find('img').attr('src');
                            const status = $(el).find('.bsx .bt .sts').text().trim() || 'جاري';
                            const type = $(el).find('.bsx .bt .bts').text().trim() || 'مانهوا';
                            if (title && link) results.push({ title, link, cover: cover || DEFAULT_IMAGE, status, type });
                        });
                    } catch (e) {}
                }
                isPopular = true;
            } else {
                const searchUrl = `${BASE_URL}/wp-admin/admin-ajax.php`;
                const formData = new URLSearchParams();
                formData.append('action', 'ts_ac_do_search');
                formData.append('ts_ac_query', text);

                const { data } = await axios.post(searchUrl, formData, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                results = data.series?.[0]?.all || [];
            }

            if (!results || results.length === 0) throw `${HEADER}\n❌ *لم يتم العثور على نتائج*\n${HEADER}`;

            const randomIndex = Math.floor(Math.random() * results.length);
            const randomResult = results[randomIndex];
            const firstCover = randomResult?.cover || randomResult?.post_image?.match(/https?:\/\/[^"']+\.(jpg|png|webp)/i)?.[0] || DEFAULT_IMAGE;

            const rows = shuffleArray(results).slice(0, 20).map((manga) => ({
                title: manga.title || manga.post_title || 'بدون عنوان',
                description: `📊 ${manga.status || manga.post_status || 'جاري'} | ${manga.type || manga.post_type || 'مانهوا'}`,
                id: `${prefix}عرض_مانهوا ${manga.link || manga.post_link}`
            }));

            const titleText = isPopular ? '🏆 *أشهر المانهوات المتاحة*' : `🔍 *نتائج البحث عن:* ${text}`;
            const subText = isPopular ? '📚 *اختر من القائمة لعرض الفصول*' : `📚 *تم العثور على:* ${results.length} نتيجة`;
            const caption = `${HEADER}\n${titleText}\n${subText}\n${HEADER}`;

            const sections = [{
                title: isPopular ? '🏆 الأكثر شهرة' : '🔍 نتائج البحث',
                rows: rows
            }];

            await conn.sendButtonNormal(m.chat, {
                media: { url: firstCover },
                mediaType: 'image',
                caption: caption,
                buttons: [{
                    name: "single_select",
                    params: {
                        title: "📚 اختر المانجا",
                        sections: sections
                    }
                }],
                mentions: [m.sender],
                contextInfo: cleanContext(m.sender)
            }, m);

        } catch (e) {
            console.log(e.message || e);
            throw e;
        }
    }

    // 2️⃣ أمر عرض تفاصيل المانهوا
    if (/^(عرض_مانهوا|manga_info)$/i.test(command)) {
        if (!text || !text.startsWith('http')) throw `${HEADER}\n📌 *ضع رابط المانهوا بعد الأمر*\n${HEADER}`;

        m.react('📖');

        try {
            const { data } = await fetchWithRetry(text);
            const $ = cheerio.load(data);

            const title = $('h1.entry-title').text().trim();
            const coverImg = $('.thumb img').attr('src') || DEFAULT_IMAGE;
            const status = $('.imptdt:contains("Status") i').text().trim() || 'جاري';
            const type = $('.imptdt:contains("Type") a').text().trim() || 'مانهوا';
            const rating = $('.rating .num').text().trim() || 'N/A';
            const synopsis = $('.entry-content.entry-content-single').text().trim();

            const chapters = [];
            $('#chapterlist ul li').each((i, el) => {
                const chapterUrl = $(el).find('a').attr('href');
                const chapterName = $(el).find('.chapternum').text().trim();
                if (chapterUrl && chapterName) {
                    chapters.push({ name: chapterName, url: chapterUrl });
                }
            });
            chapters.reverse();

            if (chapters.length === 0) throw `${HEADER}\n⚠️ *لا توجد فصول متاحة حالياً لهذه المانجا.*\n${HEADER}`;

            let infoText = `${HEADER}\n📚 *${title}*\n\n📖 *النوع:* ${type}\n📊 *الحالة:* ${status}\n⭐ *التقييم:* ${rating}\n📚 *عدد الفصول:* ${chapters.length}\n\n📖 *القصة:*\n${synopsis ? synopsis.substring(0, 200) + '...' : 'لا يوجد وصف'}\n${HEADER}`;

            const CHAPTERS_PER_SECTION = 50;
            const sections = [];
            for (let i = 0; i < chapters.length; i += CHAPTERS_PER_SECTION) {
                const chunk = chapters.slice(i, i + CHAPTERS_PER_SECTION);
                const sectionTitle = `📖 الفصول ${i + 1} - ${Math.min(i + CHAPTERS_PER_SECTION, chapters.length)}`;
                const rows = chunk.map((ch) => ({
                    title: ch.name,
                    description: `📥 اضغط للتحميل ZIP`,
                    id: `${prefix}تحميل_فصل ${ch.url}`
                }));
                sections.push({ title: sectionTitle, rows: rows });
            }

            await conn.sendButtonNormal(m.chat, {
                media: { url: coverImg },
                mediaType: 'image',
                caption: infoText,
                buttons: [{
                    name: "single_select",
                    params: {
                        title: `📖 قائمة الفصول (${chapters.length})`,
                        sections: sections
                    }
                }],
                mentions: [m.sender],
                contextInfo: cleanContext(m.sender)
            }, m);

        } catch (e) {
            console.log(e.message || e);
            throw e;
        }
    }

    // 3️⃣ أمر تحميل الفصل كملف ZIP
    if (/^(تحميل_فصل|zip)$/i.test(command)) {
        if (!text || !text.startsWith('http')) throw `${HEADER}\n📌 *ضع رابط الفصل بعد الأمر*\n${HEADER}`;

        m.react('📦');

        try {
            const { data } = await fetchWithRetry(text);
            const tsReaderMatch = data.match(/ts_reader\.run\((\{[\s\S]+?\})\)/);
            if (!tsReaderMatch) throw '❌ لم يتم العثور على صور الفصل';

            const imagesMatch = tsReaderMatch[1].match(/"images":\s*\[([^\]]+)\]/);
            if (!imagesMatch) throw '❌ فشل جلب الصور من السيرفر';

            let imagesStr = imagesMatch[1].replace(/\n/g, '').replace(/\\/g, '');
            const images = JSON.parse(`[${imagesStr}]`);
            const fullUrls = images.map(img => img.startsWith('http') ? img : `${BASE_URL}${img}`);

            const zip = new JSZip();
            let pagesAdded = 0;

            for (let i = 0; i < fullUrls.length; i++) {
                try {
                    const imgRes = await axios.get(fullUrls[i], { responseType: 'arraybuffer', timeout: 30000 });
                    if (imgRes && imgRes.data) {
                        zip.file(`page_${String(i + 1).padStart(3, '0')}.jpg`, Buffer.from(imgRes.data));
                        pagesAdded++;
                    }
                } catch (err) {}
            }

            if (pagesAdded === 0) throw '❌ فشل تحميل صفحات الفصل';

            const fileBuffer = await zip.generateAsync({ type: 'nodebuffer' });
            const fileSizeMB = (fileBuffer.length / 1024 / 1024).toFixed(2);

            await conn.sendMessage(m.chat, {
                document: fileBuffer,
                mimetype: 'application/zip',
                fileName: `Chapter_${Date.now()}.zip`,
                caption: `${HEADER}\n📦 *تم تجهيز الفصل بنجاح!*\n\n📄 *الصفحات:* ${pagesAdded}\n📁 *الحجم:* ${fileSizeMB} MB\n${HEADER}`,
                contextInfo: cleanContext(m.sender)
            }, { quoted: m });

        } catch (e) {
            console.log(e.message || e);
            throw e;
        }
    }
};

handler.usage = ["مانهوا", "عرض_مانهوا", "تحميل_فصل"];
handler.category = "downloads";
handler.command = ["مانهوا", "manhwa", "عرض_مانهوا", "manga_info", "تحميل_فصل", "zip"];

export default handler;
