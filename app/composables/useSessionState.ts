import type { Session } from '@supabase/supabase-js';

const useSessionState = () => {
  return useState<Session | null>('auth:session', () => null);
};

export { useSessionState };
