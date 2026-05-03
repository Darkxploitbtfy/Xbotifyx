'use strict';
const { getTarget } = require('../utils/helpers');
const { addWarning, resetWarning } = require('../utils/warnings');

module.exports = async function warn(sock, msg, args, chatId, senderId, reply) {
  if (!chatId.endsWith('@g.us')) return reply('⚠️ Groups only.');
  const target = getTarget(msg);
  if (!target) return reply('❌ Reply or tag a user.');
  const count = addWarning(chatId, target);
  await sock.sendMessage(chatId, {
    text: `⚠️ @${target.split('@')[0]} warned. (${count}/5)${count >= 5 ? '\nRemoving...' : `\n${5 - count} left before removal.`}`,
    mentions: [target],
  });
  if (count >= 5) {
    try {
      await sock.groupParticipantsUpdate(chatId, [target], 'remove');
      resetWarning(chatId, target);
    } catch { reply('⚠️ Could not remove — check bot admin permissions.'); }
  }
};
