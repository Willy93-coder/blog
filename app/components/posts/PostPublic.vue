<script setup lang="ts">
  import type { PostWithTagsAndAuthors } from '~/types/post';
  import TagBadge from '../tags/TagBadge.vue';
  import Breadcrumb from '~/components/common/Breadcrumb.vue';
  import PostAuthor from './PostAuthor.vue';

  const props = defineProps<{
    post: PostWithTagsAndAuthors;
  }>();

  const codeHighlight = useCodeHighlight();
  const tags = computed(() => props.post.post_tag?.map((pt) => pt.tag) ?? []);
  const author = computed(() => props.post.post_user?.[0]?.profile ?? null);

  const formattedDate = computed(() => {
    const date = props.post.published_at ?? props.post.created_at;
    return new Date(date).toISOString().split('T')[0];
  });
</script>

<template>
  <Breadcrumb :items="[{ label: 'Home', to: '/' }, { label: 'Posts', to: '/posts' }, { label: post.title }]" />
  <!-- Header -->
  <header class="mb-8">
    <h1 class="text-2xl font-bold text-default">
      <span class="text-primary mr-1">#</span>{{ post.title }}
    </h1>

    <p v-if="post.subtitle" class="mt-2 font-mono text-sm text-muted">
      {{ post.subtitle }}
    </p>

    <div class="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs text-dimmed">
      <time :datetime="post.published_at ?? post.created_at">{{ formattedDate }}</time>

      <template v-if="author">
        <span class="text-muted">·</span>
        <PostAuthor :profile="author" link />
      </template>

      <template v-if="tags.length">
        <span class="text-muted">·</span>
        <div class="flex flex-wrap gap-1.5">
          <TagBadge v-for="tag in tags" :key="tag.id" :tag="tag.name" />
        </div>
      </template>
    </div>
  </header>

  <div class="font-mono text-xs text-muted mb-8" aria-hidden="true">---</div>

  <!-- Content -->
  <div class="prose dark:prose-invert max-w-none">
    <UEditor
      :model-value="post.content"
      content-type="markdown"
      :editable="false"
      :starter-kit="{ link: { openOnClick: true }, codeBlock: false }"
      :extensions="codeHighlight"
      :ui="{ base: 'sm:px-0' }"
    />
  </div>
</template>

<style scoped>
  :deep(.ProseMirror) {
    padding: 0;
  }
</style>
