'use strict';
const { setSetting } = require('../utils/settings');

module.exports = async function antiedit(sock, msg, args, chatId, senderId, reply) {
  if (chatId.endsWith('@g.us')) return reply('⚠️ Private chats only.');
  const toggle = args[1]?.toLowerCase();
  if (!['on','off'].includes(toggle)) return reply('Usage: *antiedit on/off');
  setSetting(chatId, 'antiedit', toggle === 'on');
  reply(`✅ Anti-edit *${toggle === 'on' ? 'enabled' : 'disabled'}*.`);
};
