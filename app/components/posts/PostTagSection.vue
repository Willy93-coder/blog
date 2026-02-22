<script setup lang="ts">
  import { useTags } from '~/composables/useTags';
  import { usePostFormStore } from '~/stores/postFormStore';

  const props = defineProps<{
    postId: string | undefined;
  }>();

  const tagFunctions = useTags();
  const postFunctions = usePosts();
  const postFormStore = usePostFormStore();

  const allTags = ref<{ id: string; name: string }[]>([]);
  const selectedTagId = ref<string | undefined>(undefined);

  // Always derived from the store — single source of truth
  const postTags = computed(() => allTags.value.filter((t) => postFormStore.pendingTagIds.includes(t.id)));

  const availableItems = computed(() =>
    allTags.value
      .filter((t) => !postFormStore.pendingTagIds.includes(t.id))
      .map((t) => ({ label: t.name, value: t.id })),
  );

  onMounted(async () => {
    const tagsResult = await tagFunctions.getTags();
    if (tagsResult.error === null) {
      allTags.value = tagsResult.data.map((t) => ({ id: t.id, name: t.name }));
    }

    // For existing posts, load current tags into the store
    if (props.postId) {
      const postTagsResult = await postFunctions.getTagsByPostId({ id: props.postId });
      if (postTagsResult.error === null) {
        postFormStore.initTags(postTagsResult.data.map((t) => t.id));
      }
    }
  });

  const addTag = () => {
    if (!selectedTagId.value) return;
    postFormStore.addPendingTag(selectedTagId.value);
    selectedTagId.value = undefined;
  };

  const removeTag = (tagId: string) => {
    postFormStore.removePendingTag(tagId);
  };
</script>

<template>
  <div class="border border-accented rounded-lg overflow-hidden">
    <div class="px-4 py-3 border-b border-accented">
      <h3 class="text-sm font-semibold">Post Tags</h3>
      <p class="text-xs text-muted mt-0.5">Associate tags with this post.</p>
    </div>
    <div class="p-4 space-y-3">
      <div class="flex items-end gap-3">
        <UFormField label="Tag" class="flex-1">
          <USelect
            v-model="selectedTagId"
            :items="availableItems"
            :placeholder="availableItems.length === 0 ? 'All tags added' : 'Select a tag...'"
            class="w-full"
            :disabled="availableItems.length === 0"
          />
        </UFormField>
        <UButton type="button" icon="i-lucide-plus" :disabled="!selectedTagId" class="mb-0.5" @click="addTag">
          Add
        </UButton>
      </div>
      <div v-if="postTags.length" class="flex flex-wrap gap-2">
        <div v-for="tag in postTags" :key="tag.id">
          <UBadge variant="outline" color="neutral" class="flex items-center gap-1.5 pr-1">
            {{ tag.name }}
            <UButton icon="i-lucide-x" size="xs" variant="ghost" color="neutral" @click="removeTag(tag.id)" />
          </UBadge>
        </div>
      </div>
      <p v-else class="text-xs text-muted">No tags added yet.</p>
    </div>
  </div>
</template>
