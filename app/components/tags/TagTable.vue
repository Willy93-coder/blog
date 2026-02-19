<script setup lang="ts">
  import type { Tag } from '~/types/tag';
  import { h, resolveComponent } from 'vue';
  import type { TableColumn, FormSubmitEvent } from '@nuxt/ui';
  import * as z from 'zod';

  const props = defineProps<{
    tagList: Tag[];
  }>();

  const emit = defineEmits<{
    delete: [ids: string[]];
    update: [id: string, name: string];
  }>();

  const UCheckbox = resolveComponent('UCheckbox');
  const UBadge = resolveComponent('UBadge');
  const UButton = resolveComponent('UButton');

  // Delete modal state
  const isDeleteModalOpen = ref(false);
  const pendingDeleteIds = ref<string[]>([]);

  const deleteModalDescription = computed(() => {
    if (pendingDeleteIds.value.length === 1) {
      const tag = props.tagList.find((t) => t.id === pendingDeleteIds.value[0]);
      return `Are you sure you want to delete the tag "${tag?.name ?? ''}"? This action cannot be undone.`;
    }
    return `Are you sure you want to delete ${pendingDeleteIds.value.length} tags? This action cannot be undone.`;
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

  // Edit modal state
  const isEditModalOpen = ref(false);
  const selectedTag = ref<Tag | null>(null);

  const editSchema = z.object({
    name: z.string().min(1, 'Required').min(2, 'Must be at least 2 characters'),
  });

  type EditTagInput = z.output<typeof editSchema>;

  const editState = reactive<EditTagInput>({ name: '' });

  const openEditModal = (tag: Tag) => {
    selectedTag.value = tag;
    editState.name = tag.name;
    isEditModalOpen.value = true;
  };

  const onEditSubmit = (event: FormSubmitEvent<EditTagInput>) => {
    if (!selectedTag.value) return;
    emit('update', selectedTag.value.id, event.data.name);
    isEditModalOpen.value = false;
  };

  const columns: TableColumn<Tag>[] = [
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
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        return h(UBadge, { variant: 'outline', color: 'neutral' }, () => row.getValue('name'));
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
    },
    {
      accessorKey: 'updated_at',
      header: 'Updated',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) =>
        h('div', { class: 'flex items-center gap-2' }, [
          h(UButton, {
            icon: 'i-lucide-pencil',
            size: 'sm',
            variant: 'ghost',
            color: 'neutral',
            'aria-label': 'Edit tag',
            onClick: () => openEditModal(row.original),
          }),
          h(UButton, {
            icon: 'i-lucide-trash-2',
            size: 'sm',
            variant: 'ghost',
            color: 'error',
            'aria-label': 'Delete tag',
            onClick: () => openDeleteModal([row.original.id]),
          }),
        ]),
    },
  ];

  const table = useTemplateRef('table');
  const rowSelection = ref({});

  const selectedIds = computed(
    () =>
      Object.keys(rowSelection.value)
        .filter((key) => (rowSelection.value as Record<string, boolean>)[key])
        .map((key) => props.tagList[parseInt(key)]?.id)
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
      :data="tagList"
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

  <UModal v-model:open="isDeleteModalOpen" title="Delete Tag" :description="deleteModalDescription">
    <template #footer>
      <UButton variant="ghost" color="neutral" @click="isDeleteModalOpen = false">Cancel</UButton>
      <UButton color="error" icon="i-lucide-trash-2" @click="onDeleteConfirm">Delete</UButton>
    </template>
  </UModal>

  <UModal v-model:open="isEditModalOpen" title="Edit Tag" description="Update the tag name below.">
    <template #body>
      <UForm :schema="editSchema" :state="editState" @submit="onEditSubmit">
        <UFormField name="name" label="Name" required>
          <UInput v-model="editState.name" placeholder="Tag name..." class="w-full" />
        </UFormField>
        <div class="flex justify-end gap-3 mt-4">
          <UButton variant="ghost" color="neutral" @click="isEditModalOpen = false">Cancel</UButton>
          <UButton type="submit">Save</UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
