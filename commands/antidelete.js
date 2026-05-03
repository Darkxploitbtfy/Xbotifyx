'use strict';
const { setSetting } = require('../utils/settings');

module.exports = async function antidelete(sock, msg, args, chatId, senderId, reply) {
  if (chatId.endsWith('@g.us')) return reply('⚠️ Private chats only.');
  const toggle = args[1]?.toLowerCase();
  if (!['on','off'].includes(toggle)) return reply('Usage: *antidelete on/off');
  setSetting(chatId, 'antidelete', toggle === 'on');
  reply(`✅ Anti-delete *${toggle === 'on' ? 'enabled' : 'disabled'}*.`);
};
