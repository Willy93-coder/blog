<script setup lang="ts">
  import type { PostWithTagsAndAuthors } from '~/types/post';
  import TagBadge from '../tags/TagBadge.vue';
  import Breadcrumb from '~/components/common/Breadcrumb.vue';
  import PostAuthor from './PostAuthor.vue';

  const props = defineProps<{
    post: PostWithTagsAndAuthors;
  }>();

  const tags = computed(() => props.post.post_tag?.map((pt) => pt.tag) ?? []);
  const author = computed(() => props.post.post_user?.[0]?.profiles ?? null);

  const formattedDate = computed(() => {
    const date = props.post.published_at ?? props.post.created_at;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });
</script>

<template>
  <Breadcrumb :items="[{ label: 'Home', to: '/' }, { label: 'Posts', to: '/posts' }, { label: post.title }]" />
  <!-- Header -->
  <header class="mb-8">
    <h1 class="text-3xl font-bold tracking-tight text-default sm:text-4xl">
      {{ post.title }}
    </h1>

    <p v-if="post.subtitle" class="mt-3 text-lg text-muted">
      {{ post.subtitle }}
    </p>

    <div class="mt-5">
      <PostAuthor :profile="author" link />
    </div>
    <div class="mt-4 flex flex-wrap items-center gap-3">
      <time :datetime="post.published_at ?? post.created_at" class="text-sm text-dimmed">
        {{ formattedDate }}
      </time>

      <template v-if="tags.length">
        <USeparator orientation="vertical" class="h-4" />
        <div class="flex flex-wrap gap-1.5">
          <TagBadge v-for="tag in tags" :key="tag.id" :tag="tag.name" />
        </div>
      </template>
    </div>
  </header>

  <USeparator class="mb-8" />

  <!-- Content -->
  <div class="prose prose-zinc dark:prose-invert max-w-none">
    <UEditor
      :model-value="post.content"
      content-type="markdown"
      :editable="false"
      :starter-kit="{ link: { openOnClick: true } }"
    />
  </div>
</template>

<style scoped>
  :deep(.ProseMirror) {
    padding: 0;
  }
</style>
