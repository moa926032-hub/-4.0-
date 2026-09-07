const PAIRING_CODE = 'DEVONIC1';
const DISPLAY_PAIRING_CODE = 'DEVO-NIC1';
const MAX_WAIT_ATTEMPTS = 40;
const WAIT_MS = 500;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const formatPairingCode = (code) => {
    const normalized = String(code || '').replace(/-/g, '').toUpperCase();
    if (normalized.length !== 8) return code || DISPLAY_PAIRING_CODE;
    return normalized.slice(0, 4) + '-' + normalized.slice(4);
};

export async function sub(client) {
    if (!client || typeof client.start !== 'function') {
        throw new TypeError('sub(client) يحتاج إلى كائن Client صالح.');
    }

    await client.start();

    for (let attempt = 0; attempt < MAX_WAIT_ATTEMPTS; attempt += 1) {
        if (client.sock?.user?.id) return null;
        if (typeof client.sock?.requestPairingCode === 'function') break;
        await sleep(WAIT_MS);
    }

    if (client.sock?.user?.id) return null;
    if (typeof client.sock?.requestPairingCode !== 'function') {
        throw new Error('لم تصبح واجهة كود الربط جاهزة. أعد تشغيل البوت وحاول مرة أخرى.');
    }

    const phoneNumber = String(client.config?.phoneNumber || '').replace(/\D/g, '');
    if (!phoneNumber) {
        throw new Error('ضع رقم البوت بصيغة دولية في BOT_PHONE بدون علامة +.');
    }

    const code = await client.sock.requestPairingCode(phoneNumber, PAIRING_CODE);
    console.log('🔐 كود الربط: ' + formatPairingCode(code || PAIRING_CODE));
    console.log('📱 افتح واتساب > الأجهزة المرتبطة > ربط جهاز > الربط برقم الهاتف.');
    return code;
}
