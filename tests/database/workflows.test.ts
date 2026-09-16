import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import type { PGlite } from '@electric-sql/pglite';
import { createDatabase, asUser } from './harness';
import { defaultSettings } from '../../src/lib/settings';

const admin='10000000-0000-0000-0000-000000000001';
const sponsor='10000000-0000-0000-0000-000000000002';
const alice='10000000-0000-0000-0000-000000000003';
const bob='10000000-0000-0000-0000-000000000004';
const newcomer='10000000-0000-0000-0000-000000000005';
let db: PGlite;
async function dashboard(id: string) {
  return asUser(db,id,async () => (await db.query<{data: Record<string, unknown>}>('SELECT public.get_ambassador_dashboard() AS data')).rows[0].data);
}

describe('real migrations and authorization', () => {
  beforeAll(async () => {
    db=await createDatabase();
    await db.query('INSERT INTO auth.users(id,email) SELECT unnest($1::uuid[]),unnest($2::text[])',[[admin,sponsor,alice,bob,newcomer],['admin@test.invalid','sponsor@test.invalid','alice@test.invalid','bob@test.invalid','new@test.invalid']]);
    await db.query("INSERT INTO public.user_roles(user_id,role) VALUES($1,'admin')",[admin]);
    await db.exec("INSERT INTO public.country_limits(country_code,country_name,ambassador_limit) VALUES('TZ','Tanzania',100),('KE','Kenya',100)");
    await db.query("INSERT INTO public.profiles(id,full_name,ambassador_id,country,region,status,payment_status) VALUES($1,'Sponsor','MAP-T1001DSM','Tanzania','Dar es Salaam','active','completed')",[sponsor]);
    for (const [id,name] of [[alice,'Alice'],[bob,'Bob']]) {
      await asUser(db,id,()=>db.query("SELECT public.register_ambassador($1,'255123456789','Arusha','Tanzania','MAP-T1001DSM')",[name]));
    }
    await db.exec("INSERT INTO public.receipt_codes(code) VALUES('RECEIPT-A'),('RECEIPT-B'),('RECEIPT-C')");
  },60000);
  afterAll(async()=>{await db?.close();});

  it('replays every migration and refuses unverified profile updates/inserts',async()=>{
    await expect(asUser(db,alice,()=>db.query("UPDATE public.profiles SET status='active',payment_status='completed' WHERE id=$1",[alice]))).rejects.toThrow(/authorized workflow/);
    await expect(asUser(db,newcomer,()=>db.query("INSERT INTO public.profiles(id,status,payment_status) VALUES($1,'active','paid')",[newcomer]))).rejects.toThrow(/authorized workflow/);
    await expect(asUser(db,alice,()=>db.query("INSERT INTO public.referrals(referrer_id,referred_id,referral_code,status) VALUES($1,$1,'fake','active')",[alice]))).rejects.toThrow(/permission denied/);
    await expect(asUser(db,alice,()=>db.query("SELECT public.get_admin_report(6)"))).rejects.toThrow(/administrators/);
    await expect(asUser(db,alice,()=>db.query('SELECT * FROM public.get_admin_ambassadors()'))).rejects.toThrow(/administrators/);
    await expect(asUser(db,null,()=>db.query("SELECT public.get_admin_report(6)"))).rejects.toThrow(/permission denied/);
    await expect(asUser(db,admin,()=>db.query("SELECT public.approve_verified_ambassadors($1::uuid[])",[[bob]]))).rejects.toThrow(/verify its receipt/);
  });
  it('claims a normalized receipt, activates the profile and records pending commission once',async()=>{
    await asUser(db,alice,()=>db.query("SELECT public.verify_receipt_code(' receipt-a ',$1)",[alice]));
    await asUser(db,alice,()=>db.query("SELECT public.verify_receipt_code('RECEIPT-A',$1)",[alice]));
    const profile=(await db.query<{status:string;payment_status:string;payment_verified_at:Date}>('SELECT status,payment_status,payment_verified_at FROM public.profiles WHERE id=$1',[alice])).rows[0];
    expect(profile.status).toBe('active');expect(profile.payment_status).toBe('completed');expect(profile.payment_verified_at).toBeTruthy();
    const commissions=await db.query<{amount_usd:string;status:string}>('SELECT amount_usd,status FROM public.earnings WHERE source_transaction_id=$1',[alice]);
    expect(commissions.rows).toHaveLength(1);expect(Number(commissions.rows[0].amount_usd)).toBe(12.25);expect(commissions.rows[0].status).toBe('pending');
    expect((await dashboard(sponsor)).pendingEarnings).toBe(12.25);
  });
  it('rejects stolen, additional and cross-account receipt claims without consuming codes',async()=>{
    await expect(asUser(db,bob,()=>db.query("SELECT public.verify_receipt_code('RECEIPT-A',$1)",[bob]))).rejects.toThrow(/already used/);
    await expect(asUser(db,alice,()=>db.query("SELECT public.verify_receipt_code('RECEIPT-B',$1)",[alice]))).rejects.toThrow(/already has/);
    await expect(asUser(db,bob,()=>db.query("SELECT public.verify_receipt_code('RECEIPT-B',$1)",[alice]))).rejects.toThrow(/Not authorised/);
    expect((await db.query<{status:string}>("SELECT status FROM public.receipt_codes WHERE code='RECEIPT-B'")).rows[0].status).toBe('available');
  });
  it('validates and persists settings; new commissions use new rates while old ones retain theirs',async()=>{
    const settings=structuredClone(defaultSettings);settings.commission_rates.activation_pack=.4;settings.activation_pack.price_usd=50;
    await expect(asUser(db,bob,()=>db.query('SELECT public.save_platform_settings($1::jsonb)',[JSON.stringify(settings)]))).rejects.toThrow(/administrators/);
    const invalid=structuredClone(settings);invalid.premium_commission_rates.activation_pack=.9;
    await expect(asUser(db,admin,()=>db.query('SELECT public.save_platform_settings($1::jsonb)',[JSON.stringify(invalid)]))).rejects.toThrow(/exceed 100/);
    await asUser(db,admin,()=>db.query('SELECT public.save_platform_settings($1::jsonb)',[JSON.stringify(settings)]));
    await asUser(db,bob,()=>db.query("SELECT public.verify_receipt_code('RECEIPT-B',$1)",[bob]));
    // The receipt was issued for $35 before the pack price changed.
    const earnings=await db.query<{amount_usd:string;commission_rate:string}>('SELECT amount_usd,commission_rate FROM public.earnings WHERE source_transaction_id=$1',[bob]);
    expect(Number(earnings.rows[0].amount_usd)).toBe(14);expect(Number(earnings.rows[0].commission_rate)).toBe(.4);
    expect((await dashboard(sponsor)).totalEarnings).toBe(26.25);
    await expect(asUser(db,admin,()=>db.exec("UPDATE public.system_settings SET value='{}' WHERE key='commission_rates'"))).rejects.toThrow(/permission denied/);
  });
  it('separates approval from payment, requires a reference and rejects repeat payment',async()=>{
    const id=(await db.query<{id:string}>('SELECT id FROM public.earnings WHERE source_transaction_id=$1',[alice])).rows[0].id;
    const transition=(status:string,ref:string|null)=>asUser(db,admin,()=>db.query('SELECT public.transition_earnings($1::uuid[],$2,$3)',[[id],status,ref]));
    await expect(transition('paid','PAY-01')).rejects.toThrow(/required status/);
    await expect(asUser(db,alice,()=>db.query('SELECT public.transition_earnings($1::uuid[],\'approved\',null)',[[id]]))).rejects.toThrow(/administrators/);
    await transition('approved',null);expect((await dashboard(sponsor)).approvedEarnings).toBe(12.25);expect((await dashboard(sponsor)).paidEarnings).toBe(0);
    await expect(transition('paid',' ')).rejects.toThrow(/reference/);
    await transition('paid','BANK-01');expect((await dashboard(sponsor)).paidEarnings).toBe(12.25);
    await expect(transition('paid','BANK-01')).rejects.toThrow(/required status/);
    await expect(transition('pending',null)).rejects.toThrow(/approved or paid/);
    await expect(asUser(db,admin,()=>db.query("UPDATE public.earnings SET status='paid' WHERE id=$1",[id]))).rejects.toThrow(/permission denied/);
    expect((await db.query<{n:number}>("SELECT count(*)::int n FROM public.admin_audit_log WHERE action='commission_paid'")).rows[0].n).toBe(1);
  });
  it('derives Premium and source-based reports without treating commissions as revenue',async()=>{
    expect((await dashboard(sponsor)).currentCommissionTier).toBe('Standard');
    await asUser(db,admin,()=>db.exec("UPDATE public.country_limits SET premium_unlocked=true WHERE country_code='TZ'"));
    expect((await dashboard(sponsor)).currentCommissionTier).toBe('Premium');
    expect((await dashboard(sponsor)).commissionRates).toEqual(defaultSettings.premium_commission_rates);
    await asUser(db,admin,()=>db.query('INSERT INTO public.sales(seller_id,unit_price_usd,unit_price_local,total_amount_usd,total_amount_local) VALUES($1,100,250000,100,250000)',[sponsor]));
    const earnings=(await db.query<{amount_usd:string}>("SELECT amount_usd FROM public.earnings WHERE earning_type='direct_sales'")).rows[0];
    expect(Number(earnings.amount_usd)).toBe(35);
    const report=await asUser(db,admin,async()=> (await db.query<{data:{metrics:Record<string,number>;monthly:unknown[]}}>('SELECT public.get_admin_report(6) data')).rows[0].data);
    expect(report.metrics.totalRevenueUsd).toBe(170);expect(report.metrics.activationRevenueUsd).toBe(70);expect(report.metrics.paidThisMonthUsd).toBe(12.25);expect(report.monthly).toHaveLength(6);
  });
  it('isolates member reports and private files, even with another permissive storage policy',async()=>{
    expect((await dashboard(alice)).totalEarnings).toBe(0);
    expect((await dashboard(sponsor)).countriesReached).toBe(1);
    const members=await asUser(db,admin,()=>db.query<{id:string;total_earnings:string;tier:string;receipt_verified:boolean}>('SELECT * FROM public.get_admin_ambassadors()'));
    expect(Number(members.rows.find(p=>p.id===sponsor)?.total_earnings)).toBe(61.25);
    expect(members.rows.find(p=>p.id===sponsor)?.tier).toBe('Premium');
    expect(members.rows.find(p=>p.id===alice)?.receipt_verified).toBe(true);
    const recent=await asUser(db,sponsor,()=>db.query<{name:string}>('SELECT * FROM public.get_recent_referrals()'));
    expect(recent.rows.map(r=>r.name).sort()).toEqual(['Alice','Bob']);
    await db.query("INSERT INTO storage.objects(bucket_id,name,owner_id) VALUES('mizaniclinic','alice/report',$1)",[alice]);
    await db.exec('CREATE POLICY "Legacy broad read" ON storage.objects FOR SELECT USING(true)');
    for (const id of [null,bob]) {
      expect((await asUser(db,id,()=>db.query('SELECT * FROM storage.objects'))).rows).toHaveLength(0);
    }
    expect((await asUser(db,alice,()=>db.query('SELECT * FROM storage.objects'))).rows).toHaveLength(1);
    expect((await asUser(db,admin,()=>db.query('SELECT * FROM storage.objects'))).rows).toHaveLength(1);
    await expect(asUser(db,bob,()=>db.query("INSERT INTO storage.objects(bucket_id,name,owner_id) VALUES('mizaniclinic','stolen',$1)",[alice]))).rejects.toThrow(/row-level security/);
    expect((await db.query<{n:number}>('SELECT count(*)::int n FROM storage.buckets WHERE public')).rows[0].n).toBe(0);
  });
});
