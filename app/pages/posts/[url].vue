<script setup lang="ts">
  import PostPublic from '~/components/posts/PostPublic.vue';
  import type { PostWithTags } from '~/types/post';

  definePageMeta({
    public: true,
    layout: 'blog',
  });

  const route = useRoute();
  const postActions = usePosts();

  const { data: post } = await useAsyncData<PostWithTags | null>(`post-${route.params.url}`, async () => {
    const { data, error } = await postActions.getPostWithTagsById({ id: route.params.url as string });
    if (error !== null || !data || !data.published) return null;
    return data;
  });

  if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' });
  }
</script>

<template>
  <PostPublic :post="post!" />
</template>
