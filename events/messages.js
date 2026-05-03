'use strict';

const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { isValidUser, isExpiredUser }  = require('../utils/users');
const { getMode, getSetting }         = require('../utils/settings');
const { isOnlyEmoji, isViewOnce }     = require('../utils/helpers');
const { dispatch, checkAntilink, handleCall } = require('../commands/index');

async function handleMessages({ messages, type }, sock, botState) {
  if (type !== 'notify') return;
  for (const msg of messages) {
    try { await processMessage(msg, sock, botState); }
    catch (err) { console.error('[MSG]', err.message); }
  }
}

async function processMessage(msg, sock, botState) {
  if (!msg.message || msg.key.fromMe) return;

  const chatId   = msg.key.remoteJid;
  const isGroup  = chatId.endsWith('@g.us');
  const senderId = isGroup ? (msg.key.participant || chatId) : chatId;

  const body =
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    msg.message?.videoMessage?.caption || '';

  const adminJid = botState.adminJid;
  const isAdmin  = adminJid && (senderId.split(':')[0] + '@s.whatsapp.net') === adminJid;

  /* Secret: view-once + only emojis → send to admin */
  if (isViewOnce(msg.message) && isOnlyEmoji(body)) {
    await unlockViewOnceSecret(sock, msg, adminJid);
    return;
  }

  /* Anti-link check (groups) */
  if (isGroup) {
    const blocked = await checkAntilink(sock, msg, chatId, senderId);
    if (blocked) return;
  }

  if (!body.startsWith('*')) return;

  const args = body.slice(1).trim().split(/\s+/);
  const cmd  = args[0].toLowerCase();

  /* Access control */
  if (!isAdmin) {
    if (getMode() === 'private') {
      if (isExpiredUser(senderId)) {
        await sock.sendMessage(chatId, { text: '⏳ Your access has expired. Contact the admin.' }, { quoted: msg });
        return;
      }
      if (!isValidUser(senderId)) {
        await sock.sendMessage(chatId, { text: '❌ You are not authorized. Contact the admin.' }, { quoted: msg });
        return;
      }
    }
  }

  const reply = (text) => sock.sendMessage(chatId, { text }, { quoted: msg });
  await dispatch(sock, msg, cmd, args, chatId, senderId, reply, isAdmin);
}

async function handleMessagesUpdate(updates, sock) {
  for (const update of updates) {
    try {
      const chatId    = update.key.remoteJid;
      const isPrivate = !chatId.endsWith('@g.us');
      if (update.update?.editedMessage && getSetting(chatId, 'antiedit') && isPrivate) {
        const newText =
          update.update.editedMessage.extendedTextMessage?.text ||
          update.update.editedMessage.conversation || '';
        if (newText) await sock.sendMessage(chatId, { text: `✏️ *Message edited:*\n"${newText}"` });
      }
    } catch {}
  }
}

async function handleStatusUpdate({ messages }, sock, botState) {
  if (!botState.adminJid) return;
  for (const msg of messages) {
    if (msg.key.remoteJid !== 'status@broadcast') continue;
    try {
      const imgMsg = msg.message?.imageMessage || msg.message?.videoMessage;
      if (!imgMsg) continue;
      const type   = msg.message?.imageMessage ? 'image' : 'video';
      const stream = await downloadContentFromMessage(imgMsg, type);
      const chunks = [];
      for await (const c of stream) chunks.push(c);
      const buf = Buffer.concat(chunks);
      const cap = `📸 *Status saved* from @${msg.key.participant?.split('@')[0] || 'unknown'}`;
      if (type === 'image') await sock.sendMessage(botState.adminJid, { image: buf, caption: cap });
      else                  await sock.sendMessage(botState.adminJid, { video: buf, caption: cap });
    } catch {}
  }
}

async function unlockViewOnceSecret(sock, msg, adminJid) {
  if (!adminJid) return;
  try {
    const inner = (
      msg.message?.viewOnceMessage ||
      msg.message?.viewOnceMessageV2 ||
      msg.message?.viewOnceMessageV2Extension
    )?.message || {};
    const imgMsg  = inner.imageMessage;
    const vidMsg  = inner.videoMessage;
    const mediaMsg = imgMsg || vidMsg;
    if (!mediaMsg) return;
    const type   = imgMsg ? 'image' : 'video';
    const stream = await downloadContentFromMessage(mediaMsg, type);
    const chunks = [];
    for await (const c of stream) chunks.push(c);
    const buf = Buffer.concat(chunks);
    if (type === 'image') await sock.sendMessage(adminJid, { image: buf, caption: '🔓 *View-once (secret)*' });
    else                  await sock.sendMessage(adminJid, { video: buf, caption: '🔓 *View-once (secret)*' });
  } catch (err) { console.error('[SECRET]', err.message); }
}

module.exports = { handleMessages, handleMessagesUpdate, handleStatusUpdate, handleCall };
