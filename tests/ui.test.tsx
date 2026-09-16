// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { hasVerifiedPayment } from '../src/lib/account';
import { defaultSettings, settingsSchema } from '../src/lib/settings';
import { toCsv } from '../src/lib/reporting';
import type { AmbassadorStats } from '../src/types/dashboard';
import QuickStats from '../src/components/dashboard/QuickStats';
import CommissionTierStatus from '../src/components/dashboard/CommissionTierStatus';
import Dashboard from '../src/pages/Dashboard';
import PayoutQueueManagement from '../src/components/admin/financial/PayoutQueueManagement';
import AdminSystemConfiguration from '../src/components/admin/AdminSystemConfiguration';

const mocks=vi.hoisted(()=>({ profile:vi.fn(),process:vi.fn(),save:vi.fn() }));
vi.mock('@/hooks/useAuth',()=>({ useAuth:()=>({ user:{id:'member-1'},loading:false }) }));
vi.mock('@/integrations/supabase/client',()=>({ supabase:{from:()=>({select:()=>({eq:()=>({maybeSingle:mocks.profile})})})} }));
vi.mock('@/components/MobileHeader',()=>({default:()=>null}));
vi.mock('@/components/dashboard/RealTimeStats',()=>({default:()=> <p>Verified dashboard contents</p>}));
vi.mock('@/components/dashboard/ReferralCodeSharing',()=>({default:()=>null}));
vi.mock('@/hooks/useAdminData',()=>({
  useAdminPayouts:()=>({data:[
    {id:'pending-id',ambassadorName:'Alice',ambassadorCode:'MAP-A',amount:12.25,currency:'USD',status:'pending',type:'activation_pack',earnedDate:'2026-09-16',paidDate:null},
    {id:'approved-id',ambassadorName:'Bob',ambassadorCode:'MAP-B',amount:14,currency:'USD',status:'approved',type:'activation_pack',earnedDate:'2026-09-16',paidDate:null},
  ],isLoading:false,error:null}),
  useProcessPayouts:()=>({mutate:mocks.process,isPending:false}),downloadCsv:vi.fn(),
}));
vi.mock('@/hooks/usePlatformSettings',()=>({
  usePlatformSettings:()=>({data:defaultSettings}),
  useSavePlatformSettings:()=>({mutate:mocks.save,isPending:false}),
}));
const paidProfile={status:'active',payment_status:'completed',payment_verified_at:'2026-09-16T08:00:00Z',receipt_code:'RCPT-01',full_name:'Alice',ambassador_id:'MAP-A'};
const stats:AmbassadorStats={
  totalEarnings:75,pendingEarnings:25,approvedEarnings:40,paidEarnings:10,todayEarnings:12.25,
  referralsThisWeek:2,countriesReached:1,availableCountries:8,motorbikeTarget:400,carTarget:2400,
  motorbikeAchieved:false,carAchieved:false,commissionRates:defaultSettings.commission_rates,premiumRates:defaultSettings.premium_commission_rates,
  activationPackEarnings:25,directReferralEarnings:40,secondLevelEarnings:10,teamProgressLevel1:100,teamProgressLevel2:600,
  totalReferrals:3,activeReferrals:2,pendingReferrals:1,referralsByCountry:{Tanzania:2},ambassadorLimit:100,countryName:'Tanzania',countryActiveCount:20,
  currentCommissionTier:'Standard',nextPayoutDate:null,
};
let client:QueryClient;
beforeEach(()=>{vi.clearAllMocks();localStorage.clear();client=new QueryClient({defaultOptions:{queries:{retry:false},mutations:{retry:false}}});});
afterEach(()=>{cleanup();client.clear();});
function showDashboard(){return render(<QueryClientProvider client={client}><MemoryRouter><Dashboard/></MemoryRouter></QueryClientProvider>);}

