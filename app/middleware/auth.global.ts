import { defineNuxtRouteMiddleware, navigateTo, useNuxtApp } from '#app';
import { useRoutes } from '~/composables/useRoutes';
import { useAuth } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware(async (to) => {
  // Public URLs
  if (to.meta.public) return;

  const routes = useRoutes();
  const auth = useAuth();
  const { $supabase } = useNuxtApp();

  const { data, error } = await $supabase.auth.getSession();
  const session = data?.session;

  if (error || !session) return navigateTo(routes.login());

  const { allowed, error: allowedErr } = await auth.isAllowedUser();

  if (allowedErr || !allowed) {
    await auth.signOut();
    return navigateTo(routes.login());
  }
});
