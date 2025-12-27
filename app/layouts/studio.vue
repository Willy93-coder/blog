<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import UserMenu from "~/components/common/user-menu.vue";

const items: NavigationMenuItem[][] = [
  [
    {
      label: "Posts",
      icon: "i-lucide-newspaper",
      to: "/studio/posts",
      defaultOpen: true,
      children: [
        {
          label: "All Posts",
          to: "/studio/posts",
        },
        {
          label: "Add New",
          to: "/studio/posts/new",
        },
      ],
    },
    {
      label: "Tags",
      icon: "i-lucide-tag",
      to: "/studio/tags",
    },
  ],
  [
    {
      label: "Public Site",
      icon: "i-lucide-globe",
      to: "http://localhost:3000/",
      target: "_blank",
    },
  ],
];

const navbarTitle = "Blog Studio";
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      collapsible
      resizable
      :ui="{
        footer: 'border-t border-default',
      }"
    >
      <template #header="{ collapsed }">
        <div v-if="!collapsed" class="flex items-center gap-2">
          <UIcon name="i-simple-icons-nuxtdotjs" class="size-5 text-primary" />
          <span class="text-primary font-bold text-lg uppercase"
            >Blog Studio</span
          >
        </div>
        <UIcon
          v-else
          name="i-simple-icons-nuxtdotjs"
          class="size-5 text-primary mx-auto"
        />
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="items[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="items[1]"
          orientation="vertical"
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>
    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar :title="navbarTitle">
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>
        </UDashboardNavbar>
      </template>
      <template #body>
        <div
          class="border-2 border-dashed border-default rounded-md p-4 flex-1"
        >
          <slot />
        </div>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
