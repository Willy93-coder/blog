<script setup lang="ts">
  import TagList from '~/components/tags/TagList.vue';
  import type { Tag } from '~/types/tag';

  definePageMeta({
    public: true,
    layout: 'blog',
  });

  const { getTags } = useTags();
  const toast = useToast();

  const { data: tags } = await useAsyncData<Tag[]>('public-tags', async () => {
    const { data, error } = await getTags();
    if (error !== null) {
      toast.add({ title: 'Error', description: 'Could not load tags. Please try again.', color: 'error' });
      return [];
    }
    return data;
  });
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <section>
      <p class="font-mono text-xs text-dimmed mb-3">$ ls ~/tags</p>
      <h1 class="text-2xl font-bold text-highlighted leading-tight">
        <span class="text-primary">></span> tags
      </h1>
    </section>

    <TagList :tags="tags ?? []" fallbackText="# No tags yet." />
  </div>
</template>
