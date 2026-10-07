import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { LayoutDashboard, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^_-])[A-Za-z\d@$!%*?&#^_-]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 chars long and contain 1 uppercase, 1 lowercase, 1 number, and 1 symbol.');
      return;
    }

    setLoading(true);

    try {
      // Map email to username for the backend schema
      await api.post('/auth/register', { name: name.trim(), username: email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
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
              <h2 className="text-3xl font-bold text-[#344767] tracking-tight">Create an Account</h2>
              <p className="text-[#67748E] font-medium mt-2">Enter your email and a secure password to join</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-xl text-sm mb-6 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#344767] mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name "
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[#344767] focus:outline-none focus:border-[#141727] focus:ring-1 focus:ring-[#141727] transition-all bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#344767] mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yours@gmail.com"
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
                <p className="text-xs text-[#67748E] mt-2 font-medium">
                  Must be at least 8 characters, with 1 uppercase, 1 lowercase, 1 number, and 1 symbol.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#141727] hover:bg-[#252f40] text-white rounded-xl font-bold tracking-wide shadow-md transition-all disabled:opacity-70 mt-4"
              >
                {loading ? 'CREATING...' : 'SIGN UP'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm font-medium text-[#67748E]">
              Already have an account? <Link to="/login" className="text-[#141727] font-bold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full py-6 text-center border-t border-gray-100">
          <p className="text-sm text-[#67748E] font-medium">
            &copy; {new Date().getFullYear()} Analytics Dashboard. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-2 text-xs font-semibold text-[#67748E]">
            <a href="#" className="hover:text-[#141727] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#141727] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#141727] transition-colors">Contact Support</a>
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
            Data-Driven Decisions<br />Start Here.
          </h1>

          <p className="text-lg text-gray-300 leading-relaxed font-medium mb-10">
            Register to securely access your centralized analytics. The unified dashboard provides complete visibility over performance metrics in a minimal, professional aesthetic.
          </p>

        </div>
      </div>
    </div>
  );
}
