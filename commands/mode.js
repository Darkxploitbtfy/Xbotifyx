'use strict';
const { getMode, setMode } = require('../utils/settings');

module.exports = async function mode(sock, msg, args, chatId, senderId, reply, isAdmin) {
  if (!isAdmin) return reply('❌ Owner only command.');
  const m = args[1]?.toLowerCase();
  if (!['public','private'].includes(m)) {
    return reply(`Current mode: *${getMode()}*\n\nUsage: *mode public/private`);
  }
  setMode(m);
  reply(m === 'public'
    ? '🌐 *Public mode* — Anyone can use commands.'
    : '🔒 *Private mode* — Only authorized users can use commands.');
};
