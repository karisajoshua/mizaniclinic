import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ReferralManagement() {
  return <Card><CardHeader><CardTitle>Invite an ambassador</CardTitle></CardHeader><CardContent className="space-y-4">
    <p>Share your ambassador code. Your referral uses it during registration, then enters the receipt issued by the clinic after payment. Their verified activation records your commission.</p>
    <Button asChild><Link to="/register">Open registration</Link></Button>
  </CardContent></Card>;
}
