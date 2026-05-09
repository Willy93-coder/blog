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
  <nav class="flex items-center font-mono text-xs text-dimmed mb-3">
    <template v-for="(item, index) in items" :key="index">
      <span v-if="index > 0" class="mx-1 text-muted">/</span>
      <NuxtLink v-if="item.to" :to="item.to" class="hover:text-primary transition-colors">
        {{ index === 0 ? '~' : item.label.toLowerCase() }}
      </NuxtLink>
      <span v-else>{{ item.label.toLowerCase() }}</span>
    </template>
  </nav>
</template>
