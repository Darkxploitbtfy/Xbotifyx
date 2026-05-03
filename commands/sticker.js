'use strict';
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
let sharp; try { sharp = require('sharp'); } catch {}

module.exports = async function sticker(sock, msg, args, chatId, senderId, reply) {
  if (!sharp) return reply('❌ sharp module missing. Run: npm install');
  const ctx = msg.message?.extendedTextMessage?.contextInfo;
  const imgMsg = ctx?.quotedMessage?.imageMessage || msg.message?.imageMessage;
  if (!imgMsg) return reply('❌ Reply to an image to convert it to a sticker.');
  try {
    const stream = await downloadContentFromMessage(imgMsg, 'image');
    const chunks = [];
    for await (const c of stream) chunks.push(c);
    const webp = await sharp(Buffer.concat(chunks))
      .resize(512, 512, { fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } })
      .webp().toBuffer();
    await sock.sendMessage(chatId, { sticker: webp }, { quoted: msg });
  } catch (err) { reply('⚠️ Sticker error: ' + err.message); }
};
