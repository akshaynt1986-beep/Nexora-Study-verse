import React from 'react';
import {
  LayoutDashboard,
  Music,
  Compass,
  Target,
  FileCheck2,
  BookOpen,
  RotateCcw,
  Library,
  FileText,
  Calculator,
  Layers,
  CalendarDays,
  Clock,
  BarChart3,
  Calendar,
  Trophy,
  User,
  Settings,
  LogOut,
  Sparkles,
  Flame,
  ShieldCheck,
  Home,
} from 'lucide-react';
import { TabId, UserAccount, UserStats } from '../types';
export type { TabId };

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  user: UserAccount | null;
  stats: UserStats;
  onLogout: () => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  stats,
  onLogout,
  isOpen,
  onCloseMobile,
}) => {
  const navItems: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Study Desk', icon: LayoutDashboard },
    { id: 'roadmap', label: 'Syllabus Roadmap', icon: Compass },
    { id: 'pyqs', label: 'PYQ Practice', icon: Target },
    { id: 'mock-tests', label: 'Mock Tests', icon: FileCheck2 },
    { id: 'mistake-book', label: 'Mistake Book', icon: BookOpen },
    { id: 'revision', label: 'Spaced Repetition', icon: RotateCcw },
    { id: 'resource-library', label: 'Resource Library', icon: Library },
    { id: 'notes', label: 'Notes & Snippets', icon: FileText },
    { id: 'formula-vault', label: 'Formula Vault', icon: Calculator },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'planner', label: 'Smart Planner', icon: CalendarDays },
    { id: 'focus', label: 'Focus Mode & Lo-Fi', icon: Clock },
    { id: 'virtual-spaces', label: 'Virtual Spaces', icon: Home, badge: 'ROOMS' },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'calendar', label: 'Study Calendar', icon: Calendar },
    { id: 'achievements', label: 'Achievements & Milestones', icon: Trophy },
    { id: 'profile', label: 'Profile & Targets', icon: User },
    { id: 'settings', label: 'Settings & Theme', icon: Settings },
    ...(user?.isAdmin ? [{ id: 'admin' as TabId, label: 'Admin Portal', icon: ShieldCheck, badge: 'ADMIN' }] : []),
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0f111a]/95 backdrop-blur-2xl border-r border-purple-500/15 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-violet-600 p-[1.5px] shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <div className="w-full h-full bg-[#0d0e17] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-300" />
              </div>
            </div>
            <div>
              <span className="text-lg font-heading font-extrabold tracking-wider text-slate-100">
                NEXORA
              </span>
              <div className="text-[10px] font-mono text-purple-300/70 tracking-widest uppercase">
                {user?.exam || 'JEE / NEET'} Study OS
              </div>
            </div>
          </div>
        </div>

        {/* User Rank & Progress Card */}
        <div className="p-3 mx-3 my-3 rounded-2xl bg-[#141726]/80 border border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-400/30 flex items-center justify-center text-purple-300 font-mono font-bold text-xs">
              L{stats.level}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                <span className="truncate max-w-[90px]">{user?.name || 'Aspirant'}</span>
                <span className="text-[9px] font-mono text-purple-300 bg-purple-900/40 px-1.5 py-0.2 rounded border border-purple-500/30">
                  {stats.rankTitle}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                <span>{stats.xp} XP</span>
                <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                  <Flame className="w-3 h-3 text-amber-400" />
                  {stats.currentStreak}d streak
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-purple-500/15 text-purple-200 border border-purple-500/30 font-semibold shadow-[0_2px_12px_rgba(168,85,247,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-300' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[9px] font-mono tracking-wider bg-purple-950/80 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer / Sign Out */}
        <div className="p-3 border-t border-white/5 bg-[#0d0e17]/80">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-300 hover:bg-rose-950/30 border border-rose-500/20 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
