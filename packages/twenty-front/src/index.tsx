import ReactDOM from 'react-dom/client';

import { CustomerSiteGate } from '@/customer-site/components/CustomerSiteGate';
import 'react-loading-skeleton/dist/skeleton.css';
import 'twenty-ui/style.css';
import 'twenty-ui/theme-light.css';
import 'twenty-ui/theme-dark.css';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') ?? document.body,
);

root.render(<CustomerSiteGate />);
