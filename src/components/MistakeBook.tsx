import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Trash2,
  RotateCcw,
  Tag,
  Bookmark,
  Zap,
} from 'lucide-react';
import { MistakeEntry, NexoraTheme, SubjectType } from '../types';
import { StorageService } from '../services/storage';
import { AudioSynthService } from '../services/audioSynth';

interface MistakeBookProps {
  theme: NexoraTheme;
  mistakes: MistakeEntry[];
  onUpdateMistakes: (mistakes: MistakeEntry[]) => void;
}

export const MistakeBook: React.FC<MistakeBookProps> = ({
  theme,
  mistakes,
  onUpdateMistakes,
}) => {
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New mistake form state
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newUserAnswer, setNewUserAnswer] = useState('');
  const [newCorrectAnswer, setNewCorrectAnswer] = useState('');
  const [newSubject, setNewSubject] = useState<SubjectType>('Physics');
  const [newChapter, setNewChapter] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newCategory, setNewCategory] = useState<
    'Conceptual' | 'Calculation' | 'Formula' | 'Silly Mistake' | 'Time Management'
  >('Conceptual');
  const [newWhyWrong, setNewWhyWrong] = useState('');
  const [newCorrectConcept, setNewCorrectConcept] = useState('');

  const handleAddMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText || !newWhyWrong) return;

    const entry: MistakeEntry = {
      id: 'mst_' + Date.now(),
      questionText: newQuestionText,
      userAnswer: newUserAnswer || 'Incorrect choice',
      correctAnswer: newCorrectAnswer || 'Correct option',
      subject: newSubject,
      chapter: newChapter || 'General Chapter',
      topic: newTopic || 'Core Topic',
      category: newCategory,
      whyWrong: newWhyWrong,
      correctConcept: newCorrectConcept || 'Review fundamental theory',
      dateAdded: new Date().toISOString().split('T')[0],
      reviewedCount: 0,
      mastered: false,
    };

    const updated = [entry, ...mistakes];
    onUpdateMistakes(updated);
    StorageService.saveMistakes(updated);

    // Reset Form
    setNewQuestionText('');
    setNewUserAnswer('');
    setNewCorrectAnswer('');
    setNewWhyWrong('');
    setNewCorrectConcept('');
    setShowAddModal(false);
    AudioSynthService.playSuccessSound();
  };

  const handleToggleMastered = (id: string) => {
    const updated = mistakes.map((m) =>
      m.id === id ? { ...m, mastered: !m.mastered } : m
    );
    onUpdateMistakes(updated);
    StorageService.saveMistakes(updated);
    AudioSynthService.playClickSound();
  };

  const handleDeleteMistake = (id: string) => {
    const updated = (mistakes || []).filter((m) => m.id !== id);
    onUpdateMistakes(updated);
    StorageService.saveMistakes(updated);
  };

  // Filter logic
  const filtered = (mistakes || []).filter((m) => {
    if (subjectFilter !== 'All' && m.subject !== subjectFilter) return false;
    if (categoryFilter !== 'All' && m.category !== categoryFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        m.questionText.toLowerCase().includes(q) ||
        m.chapter.toLowerCase().includes(q) ||
        m.whyWrong.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate statistics for AI pattern bar
  const totalCount = (mistakes || []).length;
  const masteredCount = (mistakes || []).filter((m) => m.mastered).length;
  const conceptualCount = (mistakes || []).filter((m) => m.category === 'Conceptual').length;
  const sillyCount = (mistakes || []).filter((m) => m.category === 'Silly Mistake' || m.category === 'Calculation').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl ${theme.cardBg} ${theme.cardBorder} flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden`}>
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950 text-rose-400 text-xs font-extrabold border border-rose-500/30">
            <BookOpen className="w-4 h-4" /> Mistake Analysis Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            NEXORA Mistake Book
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Log every error from tests, PYQs, and coaching modules. Categorize root causes to permanently convert weak spots into S-Rank strengths.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all flex items-center gap-2 z-10"
        >
          <Plus className="w-4 h-4" /> Log New Mistake
        </button>
      </div>

      {/* AI Diagnostic Insights */}
      {totalCount > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/40 to-slate-900 border border-rose-500/30 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-xs space-y-1">
            <div className="font-extrabold text-white flex items-center gap-2">
              <span>Mistake Pattern Diagnostics</span>
              <span className="text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                {masteredCount}/{totalCount} Mastered
              </span>
            </div>
            <p className="text-slate-300 font-medium">
              {sillyCount > conceptualCount
                ? `Calculation & Silly errors make up ${Math.round((sillyCount / totalCount) * 100)}% of your mistakes. Slow down on option verification!`
                : `Conceptual gaps represent ${Math.round((conceptualCount / totalCount) * 100)}% of your errors. Use the AI Doubt Solver to re-learn fundamentals.`}
            </p>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className={`p-4 rounded-2xl ${theme.cardBg} ${theme.cardBorder} flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex flex-wrap items-center gap-3">
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

          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-xl border border-white/10 text-xs">
            <Tag className="w-4 h-4 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Error Categories</option>
              <option value="Conceptual" className="bg-slate-900">Conceptual Gap</option>
              <option value="Calculation" className="bg-slate-900">Calculation Error</option>
              <option value="Formula" className="bg-slate-900">Formula Confusion</option>
              <option value="Silly Mistake" className="bg-slate-900">Silly Mistake</option>
              <option value="Time Management" className="bg-slate-900">Time Rush</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search mistakes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 font-medium outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Mistake Entries List */}
      {filtered.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl ${theme.cardBg} ${theme.cardBorder} space-y-3`}>
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-wider">
            No Mistakes Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {mistakes.length === 0
              ? 'Your mistake book is empty. Click "Log New Mistake" to record questions you want to review and master!'
              : 'No mistakes match your selected filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl ${theme.cardBg} ${theme.cardBorder} space-y-4 flex flex-col justify-between transition-all ${
                item.mastered ? 'opacity-60 grayscale-[30%]' : ''
              }`}
            >
              <div className="space-y-3">
                {/* Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-400 font-extrabold text-[10px] uppercase border border-cyan-500/30">
                      {item.subject}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-rose-950 text-rose-300 font-extrabold text-[10px] uppercase border border-rose-500/30">
                      {item.category}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-slate-500">{item.dateAdded}</span>
                </div>

                {/* Chapter & Question */}
                <div>
                  <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {item.chapter} • {item.topic}
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1 leading-snug">
                    {item.questionText}
                  </h4>
                </div>

                {/* Why Wrong & Correct Concept */}
                <div className="space-y-2 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 text-rose-200 space-y-1">
                    <div className="font-extrabold text-[10px] uppercase text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Why It Went Wrong:
                    </div>
                    <div>{item.whyWrong}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-200 space-y-1">
                    <div className="font-extrabold text-[10px] uppercase text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Correct Concept / Solution:
                    </div>
                    <div>{item.correctConcept}</div>
                  </div>
                </div>
              </div>

              {/* Footer Controls */}
              <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-3">
                <button
                  onClick={() => handleToggleMastered(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border ${
                    item.mastered
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.mastered ? 'Mastered' : 'Mark as Mastered'}</span>
                </button>

                <button
                  onClick={() => handleDeleteMistake(item.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Mistake Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-950 border border-cyan-500/30 rounded-3xl p-6 space-y-5 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" /> Log Question Mistake
            </h3>

            <form onSubmit={handleAddMistake} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
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
                  <label className="block text-slate-400 font-bold mb-1">Error Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white font-bold outline-none"
                  >
                    <option value="Conceptual">Conceptual Gap</option>
                    <option value="Calculation">Calculation Error</option>
                    <option value="Formula">Formula Confusion</option>
                    <option value="Silly Mistake">Silly Mistake</option>
                    <option value="Time Management">Time Rush</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Chapter Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rotational Motion / Electrochemistry"
                  value={newChapter}
                  onChange={(e) => setNewChapter(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Question Description</label>
                <textarea
                  rows={2}
                  placeholder="Paste or describe the question you got wrong..."
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white font-medium outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Why Did You Get It Wrong?</label>
                <textarea
                  rows={2}
                  placeholder="Identify your thought process mistake..."
                  value={newWhyWrong}
                  onChange={(e) => setNewWhyWrong(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white font-medium outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Correct Concept / Solution Takeaway</label>
                <textarea
                  rows={2}
                  placeholder="Write the key formula or concept to remember next time..."
                  value={newCorrectConcept}
                  onChange={(e) => setNewCorrectConcept(e.target.value)}
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
                  Save Mistake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
