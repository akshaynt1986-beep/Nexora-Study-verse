import React from 'react';
import {
  Sparkles,
  Flame,
  Target,
  Compass,
  FileCheck2,
  BookOpen,
  Clock,
  TrendingUp,
  RotateCcw,
  Plus,
  CalendarDays,
  CheckCircle2,
  BookMarked
} from 'lucide-react';
import { TabId, UserAccount, UserStats } from '../types';

interface DashboardProps {
  theme?: any;
  user: UserAccount | null;
  stats: UserStats;
  planner?: any;
  setActiveTab?: (tab: TabId) => void;
  onNavigateTab?: (tab: TabId) => void;
  onUpdateStats?: (newStats: UserStats) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  stats,
  setActiveTab,
  onNavigateTab,
}) => {
  const handleNavigate = (tab: TabId) => {
    if (setActiveTab) setActiveTab(tab);
    if (onNavigateTab) onNavigateTab(tab);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const studyProgressPercent = Math.min(
    100,
    Math.round((stats.dailyStudyHoursToday / (user?.dailyStudyHours || 8)) * 100)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Desk Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-[#121422]/90 border border-purple-500/20 shadow-[0_4px_25px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono font-medium mb-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Personal Study Desk • {user?.exam || 'JEE / NEET'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-100 tracking-tight">
              {getGreeting()},{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-purple-400">
                {user?.name || 'Aspirant'}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-normal">
              Let's make today's study session count. • Goal:{' '}
              <span className="text-purple-300 font-medium">{user?.targetScoreRank || '99+ Percentile'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => handleNavigate('focus')}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(168,85,247,0.3)]"
            >
              <Clock className="w-4 h-4" />
              Start Study Session
            </button>
            <button
              onClick={() => handleNavigate('planner')}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-medium text-slate-200 bg-slate-800/80 border border-white/10 hover:bg-slate-700/80 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 text-purple-300" />
              Planner
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-[#121422]/80 border border-purple-500/15">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Level & Rank</div>
          <div className="text-lg font-mono font-bold text-purple-300 mt-1">Lvl {stats.level}</div>
          <div className="text-[10px] text-slate-400 mt-0.5 truncate">{stats.rankTitle}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#121422]/80 border border-purple-500/15">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">XP & Coins</div>
          <div className="text-lg font-mono font-bold text-violet-300 mt-1">{stats.xp} XP</div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">{stats.coins} Coins</div>
        </div>

        <div className="p-4 rounded-xl bg-[#121422]/80 border border-purple-500/15">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Study Streak</div>
          <div className="text-lg font-mono font-bold text-amber-400 mt-1 flex items-center gap-1">
            <Flame className="w-4 h-4 text-amber-400" />
            {stats.currentStreak}d
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">Best: {stats.longestStreak}d</div>
        </div>

        <div className="p-4 rounded-xl bg-[#121422]/80 border border-purple-500/15">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Today's Focus</div>
          <div className="text-lg font-mono font-bold text-sky-300 mt-1">
            {stats.dailyStudyHoursToday.toFixed(1)} / {user?.dailyStudyHours || 8}h
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
            Total: {(stats.totalFocusMinutes / 60).toFixed(1)}h
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#121422]/80 border border-purple-500/15">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Questions Solved</div>
          <div className="text-lg font-mono font-bold text-emerald-400 mt-1">{stats.questionsSolved}</div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">PYQs: {stats.pyqsSolved}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#121422]/80 border border-purple-500/15">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Mock Tests & Acc</div>
          <div className="text-lg font-mono font-bold text-rose-300 mt-1">{stats.mockTestsCount} Tests</div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">Acc: {stats.accuracyPercentage}%</div>
        </div>
      </div>

      {/* TODAY'S STUDY NOTEBOOK CARD (Requirement #10) */}
      <div className="p-6 rounded-2xl bg-[#121422]/90 border border-purple-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <BookMarked className="w-5 h-5 text-purple-300" />
            <h2 className="text-base font-heading font-bold text-slate-100">
              Today's Study Plan & Notebook
            </h2>
          </div>
          <button
            onClick={() => handleNavigate('planner')}
            className="text-xs font-mono text-purple-300 hover:text-purple-200 flex items-center gap-1.5 bg-purple-950/40 px-3 py-1.5 rounded-lg border border-purple-500/20 transition-all"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Smart Planner</span>
          </button>
        </div>

        {/* Notebook Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="p-4 rounded-xl bg-[#0f111d] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-purple-300 font-semibold uppercase">Physics</span>
              <span className="text-slate-400">2h 10m targeted</span>
            </div>
            <div className="text-sm font-medium text-slate-200">Electrostatics & Field Theory</div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span>15 Concept PYQs & Derivations</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0f111d] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-indigo-300 font-semibold uppercase">Chemistry</span>
              <span className="text-slate-400">1h 30m targeted</span>
            </div>
            <div className="text-sm font-medium text-slate-200">Chemical Bonding & VSEPR</div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Formula Vault & Molecular Geometry</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0f111d] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-rose-300 font-semibold uppercase">Mathematics / Bio</span>
              <span className="text-slate-400">1h 45m targeted</span>
            </div>
            <div className="text-sm font-medium text-slate-200">
              {user?.exam === 'NEET' ? 'Genetics & Human Physiology' : 'Limits & Continuity Drill'}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Timed Practice & Mistake Book</span>
            </div>
          </div>
        </div>

        {/* Daily Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Daily Study Goal Progress</span>
            <span className="text-purple-300 font-semibold">{studyProgressPercent}% Completed</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800/80 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-violet-400 transition-all duration-500"
              style={{ width: `${studyProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Desk Launch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => handleNavigate('roadmap')}
          className="p-5 rounded-2xl bg-[#121422]/80 border border-purple-500/15 hover:border-purple-400/40 transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-3 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-heading font-bold text-slate-100 mb-1">Syllabus Roadmap</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Track 11th & 12th chapters topic-by-topic.</p>
        </button>

        <button
          onClick={() => handleNavigate('pyqs')}
          className="p-5 rounded-2xl bg-[#121422]/80 border border-purple-500/15 hover:border-purple-400/40 transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-3 group-hover:scale-105 transition-transform">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-heading font-bold text-slate-100 mb-1">PYQ Practice</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Authentic 2016–2026 JEE & NEET questions.</p>
        </button>

        <button
          onClick={() => handleNavigate('mistake-book')}
          className="p-5 rounded-2xl bg-[#121422]/80 border border-purple-500/15 hover:border-purple-400/40 transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-3 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-heading font-bold text-slate-100 mb-1">Mistake Book</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Log incorrect solutions to prevent repeat errors.</p>
        </button>

        <button
          onClick={() => handleNavigate('formula-vault')}
          className="p-5 rounded-2xl bg-[#121422]/80 border border-purple-500/15 hover:border-purple-400/40 transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-3 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-heading font-bold text-slate-100 mb-1">Formula Vault</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Digital formula notebook & key definitions.</p>
        </button>
      </div>
    </div>
  );
};
