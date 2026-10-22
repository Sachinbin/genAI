
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  MessageSquare,
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useRegister } from '../../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const registerMutation = useRegister();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await registerMutation.mutateAsync({ name: formData.name.trim(), email: formData.email.trim(), password: formData.password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message ||
          'Unable to create your account. Please try again.'
      );
    }
  };

  const features = [
    'Get instant answers to your questions',
    'Save time with AI-powered assistance',
    'Turn ideas into something amazing',
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 md:grid md:grid-cols-2">
      {/* Left panel */}
      <section className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-violet-100 px-12 py-16 md:flex md:items-center lg:px-20">
        <div className="absolute -right-32 -top-24 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />

        <div className="relative z-10 max-w-xl">
          <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
            <MessageSquare size={30} strokeWidth={1.7} />
          </div>

          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
            Your AI assistant
          </p>

          <h1 className="text-4xl font-semibold tracking-tight lg:text-5xl">
            A smarter way to work
          </h1>

          <p className="mt-5 max-w-lg text-lg leading-8 text-gray-600">
            Create your account and discover new ways to learn, create, and
            get things done with AI.
          </p>

          <div className="mt-12 space-y-6">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 text-emerald-600 shadow-sm">
                  <CheckCircle2 size={21} />
                </div>
                <p className="text-sm text-gray-700">{feature}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex items-center gap-3 text-sm text-gray-500">
            <Sparkles size={18} />
            <span>Your ideas deserve a little intelligence.</span>
          </div>
        </div>
      </section>

      {/* Right panel */}
      <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center md:text-left">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 text-white md:hidden">
              <MessageSquare size={25} />
            </div>

            <h2 className="text-4xl font-semibold tracking-tight">
              {registerMutation.isPending ? 'Creating account…' : 'Create account'}
            </h2>

            <p className="mt-3 text-gray-500">
              Get started with your free account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium"
              >
                Full name
              </label>

              <div className="flex items-center rounded-xl border border-gray-300 px-4 transition focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
                <UserRound size={19} className="shrink-0 text-gray-400" />

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent px-3 py-3.5 text-sm outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email address
              </label>

              <div className="flex items-center rounded-xl border border-gray-300 px-4 transition focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
                <Mail size={19} className="shrink-0 text-gray-400" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent px-3 py-3.5 text-sm outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <div className="flex items-center rounded-xl border border-gray-300 px-4 transition focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
                <LockKeyhole size={19} className="shrink-0 text-gray-400" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                  required
                  className="w-full bg-transparent px-3 py-3.5 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="text-gray-500 hover:text-gray-900"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium"
              >
                Confirm password
              </label>

              <div className="flex items-center rounded-xl border border-gray-300 px-4 transition focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
                <LockKeyhole size={19} className="shrink-0 text-gray-400" />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent px-3 py-3.5 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                  className="text-gray-500 hover:text-gray-900"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-gray-900 py-3.5 font-medium text-white transition hover:bg-gray-800 active:scale-[0.99]"
            >
              Create account
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-gray-900 underline underline-offset-4 hover:text-gray-600"
            >
              Log in
            </Link>
          </p>

          <p className="mt-10 text-center text-xs leading-5 text-gray-400">
            By creating an account, you agree to our Terms of Service and
            Privacy Policy.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Register;
