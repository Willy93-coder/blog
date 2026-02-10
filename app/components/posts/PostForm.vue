<script setup lang="ts">
  import type { PostActionType } from '~/types/post';
  import { usePostFormStore } from '~/stores/postFormStore';
  import RichTextEditor from '../common/RichTextEditor.vue';

  const postFormStore = usePostFormStore();
  const selectedAction = ref<PostActionType | null>(null);

  function onSubmit() {
    if (!selectedAction.value) return;

    postFormStore.submit(selectedAction.value);
    selectedAction.value = null;
  }
</script>

<template>
  <UForm class="space-y-4 w-full" @submit="onSubmit">
    <div class="flex w-full space-x-2 items-start">
      <UFormField
        :error="postFormStore.uiState.status === 'error' && postFormStore.uiState.errors?.title"
        class="flex-1"
      >
        <UInput
          v-model="postFormStore.form.title"
          class="w-full"
          size="xl"
          placeholder="Title"
          :disabled="postFormStore.uiState.status === 'submitting'"
        />
      </UFormField>
      <div class="flex items-center justify-between gap-2">
        <UButton
          v-for="action in postFormStore.actions"
          :key="action.type"
          type="submit"
          size="xl"
          :icon="action.icon"
          :color="action.color"
          :disabled="postFormStore.uiState.status === 'submitting'"
          :loading="postFormStore.uiState.status === 'submitting' && postFormStore.uiState.action === action.type"
          @click="selectedAction = action.type"
        >
          {{ action.label }}
        </UButton>
      </div>
    </div>
    <div>
      <RichTextEditor
        v-model="postFormStore.form.content"
        :disabled="postFormStore.uiState.status === 'submitting'"
        placeholder="Start writing your post..."
      />
    </div>
  </UForm>
</template>
