<script setup lang="ts">
  import type { PostWithTagsAndAuthors } from '~/types/post';
  import PostLink from './PostLink.vue';

  const { posts, fallbackText } = defineProps<{
    posts: PostWithTagsAndAuthors[] | undefined;
    fallbackText?: string;
  }>();
</script>

<template>
  <ul v-if="posts?.length" class="flex flex-col">
    <li v-for="post in posts" :key="post.id" class="border-b border-default last:border-b-0">
      <PostLink :post="post" />
    </li>
  </ul>

  <p v-else class="font-mono text-xs text-dimmed">{{ fallbackText }}</p>
</template>
