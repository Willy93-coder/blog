import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useRoutes } from '~/composables/useRoutes';
import { useAuth } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware(async (to) => {
  // Public URLs
  if (to.meta.public) return;

  const routes = useRoutes();
  const auth = useAuth();
  const sessionState = useSessionState();

  const { data, error } = await auth.getSession();
  const session = data?.session;

  if (error || !session) {
    sessionState.value = null;
    return navigateTo(routes.login());
  }

  const { allowed, error: allowedErr } = await auth.isAllowedUser();

  if (allowedErr || !allowed) {
    await auth.signOut();
    return navigateTo(routes.login());
  }

  sessionState.value = session;
});
