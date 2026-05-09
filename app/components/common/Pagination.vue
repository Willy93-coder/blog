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
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-6 font-mono text-xs text-muted">
    <button
      :disabled="page === 1"
      @click="emit('changePage', page - 1)"
      class="cursor-pointer transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
    >
      [← prev]
    </button>

    <span class="text-dimmed">{{ page }}/{{ totalPages }}</span>

    <button
      :disabled="page === totalPages"
      @click="emit('changePage', page + 1)"
      class="cursor-pointer transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
    >
      [next →]
    </button>
  </div>
</template>
