const useRoutes = () => {
  return {
    home: () => '/',
    login: () => '/login',
    studio: () => '/studio',
  } as const;
};

export { useRoutes };
