<script setup lang="ts">
  import PostList from '~/components/posts/PostList.vue';
  import type { PostWithTags } from '~/types/post';

  definePageMeta({
    public: true,
    layout: 'blog',
  });

  const postFunctions = usePosts();
  const toast = useToast();

  const { data: posts } = await useAsyncData<PostWithTags[]>('published-posts', async () => {
    const { data, error } = await postFunctions.getLimitPublishedPostsWithTags({ limit: 5 });
    if (error !== null) {
      toast.add({ title: 'Error', description: 'Could not load posts. Please try again.', color: 'error' });
      return [];
    }
    return data;
  });
</script>

<template>
  <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl mb-2">Blog</h1>
  <p class="text-zinc-500 dark:text-zinc-400 mb-10">Articles about web development, code and other things.</p>

  <USeparator class="mb-10" />

  <PostList :posts="posts" title="Recent Posts" fallbackText="No posts published yet." />
</template>
