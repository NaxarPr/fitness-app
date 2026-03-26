import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuthStore } from '../store/authStore';
import { useShallow } from 'zustand/shallow';
import { Loader } from '../components/common/Loader';
import Input from '../components/common/Input';
import SystemButton from '../components/common/SystemButton';

const defaultProgram = () => ({ 1: [], 2: [], 3: [], 4: [] });

const RegisterPage = () => {
  const navigate = useNavigate();
  const { session, initializing } = useAuthStore(
    useShallow((state) => ({
      session: state.session,
      initializing: state.initializing,
    }))
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (initializing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Loader size={100} color="green" />
        <p className="text-white">Loading…</p>
      </div>
    );
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: { username: trimmedName || trimmedEmail.split('@')[0] },
      },
    });

    if (signUpError) {
      setSubmitting(false);
      setError(signUpError.message);
      return;
    }

    if (data.session && data.user) {
      useAuthStore.getState().applySession(data.session);

      const username =
        trimmedName || data.user.user_metadata?.username || trimmedEmail.split('@')[0];
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        username,
        program: defaultProgram(),
      });

      setSubmitting(false);

      if (profileError) {
        setSubmitting(false);
        navigate('/', { replace: true });
        return;
      }

      navigate('/', { replace: true });
      return;
    }

    setSubmitting(false);

    setSuccess(
      'Check your email to confirm your account, then sign in. Your profile will be created on first login.'
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <h1 className="text-2xl font-bold text-white">Create account</h1>
      <form
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-gray-600 bg-surface p-6"
        onSubmit={handleSubmit}
        aria-label="Registration form"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="register-name" className="text-sm text-gray-300">
            Name
          </label>
          <Input
            id="register-name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-white focus:ring-2 focus:ring-main"
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? 'register-error' : success ? 'register-success' : undefined
            }
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="register-email" className="text-sm text-gray-300">
            Email
          </label>
          <Input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-white focus:ring-2 focus:ring-main"
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? 'register-error' : success ? 'register-success' : undefined
            }
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="register-password" className="text-sm text-gray-300">
            Password
          </label>
          <Input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-white focus:ring-2 focus:ring-main"
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? 'register-error' : success ? 'register-success' : undefined
            }
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="register-confirm" className="text-sm text-gray-300">
            Confirm password
          </label>
          <Input
            id="register-confirm"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="text-white focus:ring-2 focus:ring-main"
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? 'register-error' : success ? 'register-success' : undefined
            }
            required
          />
        </div>
        {error ? (
          <p id="register-error" className="text-sm text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        {success ? (
          <p id="register-success" className="text-sm text-green-400" role="status">
            {success}
          </p>
        ) : null}
        <SystemButton
          variant="primary"
          type="submit"
          disabled={submitting || Boolean(success)}
          className="!bg-green-600 py-2 font-semibold hover:!bg-green-700 focus:outline-none focus:ring-2 focus:ring-main disabled:opacity-60"
        >
          {submitting ? 'Creating account…' : 'Register'}
        </SystemButton>
        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-green-400 underline focus:outline-none focus:ring-2 focus:ring-main rounded"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
