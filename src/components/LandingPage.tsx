import React, { useState } from 'react';
import {
  Brain,
  Compass,
  Flame,
  Globe,
  Layers,
  Sparkles,
  Target,
  Zap,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Award,
  Clock,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface LandingPageProps {
  onStartSignUp: () => void;
  onStartLogin: () => void;
  onEnterDemoMode: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartSignUp,
  onStartLogin,
  onEnterDemoMode,
}) => {
  return (
    <div className="min-h-screen bg-[#03050b] text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden relative">
      {/* Background Animated Neon Grids & Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-[-100px] w-[500px] h-[500px] bg-purple-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-100px] w-[600px] h-[600px] bg-rose-600/10 blur-[150px] pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-600 p-[2px] shadow-[0_0_20px_rgba(34,211,238,0.5)]">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400">
              NEXORA
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-widest text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              JEE / NEET OS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onEnterDemoMode}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-900/60 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Preview Demo
          </button>
          <button
            onClick={onStartLogin}
            className="px-4 py-2 rounded-lg text-sm font-bold text-slate-200 hover:text-white hover:bg-white/5 transition-all"
          >
            Log In
          </button>
          <button
            onClick={onStartSignUp}
            className="px-5 py-2.5 rounded-xl text-sm font-extrabold text-black bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 hover:opacity-95 shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all flex items-center gap-2"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-8 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>The All-In-One Intelligent Operating System for Rankers</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] max-w-5xl mx-auto mb-6">
          Your Preparation. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
            Your Progress.
          </span>{' '}
          Your Rank.
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed mb-10">
          NEXORA combines AI Tutoring, Complete JEE/NEET Syllabus Roadmaps, PYQ Practice,
          Timed Mock Tests, Mistake Books, Spaced Repetition, and Reference Libraries into one unified anime-inspired experience.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <button
            onClick={onStartSignUp}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-extrabold text-black bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 hover:scale-105 transition-all shadow-[0_0_35px_rgba(34,211,238,0.5)] flex items-center justify-center gap-3"
          >
            Create Your Rank Account
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onEnterDemoMode}
            className="w-full sm:w-auto px-6 py-4 rounded-xl text-base font-bold text-cyan-300 bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400/60 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Explore Demo Mode
          </button>
        </div>

        {/* Highlight Stats Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">100%</div>
            <div className="text-xs text-slate-400 font-medium">Syllabus Roadmaps</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="text-2xl sm:text-3xl font-black text-blue-400">2019-2026</div>
            <div className="text-xs text-slate-400 font-medium">Authentic PYQs</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="text-2xl sm:text-3xl font-black text-purple-400">24 / 7</div>
            <div className="text-xs text-slate-400 font-medium">Server AI Doubt Solver</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">0 Data Spills</div>
            <div className="text-xs text-slate-400 font-medium">Isolated Fresh Account</div>
          </div>
        </div>
      </main>

      {/* Feature Showcase Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-white/10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Everything You Need To Slay JEE & NEET
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            No more switching between 5 different productivity apps. NEXORA handles your entire preparation journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-cyan-500/20 hover:border-cyan-400/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Tutor & Study Mentor</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Instant step-by-step doubt resolution, conceptual shortcuts, and personalized strategy guidance powered by Gemini.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-blue-500/20 hover:border-blue-400/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Complete Syllabus Roadmap</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Track chapter-by-chapter and topic-by-topic progress across 11th and 12th Physics, Chemistry, Maths, and Biology.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-purple-500/20 hover:border-purple-400/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">PYQ Engine & Mock Tests</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Timed chapter tests and full mock exams with automated score calculation and weak area diagnostic analysis.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-rose-500/20 hover:border-rose-400/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Mistake Book & Spaced Repetition</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Log wrong questions, tag mistake types (Calculation, Concept, Silly Error), and review automatically on Day 1, 3, 7, 14, 30.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-emerald-500/20 hover:border-emerald-400/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Reference Library & User PDFs</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Curated official links to NCERT, HC Verma, IE Irodov, and Balaji books + upload and analyze your own PDF study materials.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-amber-500/20 hover:border-amber-400/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Rank E to SSS Progression</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Gamified XP leveling, study streak flames, focus timers, ambient rain audio, and weekly 75-question Boss Battles.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-xs text-slate-400">
        <p>NEXORA — Designed for JEE Main, JEE Advanced & NEET Aspirants</p>
      </footer>
    </div>
  );
};
