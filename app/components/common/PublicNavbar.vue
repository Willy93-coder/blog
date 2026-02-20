<script setup lang="ts">
  import type { PublicNavbar } from '~/types/publicNavbar';

  const colorMode = useColorMode();
  const isDark = computed(() => colorMode.value === 'dark');
  const toggleColorMode = () => {
    colorMode.preference = isDark.value ? 'light' : 'dark';
  };

  const isMenuOpen = ref(false);

  const navLinks: PublicNavbar[] = [
    { label: 'Posts', url: '/posts' },
    { label: 'Tags', url: '/tags' },
    { label: 'About', url: '/about' },
  ];
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80"
  >
    <nav class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="font-mono text-lg font-bold tracking-tight text-zinc-900 transition-colors hover:text-zinc-500 dark:text-zinc-100 dark:hover:text-zinc-400"
      >
        My Blog
      </NuxtLink>

      <!-- Desktop nav -->
      <div class="hidden items-center gap-6 sm:flex">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.url"
          :to="link.url"
          class="flex items-center gap-1.5 text-sm font-medium text-zinc-500 underline-offset-4 transition-colors hover:text-primary dark:text-zinc-400 dark:hover:text-primary"
          active-class="text-zinc-900 underline dark:text-zinc-100"
        >
          <UIcon v-if="link.icon" :name="link.icon" class="size-3.5" />
          {{ link.label }}
        </NuxtLink>

        <!-- Dark mode toggle -->
        <button
          @click="toggleColorMode"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          class="cursor-pointer rounded-md p-1.5 text-zinc-500 transition-colors hover:text-primary dark:text-zinc-400 dark:hover:text-primary"
        >
          <UIcon :name="isDark ? 'i-lucide-sun' : 'i-lucide-moon'" class="size-4" />
        </button>
      </div>

      <!-- Mobile: dark toggle + hamburger -->
      <div class="flex items-center gap-1 sm:hidden">
        <button
          @click="toggleColorMode"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          class="cursor-pointer rounded-md p-1.5 text-zinc-500 transition-colors hover:text-primary dark:text-zinc-400 dark:hover:text-primary"
        >
          <UIcon :name="isDark ? 'i-lucide-sun' : 'i-lucide-moon'" class="size-4" />
        </button>

        <button
          @click="isMenuOpen = !isMenuOpen"
          :aria-expanded="isMenuOpen"
          aria-label="Toggle menu"
          class="rounded-md p-1.5 text-zinc-500 transition-colors hover:text-primary dark:text-zinc-400 dark:hover:text-primary"
        >
          <UIcon :name="isMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'" class="size-5" />
        </button>
      </div>
    </nav>

    <!-- Mobile menu -->
    <div v-if="isMenuOpen" class="border-t border-zinc-200 dark:border-zinc-800 sm:hidden">
      <ul class="mx-auto max-w-3xl space-y-1 px-4 py-3">
        <li v-for="link in navLinks" :key="link.url">
          <NuxtLink
            :to="link.url"
            class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-primary dark:text-zinc-400 dark:hover:text-primary"
            active-class="bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
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
