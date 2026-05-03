'use strict';

const { startBot }       = require('./bot');
const { startDashboard } = require('./dashboard/app');

async function main() {
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('   BOTIFY X v1.0.3');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  await startDashboard();
  await startBot();
  console.log('[INIT] ✅ All systems online.');
}

main().catch(err => {
  console.error('[FATAL]', err.message);
  process.exit(1);
});
