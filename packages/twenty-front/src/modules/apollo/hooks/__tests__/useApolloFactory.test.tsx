import { gql } from '@apollo/client';
import { act, renderHook } from '@testing-library/react';
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
import { MemoryRouter } from 'react-router-dom';
import { renewToken } from '@/auth/services/AuthService';
import { resetAuthSessionTerminated } from '@/apollo/utils/apolloAuthSession';

jest.mock('@/auth/services/AuthService', () => {
  const initialAuthService = jest.requireActual('@/auth/services/AuthService');

  return {
    ...initialAuthService,
    renewToken: jest.fn().mockRejectedValue(new Error('Refresh token expired')),
  };
});
import { SnackBarComponentInstanceContext } from '@/ui/feedback/snack-bar-manager/contexts/SnackBarComponentInstanceContext';
import { useApolloFactory } from '@/apollo/hooks/useApolloFactory';

enableFetchMocks();

jest.mock('@/apollo/utils/getTokenPair', () => ({
  getTokenPair: jest.fn().mockReturnValue({
    accessOrWorkspaceAgnosticToken: { token: 'testAccessToken', expiresAt: '' },
    refreshToken: { token: 'testRefreshToken', expiresAt: '' },
  }),
}));

const mockAssign = jest.fn();

Object.defineProperty(window, 'location', {
  value: {
    ...window.location,
    assign: mockAssign,
    pathname: '/opportunities',
    search: '',
    hash: '',
  },
  writable: true,
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter
    initialEntries={['/welcome', '/verify', '/opportunities']}
    initialIndex={2}
  >
    <SnackBarComponentInstanceContext.Provider
      value={{ instanceId: 'test-instance-id' }}
    >
      {children}
    </SnackBarComponentInstanceContext.Provider>
  </MemoryRouter>
);

describe('useApolloFactory', () => {
  beforeEach(() => {
    resetAuthSessionTerminated();
    mockAssign.mockClear();
    (renewToken as jest.Mock).mockRejectedValue(
      new Error('Refresh token expired'),
    );
  });

  it('should work as expected', () => {
    const { result } = renderHook(() => useApolloFactory(), {
      wrapper: Wrapper,
    });

    const res = result.current;

    expect(res).toBeDefined();
    expect(res).toHaveProperty('link');
    expect(res).toHaveProperty('cache');
    expect(res).toHaveProperty('query');
  });

  it('should redirect to portal login on unauthenticated error', async () => {
    mockAssign.mockClear();

    const errors = [
      {
        message: 'Token has expired.',
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      },
    ];
    fetchMock.mockResponse(() =>
      Promise.resolve({
        body: JSON.stringify({
          data: {},
          errors,
        }),
      }),
    );

    const { result } = renderHook(() => useApolloFactory(), {
      wrapper: Wrapper,
    });

    await act(async () => {
      try {
        await result.current.mutate({
          mutation: gql`
            mutation Track($type: String!, $sessionId: String!, $data: JSON!) {
              track(type: $type, sessionId: $sessionId, data: $data) {
                success
              }
            }
          `,
        });
      } catch {
        // Expected when auth renewal fails.
      }
    });

    expect(mockAssign).toHaveBeenCalledWith(
      'https://portal.voxring.ai/auth/login',
    );
  });
});
