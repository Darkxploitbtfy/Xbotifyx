'use strict';
const { getTarget } = require('../utils/helpers');

module.exports = async function demote(sock, msg, args, chatId, senderId, reply) {
  if (!chatId.endsWith('@g.us')) return reply('⚠️ Groups only.');
  const target = getTarget(msg);
  if (!target) return reply('❌ Reply or tag a user.');
  try {
    await sock.groupParticipantsUpdate(chatId, [target], 'demote');
    await sock.sendMessage(chatId, {
      text: `✅ @${target.split('@')[0]} has been demoted.`,
      mentions: [target],
    });
  } catch { reply('⚠️ Could not demote — check bot admin permissions.'); }
};
