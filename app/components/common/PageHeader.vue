<script setup lang="ts">
  defineProps<{
    title: string;
    subtitle?: string;
  }>();
</script>

<template>
  <div class="flex flex-col gap-1 mb-6">
    <h1 class="text-xl font-bold text-default">
      <span class="text-primary mr-1">#</span>{{ title }}
    </h1>
    <p v-if="subtitle" class="font-mono text-xs text-muted">{{ subtitle }}</p>
  </div>
</template>
