"use client";

import Link from "next/link";
import { MessageCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../lib/auth-context";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Suspense } from "react";

export function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const message = searchParams.get('message');
  const errorParam = searchParams.get('error');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const result = await signIn(email, password);
      if (result.success) {
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        setError(result.error || 'Google sign in failed');
      }
    } catch (err) {
      setError('Something went wrong with Google sign in.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
            <img src="/pentastudio.svg" alt="PentaStudio Logo" className="h-7 w-7 sm:h-8 sm:w-8" />
            <span className="text-xl sm:text-2xl font-bold text-gray-900 font-primary">whisprmail</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 font-primary">Welcome back</h1>
          <p className="text-gray-600 font-secondary text-sm sm:text-base">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
          {message && (
            <div className="text-green-600 text-sm text-center bg-green-50 p-2 sm:p-3 rounded-lg mb-4 sm:mb-6">
              {message}
            </div>
          )}
          {errorParam && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 sm:p-3 rounded-lg mb-4 sm:mb-6">
              {errorParam === 'google_auth_failed' ? 'Google authentication failed. Please try again.' :
               errorParam === 'no_auth_code' ? 'Authentication code not received. Please try again.' :
               decodeURIComponent(errorParam)}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 text-sm sm:text-base"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  className="h-4 w-4 text-custom-blue focus:ring-custom-blue border-gray-300 rounded mt-0.5"
                />
                <label htmlFor="remember" className="ml-2 text-xs sm:text-sm text-gray-700">
                  Remember me
                </label>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 sm:p-3 rounded-lg">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-custom-blue text-white py-2 px-4 rounded-lg hover:bg-custom-blue transition-colors font-semibold disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-5 sm:mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-5 sm:mt-6">
              <button 
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">{googleLoading ? 'Signing in...' : 'Google'}</span>
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-5 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-custom-blue hover:text-custom-blue font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPageWithSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
} 