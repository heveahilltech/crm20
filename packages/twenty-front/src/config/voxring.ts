const trimTrailingSlash = (url: string) => url.replace(/\/$/, '');

const readEnv = (key: string): string | undefined => {
  if (typeof window !== 'undefined') {
    const fromWindow = (window as { _env_?: Record<string, string> })._env_?.[
      key
    ];
    if (fromWindow) return fromWindow;
  }

  return import.meta.env[key] as string | undefined;
};

/** VoxRing portal base URL (no trailing slash). Production default: https://portal.voxring.ai */
export const REACT_APP_VOXRING_PORTAL_URL = trimTrailingSlash(
  readEnv('REACT_APP_VOXRING_PORTAL_URL') ?? 'https://portal.voxring.ai',
);

export const VOXRING_PORTAL_LOGIN_URL = `${REACT_APP_VOXRING_PORTAL_URL}/auth/login`;

export const VOXRING_PORTAL_DASHBOARD_URL = `${REACT_APP_VOXRING_PORTAL_URL}/portal/dashboard`;

/** When false, CRM shows native /welcome sign-in instead of redirecting to the portal. */
export const USE_VOXRING_PORTAL_AUTH =
  readEnv('REACT_APP_USE_VOXRING_PORTAL_AUTH') !== 'false';
