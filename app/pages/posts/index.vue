<script setup lang="ts">
  import PostList from '~/components/posts/PostList.vue';
  import Breadcrumb from '~/components/common/Breadcrumb.vue';
  import Pagination from '~/components/common/Pagination.vue';
  import PageHeader from '~/components/common/PageHeader.vue';
  import type { PostWithTags } from '~/types/post';

  definePageMeta({
    public: true,
    layout: 'blog',
  });

  const PAGE_SIZE = 5;

  const route = useRoute();
  const router = useRouter();
  const postFunctions = usePosts();
  const toast = useToast();

  const page = computed(() => Number(route.query.page) || 1);
  const tagName = computed(() => (route.query.tag as string) || null);

  const { data: result } = await useAsyncData<{ posts: PostWithTags[]; totalPages: number }>(
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
  <Breadcrumb
    v-if="tagName"
    :items="[{ label: 'Home', to: '/' }, { label: 'Posts', to: '/posts' }, { label: `#${tagName}` }]"
  />
  <Breadcrumb v-else :items="[{ label: 'Home', to: '/' }, { label: `Posts (Page ${page})` }]" />

  <PageHeader title="Posts" :subtitle="tagName ? `Posts tagged #${tagName}.` : `All the articles I've posted.`" />

  <PostList :posts="posts ?? []" fallbackText="No posts published yet." />

  <Pagination class="mt-auto pt-10" :page="page" :total-pages="totalPages" @change-page="changePage" />
</template>
