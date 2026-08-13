import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Target,
  Award,
  Flame,
  Zap,
  BarChart3,
  CheckCircle2,
  Edit2,
  Sparkles,
} from 'lucide-react';
import { NexoraTheme, UserAccount, UserStats } from '../types';
import { AuthService } from '../services/authService';
import { AudioSynthService } from '../services/audioSynth';

interface ProfileTargetsProps {
  theme: NexoraTheme;
  user: UserAccount | null;
  stats: UserStats;
  onUpdateAccount: (account: UserAccount) => void;
}

export const ProfileTargets: React.FC<ProfileTargetsProps> = ({
  theme,
  user,
  stats,
  onUpdateAccount,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [targetExam, setTargetExam] = useState(user?.targetExam || 'JEE Main');
  const [targetScore, setTargetScore] = useState(user?.targetScoreRank || '99.5+ Percentile');
  const [targetCollege, setTargetCollege] = useState(user?.targetCollege || 'IIT Bombay - Computer Science');
  const [dailyHours, setDailyHours] = useState(user?.dailyStudyHours || 8);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updated: UserAccount = {
      ...user,
      name,
      targetExam,
      targetScoreRank: targetScore,
      targetCollege,
      dailyStudyHours: Number(dailyHours),
    };

    AuthService.updateAccount(updated);
    onUpdateAccount(updated);
    setIsEditing(false);
    AudioSynthService.playSuccessSound();
  };

  const nextLevelXp = stats.level * 500;
  const xpPercent = Math.min(100, Math.round((stats.xp / nextLevelXp) * 100));

  return (
    <div className="space-y-6">
      {/* Aspirant Hero Rank Card */}
      <div className={`p-6 sm:p-8 rounded-3xl ${theme.cardBg} ${theme.cardBorder} space-y-6 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 z-10 relative">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-600 p-[2px] shadow-[0_0_25px_rgba(34,211,238,0.5)] shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-cyan-400">Lvl {stats.level}</span>
                <span className="text-[9px] font-black uppercase text-slate-400">Hunter</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-white">{user?.name || 'Aspirant'}</h1>
                <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-xs font-black">
                  {stats.rankTitle}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-400 mt-1">
                {user?.exam} Aspirant • Target {user?.targetYear} • {user?.classGrade}th Class
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-rose-500/30 flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500 fill-rose-500" />
              <div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase">Streak</div>
                <div className="text-sm font-black text-white">{stats.currentStreak} Days</div>
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase">Total XP</div>
                <div className="text-sm font-black text-white">{stats.xp} XP</div>
              </div>
            </div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="space-y-1.5 pt-2 z-10 relative">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Level Progression</span>
            <span className="text-cyan-400">
              {stats.xp} / {nextLevelXp} XP ({xpPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Target College & Rank Configuration */}
      <div className={`p-6 rounded-3xl ${theme.cardBg} ${theme.cardBorder} space-y-6`}>
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" /> Target Exam & Goal Settings
          </h3>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-extrabold text-xs border border-cyan-500/30 flex items-center gap-1.5 transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Targets'}</span>
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Aspirant Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white font-bold outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Target Exam Mode</label>
                <select
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value as any)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white font-bold outline-none"
                >
                  <option value="JEE Main">JEE Main</option>
                  <option value="JEE Advanced">JEE Advanced</option>
                  <option value="NEET">NEET UG</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Target Score / Percentile</label>
                <input
                  type="text"
                  placeholder="e.g. 99.8+ Percentile / AIR < 500"
                  value={targetScore}
                  onChange={(e) => setTargetScore(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Target College & Branch</label>
                <input
                  type="text"
                  placeholder="e.g. IIT Bombay Computer Science"
                  value={targetCollege}
                  onChange={(e) => setTargetCollege(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white font-bold outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(34,211,238,0.3)]"
              >
                Save Updated Profile
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Target Exam</div>
              <div className="text-base font-black text-white">{user?.targetExam}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Target Score</div>
              <div className="text-base font-black text-cyan-400">{user?.targetScoreRank}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Dream College</div>
              <div className="text-base font-black text-amber-300">{user?.targetCollege || 'Top Tier Institute'}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Daily Goal</div>
              <div className="text-base font-black text-emerald-400">{user?.dailyStudyHours || 8} Hours / Day</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
