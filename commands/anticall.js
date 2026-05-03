'use strict';
const { getSetting, setSetting } = require('../utils/settings');

module.exports = async function anticall(sock, msg, args, chatId, senderId, reply) {
  const toggle = args[1]?.toLowerCase();
  if (!['on','off'].includes(toggle)) return reply('Usage: *anticall on/off');
  setSetting(chatId, 'anticall', toggle === 'on');
  reply(`✅ Anti-call *${toggle === 'on' ? 'enabled' : 'disabled'}*.`);
};

module.exports.handleCall = async function handleCall(sock, calls) {
  for (const call of calls) {
    const jid = call.from || call.chatId;
    if (getSetting(jid, 'anticall')) {
      try {
        await sock.rejectCall(call.id, call.from);
        await sock.sendMessage(jid, { text: "I can't receive calls at the moment." });
      } catch {}
    }
  }
};
