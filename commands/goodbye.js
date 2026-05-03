'use strict';
const { setSetting } = require('../utils/settings');

module.exports = async function goodbye(sock, msg, args, chatId, senderId, reply) {
  if (!chatId.endsWith('@g.us')) return reply('⚠️ Groups only.');
  const toggle = args[1]?.toLowerCase();
  if (!['on','off'].includes(toggle)) return reply('Usage: *goodbye on/off');
  setSetting(chatId, 'goodbye', toggle === 'on');
  reply(`✅ Goodbye messages *${toggle === 'on' ? 'enabled' : 'disabled'}*.`);
};
