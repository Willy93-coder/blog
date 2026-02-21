<script setup lang="ts">
  defineProps<{
    title: string;
    subtitle?: string;
  }>();
</script>

<template>
  <div class="flex flex-col gap-1 mb-4">
    <h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{{ title }}</h1>
    <p v-if="subtitle" class="text-sm italic text-zinc-500 dark:text-zinc-400">{{ subtitle }}</p>
  </div>
</template>
