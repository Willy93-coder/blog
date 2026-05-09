<script setup lang="ts">
  defineProps<{
    tag: string;
  }>();
</script>

<template>
  <span class="font-mono text-xs text-muted border border-default px-1.5 py-0.5 transition-colors hover:text-primary hover:border-primary">
    [{{ tag }}]
  </span>
</template>
