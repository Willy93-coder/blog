<template>
  <div class="space-y-4 w-full">
    <div class="flex w-full space-x-2 items-start">
      <!-- Title input skeleton -->
      <div class="flex-1">
        <USkeleton class="h-10 w-full rounded-md animate-pulse" aria-label="Loading title input" />
      </div>

      <!-- Action buttons skeleton -->
      <div class="flex items-center justify-between gap-2">
        <USkeleton class="h-10 w-40 rounded-md animate-pulse" aria-label="Loading save button" />
        <USkeleton class="h-10 w-40 rounded-md animate-pulse" aria-label="Loading publish button" />
      </div>
    </div>

    <!-- Subtitle input skeleton -->
    <USkeleton class="h-10 w-full rounded-md animate-pulse" aria-label="Loading subtitle input" />

    <!-- Content textarea skeleton -->
    <USkeleton class="h-64 w-full rounded-md animate-pulse" aria-label="Loading content editor" />
  </div>
</template>
