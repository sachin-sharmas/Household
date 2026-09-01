import { ArrowLeft, Mail, MailCheck, ShoppingBasket } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth.api.js';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);

    try {
      await authApi.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
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
        {sent ? (
          <div className="grid gap-4 rounded-lg border border-gray-200 bg-white p-5 text-center shadow-sm sm:p-7">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-700">
              <MailCheck size={24} />
            </span>
            <h1 className="text-2xl font-extrabold">Check your email</h1>
            <p className="text-gray-500">
              If <strong className="text-gray-900">{email}</strong> is registered, we've sent it a password reset
              link. The link expires in 30 minutes.
            </p>
            <Link to="/login" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-emerald-600 font-extrabold text-white hover:bg-emerald-700">
              Back to login
            </Link>
          </div>
        ) : (
          <form className="grid gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-7" onSubmit={submit}>
            <div>
              <h1 className="text-2xl font-extrabold sm:text-3xl">Forgot password</h1>
              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Enter your registered email and we'll send you a link to set a new password.
              </p>
            </div>
            {error && (
              <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800 sm:text-base">
                {error}
              </div>
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
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </span>
            </label>
            <button
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-emerald-600 font-extrabold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Sending link...' : 'Send reset link'}
            </button>
            <Link to="/login" className="inline-flex items-center justify-center gap-1.5 text-sm font-bold text-emerald-700 hover:underline">
              <ArrowLeft size={16} /> Back to login
            </Link>
          </form>
        )}
      </div>
    </main>
  );
}
