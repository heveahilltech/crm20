import { useEffect, useState } from 'react';

import { App } from '@/app/components/App';
import { CustomerWebsiteIframe } from '@/customer-site/components/CustomerWebsiteIframe';
import {
  checkCustomerSitePublished,
  extractCustomerSubdomain,
  shouldBypassCustomerSiteGate,
} from '@/customer-site/utils/customerSiteResolver';
import { REACT_APP_VOXRING_PORTAL_URL } from '~/config/voxring';

type GateState =
  | { status: 'customer-site'; siteUrl: string; subdomain: string }
  | { status: 'crm' };

export const CustomerSiteGate = () => {
  const [gateState, setGateState] = useState<GateState | null>(() => {
    if (typeof window === 'undefined') {
      return { status: 'crm' };
    }

    const subdomain = extractCustomerSubdomain(window.location.hostname);
    if (!subdomain || shouldBypassCustomerSiteGate(window.location)) {
      return { status: 'crm' };
    }

    // Candidate customer subdomain - needs availability check
    return null;
  });

  useEffect(() => {
    if (gateState !== null) return;

    let isMounted = true;
    const subdomain = extractCustomerSubdomain(window.location.hostname);

    if (!subdomain || shouldBypassCustomerSiteGate(window.location)) {
      setGateState({ status: 'crm' });
      return;
    }

    checkCustomerSitePublished(subdomain, REACT_APP_VOXRING_PORTAL_URL)
      .then((res) => {
        if (!isMounted) return;
        if (res.isPublished) {
          setGateState({
            status: 'customer-site',
            siteUrl: res.siteUrl,
            subdomain,
          });
        } else {
          setGateState({ status: 'crm' });
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setGateState({ status: 'crm' });
      });

    return () => {
      isMounted = false;
    };
  }, [gateState]);

  if (gateState === null) {
    return null;
  }

  if (gateState.status === 'customer-site') {
    return (
      <CustomerWebsiteIframe
        siteUrl={gateState.siteUrl}
        subdomain={gateState.subdomain}
      />
    );
  }

  return <App />;
};

