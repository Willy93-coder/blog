<script setup lang="ts">
  import { toRefs } from 'vue';
  import * as z from 'zod';
  import type { FormSubmitEvent } from '@nuxt/ui';
  import type { ActionResult } from '~/types/result';

  const tagSchema = z.object({
    name: z.string().min(1, 'Required').min(2, 'Must be at least 2 characters'),
  });

  type CreateTagInput = z.output<typeof tagSchema>;

  const props = defineProps<{
    callback: (input: CreateTagInput) => Promise<ActionResult>;
  }>();

  const { callback } = toRefs(props);

  const formState = reactive<CreateTagInput>({
    name: '',
  });

  type UiState = {
    loading: boolean;
    error: string | null;
  };

  const uiState = reactive<UiState>({
    loading: false,
    error: null,
  });

  const toast = useToast();
  const onSubmit = async (event: FormSubmitEvent<CreateTagInput>) => {
    if (uiState.loading) return;
    uiState.loading = true;
    uiState.error = null;
    try {
      const { error } = await callback.value({ name: event.data.name });
      uiState.error = error;
      if (uiState.error !== null) {
        toast.add({ title: 'Error', description: 'The tag has not been created. Please try again', color: 'error' });
        return;
      }
      formState.name = '';
      toast.add({ title: 'Success', description: 'The tag has been created.', color: 'success' });
    } catch (err) {
      if (err instanceof Error) {
        uiState.error = err.message;
      } else {
        uiState.error = 'Unknown error';
      }
      toast.add({ title: 'Error', description: 'The tag has not been created. Please try again', color: 'error' });
    } finally {
      uiState.loading = false;
    }
  };
</script>

<template>
  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Create Tag</h3>
  <UForm :schema="tagSchema" :state="formState" @submit="onSubmit">
    <UFormField label="Tag" name="name" required class="mb-2">
      <UInput v-model="formState.name" :disabled="uiState.loading" placeholder="Enter tag" />
    </UFormField>
    <UButton type="submit" :loading="uiState.loading">Create</UButton>
  </UForm>
</template>
