<script setup lang="ts">
  import type { Tag } from '~/types/tag';
  import { h, resolveComponent } from 'vue';
  import type { TableColumn } from '@nuxt/ui';

  const props = defineProps<{
    tagList: Tag[];
  }>();

  const emit = defineEmits<{
    delete: [ids: string[]];
  }>();

  const UCheckbox = resolveComponent('UCheckbox');
  const UBadge = resolveComponent('UBadge');

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
    emit('delete', selectedIds.value);
    rowSelection.value = {};
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
</template>
