<script setup lang="ts">
  import type { PostWithTagsAndAuthors } from '~/types/post';
  import { useRoutes } from '~/composables/useRoutes';

  const { post } = defineProps<{
    post: PostWithTagsAndAuthors;
  }>();

  const routes = useRoutes();

  const formattedDate = computed(() => {
    const date = post.published_at ?? post.created_at;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  });
</script>

<template>
  <NuxtLink
    :to="routes.post(post.id)"
    class="flex justify-between items-center gap-4 rounded-md px-3 py-2 -mx-3 hover:bg-muted"
  >
    <span>{{ post.title }}</span>
    <span class="text-sm text-dimmed shrink-0">{{ formattedDate }}</span>
  </NuxtLink>
</template>
