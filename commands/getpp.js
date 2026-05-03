'use strict';
const { getTarget } = require('../utils/helpers');

module.exports = async function getpp(sock, msg, args, chatId, senderId, reply) {
  const target = getTarget(msg) || senderId;
  try {
    const url = await sock.profilePictureUrl(target, 'image');
    await sock.sendMessage(chatId, {
      image: { url },
      caption: `📸 Profile picture of @${target.split('@')[0]}`,
      mentions: [target],
    }, { quoted: msg });
  } catch { reply('❌ No profile picture found or it is private.'); }
};
