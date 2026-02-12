import { createClient } from '@supabase/supabase-js';
import type { Database } from '~/types/supabase';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const url = config.public.supabaseUrl;
  const key = config.public.supabasePublishKey;

  if (!url || !key) return;

  const supabase = createClient<Database>(url, key);

  return {
    provide: {
      supabase,
    },
  };
});
