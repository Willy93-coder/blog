import { expect, describe, it, vi, beforeEach } from 'vitest';

const getSessionMock = vi.fn();
const navigateToMock = vi.fn((path: string) => ({ redirect: path }));
const isAllowedUserMock = vi.fn();
const signOutMock = vi.fn();
const sessionStateMock = { value: null as any };

vi.mock('#app', () => ({
  defineNuxtRouteMiddleware: (fn: any) => fn,
  navigateTo: navigateToMock,
}));

vi.mock('~/composables/useRoutes', () => ({
  useRoutes: () => ({ login: () => '/login' }),
}));

vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    getSession: getSessionMock,
    isAllowedUser: isAllowedUserMock,
    signOut: signOutMock,
  }),
}));

vi.mock('~/composables/useSessionState', () => ({
  useSessionState: () => sessionStateMock,
}));

describe('Auth middleware', () => {
  const from = {} as any;
  beforeEach(() => {
    vi.clearAllMocks();

    getSessionMock.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    isAllowedUserMock.mockResolvedValue({
      allowed: true,
      error: null,
    });
  });

  it('should do nothing when accessing a public route', async () => {
    // Arrange
    const to = { meta: { public: true } } as any;
    const { default: authGlobal } = await import('~/middleware/auth.global');
    // Act
    const result = await authGlobal(to, from);
    // Assert
    expect(result).toBeUndefined();
    expect(navigateToMock).not.toHaveBeenCalled();
    expect(getSessionMock).not.toHaveBeenCalled();
  });

  it('should redirect to /login when accessing a protected route without session', async () => {
    // Arrange
    const to = { meta: { public: false } } as any;
    const { default: authGlobal } = await import('~/middleware/auth.global');
    // Act
    const result = await authGlobal(to, from);
    // Assert
    expect(result).toEqual({ redirect: '/login' });
    expect(navigateToMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).toHaveBeenCalledWith('/login');
    expect(isAllowedUserMock).not.toHaveBeenCalled();
    expect(signOutMock).not.toHaveBeenCalled();
    expect(sessionStateMock.value).toBeNull();
  });

  it('should redirect to /login when an error occurs while retrieving session', async () => {
    // Arrange
    const to = { meta: { public: false } } as any;
    getSessionMock.mockResolvedValueOnce({
      data: { session: null },
      error: new Error('getSession failed'),
    });
    const { default: authGlobal } = await import('~/middleware/auth.global');
    // Act
    const result = await authGlobal(to, from);
    // Assert
    expect(result).toEqual({ redirect: '/login' });
    expect(navigateToMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).toHaveBeenCalledWith('/login');
    expect(isAllowedUserMock).not.toHaveBeenCalled();
    expect(signOutMock).not.toHaveBeenCalled();
    expect(sessionStateMock.value).toBeNull();
  });

  it('should allow access when session exists', async () => {
    // Arrange
    const to = { meta: { public: false } } as any;
    getSessionMock.mockResolvedValueOnce({
      data: { session: { access_token: 'x' } },
      error: null,
    });
    const { default: authGlobal } = await import('~/middleware/auth.global');
    // Act
    const result = await authGlobal(to, from);
    // Assert
    expect(result).toBeUndefined();
    expect(navigateToMock).not.toHaveBeenCalled();
    expect(isAllowedUserMock).toHaveBeenCalledTimes(1);
    expect(signOutMock).not.toHaveBeenCalled();
    expect(sessionStateMock.value).toEqual({ access_token: 'x' });
  });

  it('should sign out and redirect to /login when session exists but user is not allowed', async () => {
    // Arrange
    const to = { meta: { public: false } } as any;
    getSessionMock.mockResolvedValueOnce({
      data: { session: { access_token: 'x' } },
      error: null,
    });
    isAllowedUserMock.mockResolvedValueOnce({
      allowed: false,
      error: null,
    });
    const { default: authGlobal } = await import('~/middleware/auth.global');
    // Act
    const result = await authGlobal(to, from);
    // Assert
    expect(result).toEqual({ redirect: '/login' });
    expect(navigateToMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).toHaveBeenCalledWith('/login');
    expect(isAllowedUserMock).toHaveBeenCalledTimes(1);
    expect(signOutMock).toHaveBeenCalledTimes(1);
  });

  it('should sign out and redirect to /login when an error occurs while checking if the user is allowed', async () => {
    // Arrange
    const to = { meta: { public: false } } as any;
    getSessionMock.mockResolvedValueOnce({
      data: { session: { access_token: 'x' } },
      error: null,
    });
    isAllowedUserMock.mockResolvedValueOnce({
      allowed: true,
      error: new Error('getAllowedUser failed'),
    });
    const { default: authGlobal } = await import('~/middleware/auth.global');
    // Act
    const result = await authGlobal(to, from);
    // Assert
    expect(result).toEqual({ redirect: '/login' });
    expect(navigateToMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).toHaveBeenCalledWith('/login');
    expect(isAllowedUserMock).toHaveBeenCalledTimes(1);
    expect(signOutMock).toHaveBeenCalledTimes(1);
  });
});
