import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Target,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { NexoraTheme, UserAccount } from '../types';

interface StudyCalendarProps {
  theme: NexoraTheme;
  user: UserAccount | null;
}

export const StudyCalendar: React.FC<StudyCalendarProps> = ({ theme, user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Target exam dates
  const examTargetYear = user?.targetYear || 2026;
  const jeeMain1Date = new Date(`${examTargetYear}-01-24`);
  const jeeMain2Date = new Date(`${examTargetYear}-04-06`);
  const jeeAdvDate = new Date(`${examTargetYear}-05-24`);
  const neetDate = new Date(`${examTargetYear}-05-03`);

  const calculateDaysLeft = (target: Date) => {
    const diff = target.getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  const jee1Days = calculateDaysLeft(jeeMain1Date);
  const jee2Days = calculateDaysLeft(jeeMain2Date);
  const jeeAdvDays = calculateDaysLeft(jeeAdvDate);
  const neetDays = calculateDaysLeft(neetDate);

  // Calendar days calculation
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl ${theme.cardBg} ${theme.cardBorder} flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden`}>
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 text-xs font-extrabold border border-cyan-500/30">
            <CalendarIcon className="w-4 h-4" /> Exam Countdown & Milestone Timeline
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Target Exam Countdown
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time countdown clocks for JEE Main, JEE Advanced, and NEET. Align your daily targets with the official exam calendar.
          </p>
        </div>
      </div>

      {/* Countdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-500/40 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">JEE Main Session 1</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{jee1Days} Days</div>
          <div className="text-[11px] text-slate-400 font-bold">Target: January {examTargetYear}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-500/40 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-blue-400 uppercase tracking-wider">JEE Main Session 2</span>
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{jee2Days} Days</div>
          <div className="text-[11px] text-slate-400 font-bold">Target: April {examTargetYear}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/40 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-purple-400 uppercase tracking-wider">JEE Advanced</span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{jeeAdvDays} Days</div>
          <div className="text-[11px] text-slate-400 font-bold">Target: May {examTargetYear}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">NEET UG</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{neetDays} Days</div>
          <div className="text-[11px] text-slate-400 font-bold">Target: May {examTargetYear}</div>
        </div>
      </div>

      {/* Monthly Interactive Calendar */}
      <div className={`p-6 rounded-3xl ${theme.cardBg} ${theme.cardBorder} space-y-6`}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-cyan-400" /> {monthName}
          </h3>

          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-white/10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>

          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-14 rounded-xl bg-slate-950/20" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const isToday =
              dayNum === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear();

            return (
              <div
                key={dayNum}
                className={`h-14 rounded-xl p-2 font-black flex flex-col justify-between transition-all border ${
                  isToday
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                    : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-cyan-500/30'
                }`}
              >
                <div className="text-left text-[11px]">{dayNum}</div>
                {isToday && (
                  <div className="text-[9px] font-extrabold uppercase text-cyan-400 text-center">
                    Today
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
