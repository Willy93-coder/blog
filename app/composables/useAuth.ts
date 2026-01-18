import { useNuxtApp } from '#app';
import { useAppUrl } from '~/composables/useAppUrl';

const useAuth = () => {
  const { $supabase } = useNuxtApp();
  const appUrl = useAppUrl();

  return {
    signInWithGitHub: async () =>
      await $supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: appUrl.absoluteStudio({ toast: 'login_success' }),
        },
      }),
    signOut: async () => await $supabase.auth.signOut(),
    isAllowedUser: async () => {
      const { data, error } = await $supabase.rpc('is_allowlisted');

      if (error) return { allowed: false, error };

      return { allowed: Boolean(data), error: null };
    },
  };
};

export { useAuth };
