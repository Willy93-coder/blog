<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui';
  import UserMenu from '~/components/common/userMenu.vue';

  const { profile, fetchUserProfile } = useUserProfile();

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
        to: '/studio/posts',
        defaultOpen: true,
        children: [
          {
            label: 'All Posts',
            to: '/studio/posts',
          },
          {
            label: 'Add New',
            to: '/studio/posts/new',
          },
        ],
      },
      {
        label: 'Tags',
        icon: 'i-lucide-tag',
        to: '/studio/tags',
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

    return [{ label: 'Studio' }, ...items];
  });
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
          <span class="text-primary font-bold text-lg uppercase">Blog Studio</span>
        </div>
        <UIcon v-else name="i-simple-icons-nuxtdotjs" class="size-5 text-primary mx-auto" />
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu :collapsed="collapsed" :items="items[0]" orientation="vertical" tooltip popover />

        <UNavigationMenu :collapsed="collapsed" :items="items[1]" orientation="vertical" class="mt-auto" />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" :user="user" :onLogout="logout" />
      </template>
    </UDashboardSidebar>
    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar>
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
        <div class="border-2 border-dashed border-default rounded-md p-4 flex-1">
          <slot />
        </div>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
