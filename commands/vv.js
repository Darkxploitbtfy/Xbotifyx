'use strict';
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = async function vv(sock, msg, args, chatId, senderId, reply) {
  const ctx = msg.message?.extendedTextMessage?.contextInfo;
  const quoted = ctx?.quotedMessage;
  if (!quoted) return reply('❌ Reply to a view-once message.');
  const isVO = !!(quoted.viewOnceMessage || quoted.viewOnceMessageV2 || quoted.viewOnceMessageV2Extension);
  if (!isVO) return reply('❌ That is not a view-once message.');
  try {
    const inner = (quoted.viewOnceMessage || quoted.viewOnceMessageV2 || quoted.viewOnceMessageV2Extension)?.message || {};
    const imgMsg = inner.imageMessage;
    const vidMsg = inner.videoMessage;
    const mediaMsg = imgMsg || vidMsg;
    if (!mediaMsg) return reply('❌ Could not extract media.');
    const type = imgMsg ? 'image' : 'video';
    const stream = await downloadContentFromMessage(mediaMsg, type);
    const chunks = [];
    for await (const c of stream) chunks.push(c);
    const buffer = Buffer.concat(chunks);
    await sock.sendMessage(chatId,
      type === 'image'
        ? { image: buffer, caption: '🔓 View-once unlocked' }
        : { video: buffer, caption: '🔓 View-once unlocked' },
      { quoted: msg }
    );
  } catch (err) { reply('⚠️ Could not unlock: ' + err.message); }
};
