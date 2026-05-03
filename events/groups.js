'use strict';

const { getSetting } = require('../utils/settings');

async function handleGroupParticipants(update, sock) {
  const { id: chatId, action, participants } = update;

  if (action === 'add' && getSetting(chatId, 'welcome')) {
    for (const jid of participants) {
      try {
        await sock.sendMessage(chatId, {
          text: `👋 Welcome @${jid.split('@')[0]}! Glad to have you here.`,
          mentions: [jid],
        });
      } catch {}
    }
  }

  if (action === 'remove' && getSetting(chatId, 'goodbye')) {
    for (const jid of participants) {
      try {
        await sock.sendMessage(chatId, {
          text: `👋 Goodbye @${jid.split('@')[0]}! Safe travels.`,
          mentions: [jid],
        });
      } catch {}
    }
  }
}

module.exports = { handleGroupParticipants };
