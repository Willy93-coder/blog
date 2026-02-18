<script setup lang="ts">
  import { ref } from 'vue';
  import TagBadge from '~/components/tags/TagBadge.vue';
  import TagForm from '~/components/tags/TagForm.vue';
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
</script>

<template>
  <div class="mb-4">
    <TagForm :callback="onCreateTag" />
  </div>
  <USeparator />
  <p v-if="tagList.length === 0" class="mt-4 text-sm text-gray-500">No tags</p>
  <div v-else class="mt-4 flex flex-wrap gap-2">
    <TagBadge v-for="tag in tagList" :key="tag.name" :tag="tag.name" />
  </div>
</template>
