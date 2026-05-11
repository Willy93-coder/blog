<script setup lang="ts">
  import type { PostWithTagsAndAuthors } from '~/types/post';
  import PostLink from './PostLink.vue';

  const { posts, fallbackText } = defineProps<{
    posts: PostWithTagsAndAuthors[] | undefined;
    fallbackText?: string;
  }>();
</script>

<template>
  <div v-if="posts?.length" class="border border-accented bg-elevated overflow-hidden">
    <div v-for="post in posts" :key="post.id" class="border-b border-accented last:border-b-0">
      <PostLink :post="post" />
    </div>
  </div>

  <p v-else class="font-mono text-xs text-dimmed">{{ fallbackText }}</p>
</template>
