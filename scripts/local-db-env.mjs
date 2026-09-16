import { execFileSync } from 'node:child_process';
import { writeFileSync, existsSync } from 'node:fs';
// Explicitly local: no remote credentials are accepted by this script.
if (existsSync('.env.local')) throw new Error('.env.local already exists. Update it manually to preserve your settings.');
const status = JSON.parse(execFileSync('npx', ['--no-install', 'supabase', 'status', '--output', 'json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }));
const url = status.API_URL;
if (!url || !['localhost','127.0.0.1'].includes(new URL(url).hostname) || !status.ANON_KEY) throw new Error('Start the local Supabase stack with npm run db:start first.');
writeFileSync('.env.local', `VITE_SUPABASE_URL=${url}\nVITE_SUPABASE_PUBLISHABLE_KEY=${status.ANON_KEY}\n`, { mode: 0o600, flag: 'wx' });
console.log('Created .env.local with local public client settings.');
