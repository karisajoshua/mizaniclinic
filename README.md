# 🇹🇿 Mizani Clinic 

A full-featured referral-based registration and healthcare booking platform tailored for Mizani Clinic Ambassadors across Tanzania and East Africa. This system enables users to register with referral codes, earn commissions through multiple earning channels, and schedule appointments with Dr. Mwaka — all through a clean, mobile-first web interface.

---

## 🚀 Features

### 🎯 Ambassador User Features:

* Register with a region-based referral code (e.g., `TDSM-AB1234`)
* Make payments or upload receipts
* Access unique **Ambassador ID**, training, and onboarding material
* Track referral performance (people referred, earnings)
* View and share personal referral code
* Book appointments with Dr. Mwaka
* Earn commissions through 5+ revenue streams

### 👨‍⚕️ Admin Dashboard (Dr. Mwaka):

* Manage availability and booking calendar
* Track referrals, regional statistics, income, and ambassador performance
* Manually or automatically confirm payments and process payouts

### 💸 Earning Model:

1. **30% Activation Pack Referral** (paid after 5 signups)
2. **25% on Direct Sales/Service Referrals**
3. **15% from Second-Level Referrals**
4. **MPA Bonus (Motorbike at 1,000 MPA / Car at 6,000 MPA)**
5. **Post-1,000 Ambassadors:** 70% commission + ability to onboard 100 others regionally
6. **Enhanced Tiers:** Earn up to 75% on combined commissions

---

## 🧩 Tech Stack

* **Frontend:** React (Lovable low-code platform compatible), TailwindCSS
* **Backend:** Firebase / Supabase / Node.js (customizable)
* **Authentication:** OTP, Email/Password, Google/Facebook Sign-In
* **Payments:** Mobile Money Integration (Mpesa, TigoPesa, etc.)
* **Design:** Clean, mobile-first UI following Mizani brand guidelines

---

## 📱 UI Overview

* Splash screen with animated gradient logo
* Onboarding screens (Vyond-style illustrations)
* Mobile dashboard for Ambassadors
* Admin control panel
* Booking calendar with availability logic
* Commission tracking with visual progress meters

---

## 📂 Project Structure

```
📁 mizani-clinic-app/
├── public/
├── src/
│   ├── assets/          # Icons, illustrations, logos
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page views (Dashboard, Register, Book, Admin)
│   ├── utils/           # Commission logic, referral code generator
│   └── styles/          # Tailwind config + custom styles
├── .env
├── README.md
└── package.json
```

---

## 🛠 Setup Instructions

1. **Clone Repo**

```bash
git clone https://github.com/yourusername/mizani-clinic-app.git
cd mizani-clinic-app
```

2. **Install Dependencies**

```bash
npm install
```

3. **Configure Environment Variables**

```env
REACT_APP_FIREBASE_API_KEY=your-key
REACT_APP_REGION_LIST=["Dar es Salaam", "Arusha", "Mwanza", ...]
```

4. **Start Local Dev Server**

```bash
npm run dev
```


