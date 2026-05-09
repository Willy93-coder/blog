<script setup lang="ts">
  import type { Post } from '~/types/post';
  import type { Tag } from '~/types/tag';
  import { useRoutes } from '~/composables/useRoutes';

  definePageMeta({
    layout: 'studio',
  });

  const toast = useToast();
  const route = useRoute();
  const router = useRouter();
  const routes = useRoutes();
  const postFunctions = usePosts();
  const tagFunctions = useTags();

  const posts = ref<Post[]>([]);
  const tags = ref<Tag[]>([]);
  const loading = ref(true);

  onMounted(async () => {
    if (route.query.toast === 'login_success') {
      toast.add({
        title: 'Welcome!',
        description: "You're now logged in.",
        icon: 'i-lucide-log-in',
      });
      router.replace({ path: route.path, query: {} });
    }

    const [postsResult, tagsResult] = await Promise.all([
      postFunctions.getPosts(),
      tagFunctions.getTags(),
    ]);

    posts.value = postsResult.data;
    tags.value = tagsResult.data;
    loading.value = false;
  });

  const totalPosts = computed(() => posts.value.length);
  const publishedPosts = computed(() => posts.value.filter((p) => p.published).length);
  const draftPosts = computed(() => posts.value.filter((p) => !p.published).length);
  const totalTags = computed(() => tags.value.length);

  const recentPosts = computed(() => posts.value.slice(0, 5));

  const stats = computed(() => [
    { label: 'TOTAL POSTS', value: totalPosts.value, icon: 'i-lucide-file-text', to: routes.studioPosts() },
    { label: 'PUBLISHED', value: publishedPosts.value, icon: 'i-lucide-book-open', to: routes.studioPosts() },
    { label: 'DRAFTS', value: draftPosts.value, icon: 'i-lucide-file-edit', to: routes.studioPosts() },
    { label: 'TAGS', value: totalTags.value, icon: 'i-lucide-tag', to: routes.studioTags() },
  ]);
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-xl font-bold text-highlighted">
        <span class="text-primary mr-1">#</span>Dashboard
      </h1>
      <p class="font-mono text-xs text-muted mt-1">Overview of your blog.</p>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <NuxtLink
        v-for="stat in stats"
        :key="stat.label"
        :to="stat.to"
        class="border border-accented bg-elevated p-4 flex flex-col gap-3 hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs text-muted font-mono tracking-wider">{{ stat.label }}</span>
          <UIcon :name="stat.icon" class="size-4 text-primary" />
        </div>
        <span v-if="loading" class="text-2xl font-bold text-highlighted">--</span>
        <span v-else class="text-2xl font-bold text-highlighted font-mono">{{ stat.value }}</span>
      </NuxtLink>
    </div>

    <!-- Recent posts + Quick actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Recent posts -->
      <div class="lg:col-span-2 border border-accented bg-elevated">
        <div class="px-4 py-3 border-b border-accented flex items-center justify-between">
          <span class="text-xs font-mono text-muted tracking-wider uppercase">Recent Posts</span>
          <NuxtLink
            :to="routes.studioPosts()"
            class="text-xs text-primary hover:underline underline-offset-4 font-mono focus-visible:outline-2 focus-visible:outline-primary"
          >
            view all →
          </NuxtLink>
        </div>

        <div v-if="loading" class="divide-y divide-muted">
          <div v-for="n in 5" :key="n" class="px-4 py-3 flex items-center justify-between gap-4">
            <USkeleton class="h-4 w-48" />
            <USkeleton class="h-4 w-20" />
          </div>
        </div>

        <div v-else-if="recentPosts.length === 0" class="px-4 py-8 text-center">
          <span class="text-xs text-dimmed font-mono">no posts yet</span>
        </div>

        <div v-else class="divide-y divide-muted">
          <NuxtLink
            v-for="post in recentPosts"
            :key="post.id"
            :to="routes.studioPostEdit(post.id)"
            class="px-4 py-3 flex items-center justify-between gap-4 hover:bg-primary/5 hover:text-primary transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span class="text-sm text-default truncate group-hover:text-primary transition-colors">
              {{ post.title || '(untitled)' }}
            </span>
            <div class="flex items-center gap-3 shrink-0">
              <span class="text-xs text-dimmed font-mono">
                {{ new Date(post.created_at).toISOString().split('T')[0] }}
              </span>
              <UBadge
                :color="post.published ? 'success' : 'neutral'"
                variant="subtle"
                size="xs"
              >
                {{ post.published ? 'pub' : 'draft' }}
              </UBadge>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="border border-accented bg-elevated">
        <div class="px-4 py-3 border-b border-accented">
          <span class="text-xs font-mono text-muted tracking-wider uppercase">Quick Actions</span>
        </div>
        <div class="p-4 flex flex-col gap-2">
          <UButton
            :to="routes.studioPostsNew()"
            icon="i-lucide-plus"
            variant="outline"
            color="primary"
            class="w-full justify-start"
          >
            New Post
          </UButton>
          <UButton
            :to="routes.studioPosts()"
            icon="i-lucide-file-text"
            variant="ghost"
            color="neutral"
            class="w-full justify-start hover:text-primary hover:bg-primary/10"
          >
            All Posts
          </UButton>
          <UButton
            :to="routes.studioTags()"
            icon="i-lucide-tag"
            variant="ghost"
            color="neutral"
            class="w-full justify-start hover:text-primary hover:bg-primary/10"
          >
            Manage Tags
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
