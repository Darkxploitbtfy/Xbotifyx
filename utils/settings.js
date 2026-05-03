'use strict';

const fs   = require('fs');
const path = require('path');
const SF   = path.join(__dirname, '../data/settings.json');
const MF   = path.join(__dirname, '../data/mode.json');

function readS() { try { return JSON.parse(fs.readFileSync(SF,'utf8')); } catch { return {}; } }
function writeS(d){ fs.writeFileSync(SF, JSON.stringify(d, null, 2)); }

function getSetting(chatId, key)       { return readS()[chatId]?.[key] ?? false; }
function setSetting(chatId, key, val)  { const d=readS(); if(!d[chatId]) d[chatId]={}; d[chatId][key]=val; writeS(d); }

function getMode()    { try { return JSON.parse(fs.readFileSync(MF,'utf8')).mode||'private'; } catch { return 'private'; } }
function setMode(m)   { fs.writeFileSync(MF, JSON.stringify({ mode: m })); }

module.exports = { getSetting, setSetting, getMode, setMode };
