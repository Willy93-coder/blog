export default defineNuxtRouteMiddleware(async (to) => {
  // Public URLs
  if (to.meta.public) return;

  const routes = useRoutes();
  const authService = AuthService();

  const { allowed } = await authService.isAllowedUser();

  if (!allowed) return navigateTo(routes.login());
});
