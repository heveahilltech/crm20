import { type Cookies } from 'js-cookie';

import { type AuthTokenPair } from '~/generated-metadata/graphql';
import { cookieStorage } from '~/utils/cookie-storage';

export const isVoxringProductionHost = (hostname: string): boolean =>
  hostname === 'voxring.ai' || hostname.endsWith('.voxring.ai');

/** Shared cookie domain for portal + CRM on production (*.voxring.ai). */
export const getVoxringSharedCookieDomain = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  const host = window.location.hostname;
  if (!isVoxringProductionHost(host)) return undefined;
  return '.voxring.ai';
};

type TokenPairWithCookieAttributes = AuthTokenPair & {
  cookieAttributes?: Cookies.CookieAttributes;
};

export const prepareTokenPairForCookieStorage = (
  tokenPair: AuthTokenPair,
): TokenPairWithCookieAttributes => {
  const domain = getVoxringSharedCookieDomain();
  if (!domain) return tokenPair;
  return { ...tokenPair, cookieAttributes: { domain } };
};

/** Remove host-only tokenPair so it cannot shadow the shared-domain cookie. */
export const clearHostOnlyTokenPairCookie = (): void => {
  cookieStorage.removeItem('tokenPair', { path: '/' });
};

/** Clear tokenPair on both host-only and shared Voxring domain scopes. */
export const clearVoxringTokenPairCookies = (): void => {
  clearHostOnlyTokenPairCookie();
  const domain = getVoxringSharedCookieDomain();
  if (domain) {
    cookieStorage.removeItem('tokenPair', { path: '/', domain });
  }
};

export const beforePersistTokenPairCookie = (
  tokenPair: AuthTokenPair | null,
): void => {
  if (tokenPair) {
    clearHostOnlyTokenPairCookie();
    return;
  }
  clearVoxringTokenPairCookies();
};
