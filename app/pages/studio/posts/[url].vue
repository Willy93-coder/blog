<script setup lang="ts">
  import PostForm from '~/components/posts/post-form.vue';
  import { usePostFormStore } from '~/posts/post-form-store';
  import type { Post, PostActionType } from '~/posts/types';

  definePageMeta({ layout: 'studio' });

  const toast = useToast();
  const route = useRoute();
  const isNew = route.params.url === 'new';

  const post = isNew
    ? undefined
    : {
        id: '1',
        title: 'Sample Post Title',
        content: 'Sample content',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

  const postFormStore = usePostFormStore();
  postFormStore.init(post);

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
