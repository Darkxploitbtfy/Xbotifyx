'use strict';
const { setSetting } = require('../utils/settings');

module.exports = async function welcome(sock, msg, args, chatId, senderId, reply) {
  if (!chatId.endsWith('@g.us')) return reply('⚠️ Groups only.');
  const toggle = args[1]?.toLowerCase();
  if (!['on','off'].includes(toggle)) return reply('Usage: *welcome on/off');
  setSetting(chatId, 'welcome', toggle === 'on');
  reply(`✅ Welcome messages *${toggle === 'on' ? 'enabled' : 'disabled'}*.`);
};
