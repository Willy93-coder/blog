<script setup lang="ts">
  definePageMeta({
    layout: 'studio',
  });

  const toast = useToast();
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
</script>

<template>
  <h2>Studio Page</h2>
</template>
