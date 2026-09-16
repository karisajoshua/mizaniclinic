import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminMetrics } from '@/hooks/useAdminData';
import { useAdminNavigation } from '../AdminNavigation';
import { money } from '@/lib/reporting';

export default function RevenueBreakdown() {
  const { data, isLoading, isError } = useAdminMetrics();
  const navigate = useAdminNavigation();
  return <div className="grid lg:grid-cols-3 gap-6">
    <Card className="bg-slate-800 border-slate-700 text-white"><CardHeader><CardTitle>Recorded Revenue</CardTitle><CardDescription>All time, USD</CardDescription></CardHeader><CardContent className="space-y-4">
      {isError ? <p role="alert">Revenue could not be loaded.</p> : isLoading ? <p>Loading…</p> : <>
        {([
          ['Activation receipts', data?.activationRevenueUsd ?? 0],
          ['Product sales', data?.salesRevenueUsd ?? 0],
          ['Paid consultations', data?.appointmentRevenueUsd ?? 0],
        ] as const).map(([label, value]) => <div key={label} className="flex justify-between gap-3"><span>{label}</span><strong>{money(value)}</strong></div>)}
        {!!data?.activationRevenueEstimated && <p className="text-sm text-amber-200">{data.activationRevenueEstimated} historical receipts have no recorded amount and are excluded. Their revenue needs reconciliation.</p>}
      </>}
    </CardContent></Card>
    <Card className="lg:col-span-2 bg-slate-800 border-slate-700 text-white"><CardHeader><CardTitle>Financial Controls</CardTitle></CardHeader><CardContent className="grid sm:grid-cols-2 gap-4">
      <Button onClick={() => document.getElementById('payout-queue')?.scrollIntoView({ behavior: 'smooth' })}>Review payout queue</Button>
      <Button onClick={() => navigate('settings')}>Payment instructions</Button>
      <Button onClick={() => navigate('settings')}>Commission settings</Button>
      <Button onClick={() => navigate('analytics')}>Financial reports</Button>
    </CardContent></Card>
  </div>;
}
