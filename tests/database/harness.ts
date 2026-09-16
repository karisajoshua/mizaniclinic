import { PGlite } from '@electric-sql/pglite';
import { readdir, readFile } from 'node:fs/promises';

// Only the platform-owned auth/storage surfaces are stubbed. Every application
// table, policy, trigger and RPC comes from the real checked-in migrations.
export async function createDatabase() {
  const db = new PGlite();
  await db.exec(`
    CREATE ROLE anon NOLOGIN;
    CREATE ROLE authenticated NOLOGIN;
    CREATE ROLE service_role NOLOGIN BYPASSRLS;
    CREATE SCHEMA auth;
    CREATE SCHEMA storage;
    CREATE TABLE auth.users(id uuid PRIMARY KEY, email text, raw_user_meta_data jsonb DEFAULT '{}');
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS
      $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS
      $$ SELECT coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb $$;
    CREATE TABLE storage.buckets(id text PRIMARY KEY, name text NOT NULL, public boolean NOT NULL DEFAULT false);
    CREATE TABLE storage.objects(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), bucket_id text REFERENCES storage.buckets(id), name text, owner uuid, owner_id text);
    ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
    GRANT USAGE ON SCHEMA public,auth,storage TO anon,authenticated,service_role;
    GRANT SELECT,INSERT,UPDATE,DELETE ON storage.objects TO anon,authenticated,service_role;
    GRANT SELECT ON storage.buckets TO anon,authenticated;
  `);
  const dir = new URL('../../supabase/migrations/', import.meta.url);
  for (const name of (await readdir(dir)).filter(n => n.endsWith('.sql')).sort()) {
    try { await db.exec(await readFile(new URL(name, dir), 'utf8')); }
    catch (error) { await db.close(); throw new Error(`Migration failed: ${name}`, { cause: error }); }
  }
  return db;
}

export async function asUser<T>(db: PGlite, id: string | null, run: () => Promise<T>) {
  await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [id ?? '']);
  await db.exec(`SET ROLE ${id ? 'authenticated' : 'anon'}`);
  try { return await run(); }
  finally { await db.exec('RESET ROLE'); await db.query("SELECT set_config('request.jwt.claim.sub','',false)"); }
}
