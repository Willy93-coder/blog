<script setup lang="ts">
  import type { PostWithTagsAndAuthors } from '~/types/post';
  import { useRoutes } from '~/composables/useRoutes';

  const { post } = defineProps<{
    post: PostWithTagsAndAuthors;
  }>();

  const routes = useRoutes();

  const formattedDate = computed(() => {
    const date = post.published_at ?? post.created_at;
    return new Date(date).toISOString().split('T')[0];
  });
</script>

<template>
  <NuxtLink
    :to="routes.post(post.id)"
    class="group flex items-center justify-between gap-4 py-2 transition-colors hover:text-primary"
  >
    <span class="flex items-center gap-2 min-w-0">
      <span class="text-muted transition-colors group-hover:text-primary shrink-0">→</span>
      <span class="truncate">{{ post.title }}</span>
    </span>
    <span class="font-mono text-xs text-dimmed shrink-0">{{ formattedDate }}</span>
  </NuxtLink>
</template>
