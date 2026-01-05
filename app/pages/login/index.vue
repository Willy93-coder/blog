<script setup lang="ts">
  import type { ButtonProps } from '@nuxt/ui';

  definePageMeta({
    public: true,
  });

  const authService = AuthService();
  const toast = useToast();

  const providers = ref<ButtonProps[]>([
    {
      label: 'GitHub',
      icon: 'i-simple-icons-github',
      color: 'neutral',
      variant: 'subtle',
      onClick: async () => {
        const { error } = await authService.signInWithGitHub();
        if (error !== null) {
          toast.add({
            title: 'Uh oh! Something went wrong.',
            description: 'There was a problem with your request.',
            icon: 'i-lucide-log-in',
          });
          return;
        }
      },
    },
  ]);
</script>

<template>
  <div class="h-dvh flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        title="Login"
        icon="i-lucide-user"
        description="Enter your credentials to access your account."
        :providers="providers"
      />
    </UPageCard>
  </div>
</template>
