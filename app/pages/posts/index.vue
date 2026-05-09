<script setup lang="ts">
  import PostList from '~/components/posts/PostList.vue';
  import Pagination from '~/components/common/Pagination.vue';
  import type { PostWithTagsAndAuthors } from '~/types/post';

  definePageMeta({
    public: true,
    layout: 'blog',
  });

  const PAGE_SIZE = 5;

  const route = useRoute();
  const router = useRouter();
  const postFunctions = usePosts();
  const toast = useToast();
  const routes = useRoutes();

  const page = computed(() => Number(route.query.page) || 1);
  const tagName = computed(() => (route.query.tag as string) || null);

  const { data: result } = await useAsyncData<{ posts: PostWithTagsAndAuthors[]; totalPages: number }>(
    () => `published-posts-${page.value}-${tagName.value ?? ''}`,
    async () => {
      const { data, error } = await postFunctions.getPublishedPostsWithTags({
        page: page.value,
        pageSize: PAGE_SIZE,
        tagName: tagName.value,
      });
      if (error !== null) {
        toast.add({ title: 'Error', description: 'Could not load posts. Please try again.', color: 'error' });
        return { posts: [], totalPages: 1 };
      }
      return { posts: data.posts, totalPages: Math.max(1, Math.ceil(data.total / PAGE_SIZE)) };
    },
  );

  const posts = computed(() => result.value?.posts ?? []);
  const totalPages = computed(() => result.value?.totalPages ?? 1);

  const changePage = (newPage: number) => {
    router.push({ query: { ...route.query, page: newPage } });
  };
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <section>
      <p class="font-mono text-xs text-dimmed mb-3">
        $ ls ~/posts<template v-if="tagName"> --tag={{ tagName }}</template>
      </p>
      <div class="flex items-end justify-between gap-4">
        <h1 class="text-2xl font-bold text-highlighted leading-tight">
          <span class="text-primary">></span> <template v-if="tagName">posts / <span class="text-primary">[{{ tagName }}]</span></template><template v-else>posts</template>
        </h1>
        <NuxtLink
          v-if="tagName"
          :to="routes.posts()"
          class="font-mono text-xs text-dimmed hover:text-primary transition-colors shrink-0"
        >
          [clear filter]
        </NuxtLink>
      </div>
    </section>

    <PostList :posts="posts" fallbackText="# No posts published yet." />

    <Pagination :page="page" :total-pages="totalPages" @change-page="changePage" />
  </div>
</template>
