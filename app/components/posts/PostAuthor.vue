<script setup lang="ts">
  const props = defineProps<{
    profile: {
      full_name: string | null;
      github_avatar_url: string | null;
      github_username: string | null;
    } | null;
    link?: boolean;
  }>();

  const githubUserUrl = computed(() =>
    props.link && props.profile?.github_username
      ? `https://www.github.com/${props.profile.github_username}`
      : undefined,
  );
</script>

<template>
  <component
    :is="githubUserUrl ? 'a' : 'div'"
    v-if="profile"
    class="flex items-center gap-3"
    v-bind="githubUserUrl ? { href: githubUserUrl, target: '_blank', rel: 'noopener noreferrer' } : {}"
  >
    <UAvatar
      :src="profile.github_avatar_url ?? undefined"
      :alt="profile.full_name ?? profile.github_username ?? 'Author'"
      size="sm"
    />
    <div class="min-w-0">
      <p class="text-sm font-medium truncate">{{ profile.full_name ?? profile.github_username }}</p>
      <p v-if="profile.github_username" class="text-xs text-muted truncate">@{{ profile.github_username }}</p>
    </div>
  </component>
</template>
