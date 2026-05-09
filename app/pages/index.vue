<script setup lang="ts">
  import type { PostWithTagsAndAuthors } from '~/types/post';

  definePageMeta({
    public: true,
    layout: 'blog',
  });

  const postFunctions = usePosts();
  const toast = useToast();
  const routes = useRoutes();

  const { data: posts } = await useAsyncData<PostWithTagsAndAuthors[]>('published-posts', async () => {
    const { data, error } = await postFunctions.getLimitPublishedPostsWithTags({ limit: 5 });
    if (error !== null) {
      toast.add({ title: 'Error', description: 'Could not load posts. Please try again.', color: 'error' });
      return [];
    }
    return data;
  });
</script>

<template>
  <div class="space-y-12">
    <!-- Hero -->
    <section class="pt-2 pb-2">
      <p class="font-mono text-xs text-dimmed mb-4">$ whoami</p>

      <h1 class="text-3xl font-bold text-highlighted mb-4 leading-tight">
        <span class="text-primary">></span> dev.log<span class="cursor text-primary">_</span>
      </h1>

      <p class="font-mono text-sm text-muted mb-8 leading-relaxed">
        Notes on web, code, and software craft.
      </p>

      <div class="flex flex-wrap items-center gap-3">
        <UButton :to="routes.posts()" icon="i-lucide-newspaper" size="sm">
          Browse Posts
        </UButton>
        <UButton
          :to="routes.tags()"
          variant="outline"
          color="neutral"
          icon="i-lucide-tag"
          size="sm"
          class="hover:bg-primary/20"
        >
          View Tags
        </UButton>
      </div>
    </section>

    <USeparator />

    <!-- Recent posts -->
    <section>
      <div class="flex items-end justify-between mb-5">
        <div>
          <p class="font-mono text-xs text-dimmed mb-1"># recent-posts.log</p>
          <h2 class="text-xs font-mono font-medium text-highlighted uppercase tracking-wider">Recent Posts</h2>
        </div>
        <NuxtLink
          :to="routes.posts()"
          class="inline-flex items-center gap-1 font-mono text-xs text-muted transition-colors hover:text-primary"
        >
          All posts
          <UIcon name="i-lucide-arrow-right" class="size-3.5" />
        </NuxtLink>
      </div>

      <div v-if="posts?.length" class="border border-accented bg-elevated overflow-hidden">
        <NuxtLink
          v-for="post in posts"
          :key="post.id"
          :to="routes.post(post.id)"
          class="group flex items-start justify-between gap-4 px-4 py-3.5 border-b border-accented last:border-b-0 transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary"
        >
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 mb-1.5">
              <span class="text-primary text-xs shrink-0">→</span>
              <span class="text-sm font-medium text-default truncate group-hover:text-primary transition-colors">
                {{ post.title }}
              </span>
            </div>
            <div v-if="post.post_tag?.length" class="flex flex-wrap gap-1 pl-4">
              <UBadge
                v-for="pt in post.post_tag.slice(0, 3)"
                :key="pt.tag.id"
                variant="outline"
                color="neutral"
                size="xs"
              >{{ pt.tag.name }}</UBadge>
            </div>
          </div>
          <span class="font-mono text-xs text-dimmed shrink-0 pt-0.5">
            {{ new Date(post.published_at ?? post.created_at).toISOString().split('T')[0] }}
          </span>
        </NuxtLink>
      </div>

      <p v-else class="font-mono text-xs text-dimmed"># No posts published yet.</p>
    </section>
  </div>
</template>

<style scoped>
.cursor {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .cursor {
    animation: none;
    opacity: 1;
  }
}
</style>
