<script setup lang="ts">
  import type { Tag } from '~/types/tag';

  defineProps<{
    tags: Tag[] | undefined;
    fallbackText?: string;
  }>();
</script>

<template>
  <div v-if="tags?.length" class="flex flex-row flex-wrap gap-3">
    <NuxtLink
      v-for="tag in tags"
      :key="tag.id"
      :to="`/posts?tag=${tag.name}`"
      class="transition-opacity hover:opacity-70"
    >
      <UBadge color="neutral" variant="outline" class="cursor-pointer text-sm">#{{ tag.name }}</UBadge>
    </NuxtLink>
  </div>

  <p v-else class="text-sm text-zinc-400 dark:text-zinc-500">{{ fallbackText }}</p>
</template>
