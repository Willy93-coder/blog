<script setup lang="ts">
  import { computed, toRefs } from 'vue';
  import type { DropdownMenuItem } from '@nuxt/ui';
  import UserMenuSkeleton from '../skeletons/UserMenuSkeleton.vue';

  const props = defineProps<{
    collapsed?: boolean;
    user: {
      github_username: string;
      github_avatar_url: string;
      full_name: string;
    } | null;
    onLogout: () => void | Promise<void>;
    loading: boolean;
  }>();

  const { collapsed, user, onLogout } = toRefs(props);
  const userFullName = computed(() => user.value?.full_name ?? 'User user');
  const avatar = computed(() =>
    user.value?.github_avatar_url
      ? { src: user.value.github_avatar_url, alt: user.value.full_name ?? 'User' }
      : undefined,
  );
  const githubUserUrl = computed(() =>
    user.value?.github_username ? `https://www.github.com/${user.value?.github_username}` : undefined,
  );
  const colorMode = useColorMode();

  const items = computed<DropdownMenuItem[][]>(() => [
    [
      {
        type: 'label',
        label: userFullName.value,
        avatar: avatar.value,
      },
    ],
    [
      {
        label: 'Appearance',
        icon: 'i-lucide-sun-moon',
        children: [
          {
            label: 'Light',
            icon: 'i-lucide-sun',
            type: 'checkbox',
            checked: colorMode.value === 'light',
            onSelect(e: Event) {
              e.preventDefault();

              colorMode.value = 'light';
            },
          },
          {
            label: 'Dark',
            icon: 'i-lucide-moon',
            type: 'checkbox',
            checked: colorMode.value === 'dark',
            onUpdateChecked(checked: boolean) {
              if (checked) {
                colorMode.value = 'dark';
              }
            },
            onSelect(e: Event) {
              e.preventDefault();
            },
          },
        ],
      },
    ],
    [
      {
        label: 'GitHub repository',
        icon: 'simple-icons:github',
        to: githubUserUrl.value,
        target: '_blank',
      },
    ],
    [
      {
        label: 'Log out',
        icon: 'i-lucide-log-out',
        async onSelect() {
          await onLogout.value();
        },
      },
    ],
  ]);
</script>

<template>
  <UserMenuSkeleton v-if="loading" />
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{
      content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)',
    }"
    v-else
  >
    <UButton
      v-bind="{
        ...(user ?? {}),
        label: collapsed ? undefined : userFullName,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :ui="{
        trailingIcon: 'text-dimmed',
      }"
    />
  </UDropdownMenu>
</template>
