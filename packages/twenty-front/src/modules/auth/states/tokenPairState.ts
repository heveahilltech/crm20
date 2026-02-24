import { createState } from '@/ui/utilities/state/utils/createState';
import { type AuthTokenPair } from '~/generated-metadata/graphql';
import { cookieStorageEffect } from '~/utils/recoil/cookieStorageEffect';

export const tokenPairState = createState<AuthTokenPair | null>({
  key: 'tokenPairState',
  defaultValue: null,
  effects: [
    cookieStorageEffect(
      'tokenPair',
      { domain: '.voxring.ai' },
      {
        validateInitFn: (payload: AuthTokenPair) =>
          Boolean(payload['accessOrWorkspaceAgnosticToken']),
      },
    ),
  ],
});
