import React, { useState } from 'react';
import { X, Lock, Mail, User, Target, Calendar, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { AuthService } from '../services/authService';
import { UserAccount } from '../types';

interface AuthModalProps {
  mode: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (user: UserAccount) => void;
  onSwitchMode: (newMode: 'login' | 'signup') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  mode,
  onClose,
  onSuccess,
  onSwitchMode,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [exam, setExam] = useState<'JEE' | 'NEET'>('JEE');
  const [targetYear, setTargetYear] = useState<number>(2026);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          setError('Please enter your full name.');
          return;
        }
        if (!email.trim() || !email.includes('@')) {
          setError('Please enter a valid email address.');
          return;
        }
        if (password.length < 4) {
          setError('Password must be at least 4 characters long.');
          return;
        }

        const user = AuthService.signUp(name.trim(), email.trim(), password, exam, targetYear);
        onSuccess(user);
      } else {
        if (!email.trim()) {
          setError('Please enter your email.');
          return;
        }
        const user = AuthService.login(email.trim(), password);
        onSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-950 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(34,211,238,0.25)] text-white">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center mx-auto mb-3 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {mode === 'signup' ? 'Create Your NEXORA Account' : 'Welcome Back to NEXORA'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            {mode === 'signup'
              ? 'Start your preparation from Rank E with zero fake progress.'
              : 'Log in to continue your rank progression.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-2 text-rose-300 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name / Aspirant Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="aspirant@nexora.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                required
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Target Exam
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={exam}
                    onChange={(e) => setExam(e.target.value as 'JEE' | 'NEET')}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all appearance-none"
                  >
                    <option value="JEE">JEE (Main & Adv)</option>
                    <option value="NEET">NEET UG</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Target Year
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={targetYear}
                    onChange={(e) => setTargetYear(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all appearance-none"
                  >
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                    <option value={2027}>2027</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-xl text-sm font-extrabold text-black bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 hover:opacity-95 shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-2"
          >
            {mode === 'signup' ? 'Create Free Account' : 'Log In to System'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          {mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => onSwitchMode('login')}
                className="text-cyan-400 hover:underline font-bold"
              >
                Log In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account yet?{' '}
              <button
                onClick={() => onSwitchMode('signup')}
                className="text-cyan-400 hover:underline font-bold"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
