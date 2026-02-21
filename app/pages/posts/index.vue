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
    const { data, error } = await postFunctions.getPublishedPostsWithTags();
    if (error !== null) {
      toast.add({ title: 'Error', description: 'Could not load posts. Please try again.', color: 'error' });
      return [];
    }
    return data;
  });
</script>
<template>
  <PostList title="All Posts" :posts="posts" fallbackText="No posts published yet." />
</template>
