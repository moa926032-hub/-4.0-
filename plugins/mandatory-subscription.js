const REQUIRED_GROUP_LINK = 'https://chat.whatsapp.com/LXJShVjFa0aIDbr2cn1DRd';
const REQUIRED_GROUP_CODE = 'LXJShVjFa0aIDbr2cn1DRd';
const OWNER_JIDS = ['201515063273@s.whatsapp.net'];
const CACHE_TTL = 30_000;

let requiredGroupId = null;
let groupCache = { expiresAt: 0, participants: [] };
let joinAttempted = false;

const normalizeJid = (jid) => String(jid || '').trim().toLowerCase();

const sameUser = (left, right) => {
    const a = normalizeJid(left);
    const b = normalizeJid(right);
    if (!a || !b) return false;
    if (a === b) return true;

    const aNumber = a.split('@')[0].replace(/\D/g, '');
    const bNumber = b.split('@')[0].replace(/\D/g, '');
    return Boolean(aNumber && bNumber && aNumber === bNumber);
};

const isOwner = (jid) => OWNER_JIDS.some(owner => sameUser(owner, jid));

const resolveGroupId = async (conn) => {
    if (requiredGroupId) return requiredGroupId;

    try {
        const inviteInfo = await conn.groupGetInviteInfo(REQUIRED_GROUP_CODE);
        requiredGroupId = inviteInfo?.id || inviteInfo?.jid || inviteInfo?.groupJid;
    } catch (error) {
        console.error('[mandatory-subscription] تعذر قراءة بيانات رابط الجروب:', error.message);
    }

    if (!requiredGroupId && !joinAttempted && typeof conn.groupAcceptInvite === 'function') {
        joinAttempted = true;
        try {
            requiredGroupId = await conn.groupAcceptInvite(REQUIRED_GROUP_CODE);
        } catch (error) {
            console.error('[mandatory-subscription] تعذر إرسال/تنفيذ طلب انضمام البوت:', error.message);
        }
    }

    return requiredGroupId;
};

const getParticipants = async (conn, groupId) => {
    if (groupCache.expiresAt > Date.now()) return groupCache.participants;

    const metadata = await conn.groupMetadata(groupId);
    const participants = metadata?.participants || [];
    groupCache = {
        expiresAt: Date.now() + CACHE_TTL,
        participants
    };
    return participants;
};

const mandatorySubscription = async (m, { conn }) => {
    if (!m?.sender || isOwner(m.sender)) return false;

    const groupId = await resolveGroupId(conn);
    if (!groupId) {
        console.error('[mandatory-subscription] لم يتم التعرف على معرّف الجروب المطلوب.');
        return false;
    }

    if (sameUser(m.chat, groupId)) return false;

    try {
        const participants = await getParticipants(conn, groupId);
        const subscribed = participants.some(participant =>
            sameUser(participant?.id, m.sender) ||
            sameUser(participant?.jid, m.sender) ||
            sameUser(participant?.phoneNumber, m.sender)
        );

        if (subscribed) return false;

        await conn.sendMessage(m.chat, {
            text: [
                '⛔ *الاشتراك إجباري لاستخدام البوت*',
                '',
                'من فضلك انضم إلى الجروب ثم أرسل أمرك مرة أخرى:',
                REQUIRED_GROUP_LINK,
                '',
                'بعد الانضمام قد يستغرق التحقق عدة ثوانٍ.'
            ].join('\n')
        }, { quoted: m });

        return true;
    } catch (error) {
        console.error('[mandatory-subscription] فشل التحقق من العضوية:', error.message);
        return false;
    }
};

mandatorySubscription.before = mandatorySubscription;

export default mandatorySubscription;
