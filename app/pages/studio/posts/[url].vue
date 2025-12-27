<script setup lang="ts">
definePageMeta({
  layout: "studio",
});

const route = useRoute();

const url = route.params.url as string;
</script>

<template>
  <h1>Post URL: {{ url }}</h1>
</template>
