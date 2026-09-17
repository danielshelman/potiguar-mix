import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { TITLES } from '../nav';
import { COLORS } from '../theme';

export default function Layout() {
  const location = useLocation();
  const screen = location.pathname.split('/')[1] || '';
  const title = TITLES[screen] || 'Potiguar Mix';

  return (
    <div style={{ display: 'flex', height: '100vh', background: COLORS.bg, fontFamily: 'Helvetica, Arial, sans-serif', color: COLORS.text, fontSize: 14, overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Header title={title} />
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 40px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
