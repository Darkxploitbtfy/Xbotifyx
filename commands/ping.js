'use strict';

module.exports = async function ping(sock, msg, args, chatId, senderId, reply, isAdmin) {
  if (!isAdmin) return reply('❌ Owner only command.');
  const start = Date.now();
  await sock.sendMessage(chatId, { react: { text: '⏱️', key: msg.key } });
  const ms = Date.now() - start;
  reply(`🏓 *Pong!*\n⚡ Latency: *${ms}ms*`);
};
