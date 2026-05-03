'use strict';

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs   = require('fs');

const { handleConnectionUpdate }                    = require('./events/connection');
const { handleMessages, handleMessagesUpdate,
        handleStatusUpdate }                        = require('./events/messages');
const { handleGroupParticipants }                   = require('./events/groups');
const { handleCall }                                = require('./commands/index');

const AUTH_DIR = path.join(__dirname, 'auth');

const botState = {
  connected:   false,
  socket:      null,
  pairingCode: null,
  adminJid:    null,
  phoneNumber: null,
};

function getBotState() { return botState; }

async function startBot() {
  if (!fs.existsSync(AUTH_DIR)) fs.mkdirSync(AUTH_DIR, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version }          = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger:                    pino({ level: 'silent' }),
    auth:                      state,
    browser:                   ['Safari', 'MacOS', '10.15.7'],
    printQRInTerminal:         false,
    generateHighQualityLinkPreview: false,
    syncFullHistory:           false,
  });

  botState.socket    = sock;
  botState.connected = false;

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', u =>
    handleConnectionUpdate(u, sock, botState, startBot).catch(e => console.error('[CONN]', e.message))
  );

  sock.ev.on('messages.upsert', u =>
    handleMessages(u, sock, botState).catch(e => console.error('[MSG]', e.message))
  );

  sock.ev.on('messages.update', u =>
    handleMessagesUpdate(u, sock).catch(() => {})
  );

  sock.ev.on('group-participants.update', u =>
    handleGroupParticipants(u, sock).catch(() => {})
  );

  sock.ev.on('call', calls =>
    handleCall(sock, calls).catch(() => {})
  );

  return sock;
}

module.exports = { getBotState, startBot };
