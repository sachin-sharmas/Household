import { Eye, EyeOff, Lock, Mail, Phone, ShoppingBasket, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Demo/backup credentials are only baked in during development. For production
// builds they stay hidden unless explicitly provided via VITE_* env vars.
const DEMO_ADMIN = {
  email: import.meta.env.VITE_DEMO_ADMIN_EMAIL || (import.meta.env.DEV ? 'admin@grocery.com' : ''),
  password: import.meta.env.VITE_DEMO_ADMIN_PASSWORD || (import.meta.env.DEV ? 'Admin@12345' : '')
};
const BACKUP_USER_PASSWORD = import.meta.env.VITE_BACKUP_USER_PASSWORD || (import.meta.env.DEV ? 'User@12345' : '');
const SHOW_DEMO_ADMIN = Boolean(DEMO_ADMIN.email && DEMO_ADMIN.password);

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);

    try {
      const user = isRegister ? await register(form) : await login(form);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  function fillDemo(credentials) {
    setError('');
    setForm({ ...form, email: credentials.email, password: credentials.password });
  }

  return (
    <main className="min-h-dvh lg:grid lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden flex-col justify-between bg-[linear-gradient(140deg,rgba(5,150,105,0.82),rgba(23,33,27,0.62)),url(https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80)] bg-cover bg-center p-12 text-white lg:flex">
        <div className="flex items-center gap-2.5 font-display text-xl font-extrabold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/20"><ShoppingBasket size={20} /></span>
          <span>Household Grocery</span>
        </div>
        <div>
          <h1 className="max-w-2xl text-6xl font-extrabold leading-[0.95]">
            {isRegister ? 'Create your household account' : 'Sign in to manage your groceries'}
          </h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-white/85">
            Track household grocery items by category, assign who's bringing them, and give admins a clean place to manage users and inventory.
          </p>
        </div>
      </section>

      <section className="grid place-items-center p-4 py-6 sm:p-7 sm:py-8">
        <div className="w-full max-w-110">
          <div
            className="mb-4 grid h-28 place-items-center rounded-lg bg-[linear-gradient(140deg,rgba(5,150,105,0.82),rgba(23,33,27,0.62)),url(https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=70)] bg-cover bg-center text-white shadow-sm sm:h-36 lg:hidden"
            role="img"
            aria-label="Fresh groceries in a basket"
          >
            <div className="flex items-center gap-2.5 font-display text-xl font-extrabold">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/20"><ShoppingBasket size={20} /></span>
              <span>Household Grocery</span>
            </div>
          </div>
          <form className="grid w-full gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:gap-4.5 sm:p-7" onSubmit={submit}>
            <div>
              <h2 className="text-2xl font-extrabold sm:text-3xl">{isRegister ? 'Sign up' : 'Login'}</h2>
              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                {isRegister ? 'User accounts are created with regular access.' : 'Use your user or admin account.'}
              </p>
            </div>
            {error && (
              <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800 sm:text-base">
                {error}
              </div>
            )}
            {isRegister && (
              <label className="grid gap-2 text-sm font-bold text-gray-700">
                Name
                <span className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                  <UserPlus size={18} className="shrink-0 text-gray-500" />
                  <input
                    className="w-full border-0 py-3 text-base outline-none"
                    autoComplete="name"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    required
                  />
                </span>
              </label>
            )}
            {isRegister && (
              <label className="grid gap-2 text-sm font-bold text-gray-700">
                Mobile number
                <span className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                  <Phone size={18} className="shrink-0 text-gray-500" />
                  <input
                    className="w-full border-0 py-3 text-base outline-none"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+1 555 123 4567"
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                    required
                  />
                </span>
                <span className="text-xs font-normal text-gray-500">We'll use this to notify you when an item is assigned to you.</span>
              </label>
            )}
            <label className="grid gap-2 text-sm font-bold text-gray-700">
              Email
              <span className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                <Mail size={18} className="shrink-0 text-gray-500" />
                <input
                  className="w-full border-0 py-3 text-base outline-none"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  required
                />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-bold text-gray-700">
              Password
              <span className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                <Lock size={18} className="shrink-0 text-gray-500" />
                <input
                  className="w-full border-0 py-3 text-base outline-none"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  className="-mr-1 shrink-0 rounded-md p-2 text-gray-500 hover:text-gray-900"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>
            <button
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-emerald-600 font-extrabold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={submitting}
            >
              {submitting ? (isRegister ? 'Creating account...' : 'Logging in...') : isRegister ? 'Create account' : 'Login'}
            </button>
            <p className="text-center text-sm">
              {isRegister ? 'Already have an account?' : 'Need a user account?'}{' '}
              <button
                type="button"
                className="p-1 font-extrabold text-emerald-700"
                onClick={() => navigate(isRegister ? '/login' : '/register')}
              >
                {isRegister ? 'Login' : 'Sign up'}
              </button>
            </p>
            {!isRegister && (SHOW_DEMO_ADMIN || BACKUP_USER_PASSWORD) && (
              <div className="grid gap-2.5 border-t border-dashed border-gray-200 pt-3">
                <span className="text-center text-xs font-bold uppercase tracking-wide text-gray-500">Quick access</span>
                {SHOW_DEMO_ADMIN && (
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 font-extrabold text-gray-900 hover:bg-gray-50"
                      onClick={() => fillDemo(DEMO_ADMIN)}
                    >
                      Login as Admin
                    </button>
                  </div>
                )}
                {BACKUP_USER_PASSWORD && (
                  <p className="text-center text-sm text-gray-500">
                    Forgot your password? Enter your registered email with backup password <strong>{BACKUP_USER_PASSWORD}</strong> to sign in.
                  </p>
                )}
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
