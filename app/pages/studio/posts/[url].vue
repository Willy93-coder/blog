<script setup lang="ts">
  import PostForm from '~/components/posts/PostForm.vue';
  import { usePostFormStore } from '~/stores/postFormStore';
  import type { Post, PostActionType } from '~/types/post';

  definePageMeta({ layout: 'studio' });

  const toast = useToast();
  const route = useRoute();
  const postActions = usePosts();

  const isNew = route.params.url === 'new';
  const post = ref<Post | null>(null);
  const isLoading = ref(!isNew);

  const fetchPost = async () => {
    if (isNew) {
      isLoading.value = false;
      return;
    }

    try {
      const { data, error } = await postActions.getPostById({ id: route.params.url as string });
      if (error !== null) {
        toast.add({ title: 'Error', description: 'Error to get post. Please try again', color: 'error' });
        post.value = null;
        return;
      }
      post.value = data;
    } catch (err) {
      post.value = null;
      toast.add({ title: 'Error', description: 'Error to get the post. Please try again', color: 'error' });
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchPost);

  const postFormStore = usePostFormStore();

  watch(
    post,
    (newPost) => {
      console.warn('init post form store with', newPost);
      postFormStore.init(newPost ?? undefined);
    },
    { immediate: true },
  );

  postFormStore.onSuccess((updatedPost: Post, action: PostActionType) => {
    let title = 'Post saved successfully';
    if (action === 'publish') title = 'Post published successfully';
    else if (action === 'unpublish') title = 'Post unpublished successfully';

    toast.add({ title, color: 'success' });

    if (action === 'save') {
      if (isNew) navigateTo(`/studio/posts/${updatedPost.id}`);
    } else {
      console.warn('update post with', updatedPost);
      post.value = updatedPost;
    }
  });

  postFormStore.onError((error: string, action: PostActionType) => {
    toast.add({ title: `Error: ${error}`, color: 'error' });
  });

  postFormStore.onCancel(() => {
    if (isNew) navigateTo('/studio/posts');
  });
</script>

<template>
  <UPage>
    <div v-if="isLoading" class="flex justify-center items-center min-h-50">
      <div>Loading post...</div>
    </div>
    <PostForm v-else />
  </UPage>
</template>
