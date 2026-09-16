import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAdminReport } from '@/hooks/useAdminReport';
import { downloadCsv } from '@/hooks/useAdminData';
import { money } from '@/lib/reporting';

export default function AdminAnalytics() {
  const [months, setMonths] = useState('6');
  const { data, isLoading, error, refetch } = useAdminReport(Number(months));
  if (isLoading) return <p className="text-slate-300">Loading analytics…</p>;
  if (error || !data) return <div role="alert" className="text-red-300">Could not load analytics. <Button onClick={() => refetch()}>Retry</Button></div>;
  const conversion = data.metrics.totalUsers ? data.metrics.activeUsers / data.metrics.totalUsers * 100 : 0;
  return <div className="space-y-6">
    <div className="flex flex-wrap justify-between gap-3">
      <Select value={months} onValueChange={setMonths}><SelectTrigger className="w-44" aria-label="Reporting period"><SelectValue /></SelectTrigger>
        <SelectContent>{[3, 6, 12].map(n => <SelectItem key={n} value={String(n)}>Last {n} months</SelectItem>)}</SelectContent>
      </Select>
      <Button onClick={() => downloadCsv('monthly-analytics.csv', data.monthly)}>Export monthly report</Button>
    </div>
    <p className="text-sm text-slate-300">Account totals and country distribution are all time. Monthly charts and earnings use the selected period.</p>
    <div className="grid sm:grid-cols-3 gap-4">
      {[
        ['Registered ambassadors', data.metrics.totalUsers.toLocaleString()],
        ['Active ambassadors', data.metrics.activeUsers.toLocaleString()],
        ['Registration to active', `${conversion.toFixed(1)}%`],
      ].map(([title, value]) => <Card key={title}><CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{value}</CardContent></Card>)}
    </div>
    <Card><CardHeader><CardTitle>Registrations by month</CardTitle><CardDescription>Actual records; dates use East Africa Time.</CardDescription></CardHeader>
      <CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={data.monthly}>
        <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis allowDecimals={false} /><Tooltip />
        <Line type="monotone" dataKey="ambassadors" name="Registrations" stroke="#2563eb" />
      </LineChart></ResponsiveContainer></CardContent></Card>
    <div className="grid lg:grid-cols-2 gap-6">
      <Card><CardHeader><CardTitle>Ambassadors by country</CardTitle></CardHeader><CardContent>
        {data.countries.length ? data.countries.map(c => <div key={c.name} className="flex justify-between py-2"><span>{c.name}</span><strong>{c.value}</strong></div>) : <p>No registrations yet.</p>}
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Commission earnings</CardTitle><CardDescription>Selected period; excludes cancelled commissions.</CardDescription></CardHeader><CardContent>
        {data.earningsBreakdown.length ? data.earningsBreakdown.map(e => <div key={e.type} className="flex justify-between py-2"><span>{e.type.replace(/_/g, ' ')}</span><strong>{money(e.amount)}</strong></div>) : <p>No commissions in this period.</p>}
      </CardContent></Card>
    </div>
    <Card><CardHeader><CardTitle>Top ambassadors</CardTitle><CardDescription>Ranked by earned commissions during the selected period.</CardDescription></CardHeader><CardContent className="overflow-x-auto">
      <table className="w-full text-left"><thead><tr><th>Name</th><th>Region</th><th>Active referrals</th><th>Earned</th></tr></thead><tbody>
        {data.topPerformers.map((p, i) => <tr key={i} className="border-t"><td className="py-3">{p.name}</td><td>{p.region}</td><td>{p.referrals}</td><td>{money(p.earnings)}</td></tr>)}
      </tbody></table>{!data.topPerformers.length && <p className="py-4">No activity in this period.</p>}
    </CardContent></Card>
  </div>;
}
