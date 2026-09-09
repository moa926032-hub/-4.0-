import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { useMultiFileAuthState } from '@whiskeysockets/baileys';

const PAIRING_CODE = 'DEVONIC1';
const DISPLAY_PAIRING_CODE = 'DEVO-NIC1';
const MAX_WAIT_ATTEMPTS = 40;
const WAIT_MS = 500;

const ANSI = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    gray: '\x1b[90m',
    red: '\x1b[31m'
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const clearScreen = () => process.stdout.write('\x1b[2J\x1b[H');
const showLogo = () => console.log(ANSI.bold + ANSI.cyan + 'DEVONIC' + ANSI.reset);

const formatPairingCode = (code) => {
    const normalized = String(code || '').replace(/-/g, '').toUpperCase();
    if (normalized.length !== 8) return code || DISPLAY_PAIRING_CODE;
    return normalized.slice(0, 4) + '-' + normalized.slice(4);
};

const askPhoneNumber = async (client) => {
    const rl = readline.createInterface({ input, output });
    try {
        const answer = await rl.question(ANSI.cyan + 'رقم واتساب: ' + ANSI.reset);
        const typedNumber = answer.replace(/\D/g, '');
        const configuredNumber = String(client.config?.phoneNumber || process.env.BOT_PHONE || '').replace(/\D/g, '');
        return typedNumber || configuredNumber;
    } finally {
        rl.close();
    }
};

const withLoadingScreen = async (task) => {
    let tick = 0;
    const frames = ['.', '..', '...'];
    process.stdout.write('\n' + ANSI.gray + 'جاري التحميل' + ANSI.reset);
    const spinner = setInterval(() => {
        process.stdout.write('\r' + ANSI.gray + 'جاري التحميل' + frames[tick++ % frames.length] + ANSI.reset);
    }, 350);

    try {
        return await task();
    } finally {
        clearInterval(spinner);
        process.stdout.write('\r\x1b[K');
    }
};

export async function sub(client) {
    if (!client || typeof client.start !== 'function') {
        throw new TypeError('sub(client) يحتاج إلى كائن Client صالح.');
    }

    clearScreen();
    showLogo();
    console.log('');

    const sessionPath = client.config?.sessionPath || './session';
    const { state } = await useMultiFileAuthState(sessionPath);

    // لا نعتمد على sock.user.id؛ يمكن أن يظهر أثناء تهيئة socket
    // قبل أن نعرف هل بيانات الاعتماد مربوطة فعلًا أم لا.
    if (state.creds.registered) {
        await withLoadingScreen(() => client.start());
        clearScreen();
        showLogo();
        console.log('');
        console.log(ANSI.green + 'الحساب مرتبط بالفعل' + ANSI.reset);
        return null;
    }

    const phoneNumber = await askPhoneNumber(client);
    if (!phoneNumber) {
        throw new Error('رقم واتساب مطلوب بصيغة دولية بدون علامة +.');
    }

    client.config.phoneNumber = phoneNumber;
    clearScreen();
    showLogo();

    const code = await withLoadingScreen(async () => {
        await client.start();

        for (let attempt = 0; attempt < MAX_WAIT_ATTEMPTS; attempt += 1) {
            if (typeof client.sock?.requestPairingCode === 'function') break;
            await sleep(WAIT_MS);
        }

        if (typeof client.sock?.requestPairingCode !== 'function') {
            throw new Error('لم تصبح واجهة كود الربط جاهزة.');
        }

        return client.sock.requestPairingCode(phoneNumber, PAIRING_CODE);
    });

    clearScreen();
    showLogo();
    console.log('');

    console.log(ANSI.bold + 'كود الربط' + ANSI.reset);
    console.log('');
    console.log(ANSI.bold + ANSI.green + formatPairingCode(code) + ANSI.reset);
    return code;
}
