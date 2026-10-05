import React, { useState } from 'react';
import { Wifi, Battery } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { UtilityPageType } from './StandardUtilityPages';

interface FigmaAuthScreenProps {
  onSignInSuccess: (email: string) => void;
  onSkipToDashboard: () => void;
  onOpenUtilityPage?: (page: UtilityPageType) => void;
}

export const FigmaAuthScreen: React.FC<FigmaAuthScreenProps> = ({
  onSignInSuccess,
  onSkipToDashboard,
  onOpenUtilityPage,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    soundManager.playTap();
    setIsLoading(true);
    setTimeout(() => {
      soundManager.playSuccess();
      setIsLoading(false);
      onSignInSuccess(email.trim());
    }, 600);
  };

  const handleSocialLogin = (provider: 'Google' | 'Apple') => {
    soundManager.playTap();
    setIsLoading(true);
    setTimeout(() => {
      soundManager.playSuccess();
      setIsLoading(false);
      onSignInSuccess(provider === 'Google' ? 'operator@relief.org' : 'coordinator@apple.id');
    }, 500);
  };

  return (
    <div className="w-full min-h-[750px] bg-white text-neutral-900 flex flex-col justify-between p-6 select-none font-sans relative">
      {/* iOS Top Status Bar (9:41) */}
      <div className="flex items-center justify-between text-xs text-neutral-800 pt-1 pb-4">
        <span className="font-bold tracking-tight text-sm">9:41</span>
        <div className="flex items-center gap-1.5 text-neutral-800">
          {/* Signal bars */}
          <div className="flex items-end gap-0.5 h-3">
            <div className="w-0.5 h-1 bg-neutral-900 rounded-sm" />
            <div className="w-0.5 h-1.5 bg-neutral-900 rounded-sm" />
            <div className="w-0.5 h-2 bg-neutral-900 rounded-sm" />
            <div className="w-0.5 h-2.5 bg-neutral-900 rounded-sm" />
          </div>
          <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
          <Battery className="w-4 h-4 stroke-[2.5]" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full my-auto py-8">
        {/* App Name */}
        <h1 className="font-bold text-2xl tracking-tight text-neutral-900 mb-8">
          App name
        </h1>

        {/* Subtitle */}
        <div className="text-center mb-6">
          <h2 className="text-sm font-semibold text-neutral-900 mb-1">
            Create an account
          </h2>
          <p className="text-xs text-neutral-500">
            Enter your email to sign up for this app
          </p>
        </div>

        {/* Email Input Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-3 mb-4">
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@domain.com"
              className="w-full bg-white border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors shadow-xs"
            />
          </div>

          {/* Black Continue Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center transition-all active:scale-[0.98] shadow-sm disabled:opacity-70"
          >
            {isLoading ? 'Signing in...' : 'Continue'}
          </button>
        </form>

        {/* "or" divider */}
        <div className="w-full flex items-center justify-center my-3">
          <span className="text-xs text-neutral-400 font-medium">or</span>
        </div>

        {/* Social Login Buttons */}
        <div className="w-full space-y-2.5 mb-6">
          {/* Continue with Google */}
          <button
            type="button"
            onClick={() => handleSocialLogin('Google')}
            className="w-full h-10 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-medium flex items-center justify-center gap-2.5 transition-colors shadow-xs active:scale-[0.98]"
          >
            {/* Google colored G icon */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Continue with Apple */}
          <button
            type="button"
            onClick={() => handleSocialLogin('Apple')}
            className="w-full h-10 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-medium flex items-center justify-center gap-2.5 transition-colors shadow-xs active:scale-[0.98]"
          >
            {/* Apple black icon */}
            <svg className="w-3.5 h-3.5 fill-current text-neutral-900" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.42-6-9.13-10.74-19.46-14.21-31-3.48-11.53-5.22-22.39-5.22-32.57 0-14.88 3.7-27.18 11.1-36.88 7.4-9.71 16.94-14.67 28.61-14.88 5.43 0 11.3 1.25 17.62 3.75 6.31 2.5 10.22 3.8 11.72 3.89 1.19-.1 5.37-1.49 12.54-4.18 7.18-2.69 13.06-3.83 17.64-3.43 13.8 1.19 24.34 6.74 31.62 16.63-12.07 7.37-17.96 17.47-17.67 30.3.3 10.3 4.25 18.8 11.85 25.5 3.59 3.2 7.6 5.6 12.02 7.2-2.5 7.6-5.69 15.2-9.56 22.8zM119.22 33.15c0-7.39 2.66-14.42 7.97-21.09 5.31-6.68 11.85-10.97 19.61-12.87.21 1.7.32 3.3.32 4.8 0 7.28-2.77 14.4-8.31 21.36-5.54 6.96-12.18 11.19-19.92 12.69-.11-1.6-.17-3.23-.17-4.89z" />
            </svg>
            <span>Continue with Apple</span>
          </button>
        </div>

        {/* Footer Terms & Utilities */}
        <p className="text-[10px] text-neutral-400 text-center leading-relaxed max-w-xs mb-3">
          By clicking continue, you agree to our{' '}
          <button
            type="button"
            onClick={() => onOpenUtilityPage && onOpenUtilityPage('terms_conditions')}
            className="underline hover:text-neutral-700 text-neutral-600"
          >
            Terms of Service
          </button>{' '}
          and{' '}
          <button
            type="button"
            onClick={() => onOpenUtilityPage && onOpenUtilityPage('privacy_policy')}
            className="underline hover:text-neutral-700 text-neutral-600"
          >
            Privacy Policy
          </button>
        </p>

        {/* Quick Help & Password Recovery */}
        <div className="flex items-center justify-center gap-3 text-[11px] text-neutral-500 mb-2">
          <button
            type="button"
            onClick={() => onOpenUtilityPage && onOpenUtilityPage('password_reset')}
            className="hover:text-neutral-900 underline"
          >
            Forgot Password?
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => onOpenUtilityPage && onOpenUtilityPage('cookie_preferences')}
            className="hover:text-neutral-900 underline"
          >
            Cookie Preferences
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => onOpenUtilityPage && onOpenUtilityPage('help_support')}
            className="hover:text-neutral-900 underline"
          >
            Help & Support
          </button>
        </div>

        {/* Skip to Dashboard Demo Button */}
        <button
          onClick={() => {
            soundManager.playTap();
            onSkipToDashboard();
          }}
          className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 underline mt-2"
        >
          Skip to Dashboard (Live Demo) →
        </button>
      </div>

      {/* iOS Home Indicator Bar */}
      <div className="w-32 h-1 bg-neutral-300 rounded-full mx-auto mb-1" />
    </div>
  );
};
