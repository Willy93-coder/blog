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
    { label: 'Posts', url: routes.posts() },
    { label: 'Tags', url: routes.tags() },
    // { label: 'About', url: routes.about() },
  ];
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-default bg-default/80 backdrop-blur-sm dark:border-default dark:bg-default/80"
  >
    <nav class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
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
          class="flex items-center gap-1.5 text-sm font-medium text-muted underline-offset-4 transition-colors hover:text-default hover:underline dark:text-muted dark:hover:text-default"
          active-class="text-default underline dark:text-default"
        >
          <UIcon v-if="link.icon" :name="link.icon" class="size-3.5" />
          {{ link.label }}
        </NuxtLink>

        <!-- Dark mode toggle -->
        <button
          @click="toggleColorMode"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          class="rounded-md p-1.5 text-muted transition-colors hover:bg-muted hover:text-default dark:text-muted dark:hover:bg-accented dark:hover:text-default"
        >
          <UIcon :name="isDark ? 'i-lucide-sun' : 'i-lucide-moon'" class="size-4" />
        </button>
      </div>

      <!-- Mobile: dark toggle + hamburger -->
      <div class="flex items-center gap-1 sm:hidden">
        <button
          @click="toggleColorMode"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          class="rounded-md p-1.5 text-muted transition-colors hover:bg-muted hover:text-default dark:text-muted dark:hover:bg-accented dark:hover:text-default"
        >
          <UIcon :name="isDark ? 'i-lucide-sun' : 'i-lucide-moon'" class="size-4" />
        </button>

        <button
          @click="isMenuOpen = !isMenuOpen"
          :aria-expanded="isMenuOpen"
          aria-label="Toggle menu"
          class="rounded-md p-1.5 text-muted transition-colors hover:bg-muted hover:text-default dark:text-muted dark:hover:bg-accented dark:hover:text-default"
        >
          <UIcon :name="isMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'" class="size-5" />
        </button>
      </div>
    </nav>

    <!-- Mobile menu -->
    <div v-if="isMenuOpen" class="border-t border-default dark:border-default sm:hidden">
      <ul class="mx-auto max-w-3xl space-y-1 px-4 py-3">
        <li v-for="link in navLinks" :key="link.url">
          <NuxtLink
            :to="link.url"
            class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-toned transition-colors hover:bg-muted hover:text-default dark:text-muted dark:hover:bg-accented dark:hover:text-default"
            active-class="bg-muted text-default dark:bg-accented dark:text-default"
            @click="isMenuOpen = false"
          >
            <UIcon v-if="link.icon" :name="link.icon" class="size-4" />
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </header>
</template>
