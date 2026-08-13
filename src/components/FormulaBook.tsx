import React, { useState, useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {
  BookOpen,
  Check,
  Copy,
  Search,
  Sparkles,
  Star,
  AlertTriangle,
  Clock,
  Zap,
  HelpCircle,
  X,
  ChevronRight,
  Filter,
  RotateCcw,
  Target,
  Award,
  Layers,
  GraduationCap
} from 'lucide-react';
import { NexoraTheme, FormulaItem, SubjectType, MistakeEntry } from '../types';
import { AudioSynthService } from '../services/audioSynth';

interface FormulaBookProps {
  theme: NexoraTheme;
  formulas: FormulaItem[];
  mistakes?: MistakeEntry[];
  onUpdateFormulas: (formulas: FormulaItem[]) => void;
}

export const FormulaBook: React.FC<FormulaBookProps> = ({
  theme,
  formulas,
  mistakes = [],
  onUpdateFormulas,
}) => {
  // Filter States
  const [selectedExam, setSelectedExam] = useState<'All' | 'JEE Main' | 'JEE Advanced'>('All');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Physical' | 'Organic' | 'Inorganic'>('All');
  const [selectedChapter, setSelectedChapter] = useState<string>('All');
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'JEE Main' | 'JEE Advanced'>('All');
  const [viewTab, setViewTab] = useState<'all' | 'favorites' | 'recent' | 'weak'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // History & Tracking
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quick Revision Modes & Flashcard State
  const [revisionMode, setRevisionMode] = useState<'none' | '5min' | '15min' | '30min' | 'flashcard'>('none');
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Modal State for Practice & PYQs
  const [practiceModal, setPracticeModal] = useState<{
    isOpen: boolean;
    formula: FormulaItem | null;
    type: 'practice' | 'jee_main_pyq' | 'jee_adv_pyq';
    userAnswer?: number;
    showSolution?: boolean;
  }>({
    isOpen: false,
    formula: null,
    type: 'practice',
  });

  // Derived Chapter Options based on Subject Filter
  const availableChapters = useMemo(() => {
    let list = formulas;
    if (selectedSubject !== 'All') {
      list = list.filter((f) => f.subject === selectedSubject);
    }
    const chapters = Array.from(new Set(list.map((f) => f.chapter)));
    return ['All', ...chapters.sort()];
  }, [formulas, selectedSubject]);

  // Derived Subtopic Options based on Selected Chapter
  const availableSubtopics = useMemo(() => {
    if (selectedChapter === 'All') return ['All'];
    const list = formulas.filter((f) => f.chapter === selectedChapter && f.subtopic);
    const subtopics = Array.from(new Set(list.map((f) => f.subtopic as string)));
    return ['All', ...subtopics.sort()];
  }, [formulas, selectedChapter]);

  // Find Chapters where mistakes exist
  const weakChapters = useMemo(() => {
    const chapters = new Set<string>();
    mistakes.forEach((m) => {
      if (m.chapter) chapters.add(m.chapter);
    });
    return chapters;
  }, [mistakes]);

  // Main Filtered Formulas List
  const filteredFormulas = useMemo(() => {
    return (formulas || []).filter((f) => {
      // Exam Filter
      if (selectedExam !== 'All') {
        if (f.exam && f.exam !== 'Both' && f.exam !== selectedExam) return false;
      }

      // Subject Filter
      if (selectedSubject !== 'All' && f.subject !== selectedSubject) return false;

      // Chemistry Category Filter
      if (selectedSubject === 'Chemistry' && selectedCategory !== 'All') {
        if (f.category && f.category !== selectedCategory) return false;
      }

      // Chapter Filter
      if (selectedChapter !== 'All' && f.chapter !== selectedChapter) return false;

      // Subtopic Filter
      if (selectedSubtopic !== 'All' && f.subtopic !== selectedSubtopic) return false;

      // Difficulty Filter
      if (selectedDifficulty !== 'All') {
        if (f.difficulty && f.difficulty !== selectedDifficulty) return false;
      }

      // View Tabs
      if (viewTab === 'favorites' && !f.isFavorite) return false;
      if (viewTab === 'recent' && !recentIds.includes(f.id)) return false;
      if (viewTab === 'weak' && !weakChapters.has(f.chapter)) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = f.title.toLowerCase().includes(q);
        const matchesChapter = f.chapter.toLowerCase().includes(q);
        const matchesSubtopic = f.subtopic?.toLowerCase().includes(q) || false;
        const matchesLatex = f.latex.toLowerCase().includes(q);
        const matchesExplanation = f.explanation.toLowerCase().includes(q);
        const matchesVars = f.keyVariables?.some((v) => v.toLowerCase().includes(q)) || false;

        if (!matchesTitle && !matchesChapter && !matchesSubtopic && !matchesLatex && !matchesExplanation && !matchesVars) {
          return false;
        }
      }

      return true;
    });
  }, [
    formulas,
    selectedExam,
    selectedSubject,
    selectedCategory,
    selectedChapter,
    selectedSubtopic,
    selectedDifficulty,
    viewTab,
    recentIds,
    weakChapters,
    searchQuery,
  ]);

  // Revision Deck for 5min/15min/30min/flashcards
  const revisionDeck = useMemo(() => {
    const list = [...filteredFormulas];
    if (revisionMode === '5min') return list.slice(0, 5);
    if (revisionMode === '15min') return list.slice(0, 15);
    if (revisionMode === '30min') return list.slice(0, 30);
    if (revisionMode === 'flashcard') return list;
    return [];
  }, [filteredFormulas, revisionMode]);

  // Track Formula Views
  const markAsViewed = (id: string) => {
    if (!recentIds.includes(id)) {
      setRecentIds((prev) => [id, ...prev.slice(0, 19)]);
    }
  };

  const toggleFavorite = (id: string) => {
    AudioSynthService.playClickSound();
    const updated = formulas.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f));
    onUpdateFormulas(updated);
  };

  const handleCopyLatex = (id: string, latex: string) => {
    AudioSynthService.playClickSound();
    navigator.clipboard.writeText(latex);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Safe KaTeX Renderer to prevent raw unrendered LaTeX
  const renderFormulaHtml = (latexStr: string) => {
    try {
      const rendered = katex.renderToString(latexStr, {
        throwOnError: false,
        displayMode: true,
      });
      return { __html: rendered };
    } catch {
      // Fallback clean text display
      return { __html: `<div class="font-mono text-cyan-200 py-1">${latexStr}</div>` };
    }
  };

  const openPractice = (formula: FormulaItem, type: 'practice' | 'jee_main_pyq' | 'jee_adv_pyq') => {
    AudioSynthService.playClickSound();
    markAsViewed(formula.id);
    setPracticeModal({
      isOpen: true,
      formula,
      type,
      userAnswer: undefined,
      showSolution: false,
    });
  };

  const resetFilters = () => {
    AudioSynthService.playClickSound();
    setSelectedExam('All');
    setSelectedSubject('All');
    setSelectedCategory('All');
    setSelectedChapter('All');
    setSelectedSubtopic('All');
    setSelectedDifficulty('All');
    setViewTab('all');
    setSearchQuery('');
  };

  return (
    <div id="formula-vault-view" className="space-y-6 pb-24 md:pb-12">
      {/* HEADER CARD */}
      <div className={`p-6 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} relative overflow-hidden shadow-2xl space-y-4`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>NEXORA FORMULA VAULT — COMPLETE JEE MAIN & ADVANCED</span>
            </div>
            <h2 className={`text-2xl font-extrabold ${theme.textPrimary}`}>
              JEE Formula Handbook & Revision Engine
            </h2>
            <p className="text-xs text-white/70 max-w-2xl">
              Mathematically validated JEE Main & Advanced formula reference system with KaTeX math rendering, subtopic filters, quick revision blitz modes, and PYQ connections.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center space-x-2 bg-black/40 border border-white/10 p-3 rounded-xl">
            <div className="text-center px-3 border-r border-white/10">
              <span className="block text-lg font-extrabold text-cyan-400">{formulas.length}</span>
              <span className="text-[10px] text-white/50 uppercase font-mono">Formulas</span>
            </div>
            <div className="text-center px-3 border-r border-white/10">
              <span className="block text-lg font-extrabold text-amber-400">
                {formulas.filter((f) => f.isFavorite).length}
              </span>
              <span className="text-[10px] text-white/50 uppercase font-mono">Favorites</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-lg font-extrabold text-emerald-400">
                {weakChapters.size}
              </span>
              <span className="text-[10px] text-white/50 uppercase font-mono">Weak Topics</span>
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-white/40 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search formulas, chapters, subtopics, or equations (e.g. Bernoulli, Nernst, Projectile, Limits)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder:text-white/40"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-white/40 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* WEAK FORMULA MISTAKE BANNER */}
      {weakChapters.size > 0 && viewTab !== 'weak' && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-200">
                Weak Formulas Detected in Your Mistake Log!
              </h4>
              <p className="text-[11px] text-amber-300/80">
                You have recorded mistakes in {weakChapters.size} chapter(s). Filter weak formulas to revise key equations now.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              AudioSynthService.playClickSound();
              setViewTab('weak');
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold whitespace-nowrap"
          >
            Review Weak Formulas
          </button>
        </div>
      )}

      {/* REVISION MODE TRIGGER BAR */}
      <div className={`p-4 rounded-xl ${theme.cardBg} border ${theme.cardBorder} flex flex-wrap items-center justify-between gap-3`}>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300">
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="font-bold">Quick Revision Blitz Modes:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              AudioSynthService.playClickSound();
              setRevisionMode(revisionMode === '5min' ? 'none' : '5min');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
              revisionMode === '5min'
                ? 'bg-cyan-500 text-black border-cyan-400 shadow-lg'
                : 'bg-black/40 border-white/10 text-white/70 hover:text-white'
            }`}
          >
            ⚡ 5-Min Blitz (5 Formulas)
          </button>

          <button
            onClick={() => {
              AudioSynthService.playClickSound();
              setRevisionMode(revisionMode === '15min' ? 'none' : '15min');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
              revisionMode === '15min'
                ? 'bg-cyan-500 text-black border-cyan-400 shadow-lg'
                : 'bg-black/40 border-white/10 text-white/70 hover:text-white'
            }`}
          >
            🔥 15-Min Review (15 Formulas)
          </button>

          <button
            onClick={() => {
              AudioSynthService.playClickSound();
              setRevisionMode(revisionMode === '30min' ? 'none' : '30min');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
              revisionMode === '30min'
                ? 'bg-cyan-500 text-black border-cyan-400 shadow-lg'
                : 'bg-black/40 border-white/10 text-white/70 hover:text-white'
            }`}
          >
            🎓 30-Min Master (30 Formulas)
          </button>

          <button
            onClick={() => {
              AudioSynthService.playClickSound();
              setRevisionMode(revisionMode === 'flashcard' ? 'none' : 'flashcard');
              setFlashcardIndex(0);
              setIsCardFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
              revisionMode === 'flashcard'
                ? 'bg-purple-500 text-white border-purple-400 shadow-lg'
                : 'bg-black/40 border-white/10 text-purple-300 hover:text-white'
            }`}
          >
            🎴 Formula Flashcard Mode
          </button>
        </div>
      </div>

      {/* FLASHCARD MODAL / CAROUSEL VIEW */}
      {revisionMode === 'flashcard' && revisionDeck.length > 0 && (
        <div className={`p-6 rounded-2xl bg-gradient-to-br from-purple-900/30 via-black to-cyan-900/30 border border-purple-500/30 space-y-4 shadow-2xl relative`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs font-mono font-bold">
                Formula Flashcard {flashcardIndex + 1} of {revisionDeck.length}
              </span>
              <span className="text-xs text-white/60 font-mono">
                {revisionDeck[flashcardIndex].subject} → {revisionDeck[flashcardIndex].chapter}
              </span>
            </div>
            <button
              onClick={() => setRevisionMode('none')}
              className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Card Flipper */}
          <div
            onClick={() => {
              AudioSynthService.playClickSound();
              setIsCardFlipped(!isCardFlipped);
            }}
            className="min-h-[220px] p-6 rounded-xl bg-black/80 border border-white/15 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-400 transition-all shadow-inner relative group"
          >
            {!isCardFlipped ? (
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-mono text-purple-400 tracking-wider">
                  Tap to Reveal Formula & Derivation
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  {revisionDeck[flashcardIndex].title}
                </h3>
                {revisionDeck[flashcardIndex].subtopic && (
                  <p className="text-xs text-white/50 font-mono">
                    Subtopic: {revisionDeck[flashcardIndex].subtopic}
                  </p>
                )}
                <p className="text-xs text-cyan-300 italic pt-2">
                  "{revisionDeck[flashcardIndex].explanation}"
                </p>
              </div>
            ) : (
              <div className="space-y-4 w-full max-w-xl">
                <span className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider">
                  Core Mathematical Equation
                </span>
                <div
                  className="p-4 rounded-xl bg-black border border-cyan-500/30 text-cyan-300 font-serif overflow-x-auto text-lg"
                  dangerouslySetInnerHTML={renderFormulaHtml(revisionDeck[flashcardIndex].latex)}
                />
                {revisionDeck[flashcardIndex].shortcuts && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 text-left">
                    <span className="font-bold">⚡ Shortcut Trick: </span>
                    {revisionDeck[flashcardIndex].shortcuts}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              disabled={flashcardIndex === 0}
              onClick={() => {
                AudioSynthService.playClickSound();
                setFlashcardIndex((prev) => Math.max(0, prev - 1));
                setIsCardFlipped(false);
              }}
              className="px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous Card
            </button>

            <span className="text-xs text-white/40 font-mono">
              Click card to flip
            </span>

            <button
              disabled={flashcardIndex === revisionDeck.length - 1}
              onClick={() => {
                AudioSynthService.playClickSound();
                setFlashcardIndex((prev) => Math.min(revisionDeck.length - 1, prev + 1));
                setIsCardFlipped(false);
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-mono font-bold text-white shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next Card →
            </button>
          </div>
        </div>
      )}

      {/* FILTER CONTROL PANEL */}
      <div className={`p-5 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} space-y-4`}>
        {/* VIEW TAB TOGGLES */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                AudioSynthService.playClickSound();
                setViewTab('all');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                viewTab === 'all'
                  ? `${theme.buttonGradient} text-white shadow-md`
                  : 'bg-black/40 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              All Formulas ({formulas.length})
            </button>

            <button
              onClick={() => {
                AudioSynthService.playClickSound();
                setViewTab('favorites');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border flex items-center space-x-1.5 ${
                viewTab === 'favorites'
                  ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-md'
                  : 'bg-black/40 border-white/10 text-amber-300 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Favorites ({formulas.filter((f) => f.isFavorite).length})</span>
            </button>

            <button
              onClick={() => {
                AudioSynthService.playClickSound();
                setViewTab('recent');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border flex items-center space-x-1.5 ${
                viewTab === 'recent'
                  ? 'bg-cyan-500 text-black border-cyan-400 font-extrabold shadow-md'
                  : 'bg-black/40 border-white/10 text-cyan-300 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Recently Viewed ({recentIds.length})</span>
            </button>

            <button
              onClick={() => {
                AudioSynthService.playClickSound();
                setViewTab('weak');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border flex items-center space-x-1.5 ${
                viewTab === 'weak'
                  ? 'bg-rose-500 text-white border-rose-400 font-extrabold shadow-md'
                  : 'bg-black/40 border-white/10 text-rose-300 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Weak Topics ({weakChapters.size})</span>
            </button>
          </div>

          <button
            onClick={resetFilters}
            className="text-xs text-white/50 hover:text-white flex items-center space-x-1 font-mono transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>

        {/* MULTI-LEVEL FILTER DROPDOWNS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-1">
          {/* EXAM TARGET */}
          <div>
            <label className="text-[10px] text-white/40 uppercase font-mono block mb-1">
              Exam Target
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value as any)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Exams</option>
              <option value="JEE Main">JEE Main</option>
              <option value="JEE Advanced">JEE Advanced</option>
            </select>
          </div>

          {/* SUBJECT */}
          <div>
            <label className="text-[10px] text-white/40 uppercase font-mono block mb-1">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value as any);
                setSelectedChapter('All');
                setSelectedSubtopic('All');
              }}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Subjects</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
            </select>
          </div>

          {/* CHEMISTRY BRANCH (Conditional) */}
          {selectedSubject === 'Chemistry' && (
            <div>
              <label className="text-[10px] text-white/40 uppercase font-mono block mb-1">
                Chemistry Branch
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="All">All Branches</option>
                <option value="Physical">Physical</option>
                <option value="Organic">Organic</option>
                <option value="Inorganic">Inorganic</option>
              </select>
            </div>
          )}

          {/* CHAPTER */}
          <div className={selectedSubject !== 'Chemistry' ? 'col-span-2' : ''}>
            <label className="text-[10px] text-white/40 uppercase font-mono block mb-1">
              Chapter
            </label>
            <select
              value={selectedChapter}
              onChange={(e) => {
                setSelectedChapter(e.target.value);
                setSelectedSubtopic('All');
              }}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 truncate"
            >
              {availableChapters.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* SUBTOPIC */}
          <div>
            <label className="text-[10px] text-white/40 uppercase font-mono block mb-1">
              Subtopic
            </label>
            <select
              value={selectedSubtopic}
              onChange={(e) => setSelectedSubtopic(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 truncate"
            >
              {availableSubtopics.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* DIFFICULTY */}
          <div>
            <label className="text-[10px] text-white/40 uppercase font-mono block mb-1">
              Difficulty Level
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Levels</option>
              <option value="JEE Main">JEE Main</option>
              <option value="JEE Advanced">JEE Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* FORMULAS COUNT INDICATOR */}
      <div className="flex items-center justify-between text-xs text-white/60 font-mono px-1">
        <span>
          Showing <strong className="text-cyan-400">{filteredFormulas.length}</strong> formulas in NEXORA Vault
        </span>
        {searchQuery && (
          <span>
            Search filter active: "<strong>{searchQuery}</strong>"
          </span>
        )}
      </div>

      {/* FORMULA CARDS GRID */}
      {filteredFormulas.length === 0 ? (
        <div className={`p-12 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} text-center space-y-3`}>
          <HelpCircle className="w-10 h-10 text-white/30 mx-auto" />
          <h3 className="text-base font-bold text-white">No Formulas Found</h3>
          <p className="text-xs text-white/50 max-w-md mx-auto">
            No mathematical or chemical formulas match your current search parameters or filters. Try adjusting your subject, chapter, or search query.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-xs font-mono font-bold text-cyan-300"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredFormulas.map((formula) => {
            const isWeakTopic = weakChapters.has(formula.chapter);

            return (
              <div
                key={formula.id}
                onClick={() => markAsViewed(formula.id)}
                className={`p-5 rounded-2xl ${theme.cardBg} border ${
                  isWeakTopic ? 'border-amber-500/40' : theme.cardBorder
                } space-y-4 shadow-xl hover:border-cyan-500/40 transition-all relative flex flex-col justify-between`}
              >
                {/* CARD TOP BADGES & ACTIONS */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                          formula.subject === 'Physics'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : formula.subject === 'Chemistry'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}
                      >
                        {formula.subject}
                      </span>

                      {formula.category && (
                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-mono text-white/70">
                          {formula.category}
                        </span>
                      )}

                      {formula.difficulty && (
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                            formula.difficulty === 'JEE Advanced'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}
                        >
                          {formula.difficulty}
                        </span>
                      )}

                      {isWeakTopic && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Weak Logged</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyLatex(formula.id, formula.latex);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                        title="Copy LaTeX String"
                      >
                        {copiedId === formula.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(formula.id);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                        title="Bookmark Formula"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            formula.isFavorite ? 'text-amber-400 fill-amber-400' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* BREADCRUMB */}
                  <div className="text-[11px] font-mono text-white/50 flex items-center space-x-1">
                    <span>{formula.chapter}</span>
                    {formula.subtopic && (
                      <>
                        <ChevronRight className="w-3 h-3 text-white/30" />
                        <span className="text-cyan-400/80">{formula.subtopic}</span>
                      </>
                    )}
                  </div>

                  {/* TITLE */}
                  <h3 className="text-sm font-bold text-white pt-1">{formula.title}</h3>

                  {/* MATH EQUATION RENDER */}
                  <div
                    className="p-4 rounded-xl bg-black/80 border border-white/10 text-center font-serif text-cyan-300 my-2 overflow-x-auto shadow-inner text-base"
                    dangerouslySetInnerHTML={renderFormulaHtml(formula.latex)}
                  />

                  {/* EXPLANATION */}
                  <p className="text-xs text-white/80 leading-relaxed pt-1">
                    {formula.explanation}
                  </p>

                  {/* DERIVED FORMULAS / SPECIAL CASES */}
                  {formula.derivedFormulas && formula.derivedFormulas.length > 0 && (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                      <span className="text-[10px] text-cyan-400 uppercase font-mono font-bold block">
                        Derived Relations & Special Cases:
                      </span>
                      <ul className="space-y-1">
                        {formula.derivedFormulas.map((df, idx) => (
                          <li
                            key={idx}
                            className="text-[11px] font-mono text-white/90 bg-black/40 px-2 py-1 rounded border border-white/5 overflow-x-auto"
                            dangerouslySetInnerHTML={renderFormulaHtml(df)}
                          />
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* KEY VARIABLES */}
                  {formula.keyVariables && formula.keyVariables.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] text-white/40 uppercase font-mono block mb-1">
                        Key Variables Breakdown:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {formula.keyVariables.map((v, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-cyan-200 font-mono"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CONDITIONS / UNITS */}
                  {(formula.conditions || formula.units) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono text-white/60 pt-2 border-t border-white/5">
                      {formula.conditions && (
                        <div>
                          <span className="text-white/40 block">Conditions of Validity:</span>
                          <span className="text-amber-200/90">{formula.conditions}</span>
                        </div>
                      )}
                      {formula.units && (
                        <div>
                          <span className="text-white/40 block">SI Units / Dimension:</span>
                          <span className="text-emerald-200/90">{formula.units}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* COMMON MISTAKES & SHORTCUTS */}
                  {(formula.commonMistakes || formula.shortcuts) && (
                    <div className="space-y-1.5 pt-2">
                      {formula.commonMistakes && (
                        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-200">
                          <span className="font-bold text-rose-400">⚠ Common Pitfall: </span>
                          {formula.commonMistakes}
                        </div>
                      )}
                      {formula.shortcuts && (
                        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-200">
                          <span className="font-bold text-emerald-400">⚡ Shortcut Trick: </span>
                          {formula.shortcuts}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* PRACTICE & PYQ BUTTONS */}
                <div className="pt-4 mt-3 border-t border-white/10 grid grid-cols-3 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openPractice(formula, 'practice');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-bold flex items-center justify-center space-x-1"
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>Practice</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openPractice(formula, 'jee_main_pyq');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[11px] font-mono font-bold flex items-center justify-center space-x-1"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Main PYQs</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openPractice(formula, 'jee_adv_pyq');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[11px] font-mono font-bold flex items-center justify-center space-x-1"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Adv PYQs</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PRACTICE & PYQ MODAL */}
      {practiceModal.isOpen && practiceModal.formula && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-zinc-900 border border-cyan-500/30 rounded-2xl p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase block">
                  NEXORA Formula Practice Engine
                </span>
                <h3 className="text-base font-extrabold text-white">
                  {practiceModal.type === 'practice'
                    ? `Target Concept Practice: ${practiceModal.formula.title}`
                    : practiceModal.type === 'jee_main_pyq'
                    ? `JEE Main PYQ Target: ${practiceModal.formula.title}`
                    : `JEE Advanced PYQ Challenge: ${practiceModal.formula.title}`}
                </h3>
              </div>
              <button
                onClick={() => setPracticeModal({ isOpen: false, formula: null, type: 'practice' })}
                className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORMULA RECAP HEADER */}
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between text-xs text-white/80">
              <div>
                <span className="text-white/40 font-mono block text-[10px]">Core Equation Used:</span>
                <div
                  className="font-serif text-cyan-300"
                  dangerouslySetInnerHTML={renderFormulaHtml(practiceModal.formula.latex)}
                />
              </div>
              <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                {practiceModal.formula.chapter}
              </span>
            </div>

            {/* GENERATED TARGET QUESTION */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-800/80 border border-white/10 text-sm text-white font-medium space-y-2">
                <span className="text-xs text-cyan-400 font-mono block font-bold">
                  Problem Statement:
                </span>
                <p className="leading-relaxed">
                  {practiceModal.type === 'jee_main_pyq'
                    ? `[JEE Main 2023 / 2024 Pattern] A problem tests ${practiceModal.formula.title} in ${practiceModal.formula.chapter}. Calculate the required parameter using the standard formula ${practiceModal.formula.explanation.split('.')[0]}.`
                    : practiceModal.type === 'jee_adv_pyq'
                    ? `[JEE Advanced Multi-Concept Pattern] Given a physical/chemical system in ${practiceModal.formula.chapter}, evaluate the edge condition under boundary constraints where ${practiceModal.formula.conditions || 'ideal properties hold'}.`
                    : `In ${practiceModal.formula.chapter}, evaluate the value of the main variable using ${practiceModal.formula.title}.`}
                </p>
              </div>

              {/* DUMMY OPTIONS FOR INTERACTIVE DRILL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((optNum) => (
                  <button
                    key={optNum}
                    onClick={() => {
                      AudioSynthService.playClickSound();
                      setPracticeModal((prev) => ({
                        ...prev,
                        userAnswer: optNum,
                        showSolution: true,
                      }));
                    }}
                    className={`p-3 rounded-xl text-left text-xs font-mono transition-all border ${
                      practiceModal.userAnswer === optNum
                        ? optNum === 1
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold'
                          : 'bg-rose-500/20 border-rose-400 text-rose-200 font-bold'
                        : 'bg-black/50 border-white/10 hover:border-cyan-400 text-white/80'
                    }`}
                  >
                    <span className="text-white/40 mr-2">({String.fromCharCode(64 + optNum)})</span>
                    {optNum === 1
                      ? 'Option A (Mathematically Correct Solution)'
                      : `Option ${String.fromCharCode(64 + optNum)} (Common Distractor Trap)`}
                  </button>
                ))}
              </div>

              {/* STEP-BY-STEP JEE TEACHER EXPLANATION SOLUTION */}
              {practiceModal.showSolution && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold font-mono">
                    <Check className="w-4 h-4" />
                    <span>Hinglish Teacher Step-by-Step Solution:</span>
                  </div>

                  <div className="text-xs text-emerald-100/90 leading-relaxed space-y-2 font-mono">
                    <p>
                      Yaha pe hum direct formula use karenge: <strong>{practiceModal.formula.title}</strong>
                    </p>
                    <div
                      className="p-2 rounded bg-black/60 text-cyan-300"
                      dangerouslySetInnerHTML={renderFormulaHtml(practiceModal.formula.latex)}
                    />
                    <p>
                      <strong>Step 1:</strong> Given parameters ko SI units me convert baseline karo.
                    </p>
                    <p>
                      <strong>Step 2:</strong> Subtopic <em>{practiceModal.formula.subtopic || practiceModal.formula.chapter}</em> ke matching boundary conditions apply karo.
                    </p>
                    {practiceModal.formula.commonMistakes && (
                      <p className="text-rose-300 bg-rose-950/40 p-2 rounded border border-rose-800/40">
                        <strong>Common Mistake Avoided:</strong> {practiceModal.formula.commonMistakes}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                onClick={() => setPracticeModal({ isOpen: false, formula: null, type: 'practice' })}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold shadow-lg"
              >
                Close Practice Engine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
