import {
  checkCustomerSitePublished,
  extractCustomerSubdomain,
  shouldBypassCustomerSiteGate,
} from '../customerSiteResolver';

describe('customerSiteResolver', () => {
  describe('extractCustomerSubdomain', () => {
    it('extracts valid customer subdomains in production', () => {
      expect(extractCustomerSubdomain('belle-blush.voxring.ai')).toBe(
        'belle-blush',
      );
      expect(extractCustomerSubdomain('curlcure.voxring.ai')).toBe('curlcure');
      expect(extractCustomerSubdomain('smilesup.voxring.ai')).toBe('smilesup');
    });

    it('handles port numbers in hostname', () => {
      expect(extractCustomerSubdomain('belle-blush.voxring.ai:443')).toBe(
        'belle-blush',
      );
      expect(extractCustomerSubdomain('belle-blush.localhost:3001')).toBe(
        'belle-blush',
      );
    });

    it('extracts customer subdomains on localhost and localtest.me', () => {
      expect(extractCustomerSubdomain('belle-blush.localhost')).toBe(
        'belle-blush',
      );
      expect(extractCustomerSubdomain('dental-care.localtest.me')).toBe(
        'dental-care',
      );
    });

    it('rejects reserved subdomains', () => {
      expect(extractCustomerSubdomain('portal.voxring.ai')).toBeNull();
      expect(extractCustomerSubdomain('app.voxring.ai')).toBeNull();
      expect(extractCustomerSubdomain('api.voxring.ai')).toBeNull();
      expect(extractCustomerSubdomain('admin.voxring.ai')).toBeNull();
      expect(extractCustomerSubdomain('crm.voxring.ai')).toBeNull();
      expect(extractCustomerSubdomain('auth.voxring.ai')).toBeNull();
      expect(extractCustomerSubdomain('login.voxring.ai')).toBeNull();
      expect(extractCustomerSubdomain('www.voxring.ai')).toBeNull();
      expect(extractCustomerSubdomain('site.voxring.ai')).toBeNull();
      expect(extractCustomerSubdomain('dashboard.voxring.ai')).toBeNull();
    });

    it('rejects root domains or bare hosts without customer subdomains', () => {
      expect(extractCustomerSubdomain('voxring.ai')).toBeNull();
      expect(extractCustomerSubdomain('localhost')).toBeNull();
      expect(extractCustomerSubdomain('127.0.0.1')).toBeNull();
      expect(extractCustomerSubdomain('')).toBeNull();
    });

    it('rejects nested or invalid subdomain formats', () => {
      expect(extractCustomerSubdomain('nested.sub.voxring.ai')).toBeNull();
      expect(extractCustomerSubdomain('-invalid.voxring.ai')).toBeNull();
    });
  });

  describe('shouldBypassCustomerSiteGate', () => {
    it('bypasses when ?crm=1 or ?crm=true is present', () => {
      expect(
        shouldBypassCustomerSiteGate({ pathname: '/', search: '?crm=1' }),
      ).toBe(true);
      expect(
        shouldBypassCustomerSiteGate({
          pathname: '/records',
          search: '?foo=bar&crm=true',
        }),
      ).toBe(true);
    });

    it('bypasses when loginToken is present in search params', () => {
      expect(
        shouldBypassCustomerSiteGate({
          pathname: '/verify',
          search: '?loginToken=abc-123',
        }),
      ).toBe(true);
      expect(
        shouldBypassCustomerSiteGate({
          pathname: '/',
          search: '?loginToken=abc-123',
        }),
      ).toBe(true);
    });

    it('bypasses on auth and verification routes', () => {
      expect(
        shouldBypassCustomerSiteGate({ pathname: '/verify', search: '' }),
      ).toBe(true);
      expect(
        shouldBypassCustomerSiteGate({ pathname: '/verify-email', search: '' }),
      ).toBe(true);
      expect(
        shouldBypassCustomerSiteGate({
          pathname: '/reset-password',
          search: '',
        }),
      ).toBe(true);
      expect(
        shouldBypassCustomerSiteGate({ pathname: '/invite', search: '' }),
      ).toBe(true);
      expect(
        shouldBypassCustomerSiteGate({ pathname: '/authorize', search: '' }),
      ).toBe(true);
    });

    it('does not bypass for normal website visits', () => {
      expect(shouldBypassCustomerSiteGate({ pathname: '/', search: '' })).toBe(
        false,
      );
      expect(shouldBypassCustomerSiteGate({ pathname: '', search: '' })).toBe(
        false,
      );
      expect(
        shouldBypassCustomerSiteGate({
          pathname: '/',
          search: '?utm_source=google',
        }),
      ).toBe(false);
    });
  });

  describe('checkCustomerSitePublished', () => {
    const portalUrl = 'https://portal.voxring.ai';

    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it('returns isPublished=true when portal returns 200', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        status: 200,
        ok: true,
      } as Response);
      global.fetch = mockFetch;

      const result = await checkCustomerSitePublished('belle-blush', portalUrl);

      expect(result.isPublished).toBe(true);
      expect(result.siteUrl).toBe('https://portal.voxring.ai/site/belle-blush');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://portal.voxring.ai/site/belle-blush',
        expect.objectContaining({
          method: 'HEAD',
          mode: 'cors',
          credentials: 'omit',
        }),
      );
    });

    it('returns isPublished=false when portal returns 404 (draft or non-existent)', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        status: 404,
        ok: false,
      } as Response);
      global.fetch = mockFetch;

      const result = await checkCustomerSitePublished('curlcure', portalUrl);

      expect(result.isPublished).toBe(false);
      expect(result.siteUrl).toBe('https://portal.voxring.ai/site/curlcure');
    });

    it('retries with GET when HEAD returns 405 Method Not Allowed', async () => {
      const mockFetch = jest
        .fn()
        .mockResolvedValueOnce({ status: 405 } as Response)
        .mockResolvedValueOnce({ status: 200 } as Response);
      global.fetch = mockFetch;

      const result = await checkCustomerSitePublished('belle-blush', portalUrl);

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result.isPublished).toBe(true);
    });

    it('safely falls back to isPublished=false on network error', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const result = await checkCustomerSitePublished('smilesup', portalUrl);

      expect(result.isPublished).toBe(false);
    });

    it('safely falls back to isPublished=false on 500 error', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        status: 500,
        ok: false,
      } as Response);

      const result = await checkCustomerSitePublished('smilesup', portalUrl);

      expect(result.isPublished).toBe(false);
    });
  });
});
