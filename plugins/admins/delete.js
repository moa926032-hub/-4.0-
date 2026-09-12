const handler = async (m, { conn }) => {
  if (!m.quoted) return m.reply("*الرجاء الرد على الرسالة التي تريد حذفها 📩*")
  m.quoted.delete()
 // m.delete()
};

handler.command = ["حذف"];
handler.usage = ['حذف'];
handler.category = "admin";
handler.admin = true;

export default handler;