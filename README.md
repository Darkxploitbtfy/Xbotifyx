# ⚡ Botify X v1.0.3

WhatsApp bot with admin web panel. Railway & GitHub ready.

---

## 🚀 Deploy on Railway

1. Upload this folder to a GitHub repo
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select your repo — Railway auto-detects `npm start`
4. Open: `https://your-app.up.railway.app`

---

## 🌐 Web Panel

`/` automatically redirects to `/panel` (login page).

**Login:**
| Field | Value |
|---|---|
| Username | `katson` |
| Password | `#jesusfuckingchrist#` |

---

## 📡 Pairing WhatsApp

1. Login → Pairing page opens automatically
2. Enter phone number with country code (e.g. `2348012345678`)
3. Click **Generate Code**
4. WhatsApp → Settings → Linked Devices → Link a Device → *Link with phone number instead*
5. Enter the 8-digit code

> Client identity: **Safari · macOS 10.15.7**

---

## 👥 Adding Users

Dashboard → **Add User** → Enter phone number → 30 days auto-assigned.

---

## 🤖 Commands (WhatsApp only, prefix `*`)

### Group
| Command | Action |
|---|---|
| `*antilink on/off` | Delete links, warn. 5 = kick |
| `*warn` | Warn user (reply/tag) |
| `*promote` | Make admin |
| `*demote` | Remove admin |
| `*kick` | Remove from group |
| `*resetlink` | Reset invite link |
| `*tagall` | Mention all |
| `*hidetag [msg]` | Silent mention all |
| `*welcome on/off` | Welcome new members |
| `*goodbye on/off` | Farewell message |

### Utility
| Command | Action |
|---|---|
| `*vv` | Unlock view-once (reply to it) |
| `*getpp` | Get profile picture |

### Owner
| Command | Action |
|---|---|
| `*ping` | Bot speed |
| `*mode public/private` | Toggle access |

### Other
| Command | Action |
|---|---|
| `*sticker` | Image → sticker |
| `*anticall on/off` | Reject calls |
| `*antidelete on/off` | Recover deleted (private) |
| `*antiedit on/off` | Show edits (private) |
| `*menu` | All commands |

---

## 📁 Structure

```
botify-x/
├── index.js
├── bot.js
├── package.json
├── commands/        (20 files — one per command)
├── events/          (connection, messages, groups)
├── utils/           (users, settings, warnings)
├── dashboard/
│   ├── app.js
│   └── views/       (login, pairing, dashboard — HTML)
└── data/            (users.json, settings.json, warnings.json)
```
