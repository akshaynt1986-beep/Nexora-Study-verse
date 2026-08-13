import React, { useState } from 'react';
import { X, BookOpen, RotateCcw, CheckCircle2, Clock, Target, Layers, ArrowLeft } from 'lucide-react';
import { SyllabusChapter } from '../types';

interface ChapterWorkspaceProps {
  chapter: SyllabusChapter;
  onClose: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const ChapterWorkspace: React.FC<ChapterWorkspaceProps> = ({
  chapter,
  onClose,
  onNavigateToTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'topics' | 'formulas' | 'ai-notes'>('topics');

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl overflow-y-auto p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-slate-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(34,211,238,0.2)] text-white">
        {/* Workspace Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">
                  {chapter.subject} • Class {chapter.classGrade}
                </span>
                <span className="text-xs text-slate-400 font-bold">{chapter.weightage} Weightage</span>
              </div>
              <h1 className="text-2xl font-black text-white mt-1">{chapter.name}</h1>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Workspace Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <button
            onClick={() => onNavigateToTab('pyqs')}
            className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-xs font-bold text-cyan-300 hover:bg-cyan-900/60 transition-all flex items-center justify-center gap-2"
          >
            <Target className="w-4 h-4" />
            Solve Chapter PYQs
          </button>

          <button
            onClick={() => onNavigateToTab('revision')}
            className="p-3 rounded-xl bg-blue-950/60 border border-blue-500/30 text-xs font-bold text-blue-300 hover:bg-blue-900/60 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Spaced Repetition
          </button>

          <button
            onClick={() => onNavigateToTab('formula-vault')}
            className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs font-bold text-purple-300 hover:bg-purple-900/60 transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Formula Cards
          </button>

          <button
            onClick={() => onNavigateToTab('mistake-book')}
            className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-xs font-bold text-rose-300 hover:bg-rose-900/60 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Log Mistakes
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-6">
          <button
            onClick={() => setActiveSubTab('topics')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeSubTab === 'topics'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Topic Checklist ({chapter.topics.length})
          </button>
          <button
            onClick={() => setActiveSubTab('formulas')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeSubTab === 'formulas'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Essential Formulas & Shortcuts
          </button>
        </div>

        {/* Sub Tab Contents */}
        {activeSubTab === 'topics' && (
          <div className="space-y-3">
            {chapter.topics.map((t, idx) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-xs font-black flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.title}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">Status: {t.status}</span>
                  </div>
                </div>

                <div className="text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                  Ready for Practice
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'formulas' && (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <BookOpen className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-white mb-1">Formula & Concept Vault</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              View formulas tagged under {chapter.name} in the NEXORA Formula Vault.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
