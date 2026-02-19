const useRoutes = () => {
  const join = (...parts: string[]) => ('/' + parts.join('/')).replace(/\/+/g, '/').replace(/\/$/, '') || '/';
  const studio = () => '/studio';

  return {
    home: () => '/',
    login: () => '/login',

    studio,

    // Posts
    studioPosts: () => join(studio(), 'posts'),
    studioPostsNew: () => join(studio(), 'posts', 'new'),
    studioPostEdit: (id: string) => join(studio(), 'posts', id),

    // Tags
    studioTags: () => join(studio(), 'tags'),
  } as const;
};

export { useRoutes };
