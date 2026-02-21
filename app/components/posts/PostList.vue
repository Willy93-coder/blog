<script setup lang="ts">
  import type { PostWithTags } from '~/types/post';
  import PostLink from './PostLink.vue';

  const { posts, fallbackText } = defineProps<{
    posts: PostWithTags[] | undefined;
    fallbackText?: string;
  }>();
</script>

<template>
  <ul v-if="posts?.length" class="divide-y divide-zinc-100 dark:divide-zinc-800">
    <li v-for="post in posts" :key="post.id" class="py-1">
      <PostLink :post="post" />
    </li>
  </ul>

  <p v-else class="text-zinc-400 dark:text-zinc-500 text-sm">{{ fallbackText }}</p>
</template>
