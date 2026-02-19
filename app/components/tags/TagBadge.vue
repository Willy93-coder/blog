<script setup lang="ts">
  const props = defineProps<{
    tag: string;
  }>();
</script>

<template>
  <UBadge color="neutral" variant="outline">{{ tag }}</UBadge>
</template>
