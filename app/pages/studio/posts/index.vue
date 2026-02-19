<script setup lang="ts">
  import PostTable from '~/components/posts/PostTable.vue';
  import { useRoutes } from '~/composables/useRoutes';
  import type { PostWithTags } from '~/types/post';

  definePageMeta({
    layout: 'studio',
  });

  const postFunctions = usePosts();
  const toast = useToast();
  const routes = useRoutes();

  const postList = ref<PostWithTags[]>([]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await postFunctions.getPostsWithTags();
      if (error !== null) {
        toast.add({ title: 'Error', description: 'Error loading posts. Please try again', color: 'error' });
        postList.value = [];
        return;
      }
      postList.value = data;
    } catch (err) {
      postList.value = [];
      toast.add({ title: 'Error', description: 'Error loading posts. Please try again', color: 'error' });
    }
  };

  onMounted(fetchPosts);

  async function handleAction(
    action: () => Promise<{ error: string | null }>,
    successMessage: string,
    errorMessage: string,
  ) {
    const result = await action();
    if (result.error === null) {
      await fetchPosts();
      toast.add({ title: 'Success', description: successMessage, color: 'success' });
    } else {
      toast.add({ title: 'Error', description: errorMessage, color: 'error' });
    }
  }

  const onDeletePosts = (ids: string[]) =>
    handleAction(
      () => postFunctions.deletePosts(ids),
      'Post(s) deleted successfully.',
      'Error deleting post(s). Please try again',
    );

  const onPublishPost = (id: string) =>
    handleAction(
      () => postFunctions.publishPostById({ id }),
      'Post published successfully.',
      'Error publishing post. Please try again',
    );

  const onUnpublishPost = (id: string) =>
    handleAction(
      () => postFunctions.unpublishPostById({ id }),
      'Post unpublished successfully.',
      'Error unpublishing post. Please try again',
    );
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold">Posts</h1>
        <p class="text-sm text-muted mt-1">Manage your blog posts.</p>
      </div>
      <UButton icon="i-lucide-plus" :to="routes.studioPostsNew()">New Post</UButton>
    </div>
    <PostTable :postList="postList" @delete="onDeletePosts" @publish="onPublishPost" @unpublish="onUnpublishPost" />
  </div>
</template>
