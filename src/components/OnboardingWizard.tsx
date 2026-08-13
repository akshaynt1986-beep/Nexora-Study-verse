import React, { useState } from 'react';
import { Target, Calendar, Clock, Award, Check, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { UserAccount } from '../types';
import { AuthService } from '../services/authService';

interface OnboardingWizardProps {
  user: UserAccount;
  onComplete: (updatedUser: UserAccount) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [exam, setExam] = useState<'JEE' | 'NEET'>(user.exam || 'JEE');
  const [targetExam, setTargetExam] = useState<'JEE Main' | 'JEE Advanced' | 'NEET'>(
    user.targetExam || 'JEE Main'
  );
  const [classGrade, setClassGrade] = useState<'11' | '12' | 'Dropper'>(user.classGrade || '12');
  const [targetYear, setTargetYear] = useState<number>(user.targetYear || 2026);
  const [targetScore, setTargetScore] = useState<string>('99.5+ Percentile / AIR < 1000');
  const [targetCollege, setTargetCollege] = useState<string>('IIT Bombay / AIIMS New Delhi');
  const [dailyHours, setDailyHours] = useState<number>(8);
  const [prepLevel, setPrepLevel] = useState<'Not Started' | 'Beginner' | 'Intermediate' | 'Advanced'>(
    'Not Started'
  );

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Save onboarding config
      const updatedAccount: UserAccount = {
        ...user,
        exam,
        targetExam,
        classGrade,
        targetYear,
        targetScoreRank: targetScore,
        targetCollege,
        dailyStudyHours: dailyHours,
        prepLevel,
        isOnboarded: true,
      };

      AuthService.updateAccount(updatedAccount);
      onComplete(updatedAccount);
    }
  };

  return (
    <div className="min-h-screen bg-[#03050d] text-white flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-black">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-10 shadow-[0_0_60px_rgba(34,211,238,0.2)]">
        {/* Step Indicator Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-extrabold">
              {step}/5
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Aspirant System Setup
              </div>
              <div className="text-sm font-black text-white">
                {step === 1 && 'Target Exam & Goal'}
                {step === 2 && 'Class & Academic Standing'}
                {step === 3 && 'Target Score & Rank Goal'}
                {step === 4 && 'Daily Study Commitment'}
                {step === 5 && 'Current Preparation Baseline'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`w-3 h-1.5 rounded-full transition-all ${
                  s === step
                    ? 'w-6 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]'
                    : s < step
                    ? 'bg-cyan-600'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Exam Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Which competitive exam are you preparing for?</h2>
            <p className="text-xs text-slate-400">
              NEXORA will customize your syllabus roadmap, question banks, and AI tutor models specifically for this target.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setExam('JEE');
                  setTargetExam('JEE Main');
                }}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  exam === 'JEE'
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-lg font-black text-white mb-1">JEE (Main & Advanced)</div>
                <div className="text-xs text-slate-400">Engineering — Physics, Chemistry, Mathematics</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setExam('NEET');
                  setTargetExam('NEET');
                }}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  exam === 'NEET'
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-lg font-black text-white mb-1">NEET UG</div>
                <div className="text-xs text-slate-400">Medical — Physics, Chemistry, Biology (Botany & Zoology)</div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Class Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">What is your current class standing?</h2>
            <p className="text-xs text-slate-400">
              This helps NEXORA organize your 11th vs 12th syllabus priority and backlog schedules.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {(['11', '12', 'Dropper'] as const).map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setClassGrade(grade)}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    classGrade === grade
                      ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-lg font-black text-white">Class {grade}</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {grade === '11' && 'First Year Prep'}
                    {grade === '12' && 'Board & Final Prep'}
                    {grade === 'Dropper' && 'Full Focus Repeater'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Target Score & Rank */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Set Your Target Rank & Dream College</h2>
            <p className="text-xs text-slate-400">
              Clear goals drive high performance. Enter your score target and dream institute.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Target Score / Percentile Goal
                </label>
                <input
                  type="text"
                  value={targetScore}
                  onChange={(e) => setTargetScore(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl py-3 px-4 text-sm text-white focus:outline-none transition-all"
                  placeholder="e.g. 99.8 Percentile / 690 Score"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Dream College / Institute
                </label>
                <input
                  type="text"
                  value={targetCollege}
                  onChange={(e) => setTargetCollege(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl py-3 px-4 text-sm text-white focus:outline-none transition-all"
                  placeholder="e.g. IIT Bombay (CS) / AIIMS New Delhi"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Daily Study Hours Goal */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">How many hours can you study daily?</h2>
            <p className="text-xs text-slate-400">
              NEXORA's Smart Planner uses this parameter to auto-distribute study lectures, practice sets, and backlog tasks.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[6, 8, 10, 12].map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => setDailyHours(hours)}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    dailyHours === hours
                      ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-2xl font-black text-cyan-400">{hours} Hrs</div>
                  <div className="text-[11px] text-slate-400 mt-1">Per Day</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Current Baseline */}
        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Current Preparation Baseline</h2>
            <p className="text-xs text-slate-400">
              All new accounts start with ZERO fake progress (0 XP, Level 1). Select your current preparation feel.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {(['Not Started', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setPrepLevel(lvl)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    prepLevel === lvl
                      ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-sm font-bold text-white">{lvl}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {lvl === 'Not Started' && 'Starting from scratch'}
                    {lvl === 'Beginner' && 'Started basic theory'}
                    {lvl === 'Intermediate' && 'Syllabus partially covered'}
                    {lvl === 'Advanced' && 'Revising & solving PYQs'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Button */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
          <button
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-xl text-sm font-extrabold text-black bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 hover:opacity-95 shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all flex items-center gap-2"
          >
            {step === 5 ? 'Initialize NEXORA OS' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
