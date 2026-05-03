'use strict';

const fs   = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../data/warnings.json');

function read()   { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return {}; } }
function write(d) { fs.writeFileSync(FILE, JSON.stringify(d, null, 2)); }

function getWarnings(chatId, userId)  { return read()[chatId]?.[userId] ?? 0; }
function addWarning(chatId, userId)   { const d=read(); if(!d[chatId]) d[chatId]={}; d[chatId][userId]=(d[chatId][userId]??0)+1; write(d); return d[chatId][userId]; }
function resetWarning(chatId, userId) { const d=read(); if(d[chatId]) { delete d[chatId][userId]; write(d); } }

module.exports = { getWarnings, addWarning, resetWarning };
