<script setup lang="ts">
  import type { PostWithTags } from '~/types/post';
  import TagBadge from '../tags/TagBadge.vue';

  const props = defineProps<{
    post: PostWithTags;
  }>();

  const tags = computed(() => props.post.post_tag?.map((pt) => pt.tag) ?? []);

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
  <article class="mx-auto max-w-3xl px-4 py-12">
    <!-- Header -->
    <header class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
        {{ post.title }}
      </h1>

      <p v-if="post.subtitle" class="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
        {{ post.subtitle }}
      </p>

      <div class="mt-4 flex flex-wrap items-center gap-3">
        <time :datetime="post.published_at ?? post.created_at" class="text-sm text-zinc-400 dark:text-zinc-500">
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
  </article>
</template>
