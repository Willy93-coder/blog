<script setup lang="ts">
  import type { Tag } from '~/types/tag';
  import TagBadge from './TagBadge.vue';

  defineProps<{
    tags: Tag[] | undefined;
    fallbackText?: string;
  }>();
</script>

<template>
  <div v-if="tags?.length" class="flex flex-row flex-wrap gap-2">
    <NuxtLink
      v-for="tag in tags"
      :key="tag.id"
      :to="`/posts?tag=${tag.name}`"
      class="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
    >
      <TagBadge :tag="tag.name" />
    </NuxtLink>
  </div>

  <p v-else class="font-mono text-xs text-dimmed">{{ fallbackText }}</p>
</template>
