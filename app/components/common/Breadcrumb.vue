<script setup lang="ts">
  export type BreadcrumbItem = {
    label: string;
    to?: string;
  };

  defineProps<{
    items: BreadcrumbItem[];
  }>();
</script>

<template>
  <nav class="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 mb-2">
    <template v-for="(item, index) in items" :key="index">
      <span v-if="index > 0" class="mx-1">»</span>
      <NuxtLink v-if="item.to" :to="item.to" class="transition-colors hover:text-primary">
        {{ item.label }}
      </NuxtLink>
      <span v-else>{{ item.label }}</span>
    </template>
  </nav>
</template>
