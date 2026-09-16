import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MobileHeader from '@/components/MobileHeader';
import { useAuth } from '@/hooks/useAuth';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';
import { supabase } from '@/integrations/supabase/client';
import { hasVerifiedPayment } from '@/lib/account';
import { toast } from '@/hooks/use-toast';

export default function Payment() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const settings = usePlatformSettings();
  const [receiptCode, setReceiptCode] = useState('');
  const profile = useQuery({
    queryKey: ['payment-profile', user?.id], enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user!.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  useEffect(() => { if (!loading && !user) navigate('/signin', { replace: true }); }, [loading, user, navigate]);
  useEffect(() => { if (hasVerifiedPayment(profile.data)) navigate('/dashboard', { replace: true }); }, [profile.data, navigate]);
  const verify = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Sign in to verify your receipt.');
      const { error } = await supabase.rpc('verify_receipt_code', { p_receipt_code: receiptCode.trim(), p_uid: user.id });
      if (error) throw error;
      const { data, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profileError) throw profileError;
      if (!hasVerifiedPayment(data)) throw new Error('Your payment has not been confirmed. Please contact support.');
      return data;
    },
    onSuccess: data => {
      queryClient.setQueryData(['payment-profile', user?.id], data);
      ['ambassador-stats', 'country-limits', 'referrals'].forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
      localStorage.removeItem('registrationData');
      localStorage.removeItem('userAccount');
      toast({ title: 'Payment verified', description: 'Your ambassador account is now active.' });
      navigate('/dashboard', { replace: true });
    },
  });
  if (loading || !user || profile.isPending) return <p className="p-8 text-center">Loading account…</p>;
  return <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50"><MobileHeader />
    <main className="max-w-lg mx-auto px-4 py-10"><Card><CardHeader><CardTitle>Verify your receipt</CardTitle><CardDescription>Activate your ambassador account after paying the clinic.</CardDescription></CardHeader><CardContent className="space-y-6">
      {profile.isError ? <div role="alert">Your account could not be loaded. <Button onClick={() => profile.refetch()}>Retry</Button></div> : !profile.data?.ambassador_id ? <p>Complete your <Link className="underline" to="/register">registration</Link> before redeeming a receipt.</p> : <>
        <div><p className="font-semibold">{profile.data.full_name}</p><p>{profile.data.ambassador_id}</p><p>{profile.data.region}, {profile.data.country}</p></div>
        {settings.data && <div className="bg-blue-50 p-4 rounded-lg"><p className="whitespace-pre-wrap">{settings.data.payment_instructions.instructions}</p>
          {settings.data.payment_instructions.support_phone && <p className="mt-2">Support: {settings.data.payment_instructions.support_phone}</p>}</div>}
        {settings.isError && <p>Payment instructions are unavailable. You can still verify a receipt already issued by the clinic.</p>}
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); verify.mutate(); }}>
          <Label htmlFor="receipt-code">Receipt code</Label><Input id="receipt-code" required maxLength={100} autoComplete="off" value={receiptCode} onChange={e => setReceiptCode(e.target.value.toUpperCase())} />
          {verify.isError && <p role="alert" className="text-red-600">{verify.error.message}</p>}
          <Button className="w-full" type="submit" disabled={verify.isPending || !receiptCode.trim()}>{verify.isPending ? 'Verifying…' : 'Verify payment'}</Button>
        </form>
      </>}
    </CardContent></Card></main>
  </div>;
}
