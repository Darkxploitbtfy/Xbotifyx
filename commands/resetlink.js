'use strict';

module.exports = async function resetlink(sock, msg, args, chatId, senderId, reply) {
  if (!chatId.endsWith('@g.us')) return reply('⚠️ Groups only.');
  try {
    const code = await sock.groupRevokeInvite(chatId);
    reply(`✅ Group link reset.\nhttps://chat.whatsapp.com/${code}`);
  } catch { reply('⚠️ Could not reset link — check bot admin permissions.'); }
};
