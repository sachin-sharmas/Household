import { Eye, EyeOff, Lock, ShoppingBasket } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/auth.api.js';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (submitting) return;
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await authApi.resetPassword({ token, password });
      navigate('/login', { replace: true, state: { notice: data.message || 'Password updated. You can now log in.' } });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-gray-50 p-4">
      <div className="w-full max-w-110">
        <div className="mb-4 flex items-center justify-center gap-2.5 font-display text-xl font-extrabold text-gray-900">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-600 text-white"><ShoppingBasket size={20} /></span>
          <span>Household Grocery</span>
        </div>
        {!token ? (
          <div className="grid gap-4 rounded-lg border border-gray-200 bg-white p-5 text-center shadow-sm sm:p-7">
            <h1 className="text-2xl font-extrabold">Invalid reset link</h1>
            <p className="text-gray-500">
              This link is missing its reset code. Open the link from your email again, or request a new one.
            </p>
            <Link to="/forgot-password" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-emerald-600 font-extrabold text-white hover:bg-emerald-700">
              Request a new link
            </Link>
          </div>
        ) : (
          <form className="grid gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-7" onSubmit={submit}>
            <div>
              <h1 className="text-2xl font-extrabold sm:text-3xl">Set a new password</h1>
              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Choose a new password for your account. You'll be signed in with it from now on.
              </p>
            </div>
            {error && (
              <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800 sm:text-base">
                {error}{' '}
                {/^This reset link/.test(error) && (
                  <Link to="/forgot-password" className="font-bold text-emerald-700 hover:underline">
                    Request a new link
                  </Link>
                )}
              </div>
            )}
            <label className="grid gap-2 text-sm font-bold text-gray-700">
              New password
              <span className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                <Lock size={18} className="shrink-0 text-gray-500" />
                <input
                  className="w-full border-0 py-3 text-base outline-none"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
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
            <label className="grid gap-2 text-sm font-bold text-gray-700">
              Confirm new password
              <span className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                <Lock size={18} className="shrink-0 text-gray-500" />
                <input
                  className="w-full border-0 py-3 text-base outline-none"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  minLength="6"
                />
              </span>
            </label>
            <button
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-emerald-600 font-extrabold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Updating password...' : 'Update password'}
            </button>
            <Link to="/login" className="text-center text-sm font-bold text-emerald-700 hover:underline">
              Back to login
            </Link>
          </form>
        )}
      </div>
    </main>
  );
}
