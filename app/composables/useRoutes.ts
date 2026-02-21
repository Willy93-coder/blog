const useRoutes = () => {
  const join = (...parts: string[]) => ('/' + parts.join('/')).replace(/\/+/g, '/').replace(/\/$/, '') || '/';
  const studio = () => '/studio';

  return {
    // Public routes
    home: () => '/',
    login: () => '/login',
    posts: () => join('posts'),
    post: (id: string) => join('posts', id),
    tags: () => join('tags'),
    about: () => join('about'),

    // Private routes
    studio,
    studioPosts: () => join(studio(), 'posts'),
    studioPostsNew: () => join(studio(), 'posts', 'new'),
    studioPostEdit: (id: string) => join(studio(), 'posts', id),
    studioTags: () => join(studio(), 'tags'),
  } as const;
};

export { useRoutes };
