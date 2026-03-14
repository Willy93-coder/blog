<script setup lang="ts">
  import type { PostWithTagsAndAuthors } from '~/types/post';
  import PostLink from './PostLink.vue';

  const { posts, fallbackText } = defineProps<{
    posts: PostWithTagsAndAuthors[] | undefined;
    fallbackText?: string;
  }>();
</script>

<template>
  <ul v-if="posts?.length" class="divide-y divide-default">
    <li v-for="post in posts" :key="post.id" class="py-1">
      <PostLink :post="post" />
    </li>
  </ul>

  <p v-else class="text-dimmed text-sm">{{ fallbackText }}</p>
</template>
