<script setup lang="ts">
  const year = new Date().getFullYear();
</script>

<template>
  <footer class="w-full border-t border-default bg-default dark:border-default dark:bg-default">
    <div class="mx-auto max-w-3xl px-4 py-6">
      <p class="text-center text-sm text-dimmed">&copy; {{ year }} GMV-Blog. All rights reserved.</p>
    </div>
  </footer>
</template>
