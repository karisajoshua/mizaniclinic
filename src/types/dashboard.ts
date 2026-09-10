
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
  countryName: string;
  countryActiveCount: number;
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
  code?: string;
  flag: string;
  count: number;
  limit: number;
  premiumUnlocked?: boolean;
}

export interface Referral {
  name: string;
  joinDate: string;
  location: string;
  status: 'Active' | 'Pending';
}

export interface Appointment {
  id: string;
  user_id: string;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  stripe_session_id?: string;
  amount: number;
  patient_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DoctorAvailability {
  id: string;
  doctor_name: string;
  available_date: string;
  start_time: string;
  end_time: string;
  slot_duration: number;
  max_bookings_per_slot: number;
  is_available: boolean;
  created_at: string;
}