describe('verified account access',()=>{
  it('requires both receipt verification and an active account',()=>{
    expect(hasVerifiedPayment(paidProfile)).toBe(true);
    for(const profile of [null,{...paidProfile,status:'pending'},{...paidProfile,payment_status:'pending'},{...paidProfile,payment_verified_at:null},{...paidProfile,receipt_code:''}]) expect(hasVerifiedPayment(profile)).toBe(false);
  });
  it('does not grant access on an unavailable profile, even with a forged local paid flag',async()=>{
    localStorage.setItem('userAccount',JSON.stringify({paymentConfirmed:true}));
    mocks.profile.mockResolvedValue({data:null,error:new Error('offline')});showDashboard();
    await screen.findByText('We could not verify your account');expect(screen.queryByText('Verified dashboard contents')).toBeNull();
    fireEvent.click(screen.getByRole('button',{name:'Retry verification'}));expect(mocks.profile).toHaveBeenCalledTimes(2);
  });
  it('offers receipt verification for a missing profile',async()=>{
    mocks.profile.mockResolvedValue({data:null,error:null});showDashboard();
    await screen.findByRole('link',{name:'Verify receipt code'});expect(screen.queryByText('Verified dashboard contents')).toBeNull();
  });
  it('opens the dashboard with a database-verified receipt',async()=>{
    mocks.profile.mockResolvedValue({data:paidProfile,error:null});showDashboard();
    expect(await screen.findByText('Verified dashboard contents')).toBeTruthy();
  });
});

describe('live dashboard and admin controls',()=>{
  it('renders recorded totals and progress without fixed overview numbers',()=>{
    render(<QuickStats ambassadorStats={stats}/>);
    expect(screen.getByText('$12.25 earned today')).toBeTruthy();expect(screen.getByText('1/8')).toBeTruthy();expect(screen.getByText('$300.00')).toBeTruthy();
    expect(screen.queryByText('4/6')).toBeNull();
  });
  it('shows Premium as active without another unlock prompt',()=>{
    render(<CommissionTierStatus ambassadorStats={{...stats,currentCommissionTier:'Premium',commissionRates:defaultSettings.premium_commission_rates}}/>);
    expect(screen.getByText(/Premium rates are active/)).toBeTruthy();expect(screen.queryByText(/Unlock Premium/)).toBeNull();
  });
  it('approves a payout without marking it paid and asks for an external payment reference',()=>{
    render(<PayoutQueueManagement/>);fireEvent.click(screen.getByRole('button',{name:'Approve'}));
    expect(mocks.process).toHaveBeenCalledWith({ids:['pending-id'],status:'approved'});
    fireEvent.click(screen.getByRole('button',{name:'Record payment'}));
    expect((screen.getByRole('button',{name:'Confirm paid'}) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.change(screen.getByLabelText('Payment reference'),{target:{value:'BANK-19'}});
    fireEvent.click(screen.getByRole('button',{name:'Confirm paid'}));
    expect(mocks.process).toHaveBeenLastCalledWith({ids:['approved-id'],status:'paid',reference:'BANK-19'},expect.any(Object));
  });
  it('submits changed settings and rates from the admin form',()=>{
    render(<AdminSystemConfiguration/>);
    fireEvent.change(screen.getAllByLabelText('Activation pack (%)')[0],{target:{value:'40'}});
    fireEvent.change(screen.getByLabelText('Instructions'),{target:{value:'Get your receipt at the clinic.'}});
    fireEvent.click(screen.getByRole('button',{name:'Save settings and commissions'}));
    expect(mocks.save).toHaveBeenCalledWith(expect.objectContaining({commission_rates:{activation_pack:.4,direct_sales:.25,second_level:.1},payment_instructions:expect.objectContaining({instructions:'Get your receipt at the clinic.'})}));
  });
});

it('rejects rates that exceed revenue across mixed tiers and neutralizes CSV formulas',()=>{
  expect(settingsSchema.safeParse({...defaultSettings,commission_rates:{activation_pack:.85,direct_sales:.25,second_level:.1}}).success).toBe(false);
  const csv=toCsv([{name:'=HYPERLINK("bad")',value:'a,b\n"quoted"'}]);
  expect(csv).toContain("'=HYPERLINK");expect(csv).toContain('"a,b\n""quoted"""');
});
