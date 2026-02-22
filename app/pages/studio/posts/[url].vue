<script setup lang="ts">
  import PostForm from '~/components/posts/PostForm.vue';
  import PostFormSkeleton from '~/components/skeletons/PostFormSkeleton.vue';
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
      post.value = updatedPost;
    }
  });

  postFormStore.onError((error: string) => {
    toast.add({ title: `Error: ${error}`, color: 'error' });
  });

  postFormStore.onCancel(() => {
    if (isNew) navigateTo('/studio/posts');
  });
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold">{{ isNew ? 'New Post' : 'Edit Post' }}</h1>
        <p class="text-sm text-muted mt-1">
          {{ isNew ? 'Create a new blog post.' : 'Edit your blog post.' }}
        </p>
      </div>
      <div v-if="!isLoading" class="flex items-center gap-2">
        <UButton
          v-for="action in postFormStore.actions"
          :key="action.type"
          :icon="action.icon"
          :color="action.color"
          :disabled="postFormStore.uiState.status === 'submitting'"
          :loading="postFormStore.uiState.status === 'submitting' && postFormStore.uiState.action === action.type"
          @click="postFormStore.submit(action.type)"
        >
          {{ action.label }}
        </UButton>
      </div>
    </div>
    <PostFormSkeleton v-if="isLoading" />
    <PostForm v-else />
  </div>
</template>
