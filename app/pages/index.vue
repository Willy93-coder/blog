<script setup lang="ts">
  import PublicFooter from '~/components/common/PublicFooter.vue';
  import PublicNavbar from '~/components/common/PublicNavbar.vue';
  definePageMeta({
    public: true,
  });
</script>

<template>
  <PublicNavbar />
  <PublicFooter />
</template>
