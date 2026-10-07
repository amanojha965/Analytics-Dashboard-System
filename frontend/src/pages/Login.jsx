import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      // Map email to username for the backend
      const res = await api.post('/auth/login', { username: email, password });
      login(res.data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white relative">
        <div className="flex-1 flex items-center justify-center px-8 sm:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#344767] tracking-tight">Welcome Back</h2>
              <p className="text-[#67748E] font-medium mt-2">Enter your email and password to sign in</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-xl text-sm mb-6 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#344767] mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@gmail.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[#344767] focus:outline-none focus:border-[#141727] focus:ring-1 focus:ring-[#141727] transition-all bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#344767] mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[#344767] focus:outline-none focus:border-[#141727] focus:ring-1 focus:ring-[#141727] transition-all bg-white pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#344767] transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#141727] hover:bg-[#252f40] text-white rounded-xl font-bold tracking-wide shadow-md transition-all disabled:opacity-70 mt-4"
              >
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm font-medium text-[#67748E]">
              Don't have an account? <Link to="/register" className="text-[#141727] font-bold hover:underline">Sign up</Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full py-6 text-center border-t border-gray-100">
          <p className="text-sm text-[#67748E] font-medium">
            &copy; {new Date().getFullYear()} Analytics Dashboard. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-2 text-xs font-semibold text-[#67748E]">
            <Link to="/privacy" className="hover:text-[#141727] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#141727] transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-[#141727] transition-colors">Contact Support</Link>
          </div>
        </div>
      </div>

      {/* Right Side - Dashboard Info Showcase */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#141727] to-[#3A416F] p-16 flex-col justify-center relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-lg mx-auto">
          <div className="bg-white/10 p-4 rounded-2xl inline-block mb-8 backdrop-blur-sm border border-white/10">
            <LayoutDashboard size={40} className="text-white" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
            Advanced Analytics,<br />Simplified.
          </h1>

          <p className="text-lg text-gray-300 leading-relaxed font-medium mb-10">
            Gain immediate insights into your retail operations. Track live revenue trends, monitor fulfillment bottlenecks, and analyze product categories with our beautifully crafted, production-ready dashboard.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#82d616]"></div>
              <span className="text-gray-200 font-medium">Real-time revenue tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#17c1e8]"></div>
              <span className="text-gray-200 font-medium">Advanced fulfillment metrics</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#cb0c9f]"></div>
              <span className="text-gray-200 font-medium">Category performance breakdowns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
