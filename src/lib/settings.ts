import { z } from 'zod';

const rate = z.number().min(0).max(1);
export const commissionRatesSchema = z.object({ activation_pack: rate, direct_sales: rate, second_level: rate })
  .refine(v => v.activation_pack + v.second_level <= 1 && v.direct_sales + v.second_level <= 1,
    'Direct and sponsor commissions together cannot exceed 100%.');
export const settingsSchema = z.object({
  commission_rates: commissionRatesSchema,
  premium_commission_rates: commissionRatesSchema,
  activation_pack: z.object({ price_usd: z.number().positive(), price_local: z.number().positive(), currency: z.literal('TZS') }),
  admin_alerts: z.object({ registrations: z.boolean(), payouts: z.boolean(), country_limits: z.boolean(), milestones: z.boolean() }),
  payment_instructions: z.object({ instructions: z.string().trim().min(1).max(2000), support_phone: z.string().trim().max(40) }),
}).refine(v => Math.max(v.commission_rates.activation_pack, v.commission_rates.direct_sales, v.premium_commission_rates.activation_pack, v.premium_commission_rates.direct_sales) + Math.max(v.commission_rates.second_level, v.premium_commission_rates.second_level) <= 1, 'Mixed-tier commissions together cannot exceed 100%.');

export type PlatformSettings = z.infer<typeof settingsSchema>;
export type CommissionRates = z.infer<typeof commissionRatesSchema>;
export const defaultSettings = {
  commission_rates: { activation_pack: .35, direct_sales: .25, second_level: .10 },
  premium_commission_rates: { activation_pack: .70, direct_sales: .35, second_level: .20 },
  activation_pack: { price_usd: 35, price_local: 87500, currency: 'TZS' },
  admin_alerts: { registrations: true, payouts: true, country_limits: true, milestones: true },
  payment_instructions: { instructions: 'Pay the clinic separately and obtain a receipt code. Enter that code below to activate your account.', support_phone: '+255747100100' },
} satisfies PlatformSettings;

export function parseSettings(rows: { key: string; value: unknown }[]): PlatformSettings {
  const values = Object.fromEntries(rows.map(row => [row.key, row.value]));
  return settingsSchema.parse({ ...defaultSettings, ...values });
}
