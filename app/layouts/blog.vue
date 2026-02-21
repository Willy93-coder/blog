<script setup lang="ts">
  import PublicFooter from '~/components/common/PublicFooter.vue';
  import PublicNavbar from '~/components/common/PublicNavbar.vue';
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <PublicNavbar />
    <main class="flex-1">
      <section class="mx-auto max-w-3xl px-4 py-12">
        <slot />
      </section>
    </main>
    <PublicFooter />
  </div>
</template>
