'use strict';

module.exports = async function tagall(sock, msg, args, chatId, senderId, reply) {
  if (!chatId.endsWith('@g.us')) return reply('⚠️ Groups only.');
  try {
    const meta = await sock.groupMetadata(chatId);
    const members = meta.participants.map(p => p.id);
    const text = '📢 ' + members.map(m => `@${m.split('@')[0]}`).join(' ');
    await sock.sendMessage(chatId, { text, mentions: members });
  } catch { reply('⚠️ Could not fetch group members.'); }
};
