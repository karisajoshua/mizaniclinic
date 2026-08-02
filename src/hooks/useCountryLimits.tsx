import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Country } from "@/types/dashboard";

export const useCountryLimits = () => {
  return useQuery({
    queryKey: ['country-limits'],
    queryFn: async (): Promise<Country[]> => {
      const { data: countryLimits, error } = await supabase
        .from('country_limits')
        .select('*')
        .eq('is_active', true)
        .order('country_name');

      if (error) {
        console.error('Error fetching country limits:', error);
        throw error;
      }

      const countryFlags: Record<string, string> = {
        'TZ': '🇹🇿',
        'KE': '🇰🇪',
        'UG': '🇺🇬',
        'RW': '🇷🇼',
        'BI': '🇧🇮',
        'CD': '🇨🇩'
      };

      return countryLimits?.map(country => ({
        name: country.country_name,
        code: country.country_code,
        flag: countryFlags[country.country_code] || '🏳️',
        count: country.current_count,
        limit: country.ambassador_limit,
        premiumUnlocked: country.premium_unlocked,
      })) || [];
    },
    enabled: true,
  });
};
