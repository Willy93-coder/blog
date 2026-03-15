<script setup lang="ts">
  defineProps<{
    title: string;
    subtitle?: string;
  }>();
</script>

<template>
  <div class="flex flex-col gap-1 mb-4">
    <h1 class="text-3xl font-bold text-default">{{ title }}</h1>
    <p v-if="subtitle" class="text-sm text-muted">{{ subtitle }}</p>
  </div>
</template>
