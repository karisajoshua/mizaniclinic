import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePlatformSettings, useSavePlatformSettings } from '@/hooks/usePlatformSettings';
import { defaultSettings, type PlatformSettings } from '@/lib/settings';

export default function AdminSystemConfiguration() {
  const query = usePlatformSettings();
  const save = useSavePlatformSettings();
  const [form, setForm] = useState<PlatformSettings | null>(null);
  useEffect(() => { if (query.data) setForm(structuredClone(query.data)); }, [query.data]);
  if (query.isError) return <div role="alert" className="text-red-300">Settings could not be loaded. <Button onClick={() => query.refetch()}>Retry</Button></div>;
  if (!form) return <p className="text-slate-300">Loading settings…</p>;

  return <form className="space-y-6" onSubmit={event => { event.preventDefault(); save.mutate(form); }}>
    <Card><CardHeader><CardTitle>Commission rates</CardTitle><CardDescription>Saved rates apply to new transactions. Existing earnings retain their original rates.</CardDescription></CardHeader><CardContent className="space-y-6">
      {(['commission_rates', 'premium_commission_rates'] as const).map(key => <fieldset key={key} className="border rounded-lg p-4">
        <legend className="font-bold px-2">{key === 'commission_rates' ? 'Standard' : 'Premium'}</legend>
        <div className="grid sm:grid-cols-3 gap-4">{([
          ['activation_pack', 'Activation pack (%)'], ['direct_sales', 'Direct sales (%)'], ['second_level', 'First generation (%)'],
        ] as const).map(([field, label]) => <div key={field}>
          <Label htmlFor={`${key}-${field}`}>{label}</Label>
          <Input id={`${key}-${field}`} type="number" min="0" max="100" step="0.01" required
            value={Number((form[key][field] * 100).toFixed(2))}
            onChange={e => setForm({ ...form, [key]: { ...form[key], [field]: Number(e.target.value) / 100 } })} />
        </div>)}</div>
      </fieldset>)}
    </CardContent></Card>
    <Card><CardHeader><CardTitle>Activation pack pricing</CardTitle><CardDescription>Receipt redemption records the price in effect at activation. Previously issued receipts can carry their original amount.</CardDescription></CardHeader><CardContent className="grid sm:grid-cols-2 gap-4">
      {([['price_usd', 'Price (USD)'], ['price_local', 'Price (TZS)']] as const).map(([key, label]) => <div key={key}>
        <Label htmlFor={key}>{label}</Label><Input id={key} type="number" min="0.01" step="0.01" required value={form.activation_pack[key]}
          onChange={e => setForm({ ...form, activation_pack: { ...form.activation_pack, [key]: Number(e.target.value) } })} />
      </div>)}
    </CardContent></Card>
    <Card><CardHeader><CardTitle>Receipt payment instructions</CardTitle><CardDescription>Shown on the account activation page.</CardDescription></CardHeader><CardContent className="space-y-4">
      <Label htmlFor="payment-instructions">Instructions</Label><Textarea id="payment-instructions" required maxLength={2000} value={form.payment_instructions.instructions}
        onChange={e => setForm({ ...form, payment_instructions: { ...form.payment_instructions, instructions: e.target.value } })} />
      <Label htmlFor="support-phone">Support phone</Label><Input id="support-phone" maxLength={40} value={form.payment_instructions.support_phone}
        onChange={e => setForm({ ...form, payment_instructions: { ...form.payment_instructions, support_phone: e.target.value } })} />
    </CardContent></Card>
    <Card><CardHeader><CardTitle>In-app admin alerts</CardTitle></CardHeader><CardContent className="grid sm:grid-cols-2 gap-3">
      {([['registrations', 'Pending registrations'], ['payouts', 'Pending commissions'], ['country_limits', 'Country capacity'], ['milestones', 'Completed payouts']] as const).map(([key, label]) =>
        <label key={key} className="flex gap-2 items-center"><input type="checkbox" checked={form.admin_alerts[key]}
          onChange={e => setForm({ ...form, admin_alerts: { ...form.admin_alerts, [key]: e.target.checked } })} />{label}</label>)}
    </CardContent></Card>
    {save.isError && <p role="alert" className="text-red-300">{save.error.message}</p>}
    <div className="flex flex-wrap justify-between gap-3">
      <Button type="button" variant="outline" disabled={save.isPending} onClick={() => setForm(structuredClone(defaultSettings))}>Restore defaults in form</Button>
      <Button type="submit" disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save settings and commissions'}</Button>
    </div>
  </form>;
}
