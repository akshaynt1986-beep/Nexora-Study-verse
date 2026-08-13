import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  Plus,
  Filter,
  Sparkles,
  Calendar,
  Layers,
  Zap,
} from 'lucide-react';
import { NexoraTheme, RevisionItem, SubjectType } from '../types';
import { StorageService } from '../services/storage';
import { AudioSynthService } from '../services/audioSynth';

interface SpacedRepetitionProps {
  theme: NexoraTheme;
  revisions: RevisionItem[];
  onUpdateRevisions: (revisions: RevisionItem[]) => void;
  onRewardXpCoins: (xp: number, coins: number) => void;
}

export const SpacedRepetition: React.FC<SpacedRepetitionProps> = ({
  theme,
  revisions,
  onUpdateRevisions,
  onRewardXpCoins,
}) => {
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New revision form state
  const [newSubject, setNewSubject] = useState<SubjectType>('Physics');
  const [newChapter, setNewChapter] = useState('');
  const [newTopic, setNewTopic] = useState('');

  const handleAddRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapter) return;

    const item: RevisionItem = {
      id: 'rev_' + Date.now(),
      subject: newSubject,
      chapter: newChapter,
      topic: newTopic || 'Full Chapter Core',
      questionCount: 15,
      stage: 1,
      dueDate: new Date().toISOString().split('T')[0],
    };

    const updated = [item, ...revisions];
    onUpdateRevisions(updated);
    StorageService.saveRevisions(updated);

    setNewChapter('');
    setNewTopic('');
    setShowAddModal(false);
    AudioSynthService.playSuccessSound();
  };

  const handleMarkReviewed = (id: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const updated = revisions.map((r) => {
      if (r.id === id) {
        const nextStage = (r.stage < 5 ? r.stage + 1 : 5) as 1 | 2 | 3 | 4 | 5;
        // Spaced intervals in days: 1 -> +3d, 2 -> +7d, 3 -> +14d, 4 -> +30d
        const intervalDays = [0, 3, 7, 14, 30][nextStage - 1];
        const nextDueDate = new Date(Date.now() + intervalDays * 86400000)
          .toISOString()
          .split('T')[0];

        return {
          ...r,
          stage: nextStage,
          lastReviewedDate: todayStr,
          dueDate: nextDueDate,
        };
      }
      return r;
    });

    onUpdateRevisions(updated);
    StorageService.saveRevisions(updated);
    onRewardXpCoins(40, 15);
    AudioSynthService.playClickSound();
  };

  const filtered = (revisions || []).filter((r) => {
    if (subjectFilter !== 'All' && r.subject !== subjectFilter) return false;
    return true;
  });

  const dueTodayCount = (revisions || []).filter((r) => {
    const today = new Date().toISOString().split('T')[0];
    return r.dueDate <= today;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl ${theme.cardBg} ${theme.cardBorder} flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden`}>
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 text-xs font-extrabold border border-cyan-500/30">
            <RotateCcw className="w-4 h-4 animate-spin-slow" /> Ebbinghaus Memory Retention Algorithm
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Spaced Repetition Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Scientifically scheduled revision intervals (Day 1, 3, 7, 14, 30) ensuring zero memory decay for high-weightage JEE & NEET chapters.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all flex items-center gap-2 z-10"
        >
          <Plus className="w-4 h-4" /> Queue Chapter for Revision
        </button>
      </div>

      {/* Summary Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Due Today</div>
            <div className="text-2xl font-black text-white mt-0.5">{dueTodayCount} Chapters</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Total Tracked</div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">{revisions.length} Topics</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/30 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Stage 5 Mastered</div>
            <div className="text-2xl font-black text-indigo-400 mt-0.5">
              {(revisions || []).filter((r) => r.stage === 5).length}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={`p-4 rounded-2xl ${theme.cardBg} ${theme.cardBorder} flex items-center justify-between`}>
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-xl border border-white/10 text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="bg-transparent text-white font-bold outline-none cursor-pointer"
          >
            <option value="All" className="bg-slate-900">All Subjects</option>
            <option value="Physics" className="bg-slate-900">Physics</option>
            <option value="Chemistry" className="bg-slate-900">Chemistry</option>
            <option value="Mathematics" className="bg-slate-900">Mathematics</option>
            <option value="Biology" className="bg-slate-900">Biology</option>
          </select>
        </div>
      </div>

      {/* Revision Items Grid */}
      {filtered.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl ${theme.cardBg} ${theme.cardBorder} space-y-3`}>
          <RotateCcw className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-wider">
            No Revisions Queued
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "Queue Chapter for Revision" to start tracking spaced repetition intervals.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const today = new Date().toISOString().split('T')[0];
            const isDue = item.dueDate <= today;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl ${theme.cardBg} ${theme.cardBorder} space-y-4 flex flex-col justify-between transition-all`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-400 font-extrabold text-[10px] uppercase border border-cyan-500/30">
                      {item.subject}
                    </span>

                    <span
                      className={`px-2.5 py-1 rounded-lg font-black text-[10px] uppercase border ${
                        isDue
                          ? 'bg-rose-950 text-rose-400 border-rose-500/40 animate-pulse'
                          : 'bg-slate-900 text-slate-400 border-white/10'
                      }`}
                    >
                      {isDue ? 'Due Today' : `Due: ${item.dueDate}`}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-white">{item.chapter}</h4>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{item.topic}</p>
                  </div>

                  {/* Stage Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span>Retention Stage</span>
                      <span className="text-cyan-400">Stage {item.stage} / 5</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                        style={{ width: `${(item.stage / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleMarkReviewed(item.id)}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(34,211,238,0.25)] transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Complete Revision (+40 XP)
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-950 border border-cyan-500/30 rounded-3xl p-6 space-y-4 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-cyan-400" /> Add Topic to Revision Queue
            </h3>

            <form onSubmit={handleAddRevision} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value as SubjectType)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white font-bold outline-none"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Chapter Name</label>
                <input
                  type="text"
                  placeholder="e.g. Thermodynamics / Organic Mechanisms"
                  value={newChapter}
                  onChange={(e) => setNewChapter(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white font-medium outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Subtopic / Key Focus</label>
                <input
                  type="text"
                  placeholder="e.g. Carnot Engine & Entropy"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white font-medium outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black uppercase tracking-wider"
                >
                  Start Spaced Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
