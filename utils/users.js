'use strict';

const fs   = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../data/users.json');

function read()        { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return []; } }
function write(d)      { fs.writeFileSync(FILE, JSON.stringify(d, null, 2)); }

function getAllUsers()  { return read(); }

function isValidUser(jid) {
  const num = jid.split('@')[0].split(':')[0];
  const u = read().find(u => u.number === num);
  return u ? Date.now() < u.expiry : false;
}

function isExpiredUser(jid) {
  const num = jid.split('@')[0].split(':')[0];
  const u = read().find(u => u.number === num);
  return u ? Date.now() >= u.expiry : false;
}

function addUser(number) {
  const clean  = number.replace(/\D/g, '');
  const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
  const users  = read();
  const idx    = users.findIndex(u => u.number === clean);
  if (idx >= 0) users[idx].expiry = expiry;
  else users.push({ number: clean, expiry, addedAt: Date.now() });
  write(users);
  return { number: clean, expiry };
}

function removeUser(number) {
  write(read().filter(u => u.number !== number.replace(/\D/g,'')));
}

module.exports = { getAllUsers, isValidUser, isExpiredUser, addUser, removeUser };
