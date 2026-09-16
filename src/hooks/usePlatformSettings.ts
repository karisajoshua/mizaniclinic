import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { parseSettings, settingsSchema, type PlatformSettings } from '@/lib/settings';
import { toast } from '@/hooks/use-toast';

export function usePlatformSettings() {
  return useQuery({
    queryKey: ['platform-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('system_settings').select('key,value');
      if (error) throw error;
      return parseSettings(data ?? []);
    },
    staleTime: 60_000,
  });
}

export function useSavePlatformSettings() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (settings: PlatformSettings) => {
      const validated = settingsSchema.parse(settings);
      const { error } = await supabase.rpc('save_platform_settings', { p_settings: validated });
      if (error) throw error;
      return validated;
    },
    onSuccess: (settings) => {
      client.setQueryData(['platform-settings'], settings);
      client.invalidateQueries({ queryKey: ['ambassador-stats'] });
      client.invalidateQueries({ queryKey: ['admin-report'] });
      toast({ title: 'Settings saved', description: 'Commission changes apply to new transactions.' });
    },
    onError: (error: Error) => toast({ title: 'Could not save settings', description: error.message, variant: 'destructive' }),
  });
}
