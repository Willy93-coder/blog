<script setup lang="ts">
  const year = new Date().getFullYear();
</script>

<template>
  <footer class="w-full border-t border-default">
    <div class="mx-auto max-w-3xl px-4 py-4">
      <p class="font-mono text-xs text-dimmed">// © {{ year }} GMV-Blog</p>
    </div>
  </footer>
</template>
