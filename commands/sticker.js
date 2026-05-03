'use strict';

const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = async function sticker(sock, msg, args, chatId, senderId, reply) {
  const ctx    = msg.message?.extendedTextMessage?.contextInfo;
  const imgMsg = ctx?.quotedMessage?.imageMessage || msg.message?.imageMessage;
  if (!imgMsg) return reply('❌ Reply to an image to convert it to a sticker.');

  try {
    const stream = await downloadContentFromMessage(imgMsg, 'image');
    const chunks = [];
    for await (const c of stream) chunks.push(c);
    const buffer = Buffer.concat(chunks);

    /* Try sharp first (may be available if manually installed) */
    let webp = null;
    try {
      const sharp = require('sharp');
      webp = await sharp(buffer)
        .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp()
        .toBuffer();
    } catch {
      /* Fallback: use Jimp (pure JS, always available) */
      const Jimp = require('jimp');
      const img  = await Jimp.read(buffer);
      img.resize(512, 512);
      webp = await img.getBufferAsync(Jimp.MIME_PNG);
    }

    await sock.sendMessage(chatId, { sticker: webp }, { quoted: msg });
  } catch (err) {
    reply('⚠️ Sticker error: ' + err.message);
  }
};
