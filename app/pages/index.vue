<script setup lang="ts">
  import PostList from '~/components/posts/PostList.vue';
  import type { PostWithTagsAndAuthors } from '~/types/post';

  definePageMeta({
    public: true,
    layout: 'blog',
  });

  const postFunctions = usePosts();
  const toast = useToast();

  const { data: posts } = await useAsyncData<PostWithTagsAndAuthors[]>('published-posts', async () => {
    const { data, error } = await postFunctions.getLimitPublishedPostsWithTags({ limit: 5 });
    if (error !== null) {
      toast.add({ title: 'Error', description: 'Could not load posts. Please try again.', color: 'error' });
      return [];
    }
    return data;
  });
</script>

<template>
  <div>
    <p class="font-mono text-xs text-muted mb-1">$ cat recent-posts.md</p>
    <h1 class="text-xl font-bold text-default mb-1">
      <span class="text-primary mr-1">#</span>Blog
    </h1>
    <p class="font-mono text-xs text-muted mb-8">Articles about web development, code and other things.</p>

    <USeparator class="mb-8" />

    <PostList :posts="posts" fallbackText="No posts published yet." />
  </div>
</template>
