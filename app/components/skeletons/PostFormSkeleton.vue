<template>
  <div class="space-y-6">
    <!-- Top row: metadata cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Post Details -->
      <div class="border border-accented rounded-lg overflow-hidden">
        <div class="px-4 py-3 border-b border-accented">
          <USkeleton class="h-4 w-24 rounded" />
        </div>
        <div class="p-4 space-y-4">
          <div class="space-y-1.5">
            <USkeleton class="h-3.5 w-10 rounded" />
            <USkeleton class="h-9 w-full rounded-md" />
          </div>
          <div class="space-y-1.5">
            <USkeleton class="h-3.5 w-14 rounded" />
            <USkeleton class="h-20 w-full rounded-md" />
          </div>
        </div>
      </div>

      <!-- Tags -->
      <div class="border border-accented rounded-lg overflow-hidden">
        <div class="px-4 py-3 border-b border-accented">
          <USkeleton class="h-4 w-10 rounded" />
        </div>
        <div class="p-4 space-y-3">
          <USkeleton class="h-9 w-full rounded-md" />
          <div class="flex flex-wrap gap-2">
            <USkeleton class="h-6 w-16 rounded-full" />
            <USkeleton class="h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>

      <!-- Post Info -->
      <div class="border border-accented rounded-lg overflow-hidden">
        <div class="px-4 py-3 border-b border-accented">
          <USkeleton class="h-4 w-16 rounded" />
        </div>
        <div class="p-4 space-y-3">
          <div class="flex items-center justify-between">
            <USkeleton class="h-3.5 w-12 rounded" />
            <USkeleton class="h-5 w-16 rounded-full" />
          </div>
          <div class="flex items-center justify-between">
            <USkeleton class="h-3.5 w-20 rounded" />
            <USkeleton class="h-3.5 w-24 rounded" />
          </div>
          <USkeleton class="h-px w-full" />
          <div class="flex items-center justify-between">
            <USkeleton class="h-3.5 w-14 rounded" />
            <USkeleton class="h-3.5 w-24 rounded" />
          </div>
          <div class="flex items-center justify-between">
            <USkeleton class="h-3.5 w-14 rounded" />
            <USkeleton class="h-3.5 w-24 rounded" />
          </div>
        </div>
      </div>
    </div>

    <!-- Content editor -->
    <div class="border border-accented rounded-lg overflow-hidden">
      <div class="px-4 py-3 border-b border-accented">
        <USkeleton class="h-4 w-16 rounded" />
        <USkeleton class="h-3 w-48 rounded mt-1" />
      </div>
      <div class="p-4">
        <USkeleton class="h-96 w-full rounded-md" />
      </div>
    </div>
  </div>
</template>
