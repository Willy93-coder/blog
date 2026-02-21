<script setup lang="ts">
  import Breadcrumb from '~/components/common/Breadcrumb.vue';
  import PageHeader from '~/components/common/PageHeader.vue';
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
  <div class="mx-auto max-w-3xl px-4 py-10">
    <Breadcrumb :items="[{ label: 'Home', to: '/' }, { label: 'Tags' }]" />

    <PageHeader title="Tags" subtitle="Browse posts by topic." />

    <TagList :tags="tags ?? []" fallbackText="No tags yet." />
  </div>
</template>
