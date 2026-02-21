import { expect, describe, it } from 'vitest';
import { useRoutes } from '../../app/composables/useRoutes';

describe('useRoutes', () => {
  it('should return the home route', () => {
    // Arrange
    const routes = useRoutes();
    // Act
    const homePath = routes.home();
    // Assert
    expect(homePath).toBe('/');
  });

  it('should return the login route', () => {
    // Arrange
    const routes = useRoutes();
    // Act
    const loginPath = routes.login();
    // Assert
    expect(loginPath).toBe('/login');
  });

  it('should return the posts route', () => {
    // Arrange
    const routes = useRoutes();
    //Act
    const postsPath = routes.posts();
    //Assert
    expect(postsPath).toBe('/posts');
  });

  it('should return the post id route', () => {
    // Arrange
    const routes = useRoutes();
    const postId = '183921abe394';
    // Act
    const postIdPath = routes.post(postId);
    // Assert
    expect(postIdPath).toBe('/posts/183921abe394');
  });

  it('should return the tags route', () => {
    // Arrange
    const routes = useRoutes();
    // Act
    const tagsPath = routes.tags();
    // Assert
    expect(tagsPath).toBe('/tags');
  });

  it('should return the about route', () => {
    // Arrange
    const routes = useRoutes();
    // Act
    const aboutPath = routes.about();
    // Assert
    expect(aboutPath).toBe('/about');
  });

  it('should return the studio route', () => {
    // Arrange
    const routes = useRoutes();
    // Act
    const studioPath = routes.studio();
    // Assert
    expect(studioPath).toBe('/studio');
  });

  it('should build the posts route under studio', () => {
    // Arrange
    const routes = useRoutes();
    // Act
    const studioPostsPath = routes.studioPosts();
    // Assert
    expect(studioPostsPath).toBe('/studio/posts');
  });

  it('should build the new post route under studio', () => {
    // Arrange
    const routes = useRoutes();
    // Act
    const studioPostsNewPath = routes.studioPostsNew();
    // Assert
    expect(studioPostsNewPath).toBe('/studio/posts/new');
  });

  it('should build the tags route under studio', () => {
    // Arrange
    const routes = useRoutes();
    // Act
    const studioTagsPath = routes.studioTags();
    // Assert
    expect(studioTagsPath).toBe('/studio/tags');
  });

  it('should not generate duplicated or trailing slashes', () => {
    // Arrange
    const routes = useRoutes();
    // Act
    const paths = [
      routes.home(),
      routes.login(),
      routes.studio(),
      routes.studioPosts(),
      routes.studioPostsNew(),
      routes.studioTags(),
    ];
    // Assert
    for (const path of paths) {
      expect(path.startsWith('/')).toBe(true);
      expect(path.includes('//')).toBe(false);

      if (path !== '/') {
        expect(path.endsWith('/')).toBe(false);
      }
    }
  });
});
