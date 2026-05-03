'use strict';

module.exports = async function hidetag(sock, msg, args, chatId, senderId, reply) {
  if (!chatId.endsWith('@g.us')) return reply('⚠️ Groups only.');
  const text = args.slice(1).join(' ') || '📣';
  try {
    const meta = await sock.groupMetadata(chatId);
    const members = meta.participants.map(p => p.id);
    await sock.sendMessage(chatId, { text, mentions: members });
    try { await sock.sendMessage(chatId, { delete: msg.key }); } catch {}
  } catch { reply('⚠️ Could not fetch members.'); }
};
