'use strict';

const { DisconnectReason } = require('@whiskeysockets/baileys');

const CONNECT_MSG = `━━━━━━━━━━━━━━━
BOTIFY X v1.0.3
━━━━━━━━━━━━━━━

✅ Connected successfully
⚡ System online
🔐 Secure session active`;

async function handleConnectionUpdate(update, sock, botState, startBot) {
  const { connection, lastDisconnect } = update;

  if (connection === 'close') {
    botState.connected = false;
    const code = lastDisconnect?.error?.output?.statusCode;
    const reconnect = code !== DisconnectReason.loggedOut;
    console.log(`[BOT] Disconnected (${code}). Reconnecting: ${reconnect}`);
    if (reconnect) setTimeout(() => startBot(), 4000);
    else { console.log('[BOT] Logged out. Re-pair via /panel'); botState.pairingCode = null; }
  } else if (connection === 'open') {
    botState.connected = true;
    console.log('[BOT] ✅ WhatsApp connected!');
    const selfJid = sock.user?.id;
    if (selfJid) {
      botState.adminJid = selfJid.split(':')[0] + '@s.whatsapp.net';
      try { await sock.sendMessage(botState.adminJid, { text: CONNECT_MSG }); } catch {}
    }
  }
}

module.exports = { handleConnectionUpdate };
