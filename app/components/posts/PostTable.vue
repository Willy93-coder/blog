<script setup lang="ts">
  import { h, resolveComponent } from 'vue';
  import type { TableColumn } from '@nuxt/ui';
  import type { PostWithTags } from '~/types/post';
  import { useRoutes } from '~/composables/useRoutes';

  const props = defineProps<{
    postList: PostWithTags[];
  }>();

  const emit = defineEmits<{
    delete: [ids: string[]];
    publish: [id: string];
    unpublish: [id: string];
  }>();

  const routes = useRoutes();

  const UCheckbox = resolveComponent('UCheckbox');
  const UBadge = resolveComponent('UBadge');
  const UButton = resolveComponent('UButton');

  // Delete modal state
  const isDeleteModalOpen = ref(false);
  const pendingDeleteIds = ref<string[]>([]);

  const deleteModalDescription = computed(() => {
    if (pendingDeleteIds.value.length === 1) {
      const post = props.postList.find((p) => p.id === pendingDeleteIds.value[0]);
      return `Are you sure you want to delete the post "${post?.title ?? ''}"? This action cannot be undone.`;
    }
    return `Are you sure you want to delete ${pendingDeleteIds.value.length} posts? This action cannot be undone.`;
  });

  const openDeleteModal = (ids: string[]) => {
    pendingDeleteIds.value = ids;
    isDeleteModalOpen.value = true;
  };

  const onDeleteConfirm = () => {
    emit('delete', pendingDeleteIds.value);
    rowSelection.value = {};
    isDeleteModalOpen.value = false;
  };

  const columns: TableColumn<PostWithTags>[] = [
    {
      id: 'select',
      header: ({ table }) =>
        h(UCheckbox, {
          modelValue: table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
          'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
          'aria-label': 'Select all',
        }),
      cell: ({ row }) =>
        h(UCheckbox, {
          modelValue: row.getIsSelected(),
          'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
          'aria-label': 'Select row',
        }),
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => h('span', { class: 'font-medium truncate max-w-xs block' }, row.getValue('title')),
    },
    {
      id: 'tags',
      header: 'Tags',
      cell: ({ row }) => {
        const tags = row.original.post_tag?.map((pt) => pt.tag) ?? [];
        if (!tags.length) return h('span', { class: 'text-muted text-sm' }, '—');
        return h(
          'div',
          { class: 'flex flex-wrap gap-1' },
          tags.map((tag) =>
            h(UBadge, { key: tag.id, variant: 'outline', color: 'neutral', size: 'sm' }, () => tag.name),
          ),
        );
      },
    },
    {
      accessorKey: 'published',
      header: 'Published',
      cell: ({ row }) => {
        const published = row.getValue('published') as boolean;
        return h(UBadge, { variant: 'subtle', color: published ? 'success' : 'info' }, () =>
          published ? 'Published' : 'Unpublished',
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) =>
        h('span', { class: 'text-sm text-muted' }, new Date(row.getValue('created_at')).toLocaleDateString()),
    },
    {
      accessorKey: 'updated_at',
      header: 'Updated',
      cell: ({ row }) =>
        h('span', { class: 'text-sm text-muted' }, new Date(row.getValue('updated_at')).toLocaleDateString()),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const post = row.original;
        return h('div', { class: 'flex items-center gap-2' }, [
          h(UButton, {
            icon: 'i-lucide-pencil',
            size: 'sm',
            variant: 'ghost',
            color: 'neutral',
            'aria-label': 'Edit post',
            onClick: () => navigateTo(routes.studioPostEdit(post.id)),
          }),
          h(UButton, {
            icon: post.published ? 'i-lucide-book-lock' : 'i-lucide-book-open-check',
            size: 'sm',
            variant: 'ghost',
            color: post.published ? 'secondary' : 'success',
            'aria-label': post.published ? 'Unpublish post' : 'Publish post',
            onClick: () => (post.published ? emit('unpublish', post.id) : emit('publish', post.id)),
          }),
          h(UButton, {
            icon: 'i-lucide-trash-2',
            size: 'sm',
            variant: 'ghost',
            color: 'error',
            'aria-label': 'Delete post',
            onClick: () => openDeleteModal([post.id]),
          }),
        ]);
      },
    },
  ];

  const table = useTemplateRef('table');
  const rowSelection = ref({});

  const selectedIds = computed(
    () =>
      Object.keys(rowSelection.value)
        .filter((key) => (rowSelection.value as Record<string, boolean>)[key])
        .map((key) => props.postList[parseInt(key)]?.id)
        .filter(Boolean) as string[],
  );

  const onDelete = () => {
    openDeleteModal(selectedIds.value);
  };
</script>

<template>
  <div class="border border-accented rounded-lg overflow-hidden">
    <div class="px-4 py-3 border-b border-accented flex items-center justify-end min-h-13">
      <UButton
        v-if="selectedIds.length > 0"
        color="error"
        variant="soft"
        icon="i-lucide-trash-2"
        size="sm"
        @click="onDelete"
      >
        Delete selected ({{ selectedIds.length }})
      </UButton>
    </div>
    <UTable
      sticky
      ref="table"
      v-model:row-selection="rowSelection"
      :data="postList"
      :columns="columns"
      class="flex-1 max-h-[60vh]"
    />
    <div class="px-4 py-3 border-t border-accented">
      <span class="text-sm text-muted">
        {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
        {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
      </span>
    </div>
  </div>

  <UModal v-model:open="isDeleteModalOpen" title="Delete Post" :description="deleteModalDescription">
    <template #footer>
      <UButton variant="ghost" color="neutral" @click="isDeleteModalOpen = false">Cancel</UButton>
      <UButton color="error" icon="i-lucide-trash-2" @click="onDeleteConfirm">Delete</UButton>
    </template>
  </UModal>
</template>
