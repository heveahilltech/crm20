import { useEffect } from 'react';

type CustomerWebsiteIframeProps = {
  siteUrl: string;
  subdomain: string;
};

export const CustomerWebsiteIframe = ({
  siteUrl,
  subdomain,
}: CustomerWebsiteIframeProps) => {
  useEffect(() => {
    // Preserve customer branding in the document title
    if (subdomain) {
      document.title = subdomain;
    }
  }, [subdomain]);

  return (
    <iframe
      src={siteUrl}
      title={`${subdomain} customer website`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 'none',
        margin: 0,
        padding: 0,
        overflow: 'auto',
        zIndex: 999999,
        backgroundColor: '#ffffff',
      }}
      // Strictly isolate customer scripts from parent CRM DOM, credentials, and .voxring.ai cookies.
      // Deliberately omit `allow-same-origin` to keep iframe in an opaque null origin.
      sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
    />
  );
};

