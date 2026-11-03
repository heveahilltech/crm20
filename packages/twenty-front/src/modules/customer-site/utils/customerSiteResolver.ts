export const RESERVED_SUBDOMAINS = new Set([
  'admin',
  'api',
  'app',
  'assets',
  'auth',
  'billing',
  'cdn',
  'crm',
  'dashboard',
  'embed',
  'help',
  'live',
  'login',
  'mail',
  'onboarding',
  'portal',
  'public',
  'register',
  'settings',
  'site',
  'static',
  'status',
  'support',
  'www',
]);

/**
 * Extracts a candidate customer subdomain from hostname.
 * Returns null for reserved subdomains, IP addresses, or root domain.
 */
export const extractCustomerSubdomain = (
  hostname: string,
  rootDomain = 'voxring.ai',
): string | null => {
  const cleanHost = hostname.split(':')[0].trim().toLowerCase();
  if (!cleanHost) return null;

  // Local development: e.g. belle-blush.localhost or belle-blush.localtest.me
  if (cleanHost.endsWith('.localhost')) {
    const sub = cleanHost.slice(0, -'.localhost'.length);
    if (!sub || sub.includes('.') || RESERVED_SUBDOMAINS.has(sub)) return null;
    return /^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?$/.test(sub) ? sub : null;
  }

  if (cleanHost.endsWith('.localtest.me')) {
    const sub = cleanHost.slice(0, -'.localtest.me'.length);
    if (!sub || sub.includes('.') || RESERVED_SUBDOMAINS.has(sub)) return null;
    return /^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?$/.test(sub) ? sub : null;
  }

  // Configured root domain (e.g. voxring.ai)
  const cleanRoot = rootDomain.toLowerCase().replace(/^\.+/, '');
  if (cleanHost.endsWith(`.${cleanRoot}`)) {
    const sub = cleanHost.slice(0, -(cleanRoot.length + 1));
    if (!sub || sub.includes('.') || RESERVED_SUBDOMAINS.has(sub)) return null;
    return /^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?$/.test(sub) ? sub : null;
  }

  return null;
};

/**
 * Returns true if the request explicitly targets CRM or authentication flows.
 * In these cases, the customer website gate is skipped immediately.
 */
export const shouldBypassCustomerSiteGate = (location: {
  pathname: string;
  search: string;
}): boolean => {
  try {
    const searchParams = new URLSearchParams(location.search);

    // Explicit CRM query bypass: ?crm=1, ?crm=true, etc.
    if (searchParams.has('crm')) {
      return true;
    }

    // Login token verification parameter
    if (searchParams.has('loginToken')) {
      return true;
    }

    // Critical authentication and onboarding routes that CRM handles
    const path = (location.pathname || '').toLowerCase();
    if (
      path.startsWith('/verify') ||
      path.startsWith('/verify-email') ||
      path.startsWith('/reset-password') ||
      path.startsWith('/invite') ||
      path.startsWith('/authorize')
    ) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

export type CustomerSiteCheckResult = {
  isPublished: boolean;
  siteUrl: string;
};

/**
 * Checks whether the customer website is published on VoxRing.
 * Performs a fast, unauthenticated, lightweight check against portal.voxring.ai/site/:slug.
 * Falls back to false on any timeout, network error, or non-200 response.
 */
export const checkCustomerSitePublished = async (
  subdomain: string,
  portalBaseUrl: string,
  timeoutMs = 3000,
): Promise<CustomerSiteCheckResult> => {
  const cleanBase = portalBaseUrl.replace(/\/$/, '');
  const siteUrl = `${cleanBase}/site/${encodeURIComponent(subdomain)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Attempt lightweight HEAD check first
    let res = await fetch(siteUrl, {
      method: 'HEAD',
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-store',
      signal: controller.signal,
    });

    // If server or proxy returns 405 Method Not Allowed, fallback to GET
    if (res.status === 405) {
      res = await fetch(siteUrl, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-store',
        signal: controller.signal,
      });
    }

    clearTimeout(timeoutId);

    if (res.status === 200) {
      return { isPublished: true, siteUrl };
    }

    return { isPublished: false, siteUrl };
  } catch {
    clearTimeout(timeoutId);
    // On any network error, abort/timeout, or CORS failure, fall back to CRM safely
    return { isPublished: false, siteUrl };
  }
};

