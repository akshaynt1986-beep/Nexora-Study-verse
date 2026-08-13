import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Filter,
  BarChart3,
  RotateCcw,
  Target,
  AlertTriangle,
  Play,
  Calculator,
  ChevronRight,
  Layers,
  Calendar,
  Grid,
  List,
  RefreshCw,
  X,
  Check,
  ChevronDown,
  BrainCircuit,
  Sliders,
  ShieldAlert,
  Flame,
  Zap,
  Award,
} from 'lucide-react';
import {
  ChapterStatusType,
  PlannerState,
  RevisionItem,
  SmartChapter,
  SubjectType,
  SyllabusExamType,
  TabId,
  UserAccount,
  UserStats,
} from '../types';
import { StorageService } from '../services/storage';
import { calculateChapterProgress } from '../data/syllabusData';

interface SmartSyllabusEngineProps {
  theme: string;
  user: UserAccount | null;
  userStats: UserStats;
  plannerState: PlannerState;
  revisions: RevisionItem[];
  onNavigate: (tab: TabId) => void;
  onUpdatePlanner: (updated: PlannerState) => void;
  onUpdateRevisions: (updated: RevisionItem[]) => void;
  onUpdateStats: (updated: UserStats) => void;
}

export const SmartSyllabusEngine: React.FC<SmartSyllabusEngineProps> = ({
  user,
  userStats,
  plannerState,
  revisions,
  onNavigate,
  onUpdatePlanner,
  onUpdateRevisions,
  onUpdateStats,
}) => {
  // 1. Exam Selection State (JEE Main | JEE Advanced | NEET)
  const defaultExam: SyllabusExamType =
    user?.targetExam === 'NEET'
      ? 'NEET'
      : user?.targetExam === 'JEE Advanced'
      ? 'JEE Advanced'
      : 'JEE Main';

  const [selectedExam, setSelectedExam] = useState<SyllabusExamType>(defaultExam);
  const [chapters, setChapters] = useState<SmartChapter[]>([]);

  // 2. Navigation & Subject Filters
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('Physics');
  const [biologyFilter, setBiologyFilter] = useState<'All' | 'Botany' | 'Zoology'>('All');
  const [chemistryFilter, setChemistryFilter] = useState<
    'All' | 'Physical' | 'Organic' | 'Inorganic'
  >('All');
  const [statusFilter, setStatusFilter] = useState<'All' | ChapterStatusType | 'Weak' | 'Strong'>(
    'All'
  );
  const [gradeFilter, setGradeFilter] = useState<'All' | '11' | '12'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'heatmap'>('list');

  // 3. Goal & Target Date Calculator State
  const [targetDate, setTargetDate] = useState<string>('2026-10-15');

  // 4. Modal States
  const [activeChapterModal, setActiveChapterModal] = useState<SmartChapter | null>(null);
  const [prerequisiteWarning, setPrerequisiteWarning] = useState<{
    targetChapter: SmartChapter;
    unmetPrereqs: SmartChapter[];
  } | null>(null);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [resetType, setResetType] = useState<'chapter' | 'subject' | 'syllabus'>('chapter');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load Syllabus on Exam Change
  useEffect(() => {
    const loaded = StorageService.getSmartSyllabus(selectedExam);
    setChapters(loaded);

    // Default subject adjusting for NEET vs JEE
    if (selectedExam === 'NEET' && selectedSubject === 'Mathematics') {
      setSelectedSubject('Physics');
    }
  }, [selectedExam]);

  // Save changes to storage
  const handleUpdateChapter = (updatedChapter: SmartChapter) => {
    const calculated = calculateChapterProgress(updatedChapter);
    const newChapters = chapters.map((c) => (c.id === calculated.id ? calculated : c));
    setChapters(newChapters);
    StorageService.saveSmartSyllabus(selectedExam, newChapters);

    if (activeChapterModal?.id === calculated.id) {
      setActiveChapterModal(calculated);
    }
  };

  const handleStatusChange = (chapterId: string, newStatus: ChapterStatusType) => {
    const target = chapters.find((c) => c.id === chapterId);
    if (!target) return;

    // Check prerequisites if setting status to Learning or In Progress or Completed
    if (newStatus !== 'Not Started' && target.prerequisites && target.prerequisites.length > 0) {
      const unmet = chapters.filter(
        (c) => target.prerequisites?.includes(c.id) && c.overallProgress < 50
      );
      if (unmet.length > 0) {
        setPrerequisiteWarning({
          targetChapter: { ...target, status: newStatus },
          unmetPrereqs: unmet,
        });
        return;
      }
    }

    applyStatusChange(chapterId, newStatus);
  };

  const applyStatusChange = (chapterId: string, newStatus: ChapterStatusType) => {
    const updated = chapters.map((c) => {
      if (c.id === chapterId) {
        let topicProgress = c.topics;
        if (newStatus === 'Completed') {
          topicProgress = c.topics.map((t) => ({
            ...t,
            completionPercentage: 100,
            status: 'Completed',
            subtopics: t.subtopics?.map((s) => ({ ...s, completed: true })),
          }));
        }
        return {
          ...c,
          status: newStatus,
          topics: topicProgress,
        };
      }
      return c;
    });

    const calculated = updated.map(calculateChapterProgress);
    setChapters(calculated);
    StorageService.saveSmartSyllabus(selectedExam, calculated);

    // Auto-integrate with Revision Engine if Completed
    if (newStatus === 'Completed') {
      const targetCh = calculated.find((c) => c.id === chapterId);
      if (targetCh) {
        addChapterToRevisionEngine(targetCh, false);
      }
    }

    showToast(`Chapter status updated to ${newStatus}`);
  };

  // Add Chapter to Revision Engine
  const addChapterToRevisionEngine = (ch: SmartChapter, notify = true) => {
    const existing = revisions.find((r) => r.chapter === ch.name);
    if (!existing) {
      const newRev: RevisionItem = {
        id: 'rev_' + Date.now() + Math.random().toString(36).substr(2, 4),
        subject: ch.subject,
        chapter: ch.name,
        topic: ch.topics[0]?.title || 'Overall Chapter Review',
        questionCount: ch.metrics.totalPyqs || 25,
        stage: 1,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
      };
      const updated = [newRev, ...revisions];
      onUpdateRevisions(updated);
      if (notify) showToast(`Scheduled '${ch.name}' in Spaced Repetition (Due in 3 Days)`);
    } else {
      if (notify) showToast(`'${ch.name}' is already in your Spaced Repetition Queue`);
    }
  };

  // Add Chapter to Study Planner
  const addChapterToPlannerRecommendation = (ch: SmartChapter) => {
    const today = new Date().toISOString().split('T')[0];
    const newSession = {
      id: 'plan_' + Date.now(),
      title: `Study & Revise: ${ch.name}`,
      subject: ch.subject,
      topic: ch.topics[0]?.title || 'Core Practice',
      durationMinutes: 60,
      completed: false,
      date: today,
    };

    const updatedPlanner: PlannerState = {
      ...plannerState,
      dailySessions: [...(plannerState.dailySessions || []), newSession],
    };
    onUpdatePlanner(updatedPlanner);
    showToast(`Recommended study session for '${ch.name}' added to Smart Planner`);
  };

  // Reset Operations
  const handleResetExecute = () => {
    if (resetType === 'chapter' && activeChapterModal) {
      const updated = StorageService.resetSmartSyllabus(
        selectedExam,
        undefined,
        activeChapterModal.id
      );
      setChapters(updated);
      setActiveChapterModal(null);
      showToast(`Chapter '${activeChapterModal.name}' reset successfully`);
    } else if (resetType === 'subject') {
      const updated = StorageService.resetSmartSyllabus(selectedExam, selectedSubject);
      setChapters(updated);
      showToast(`All chapters in ${selectedSubject} reset successfully`);
    } else {
      const updated = StorageService.resetSmartSyllabus(selectedExam);
      setChapters(updated);
      showToast(`Entire ${selectedExam} Syllabus reset successfully`);
    }
    setShowResetModal(false);
  };

  // Filter Chapters for Current View
  const filteredChapters = chapters.filter((ch) => {
    if (ch.subject !== selectedSubject) return false;

    // Biology sub-filters for NEET
    if (selectedExam === 'NEET' && selectedSubject === 'Biology') {
      if (biologyFilter !== 'All' && ch.category !== biologyFilter) return false;
    }

    // Chemistry category filters
    if (selectedSubject === 'Chemistry' && chemistryFilter !== 'All') {
      if (ch.category !== chemistryFilter) return false;
    }

    if (gradeFilter !== 'All' && ch.classGrade !== gradeFilter) return false;

    // Status / Health filters
    if (statusFilter === 'Weak') {
      if (ch.healthStatus !== 'Weak') return false;
    } else if (statusFilter === 'Strong') {
      if (ch.healthStatus !== 'Strong') return false;
    } else if (statusFilter !== 'All') {
      if (ch.status !== statusFilter) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ch.name.toLowerCase().includes(q);
      const matchTopic = ch.topics.some((t) => t.title.toLowerCase().includes(q));
      if (!matchName && !matchTopic) return false;
    }

    return true;
  });

  // Calculate Overall Syllabus Metrics
  const totalChaptersCount = chapters.length;
  const completedChaptersCount = chapters.filter((c) => c.status === 'Completed').length;
  const weakChaptersCount = chapters.filter((c) => c.healthStatus === 'Weak').length;
  const revisionDueCount = chapters.filter((c) => c.status === 'Needs Revision').length;
  const remainingChaptersCount = totalChaptersCount - completedChaptersCount;

  const examProgressAvg = Math.round(
    chapters.reduce((acc, c) => acc + (c.overallProgress || 0), 0) / (totalChaptersCount || 1)
  );

  // Subject Progresses
  const getSubjectProgress = (subj: SubjectType, category?: string) => {
    const list = chapters.filter(
      (c) => c.subject === subj && (!category || category === 'All' || c.category === category)
    );
    if (list.length === 0) return 0;
    return Math.round(list.reduce((acc, c) => acc + c.overallProgress, 0) / list.length);
  };

  // Target Pace Calculation
  const daysRemaining = Math.max(
    1,
    Math.ceil(
      (new Date(targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
  );
  const requiredPacePerWeek = (
    (remainingChaptersCount / (daysRemaining / 7)) || 0
  ).toFixed(1);

  return (
    <div className="space-y-6 text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-950 border border-cyan-500 text-cyan-200 px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(34,211,238,0.3)] flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. HERO HEADER & EXAM SELECTOR */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 backdrop-blur-2xl border border-cyan-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-black mb-3">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>NEXORA Smart Syllabus & Chapter Progress Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Official Exam Syllabus Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Detailed topic-level tracking with integrated PYQs, Formula Vault, Spaced Repetition,
            and automated weak chapter detection.
          </p>
        </div>

        {/* Exam Toggle Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 shrink-0">
          {(['JEE MAIN', 'JEE ADVANCED', 'NEET'] as const).map((ex) => {
            const mappedExam: SyllabusExamType =
              ex === 'JEE MAIN' ? 'JEE Main' : ex === 'JEE ADVANCED' ? 'JEE Advanced' : 'NEET';
            const isActive = selectedExam === mappedExam;
            return (
              <button
                key={ex}
                onClick={() => setSelectedExam(mappedExam)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {ex}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. OVERALL SYLLABUS PROGRESS & TARGET PACE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Completion Ring & Subject Bars */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-cyan-400 transition-all duration-1000"
                strokeDasharray={`${examProgressAvg}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-white">{examProgressAvg}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Overall
              </span>
            </div>
          </div>

          <div className="flex-1 w-full space-y-3">
            <div className="flex items-center justify-between text-xs font-black text-slate-300">
              <span>{selectedExam} Subject Completion</span>
              <span className="text-cyan-400">{completedChaptersCount} / {totalChaptersCount} Chapters Done</span>
            </div>

            {selectedExam !== 'NEET' ? (
              <>
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Physics</span>
                    <span>{getSubjectProgress('Physics')}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${getSubjectProgress('Physics')}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Chemistry</span>
                    <span>{getSubjectProgress('Chemistry')}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${getSubjectProgress('Chemistry')}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Mathematics</span>
                    <span>{getSubjectProgress('Mathematics')}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${getSubjectProgress('Mathematics')}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Physics</span>
                    <span>{getSubjectProgress('Physics')}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${getSubjectProgress('Physics')}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Chemistry</span>
                    <span>{getSubjectProgress('Chemistry')}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${getSubjectProgress('Chemistry')}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Biology (Botany {getSubjectProgress('Biology', 'Botany')}% | Zoology {getSubjectProgress('Biology', 'Zoology')}%)</span>
                    <span>{getSubjectProgress('Biology')}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${getSubjectProgress('Biology')}%` }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Goal & Target Pace Box */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-black uppercase text-slate-300">Target Goal Pace</span>
            </div>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-cyan-300 rounded-xl px-2.5 py-1 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
              <div className="text-[10px] font-bold text-slate-400">Days Remaining</div>
              <div className="text-lg font-black text-white mt-0.5">{daysRemaining} Days</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
              <div className="text-[10px] font-bold text-slate-400">Required Pace</div>
              <div className="text-lg font-black text-cyan-300 mt-0.5">
                {requiredPacePerWeek} ch/wk
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200/80 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Pace recommendation: Complete ~{Math.ceil(remainingChaptersCount / Math.max(1, Math.ceil(daysRemaining / 30)))} chapters per month to finish by target date.
            </span>
          </div>
        </div>
      </div>

      {/* 3. QUICK STAT CARDS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-emerald-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Completed</div>
            <div className="text-lg font-black text-white">{completedChaptersCount} Chapters</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-cyan-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Remaining</div>
            <div className="text-lg font-black text-white">{remainingChaptersCount} Chapters</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-rose-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Weak Chapters</div>
            <div className="text-lg font-black text-white">{weakChaptersCount} Chapters</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-amber-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Revision Due</div>
            <div className="text-lg font-black text-white">{revisionDueCount} Chapters</div>
          </div>
        </div>
      </div>

      {/* 4. SUBJECT TABS & SUB-CATEGORY BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        {/* Subject Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {selectedExam !== 'NEET' ? (
            (['Physics', 'Chemistry', 'Mathematics'] as SubjectType[]).map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 ${
                  selectedSubject === subj
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {subj}
              </button>
            ))
          ) : (
            (['Physics', 'Chemistry', 'Biology'] as SubjectType[]).map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 ${
                  selectedSubject === subj
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {subj}
              </button>
            ))
          )}
        </div>

        {/* Category Toggles (Biology Botany/Zoology or Chemistry Organic/Inorganic) */}
        {selectedExam === 'NEET' && selectedSubject === 'Biology' && (
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-white/10 self-start md:self-auto">
            {(['All', 'Botany', 'Zoology'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setBiologyFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  biologyFilter === cat
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {selectedSubject === 'Chemistry' && (
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-white/10 self-start md:self-auto">
            {(['All', 'Physical', 'Organic', 'Inorganic'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setChemistryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  chemistryFilter === cat
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 5. SEARCH & FILTER CONTROLS & VIEW MODES */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${selectedSubject} chapters or topics...`}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 text-xs font-bold text-white rounded-2xl py-2.5 px-3 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="All">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="Learning">Learning</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Needs Revision">Needs Revision</option>
            <option value="Weak">🔴 Weak Chapters</option>
            <option value="Strong">🟢 Strong Chapters</option>
          </select>

          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 text-xs font-bold text-white rounded-2xl py-2.5 px-3 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="All">Class 11 & 12</option>
            <option value="11">Class 11th</option>
            <option value="12">Class 12th</option>
          </select>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${
                viewMode === 'list'
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${
                viewMode === 'grid'
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('heatmap')}
              className={`p-2 rounded-xl transition-all ${
                viewMode === 'heatmap'
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Syllabus Heatmap"
            >
              <BrainCircuit className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              setResetType('subject');
              setShowResetModal(true);
            }}
            className="p-2.5 rounded-2xl bg-slate-900 border border-rose-500/30 text-rose-400 hover:bg-rose-950/40 transition-all text-xs font-bold flex items-center gap-1.5"
            title="Reset Subject Progress"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* 6. SYLLABUS HEATMAP VIEW */}
      {viewMode === 'heatmap' && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
                <span>{selectedSubject} Syllabus Preparation Heatmap Matrix</span>
              </h3>
              <p className="text-xs text-slate-400">
                Visual grid map of all chapters. Click any cell to inspect and update topic progress.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-bold">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700" /> Not Started
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-amber-500/40 border border-amber-500/50" /> In Progress
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-500/50" /> Strong / Done
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-rose-500/40 border border-rose-500/50" /> Weak
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
            {filteredChapters.map((ch) => {
              let bg = 'bg-slate-800 border-slate-700 hover:border-cyan-500';
              if (ch.healthStatus === 'Weak') {
                bg = 'bg-rose-950/40 border-rose-500/40 text-rose-200 hover:border-rose-400';
              } else if (ch.overallProgress >= 75) {
                bg = 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200 hover:border-emerald-400';
              } else if (ch.overallProgress > 0) {
                bg = 'bg-amber-950/40 border-amber-500/40 text-amber-200 hover:border-amber-400';
              }

              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapterModal(ch)}
                  className={`p-3 rounded-2xl border text-left transition-all hover:scale-105 space-y-2 ${bg}`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold opacity-80">
                    <span>Class {ch.classGrade}</span>
                    <span>{ch.overallProgress}%</span>
                  </div>
                  <div className="text-xs font-black line-clamp-2">{ch.name}</div>
                  <div className="w-full bg-slate-900/60 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-current h-full rounded-full"
                      style={{ width: `${ch.overallProgress}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. CHAPTER CARDS (LIST & GRID VIEW) */}
      {viewMode !== 'heatmap' && (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-4'
          }
        >
          {filteredChapters.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-white/5 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-slate-400">
                No chapters matched your current filter criteria.
              </div>
              <button
                onClick={() => {
                  setStatusFilter('All');
                  setGradeFilter('All');
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-cyan-400 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredChapters.map((ch) => {
              const hasPrereqWarning =
                ch.prerequisites &&
                ch.prerequisites.length > 0 &&
                chapters.some((c) => ch.prerequisites?.includes(c.id) && c.overallProgress < 50);

              return (
                <div
                  key={ch.id}
                  className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 transition-all space-y-4 shadow-lg group"
                >
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-cyan-300 font-bold border border-slate-700">
                          Class {ch.classGrade}
                        </span>
                        {ch.category && (
                          <span className="px-2.5 py-0.5 rounded-md bg-purple-950/80 text-[10px] font-mono text-purple-300 font-bold border border-purple-500/30">
                            {ch.category}
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-300 font-bold">
                          {ch.weightage} Weightage
                        </span>
                        {ch.healthStatus === 'Weak' && (
                          <span className="px-2.5 py-0.5 rounded-md bg-rose-950 text-[10px] font-bold text-rose-300 border border-rose-500/40 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> 🔴 Weak
                          </span>
                        )}
                        {ch.healthStatus === 'Strong' && (
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-950 text-[10px] font-bold text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> 🟢 Strong
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => setActiveChapterModal(ch)}
                        className="text-base sm:text-lg font-black text-white hover:text-cyan-300 transition-colors cursor-pointer pt-1"
                      >
                        {ch.name}
                      </h3>
                    </div>

                    {/* Status Select Box */}
                    <select
                      value={ch.status}
                      onChange={(e) =>
                        handleStatusChange(ch.id, e.target.value as ChapterStatusType)
                      }
                      className={`text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-none border transition-all ${
                        ch.status === 'Completed'
                          ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300'
                          : ch.status === 'Needs Revision'
                          ? 'bg-amber-950 border-amber-500/50 text-amber-300'
                          : ch.status === 'In Progress' || ch.status === 'Learning'
                          ? 'bg-cyan-950 border-cyan-500/50 text-cyan-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="Learning">Learning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Needs Revision">Needs Revision</option>
                    </select>
                  </div>

                  {/* Prerequisites Alert Banner */}
                  {hasPrereqWarning && (
                    <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>
                          Recommended prerequisite incomplete ({ch.prerequisiteNames?.join(', ')})
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveChapterModal(ch)}
                        className="text-[10px] font-black underline text-amber-300 whitespace-nowrap"
                      >
                        Review
                      </button>
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-400">Chapter Completion</span>
                      <span className="text-cyan-300 font-mono font-black">
                        {ch.overallProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${ch.overallProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Sub-metrics Summary */}
                  <div className="grid grid-cols-4 gap-2 pt-1 text-center text-[10px] font-bold">
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                      <div className="text-slate-500">Lectures</div>
                      <div className="text-slate-200 mt-0.5">
                        {ch.metrics.lecturesCompleted}/{ch.metrics.totalLectures}
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                      <div className="text-slate-500">DPPs</div>
                      <div className="text-slate-200 mt-0.5">
                        {ch.metrics.dppsCompleted}/{ch.metrics.totalDpps}
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                      <div className="text-slate-500">PYQs</div>
                      <div className="text-cyan-300 mt-0.5">
                        {ch.metrics.pyqsSolved}/{ch.metrics.totalPyqs} ({ch.metrics.pyqAccuracy}%)
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                      <div className="text-slate-500">Formulas</div>
                      <div className="text-slate-200 mt-0.5">
                        {ch.metrics.formulasRevised ? '✓ Revised' : 'Pending'}
                      </div>
                    </div>
                  </div>

                  {/* Connected NEXORA Action Buttons */}
                  <div className="flex items-center gap-1.5 pt-2 border-t border-white/5 flex-wrap">
                    <button
                      onClick={() => onNavigate('focus')}
                      className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/80 transition-all text-[11px] font-extrabold flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3 fill-current" /> Study
                    </button>

                    <button
                      onClick={() => onNavigate('practice')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 transition-all text-[11px] font-extrabold flex items-center gap-1.5"
                    >
                      <Target className="w-3 h-3" /> Practice
                    </button>

                    <button
                      onClick={() => onNavigate('pyqs')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 transition-all text-[11px] font-extrabold flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3 h-3" /> PYQs ({ch.metrics.totalPyqs})
                    </button>

                    <button
                      onClick={() => onNavigate('formula-vault')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 transition-all text-[11px] font-extrabold flex items-center gap-1.5"
                    >
                      <Calculator className="w-3 h-3" /> Formulas
                    </button>

                    <button
                      onClick={() => addChapterToRevisionEngine(ch)}
                      className="px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/30 text-amber-300 hover:bg-amber-900/80 transition-all text-[11px] font-extrabold flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3 h-3" /> Revise
                    </button>

                    <button
                      onClick={() => setActiveChapterModal(ch)}
                      className="ml-auto p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all text-xs font-bold"
                      title="Open Detailed Chapter Dashboard"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 8. CHAPTER DETAILED DASHBOARD MODAL */}
      {activeChapterModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(34,211,238,0.2)] text-slate-100">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                    {activeChapterModal.exam}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                    Class {activeChapterModal.classGrade}
                  </span>
                  {activeChapterModal.category && (
                    <span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] font-bold">
                      {activeChapterModal.category}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-black text-white">{activeChapterModal.name}</h2>
              </div>
              <button
                onClick={() => setActiveChapterModal(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overall Progress & Quick Actions Bar */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <div className="text-xs font-bold text-slate-400">Chapter Progress</div>
                <div className="text-3xl font-black text-cyan-300 mt-1">
                  {activeChapterModal.overallProgress}%
                </div>
              </div>

              <div className="md:col-span-2 flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => addChapterToPlannerRecommendation(activeChapterModal)}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 text-xs font-bold flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Add to Smart Planner
                </button>
                <button
                  onClick={() => addChapterToRevisionEngine(activeChapterModal)}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-bold flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Schedule Spaced Revision
                </button>
              </div>
            </div>

            {/* Detailed Topics & Subtopics Interactive Editor */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Chapter Topics & Subtopics Hierarchy</span>
              </h3>

              <div className="space-y-3">
                {activeChapterModal.topics.map((top, tIdx) => (
                  <div
                    key={top.id}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-slate-200">
                        {tIdx + 1}. {top.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-300">
                          {top.completionPercentage}%
                        </span>
                      </div>
                    </div>

                    {/* Completion Slider */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={top.completionPercentage}
                      onChange={(e) => {
                        const newPct = parseInt(e.target.value);
                        const updatedTopics = activeChapterModal.topics.map((t) =>
                          t.id === top.id ? { ...t, completionPercentage: newPct } : t
                        );
                        handleUpdateChapter({
                          ...activeChapterModal,
                          topics: updatedTopics,
                        });
                      }}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />

                    {/* Subtopics Checklist */}
                    {top.subtopics && top.subtopics.length > 0 && (
                      <div className="pl-4 border-l-2 border-cyan-500/20 space-y-1.5 pt-1">
                        {top.subtopics.map((sub) => (
                          <label
                            key={sub.id}
                            className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white"
                          >
                            <input
                              type="checkbox"
                              checked={sub.completed}
                              onChange={(e) => {
                                const newChecked = e.target.checked;
                                const updatedSubtopics = top.subtopics?.map((s) =>
                                  s.id === sub.id ? { ...s, completed: newChecked } : s
                                );

                                // Auto recalculate topic % based on subtopics
                                const compCount =
                                  updatedSubtopics?.filter((s) => s.completed).length || 0;
                                const calcTopicPct = Math.round(
                                  (compCount / (updatedSubtopics?.length || 1)) * 100
                                );

                                const updatedTopics = activeChapterModal.topics.map((t) =>
                                  t.id === top.id
                                    ? {
                                        ...t,
                                        subtopics: updatedSubtopics,
                                        completionPercentage: calcTopicPct,
                                      }
                                    : t
                                );

                                handleUpdateChapter({
                                  ...activeChapterModal,
                                  topics: updatedTopics,
                                });
                              }}
                              className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/30"
                            />
                            <span>{sub.title}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-Metrics Tracker Editor */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Tracked Learning & Practice Sub-Metrics</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Lectures */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <div className="text-xs font-bold text-slate-400">Lectures Completed</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={activeChapterModal.metrics.lecturesCompleted}
                      onChange={(e) =>
                        handleUpdateChapter({
                          ...activeChapterModal,
                          metrics: {
                            ...activeChapterModal.metrics,
                            lecturesCompleted: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-16 bg-slate-900 border border-slate-700 text-xs font-bold text-cyan-300 rounded-xl p-1.5 text-center"
                    />
                    <span className="text-xs text-slate-500">
                      / {activeChapterModal.metrics.totalLectures} Total
                    </span>
                  </div>
                </div>

                {/* DPPs */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <div className="text-xs font-bold text-slate-400">DPPs Completed</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={activeChapterModal.metrics.dppsCompleted}
                      onChange={(e) =>
                        handleUpdateChapter({
                          ...activeChapterModal,
                          metrics: {
                            ...activeChapterModal.metrics,
                            dppsCompleted: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-16 bg-slate-900 border border-slate-700 text-xs font-bold text-cyan-300 rounded-xl p-1.5 text-center"
                    />
                    <span className="text-xs text-slate-500">
                      / {activeChapterModal.metrics.totalDpps} Total
                    </span>
                  </div>
                </div>

                {/* PYQs Solved */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <div className="text-xs font-bold text-slate-400">PYQs Solved</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={activeChapterModal.metrics.pyqsSolved}
                      onChange={(e) =>
                        handleUpdateChapter({
                          ...activeChapterModal,
                          metrics: {
                            ...activeChapterModal.metrics,
                            pyqsSolved: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-16 bg-slate-900 border border-slate-700 text-xs font-bold text-cyan-300 rounded-xl p-1.5 text-center"
                    />
                    <span className="text-xs text-slate-500">
                      / {activeChapterModal.metrics.totalPyqs} Available
                    </span>
                  </div>
                </div>

                {/* PYQ Accuracy */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <div className="text-xs font-bold text-slate-400">PYQ Accuracy %</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={activeChapterModal.metrics.pyqAccuracy}
                      onChange={(e) =>
                        handleUpdateChapter({
                          ...activeChapterModal,
                          metrics: {
                            ...activeChapterModal.metrics,
                            pyqAccuracy: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-16 bg-slate-900 border border-slate-700 text-xs font-bold text-cyan-300 rounded-xl p-1.5 text-center"
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                </div>

                {/* Toggles */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2 col-span-1 sm:col-span-2 flex items-center justify-around">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeChapterModal.metrics.formulasRevised}
                      onChange={(e) =>
                        handleUpdateChapter({
                          ...activeChapterModal,
                          metrics: {
                            ...activeChapterModal.metrics,
                            formulasRevised: e.target.checked,
                          },
                        })
                      }
                      className="rounded text-cyan-500"
                    />
                    <span>Formulas Revised</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeChapterModal.metrics.notesCompleted}
                      onChange={(e) =>
                        handleUpdateChapter({
                          ...activeChapterModal,
                          metrics: {
                            ...activeChapterModal.metrics,
                            notesCompleted: e.target.checked,
                          },
                        })
                      }
                      className="rounded text-cyan-500"
                    />
                    <span>Notes Completed</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <button
                onClick={() => {
                  setResetType('chapter');
                  setShowResetModal(true);
                }}
                className="text-xs font-bold text-rose-400 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Chapter Progress
              </button>

              <button
                onClick={() => setActiveChapterModal(null)}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs hover:bg-cyan-400 transition-all"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. PREREQUISITE WARNING MODAL */}
      {prerequisiteWarning && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-[0_0_40px_rgba(245,158,11,0.2)] text-slate-100">
            <div className="flex items-center gap-3 text-amber-400">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-black">Recommended Prerequisite Warning</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              You are starting{' '}
              <strong className="text-white">{prerequisiteWarning.targetChapter.name}</strong>, but
              the following recommended prerequisites are incomplete:
            </p>

            <ul className="space-y-2">
              {prerequisiteWarning.unmetPrereqs.map((un) => (
                <li
                  key={un.id}
                  className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-xs flex items-center justify-between"
                >
                  <span className="font-bold text-amber-200">{un.name}</span>
                  <span className="font-mono text-amber-400">{un.overallProgress}% Complete</span>
                </li>
              ))}
            </ul>

            <p className="text-[11px] text-slate-400 italic">
              NEXORA does not block you — you can proceed anyway or review prerequisites first.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  applyStatusChange(
                    prerequisiteWarning.targetChapter.id,
                    prerequisiteWarning.targetChapter.status
                  );
                  setPrerequisiteWarning(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-all"
              >
                Continue Anyway
              </button>
              <button
                onClick={() => {
                  setActiveChapterModal(prerequisiteWarning.unmetPrereqs[0]);
                  setPrerequisiteWarning(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition-all"
              >
                Review Prerequisite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. RESET CONFIRMATION MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-[0_0_40px_rgba(244,63,94,0.2)] text-slate-100">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-black">Confirm Progress Reset</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to reset{' '}
              <strong className="text-white">
                {resetType === 'chapter'
                  ? activeChapterModal?.name
                  : resetType === 'subject'
                  ? `${selectedSubject} Subject`
                  : `Entire ${selectedExam} Syllabus`}
              </strong>
              ?
            </p>

            <div className="p-3 rounded-2xl bg-slate-950 border border-white/5 text-[11px] text-emerald-300/90 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Preserved Safe Records:
              </div>
              <p>Your PYQ history, mock test results, and study timer logs will NOT be deleted.</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleResetExecute}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-black text-xs hover:bg-rose-500 transition-all"
              >
                Yes, Reset Progress
              </button>
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
