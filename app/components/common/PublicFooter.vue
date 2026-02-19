<script setup lang="ts">
  const year = new Date().getFullYear();
</script>

<template>
  <footer class="w-full border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
    <div class="mx-auto max-w-3xl px-4 py-6">
      <p class="text-center text-sm text-zinc-400 dark:text-zinc-500">
        &copy; {{ year }} My Blog. All rights reserved.
      </p>
    </div>
  </footer>
</template>
