'use strict';

const antilink  = require('./antilink');
const anticall  = require('./anticall');
const antidelete = require('./antidelete');
const antiedit  = require('./antiedit');
const demote    = require('./demote');
const getpp     = require('./getpp');
const goodbye   = require('./goodbye');
const hidetag   = require('./hidetag');
const kick      = require('./kick');
const menu      = require('./menu');
const mode      = require('./mode');
const ping      = require('./ping');
const promote   = require('./promote');
const resetlink = require('./resetlink');
const sticker   = require('./sticker');
const tagall    = require('./tagall');
const vv        = require('./vv');
const warn      = require('./warn');
const welcome   = require('./welcome');

const OWNER_CMDS = ['ping', 'mode'];

const CMD_MAP = {
  antilink, anticall, antidelete, antiedit,
  demote, getpp, goodbye, hidetag, kick,
  menu, mode, ping, promote, resetlink,
  sticker, tagall, vv, warn, welcome,
};

async function dispatch(sock, msg, cmd, args, chatId, senderId, reply, isAdmin) {
  const handler = CMD_MAP[cmd];
  if (!handler) return false;
  await handler(sock, msg, args, chatId, senderId, reply, isAdmin);
  return true;
}

module.exports = { dispatch, checkAntilink: antilink.check, handleCall: anticall.handleCall, OWNER_CMDS };
