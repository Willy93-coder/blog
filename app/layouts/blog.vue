<script setup lang="ts">
  import PublicFooter from '~/components/common/PublicFooter.vue';
  import PublicNavbar from '~/components/common/PublicNavbar.vue';
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-default focus:border focus:border-primary focus:text-primary focus:px-3 focus:py-1.5 focus:text-xs focus:font-mono"
    >
      Skip to main content
    </a>

    <PublicNavbar />

    <main id="main-content" class="flex-1">
      <section class="mx-auto max-w-3xl px-4 py-8">
        <slot />
      </section>
    </main>

    <PublicFooter />
  </div>
</template>
