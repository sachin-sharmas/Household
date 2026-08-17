import { Bell, BellOff, ListChecks, LogOut, Shield, ShoppingBasket, UserCheck } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePushNotifications } from '../../hooks/usePushNotifications.js';

export default function AppShell({ children, title, subtitle, headerAction }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const push = usePushNotifications();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const navLinkClasses = (active) =>
    `flex min-h-11 items-center gap-2.5 rounded-lg px-3 font-extrabold ${
      active ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-screen md:grid md:grid-cols-[280px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col gap-6 border-r border-gray-200 bg-white/80 p-6 backdrop-blur md:flex">
        <Link to="/" className="flex items-center gap-2.5 font-display text-xl font-extrabold">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-600 text-white"><ShoppingBasket size={20} /></span>
          <span className="leading-tight">Household Grocery</span>
        </Link>
        <nav className="grid gap-2">
          <Link to="/" className={navLinkClasses(pathname === '/')}>
            <ShoppingBasket size={18} /> Dashboard
          </Link>
          <Link to="/my-items" className={navLinkClasses(pathname === '/my-items')}>
            <ListChecks size={18} /> My Items
          </Link>
          <Link to="/my-assigned" className={navLinkClasses(pathname === '/my-assigned')}>
            <UserCheck size={18} /> My Assigned
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className={navLinkClasses(pathname === '/admin')}>
              <Shield size={18} /> Admin
            </Link>
          )}
        </nav>
        <div className="mt-auto grid gap-1 rounded-lg bg-emerald-50 p-3.5">
          <strong className="truncate">{user?.name}</strong>
          <span className="break-words text-sm text-gray-500">{user?.email}</span>
        </div>
        {push.supported && (
          <div className="grid gap-1">
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 font-extrabold text-gray-900 hover:bg-gray-50 disabled:opacity-60"
              onClick={push.toggle}
              disabled={push.busy}
              title={push.enabled ? 'Turn off browser notifications' : 'Get notified when an item is assigned to you'}
            >
              {push.enabled ? <Bell size={18} className="text-emerald-600" /> : <BellOff size={18} />}
              {push.enabled ? 'Notifications on' : 'Notifications off'}
            </button>
            {push.error && <span className="text-xs text-red-600">{push.error}</span>}
          </div>
        )}
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 font-extrabold text-gray-900 hover:bg-gray-50"
          onClick={handleLogout}
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur md:hidden">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-600 text-white"><ShoppingBasket size={18} /></span>
          <span>Household Grocery</span>
        </Link>
        <div className="flex items-center gap-1.5">
          {push.supported && (
            <button
              className="grid h-10 w-10 place-items-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-60"
              onClick={push.toggle}
              disabled={push.busy}
              aria-label={push.enabled ? 'Turn off notifications' : 'Turn on notifications'}
              title={push.enabled ? 'Turn off browser notifications' : 'Get notified when an item is assigned to you'}
            >
              {push.enabled ? <Bell size={20} className="text-emerald-600" /> : <BellOff size={20} />}
            </button>
          )}
          {headerAction}
        </div>
      </header>

      <main className="grid content-start gap-5 p-4 pb-24 md:gap-6 md:p-8 md:pb-8">
        <header className="flex flex-col gap-1">
          <h1 className="hidden text-3xl font-extrabold sm:block md:text-5xl">{title}</h1>
          <p className="hidden text-gray-500">{subtitle}</p>
        </header>
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-20 flex items-stretch justify-around border-t border-gray-200 bg-white/95 px-2 backdrop-blur md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <Link
          to="/"
          className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-bold ${
            pathname === '/' ? 'text-emerald-700' : 'text-gray-500'
          }`}
        >
          <ShoppingBasket size={20} />
          Dashboard
        </Link>
        <Link
          to="/my-items"
          className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-bold ${
            pathname === '/my-items' ? 'text-emerald-700' : 'text-gray-500'
          }`}
        >
          <ListChecks size={20} />
          My Items
        </Link>
        <Link
          to="/my-assigned"
          className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-bold ${
            pathname === '/my-assigned' ? 'text-emerald-700' : 'text-gray-500'
          }`}
        >
          <UserCheck size={20} />
          Assigned
        </Link>
        {user?.role === 'admin' && (
          <Link
            to="/admin"
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-bold ${
              pathname === '/admin' ? 'text-emerald-700' : 'text-gray-500'
            }`}
          >
            <Shield size={20} />
            Admin
          </Link>
        )}
        <button
          className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-bold text-gray-500"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </button>
      </nav>
    </div>
  );
}
