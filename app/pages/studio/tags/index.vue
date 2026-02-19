<script setup lang="ts">
  import { ref } from 'vue';
  import TagForm from '~/components/tags/TagForm.vue';
  import TagTable from '~/components/tags/TagTable.vue';
  import { useTags } from '~/composables/useTags';
  import type { ActionResult } from '~/types/result';
  import type { CreateTagInput, Tag } from '~/types/tag';

  definePageMeta({
    layout: 'studio',
  });

  const tagFunctions = useTags();
  const toast = useToast();

  const tagList = ref<Tag[]>([]);

  const fetchTags = async () => {
    try {
      const { data, error } = await tagFunctions.getTags();
      if (error !== null) {
        toast.add({ title: 'Error', description: 'Error to get tags. Please try again', color: 'error' });
        tagList.value = [];
        return;
      }
      tagList.value = data;
    } catch (err) {
      tagList.value = [];
      toast.add({ title: 'Error', description: 'Error to get tags. Please try again', color: 'error' });
    }
  };

  onMounted(fetchTags);

  const onCreateTag = async (input: CreateTagInput): Promise<ActionResult> => {
    const result = await tagFunctions.createTag(input);
    if (result.error === null) {
      await fetchTags();
    }
    return result;
  };

  const onDeleteTags = async (ids: string[]) => {
    const result = await tagFunctions.deleteTags(ids);
    if (result.error === null) {
      await fetchTags();
    } else {
      toast.add({ title: 'Error', description: 'Error deleting tags. Please try again', color: 'error' });
    }
  };

  const onUpdateTag = async (id: string, name: string) => {
    const result = await tagFunctions.updateTag({ id, name });
    if (result.error === null) {
      await fetchTags();
      toast.add({ title: 'Success', description: 'Tag updated successfully.', color: 'success' });
    } else {
      toast.add({ title: 'Error', description: 'Error updating tag. Please try again', color: 'error' });
    }
  };
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Tags</h1>
      <p class="text-sm text-muted mt-1">Manage the tags used across your blog posts.</p>
    </div>
    <TagForm :callback="onCreateTag" />
    <TagTable :tagList="tagList" @delete="onDeleteTags" @update="onUpdateTag" />
  </div>
</template>
