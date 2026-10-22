
import { Link, useNavigate } from 'react-router';
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  MessageSquare,
  Lightbulb,
  Zap,
} from 'lucide-react';
import { useContext, useState } from 'react';
import {useLogin} from '../../hooks/useAuth';


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin() ;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync(formData);
      navigate('/dashboard', { replace: true } );

    } catch (error) {
      console.error('Login failed:', error);
    } 
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 md:grid md:grid-cols-2">
      {/* Left panel */}
      <section className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-violet-100 px-12 py-16 md:flex md:flex-col md:justify-center lg:px-20">
        <div className="absolute -right-32 -top-24 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />

        <div className="relative z-10 max-w-xl">
          <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
            <MessageSquare size={30} strokeWidth={1.7} />
          </div>

          <h1 className="text-4xl font-semibold tracking-tight lg:text-5xl">
            Welcome back
          </h1>

          <p className="mt-3 text-3xl text-gray-500 lg:text-4xl">
            Continue to AI Chat
          </p>

          <p className="mt-6 max-w-md text-lg leading-8 text-gray-600">
            Get answers, find inspiration, and be more productive with AI.
          </p>

          <div className="mt-12 space-y-8">
            {[
              {
                icon: MessageSquare,
                title: 'Instant answers',
                description: 'Get helpful information when you need it.',
                color: 'text-teal-600 bg-teal-100',
              },
              {
                icon: Lightbulb,
                title: 'Creative inspiration',
                description: 'Turn your ideas into reality.',
                color: 'text-violet-600 bg-violet-100',
              },
              {
                icon: Zap,
                title: 'Be more productive',
                description: 'Write, plan, and solve problems faster.',
                color: 'text-blue-600 bg-blue-100',
              },
            ].map((feature) => {
              const Icon = feature.icon;

              return (
                <div key={feature.title} className="flex items-center gap-5">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${feature.color}`}
                  >
                    <Icon size={25} />
                  </div>

                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Right panel */}
      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 text-white md:hidden">
              <MessageSquare size={25} />
            </div>

            <h2 className="text-4xl font-semibold tracking-tight">
              Log in
            </h2>

            <p className="mt-3 text-gray-500">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email address
              </label>

              <div className="flex items-center rounded-xl border border-gray-300 px-4 transition focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
                <Mail size={19} className="text-gray-400" />

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

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <div className="flex items-center rounded-xl border border-gray-300 px-4 transition focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
                <LockKeyhole size={19} className="text-gray-400" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent px-3 py-3.5 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="text-gray-500 hover:text-gray-900"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {loginMutation.isError && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{loginMutation.error?.response?.data?.message || 'Unable to log in. Check your connection and try again.'}</p>}

            <button
              type="submit"
              className="w-full rounded-xl bg-gray-900 py-3.5 font-medium text-white transition hover:bg-gray-800 active:scale-[0.99]"
            >
              {loginMutation.isLoading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-gray-900 underline underline-offset-4 hover:text-gray-600"
            >
              Sign up
            </Link>
          </p>

        </div>
      </section>
    </div>
  );
};

export default Login;
