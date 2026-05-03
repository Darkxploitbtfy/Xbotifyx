'use strict';

const MENU = `╔══════════════════════╗
  ⚡ *BOTIFY X v1.0.3*
╚══════════════════════╝

*📋 GROUP COMMANDS*
┌──────────────────────
│ *antilink on/off
│   Auto-delete links + warn (5 = kick)
│ *warn — Warn user (reply/tag)
│ *promote — Make user admin
│ *demote — Remove admin
│ *kick — Remove from group
│ *resetlink — Reset invite link
│ *tagall — Mention everyone
│ *hidetag [msg] — Silent mention
│ *welcome on/off — Welcome message
│ *goodbye on/off — Farewell message
└──────────────────────

*🔧 UTILITY*
┌──────────────────────
│ *vv — Unlock view-once (reply)
│ *getpp — Get profile picture
└──────────────────────

*👑 OWNER ONLY*
┌──────────────────────
│ *ping — Bot latency
│ *mode public/private
└──────────────────────

*⚙️ OTHER*
┌──────────────────────
│ *sticker — Image → sticker
│ *anticall on/off — Reject calls
│ *antidelete on/off — Recover deleted
│ *antiedit on/off — Catch edits
└──────────────────────

_All commands start with * (asterisk)_
_Reply or tag for user-targeted commands_`;

module.exports = async function menu(sock, msg, args, chatId, senderId, reply) {
  reply(MENU);
};
