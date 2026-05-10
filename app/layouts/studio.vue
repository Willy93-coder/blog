<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui';
  import UserMenu from '~/components/common/UserMenu.vue';
  import StudioPageSkeleton from '~/components/skeletons/StudioPageSkeleton.vue';

  const { profile, fetchUserProfile, loading } = useUserProfile();

  onMounted(() => {
    if (!profile.value) {
      fetchUserProfile();
    }
  });

  const user = computed(() => profile.value ?? null);

  const routes = useRoutes();
  const route = useRoute();

  const logout = async () => {
    const toast = useToast();
    const authService = useAuth();
    const { error } = await authService.signOut();

    if (error !== null) {
      toast.add({
        title: 'Uh oh! Something went wrong.',
        description: "There was a problem when you've tried to do logout.",
        icon: 'i-lucide-log-out',
      });
      return;
    }

    toast.add({
      title: 'Logout successful',
      description: 'You have safely logged out of your account.',
      icon: 'i-lucide-log-out',
    });

    navigateTo(routes.login());
  };

  const items: NavigationMenuItem[][] = [
    [
      {
        label: 'Posts',
        icon: 'i-lucide-newspaper',
        to: routes.studioPosts(),
        defaultOpen: true,
        children: [
          {
            label: 'All Posts',
            to: routes.studioPosts(),
          },
          {
            label: 'Add New',
            to: routes.studioPostsNew(),
          },
        ],
      },
      {
        label: 'Tags',
        icon: 'i-lucide-tag',
        to: routes.studioTags(),
      },
    ],
    [
      {
        label: 'Public Site',
        icon: 'i-lucide-globe',
        to: 'http://localhost:3000/',
        target: '_blank',
      },
    ],
  ];

  const breadcrumbItems = computed(() => {
    const baseUrl = '/studio';
    const paths = route.path.replace(baseUrl, '').split('/').filter(Boolean);

    const items = paths.map((path, index) => {
      const to = baseUrl + '/' + paths.slice(0, index + 1).join('/');

      return {
        label: decodeURIComponent(path.charAt(0).toUpperCase() + path.slice(1)),
        to,
      };
    });

    return [{ label: 'Studio', to: routes.studio() }, ...items];
  });
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      collapsible
      resizable
      :ui="{
        root: 'overflow-hidden bg-elevated',
        footer: 'border-t border-default',
      }"
    >
      <template #header="{ collapsed }">
        <Transition name="sidebar-fade" mode="out-in">
          <ULink v-if="!collapsed" :to="routes.studio()" class="flex items-center gap-2 overflow-hidden">
            <UIcon name="i-lucide-square-pen" class="size-5 text-primary shrink-0" />
            <span class="text-primary font-bold text-sm uppercase truncate">Blog Studio</span>
          </ULink>
          <ULink v-else :to="routes.studio()" class="flex justify-center mx-auto">
            <UIcon name="i-lucide-square-pen" class="size-5 text-primary" />
          </ULink>
        </Transition>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu :collapsed="collapsed" :items="items[0]" orientation="vertical" tooltip popover class="nav-primary-hover" />

        <UNavigationMenu :collapsed="collapsed" :items="items[1]" orientation="vertical" class="mt-auto nav-primary-hover" />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" :user="user" :onLogout="logout" :loading="loading" />
      </template>
    </UDashboardSidebar>
    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar :ui="{ root: 'bg-elevated' }">
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>
          <template #trailing>
            <UBreadcrumb :items="breadcrumbItems">
              <template #separator>
                <span class="mx-2 text-muted">/</span>
              </template>
            </UBreadcrumb>
          </template>
        </UDashboardNavbar>
      </template>
      <template #body>
        <div class="flex-1">
          <StudioPageSkeleton v-if="loading" />
          <slot v-else />
        </div>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>

<style scoped>
/* Width transition via :deep so we can scope the media query */
:deep([data-slot="root"]) {
  transition: width 200ms ease-in-out;
  will-change: width;
}

/* Enter: ease-out, slide in from left + fade */
.sidebar-fade-enter-active {
  transition: opacity 180ms ease-out, transform 180ms ease-out;
}
/* Leave: ease-in, exit faster than enter (≈60%) */
.sidebar-fade-leave-active {
  transition: opacity 110ms ease-in, transform 110ms ease-in;
}
.sidebar-fade-enter-from {
  opacity: 0;
  transform: translateX(-8px);
}
.sidebar-fade-leave-to {
  opacity: 0;
  transform: translateX(-4px);
}

/* Green hover on nav links — consistent with primary ghost button */
:deep(.nav-primary-hover [data-slot="link"]:hover) {
  color: var(--ui-primary);
}
:deep(.nav-primary-hover [data-slot="link"]:hover::before) {
  background-color: color-mix(in oklch, var(--ui-primary) 10%, transparent);
}
:deep(.nav-primary-hover [data-slot="link"]:hover [data-slot="linkLeadingIcon"]) {
  color: var(--ui-primary);
}
:deep(.nav-primary-hover [data-slot="childLink"]:hover) {
  color: var(--ui-primary);
}
:deep(.nav-primary-hover [data-slot="childLink"]:hover::before) {
  background-color: color-mix(in oklch, var(--ui-primary) 10%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  :deep([data-slot="root"]) {
    transition: none;
    will-change: auto;
  }
  .sidebar-fade-enter-active,
  .sidebar-fade-leave-active {
    transition: opacity 100ms linear;
  }
  .sidebar-fade-enter-from,
  .sidebar-fade-leave-to {
    transform: none;
  }
}
</style>
