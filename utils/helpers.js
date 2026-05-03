'use strict';

function getTarget(msg) {
  const ctx = msg.message?.extendedTextMessage?.contextInfo;
  if (ctx?.mentionedJid?.length) return ctx.mentionedJid[0];
  if (ctx?.participant) return ctx.participant;
  return null;
}

function isOnlyEmoji(text) {
  if (!text || !text.trim()) return false;
  const cleaned = text.replace(
    /[\u{1F000}-\\u{1FFFF}\u{2600}-\\u{27BF}\\u{2300}-\\u{23FF}\\u{2B50}\u{2B55}\\u{FE00}-\u{FE0F}\‍\uFE0F\s]+/gu, ''
  );
  return cleaned.length === 0;
}

function isViewOnce(message) {
  return !!(message?.viewOnceMessage || message?.viewOnceMessageV2 || message?.viewOnceMessageV2Extension);
}

function normalizeJid(jid) {
  return jid?.split(':')[0] + '@s.whatsapp.net';
}

module.exports = { getTarget, isOnlyEmoji, isViewOnce, normalizeJid };
