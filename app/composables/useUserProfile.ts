import { useNuxtApp } from '#app';

const useUserProfile = () => {
  const { $supabase } = useNuxtApp();
  const session = useSessionState();

  const profile = useState<any | null>('user:profile', () => null);
  const loading = useState<boolean>('user:profile:loading', () => false);

  const userId = computed(() => session.value?.user?.id ?? null);

  const fetchUserProfile = async () => {
    if (!userId.value) return;

    loading.value = true;
    const { data, error } = await $supabase.from('profiles').select().eq('id', userId.value).single();

    loading.value = false;

    if (error) {
      profile.value = null;
      return;
    }

    profile.value = data;
  };

  return {
    profile,
    loading,
    fetchUserProfile,
  };
};

export { useUserProfile };
