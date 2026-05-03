'use strict';
const { addWarning, resetWarning } = require('../utils/warnings');

module.exports = async function antilink(sock, msg, args, chatId, senderId, reply) {
  if (!chatId.endsWith('@g.us')) return reply('⚠️ Groups only.');
  const { getSetting, setSetting } = require('../utils/settings');
  const toggle = args[1]?.toLowerCase();
  if (!['on','off'].includes(toggle)) return reply('Usage: *antilink on/off');
  setSetting(chatId, 'antilink', toggle === 'on');
  reply(`✅ Anti-link *${toggle === 'on' ? 'enabled' : 'disabled'}*.`);
};

module.exports.check = async function checkAntilink(sock, msg, chatId, senderId) {
  const { getSetting } = require('../utils/settings');
  if (!getSetting(chatId, 'antilink')) return false;
  const body =
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    msg.message?.videoMessage?.caption || '';
  const linkRe = /(https?:\/\/|wa\.me\/|chat\.whatsapp\.com\/)[^\s]*/i;
  if (!linkRe.test(body)) return false;
  try { await sock.sendMessage(chatId, { delete: msg.key }); } catch {}
  const count = addWarning(chatId, senderId);
  if (count >= 5) {
    try {
      await sock.groupParticipantsUpdate(chatId, [senderId], 'remove');
      await sock.sendMessage(chatId, {
        text: `🚫 @${senderId.split('@')[0]} removed after 5 link violations.`,
        mentions: [senderId],
      });
      resetWarning(chatId, senderId);
    } catch {}
  } else {
    await sock.sendMessage(chatId, {
      text: `⚠️ @${senderId.split('@')[0]}, links not allowed. Warning ${count}/5.`,
      mentions: [senderId],
    });
  }
  return true;
};
