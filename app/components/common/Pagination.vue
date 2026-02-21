<script setup lang="ts">
  defineProps<{
    page: number;
    totalPages: number;
  }>();

  const emit = defineEmits<{
    changePage: [page: number];
  }>();
</script>

<template>
  <div
    v-if="totalPages > 1"
    class="flex items-center justify-center gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400"
  >
    <button
      :disabled="page === 1"
      @click="emit('changePage', page - 1)"
      class="flex cursor-pointer items-center gap-1.5 transition-colors hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:text-zinc-100"
    >
      <UIcon name="i-lucide-arrow-left" class="size-4" />
      Prev
    </button>

    <span>{{ page }} / {{ totalPages }}</span>

    <button
      :disabled="page === totalPages"
      @click="emit('changePage', page + 1)"
      class="flex cursor-pointer items-center gap-1.5 transition-colors hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:text-zinc-100"
    >
      Next
      <UIcon name="i-lucide-arrow-right" class="size-4" />
    </button>
  </div>
</template>
