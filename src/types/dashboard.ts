
export interface AmbassadorStats {
  totalEarnings: number;
  activationPackEarnings: number;
  directReferralEarnings: number;
  secondLevelEarnings: number;
  teamProgressLevel1: number;
  teamProgressLevel2: number;
  totalReferrals: number;
  activeReferrals: number;
  pendingReferrals: number;
  referralsByCountry: {
    Tanzania: number;
    Kenya: number;
    Uganda: number;
    Rwanda: number;
    Burundi: number;
    DRC: number;
  };
  ambassadorLimit: number;
  currentCommissionTier: string;
  nextPayoutDate: string;
}

export interface UserAccount {
  fullName: string;
  region: string;
  userReferralId: string;
}

export interface Country {
  name: string;
  flag: string;
  count: number;
  limit: number;
}

export interface Referral {
  name: string;
  joinDate: string;
  location: string;
  status: 'Active' | 'Pending';
}
