<script setup lang="ts">
  const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="w-full border-t border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
    <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
      <!-- Copyright -->
      <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        Copyright &copy; {{ currentYear }} | All rights reserved.
      </p>

      <!-- Social links -->
      <div class="flex items-center gap-2">
        <a
          href="https://github.com/Willy93-coder/blog"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
          class="rounded-md text-zinc-500 transition-colors hover:text-primary dark:text-zinc-400 dark:hover:text-primary"
        >
          <UIcon name="i-lucide-github" class="size-4" />
        </a>
      </div>
    </div>
  </footer>
</template>
