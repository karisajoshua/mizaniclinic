import { execFileSync } from 'node:child_process';
import { writeFileSync, renameSync } from 'node:fs';
const result = execFileSync('npx', ['--no-install','supabase','gen','types','typescript','--local','--schema','public'], { encoding: 'utf8', stdio: ['ignore','pipe','inherit'] });
if (!result.includes('export type Database')) throw new Error('Type generation did not return a Database type.');
const file='src/integrations/supabase/types.ts';
writeFileSync(`${file}.tmp`, result);
renameSync(`${file}.tmp`,file);
console.log('Updated database types from local migrations.');
