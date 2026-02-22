<script setup lang="ts">
  import { usePostFormStore } from '~/stores/postFormStore';
  import RichTextEditor from '../common/RichTextEditor.vue';
  import PostTagSection from './PostTagSection.vue';

  const postFormStore = usePostFormStore();
  const { profile } = useUserProfile();

  const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };
</script>

<template>
  <div class="space-y-6">
    <!-- Top row: metadata cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Post Details -->
      <div class="border border-accented rounded-lg overflow-hidden">
        <div class="px-4 py-3 border-b border-accented">
          <h3 class="text-sm font-semibold">Post Details</h3>
          <p class="text-xs text-muted mt-0.5">Title and subtitle of your post.</p>
        </div>
        <div class="p-4 space-y-4">
          <UFormField
            label="Title"
            required
            :error="postFormStore.uiState.status === 'error' && postFormStore.uiState.errors?.title"
          >
            <UInput
              v-model="postFormStore.form.title"
              class="w-full"
              placeholder="My awesome post..."
              :disabled="postFormStore.uiState.status === 'submitting'"
            />
          </UFormField>
          <UFormField
            label="Subtitle"
            description="Optional — shown as a brief summary below the title."
            :error="postFormStore.uiState.status === 'error' && postFormStore.uiState.errors?.subtitle"
          >
            <UTextarea
              v-model="postFormStore.form.subtitle"
              class="w-full"
              placeholder="A brief description of your post..."
              :disabled="postFormStore.uiState.status === 'submitting'"
              :rows="3"
              autoresize
            />
          </UFormField>
        </div>
      </div>

      <!-- Tags -->
      <PostTagSection :post-id="postFormStore.originalPost.id" />

      <!-- Post Info -->
      <div class="border border-accented rounded-lg overflow-hidden">
        <div class="px-4 py-3 border-b border-accented">
          <h3 class="text-sm font-semibold">Post Info</h3>
          <p class="text-xs text-muted mt-0.5">Author, status and publication dates.</p>
        </div>
        <div class="p-4 space-y-3">
          <div v-if="profile" class="flex items-center gap-3">
            <UAvatar
              :src="profile.github_avatar_url ?? undefined"
              :alt="profile.full_name ?? profile.github_username ?? 'Author'"
              size="sm"
            />
            <div class="min-w-0">
              <p class="text-sm font-medium truncate">{{ profile.full_name ?? profile.github_username }}</p>
              <p v-if="profile.github_username" class="text-xs text-muted truncate">@{{ profile.github_username }}</p>
            </div>
          </div>
          <USeparator v-if="profile" />
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted">Status</span>
            <UBadge
              :color="postFormStore.originalPost.published ? 'success' : 'neutral'"
              variant="subtle"
            >
              {{ postFormStore.originalPost.published ? 'Published' : 'Draft' }}
            </UBadge>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted">Published at</span>
            <span class="text-sm">{{ formatDate(postFormStore.originalPost.published_at) }}</span>
          </div>
          <USeparator />
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted">Created</span>
            <span class="text-sm">
              {{ postFormStore.originalPost.id ? formatDate(postFormStore.originalPost.created_at) : today }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted">Updated</span>
            <span class="text-sm">
              {{ postFormStore.originalPost.id ? formatDate(postFormStore.originalPost.updated_at) : today }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Content editor — full width, last -->
    <div class="border border-accented rounded-lg overflow-hidden">
      <div class="px-4 py-3 border-b border-accented">
        <h3 class="text-sm font-semibold">Post Content <span class="text-error">*</span></h3>
        <p class="text-xs text-muted mt-0.5">Write your post using the rich text editor below.</p>
      </div>
      <RichTextEditor
        v-model="postFormStore.form.content"
        :disabled="postFormStore.uiState.status === 'submitting'"
        placeholder="Start writing your post..."
      />
      <p
        v-if="postFormStore.uiState.status === 'error' && postFormStore.uiState.errors?.content"
        class="px-4 pb-3 text-xs text-error"
      >
        {{ postFormStore.uiState.errors?.content }}
      </p>
    </div>
  </div>
</template>
