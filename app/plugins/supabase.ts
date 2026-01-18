import { createClient } from '@supabase/supabase-js';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const url = config.public.supabaseUrl;
  const key = config.public.supabasePublishKey;

  if (!url || !key) return;

  const supabase = createClient(url, key);

  return {
    provide: {
      supabase,
    },
  };
});
