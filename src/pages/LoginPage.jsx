import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuthStore } from '../store/authStore';
import { useShallow } from 'zustand/shallow';
import { Loader } from '../components/common/Loader';
import Input from '../components/common/Input';
import SystemButton from '../components/common/SystemButton';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? '/';

  const { session, initializing } = useAuthStore(
    useShallow((state) => ({
      session: state.session,
      initializing: state.initializing,
    }))
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleTogglePasswordVisible = () => {
    setPasswordVisible((visible) => !visible);
  };

  if (initializing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Loader size={100} color="green" />
        <p className="text-white">Loading…</p>
      </div>
    );
  }

  if (session) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    if (data.session) {
      useAuthStore.getState().applySession(data.session);
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <h1 className="text-2xl font-bold text-white">Sign in</h1>
      <form
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-gray-600 bg-surface p-6"
        onSubmit={handleSubmit}
        aria-label="Sign in form"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="login-email" className="text-sm text-gray-300">
            Email
          </label>
          <Input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-white focus:ring-2 focus:ring-main"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'login-error' : undefined}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="login-password" className="text-sm text-gray-300">
            Password
          </label>
          <div className="relative">
            <Input
              id="login-password"
              name="password"
              type={passwordVisible ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-9 text-white focus:ring-2 focus:ring-main"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'login-error' : undefined}
              required
            />
            <button
              type="button"
              onClick={handleTogglePasswordVisible}
              className="absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-main"
              aria-label={passwordVisible ? 'Hide password' : 'Show password'}
              aria-pressed={passwordVisible}
            >
              {passwordVisible ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {error ? (
          <p id="login-error" className="text-sm text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        <SystemButton
          variant="primary"
          type="submit"
          disabled={submitting}
          className="!bg-green-600 py-2 font-semibold hover:!bg-green-700 focus:outline-none focus:ring-2 focus:ring-main disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </SystemButton>
        <p className="text-center text-sm text-gray-400">
          No account?{' '}
          <Link
            to="/register"
            className="text-green-400 underline focus:outline-none focus:ring-2 focus:ring-main rounded"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
