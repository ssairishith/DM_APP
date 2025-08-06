
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      router.push('/dashboard');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      router.push('/dashboard');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Password reset link sent to your email!');
    setShowForgotPassword(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">DUOMATE</h1>
          <p className="text-gray-400">Your Student Service Platform</p>
        </div>

        {!showForgotPassword ? (
          <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {isSignUp ? 'Sign Up' : 'Login'}
            </h2>
            
            <form onSubmit={isSignUp ? handleSignUp : handleLogin} suppressHydrationWarning={true}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Student Email ID
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Enter your student email"
                    required
                    suppressHydrationWarning={true}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Enter your password"
                    required
                    suppressHydrationWarning={true}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-red-600 to-blue-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 whitespace-nowrap cursor-pointer"
                suppressHydrationWarning={true}
              >
                {isSignUp ? 'Create Account' : 'Login'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-3">
              {!isSignUp && (
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer"
                  suppressHydrationWarning={true}
                >
                  Forgot Password?
                </button>
              )}
              
              <div className="text-gray-400">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-red-400 hover:text-red-300 ml-2 cursor-pointer"
                  suppressHydrationWarning={true}
                >
                  {isSignUp ? 'Login' : 'Sign Up'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Reset Password
            </h2>
            
            <form onSubmit={handleForgotPassword} suppressHydrationWarning={true}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Student Email ID
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter your student email"
                  required
                  suppressHydrationWarning={true}
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 whitespace-nowrap cursor-pointer"
                suppressHydrationWarning={true}
              >
                Send Reset Link
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-gray-400 hover:text-gray-300 text-sm cursor-pointer"
                suppressHydrationWarning={true}
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
