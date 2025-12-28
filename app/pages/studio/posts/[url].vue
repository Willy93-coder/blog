<script setup lang="ts">
  import PostForm from '~/components/posts/post-form.vue';
  import { usePostFormStore } from '~/posts/post-form-store';
  import type { Post, PostActionType } from '~/posts/types';

  definePageMeta({ layout: 'studio' });

  const toast = useToast();
  const route = useRoute();
  const isNew = route.params.url === 'new';

  const post = ref<Partial<Post>>(isNew ? { title: '' } : { title: 'Sample Post Title', id: 1, published: true });

  const postFormStore = usePostFormStore();
  postFormStore.init(post.value);

  postFormStore.onSuccess((updatedPost: Post, action: PostActionType) => {
    let title = 'Post saved successfully';
    if (action === 'publish') title = 'Post published successfully';
    else if (action === 'unpublish') title = 'Post unpublished successfully';

    toast.add({ title, color: 'success' });

    if (action === 'save') {
      // redirect to new post URL (check if the updated post has different url before redirecting)
    }
  });

  postFormStore.onError((error: string, action: PostActionType) => {
    toast.add({ title: `Error: ${error}`, color: 'error' });
  });
</script>

<template>
  <Upage>
    <PostForm />
  </Upage>
</template>
