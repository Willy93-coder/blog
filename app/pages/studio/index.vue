<script setup lang="ts">
  const toast = useToast();
  const authService = useAuth();
  const routes = useRoutes();
  const route = useRoute();
  const router = useRouter();

  onMounted(() => {
    if (route.query.toast === 'login_success') {
      toast.add({
        title: 'Welcome!',
        description: 'You’re now logged in.',
        icon: 'i-lucide-log-in',
      });
    }
    // Clean query param
    router.replace({ path: route.path, query: {} });
  });

  const logout = async () => {
    const { error } = await authService.signOut();
    if (error !== null) {
      toast.add({
        title: 'Uh oh! Something went wrong.',
        description: "There was a problem when you've tried to do logout.",
        icon: 'i-lucide-log-out',
      });
      return;
    }
    toast.add({
      title: 'Logout successful',
      description: 'You have safely logged out of your account.',
      icon: 'i-lucide-log-out',
    });
    navigateTo(routes.login());
  };
</script>

<template>
  <h2>Studio Page</h2>
  <UButton
    icon="i-lucide-log-out"
    color="neutral"
    variant="outline"
    :ui="{ leadingIcon: 'text-primary' }"
    @click="logout"
  >
    Logout
  </UButton>
</template>
