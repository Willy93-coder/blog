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
        description: "You're now logged in.",
        icon: 'i-lucide-log-in',
      });
    }
    router.replace({ path: route.path, query: {} });
  });
</script>

<template>
  <div>
    <h1 class="text-xl font-bold text-highlighted mb-1">
      <span class="text-primary mr-1">#</span>Studio
    </h1>
    <p class="font-mono text-xs text-muted">Manage your posts and tags.</p>
  </div>
</template>
