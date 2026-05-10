<script setup lang="ts">
  import type { PublicNavbar } from '~/types/publicNavbar';
  import AppLogo from '~/components/common/AppLogo.vue';

  const colorMode = useColorMode();
  const isDark = computed(() => colorMode.value === 'dark');
  const toggleColorMode = () => {
    colorMode.preference = isDark.value ? 'light' : 'dark';
  };

  const isMenuOpen = ref(false);
  const routes = useRoutes();

  const navLinks: PublicNavbar[] = [
    { label: '~/posts', url: routes.posts() },
    { label: '~/tags', url: routes.tags() },
  ];
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-default bg-default">
    <nav class="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
      <!-- Logo -->
      <NuxtLink :to="routes.home()" aria-label="GMV-Blog">
        <AppLogo />
      </NuxtLink>

      <!-- Desktop nav -->
      <div class="hidden items-center gap-6 sm:flex">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.url"
          :to="link.url"
          class="font-mono text-xs text-muted transition-colors hover:text-primary"
          active-class="text-primary underline underline-offset-4 decoration-primary"
        >
          {{ link.label }}
        </NuxtLink>

        <button
          @click="toggleColorMode"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          class="cursor-pointer p-1.5 text-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
        >
          <UIcon :name="isDark ? 'i-lucide-sun' : 'i-lucide-moon'" class="size-4" />
        </button>
      </div>

      <!-- Mobile: dark toggle + hamburger -->
      <div class="flex items-center gap-1 sm:hidden">
        <button
          @click="toggleColorMode"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          class="cursor-pointer p-1.5 text-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
        >
          <UIcon :name="isDark ? 'i-lucide-sun' : 'i-lucide-moon'" class="size-4" />
        </button>

        <button
          @click="isMenuOpen = !isMenuOpen"
          :aria-expanded="isMenuOpen"
          aria-label="Toggle menu"
          class="cursor-pointer p-1.5 text-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
        >
          <UIcon :name="isMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'" class="size-5" />
        </button>
      </div>
    </nav>

    <!-- Mobile menu -->
    <div v-if="isMenuOpen" class="border-t border-default sm:hidden">
      <ul class="mx-auto max-w-3xl space-y-1 px-4 py-3">
        <li v-for="link in navLinks" :key="link.url">
          <NuxtLink
            :to="link.url"
            class="block px-2 py-2 font-mono text-xs text-muted transition-colors hover:text-primary"
            active-class="text-primary underline underline-offset-4 decoration-primary"
            @click="isMenuOpen = false"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </header>
</template>
