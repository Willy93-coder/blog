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
    class="group flex items-start justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary"
  >
    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-2 mb-1.5">
        <span class="text-primary text-xs shrink-0">→</span>
        <span class="text-sm font-medium text-default truncate group-hover:text-primary transition-colors">
          {{ post.title }}
        </span>
      </div>
      <div v-if="post.post_tag?.length" class="flex flex-wrap gap-1 pl-4">
        <UBadge
          v-for="pt in post.post_tag.slice(0, 3)"
          :key="pt.tag.id"
          variant="outline"
          color="neutral"
          size="xs"
        >{{ pt.tag.name }}</UBadge>
      </div>
    </div>
    <span class="font-mono text-xs text-dimmed shrink-0 pt-0.5">{{ formattedDate }}</span>
  </NuxtLink>
</template>
