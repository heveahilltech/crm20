import { isValidReturnToPath } from '@/auth/utils/isValidReturnToPath';
import { VOXRING_PORTAL_LOGIN_URL } from '~/hooks/usePageChangeEffectNavigateLocation';
import { AppPath } from 'twenty-shared/types';
import { isMatchingLocation } from '~/utils/isMatchingLocation';

type RedirectToPortalLoginOptions = {
  setReturnToPath: (path: string) => void;
};

export const redirectToPortalLogin = ({
  setReturnToPath,
}: RedirectToPortalLoginOptions) => {
  const { pathname, search, hash } = window.location;

  const location = { pathname, search, hash };

  if (
    isMatchingLocation(location, AppPath.Verify) ||
    isMatchingLocation(location, AppPath.SignInUp) ||
    isMatchingLocation(location, AppPath.Invite) ||
    isMatchingLocation(location, AppPath.ResetPassword)
  ) {
    return;
  }

  const path = `${pathname}${search}${hash}`;

  if (isValidReturnToPath(path)) {
    setReturnToPath(path);
  }

  window.location.assign(VOXRING_PORTAL_LOGIN_URL);
};
