import React, { useState, useEffect } from 'react';
import {
  Target,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  BookOpen,
  ChevronRight,
  Bookmark,
  RotateCcw,
  BarChart3,
  List,
  Calendar,
  Layers,
  Award,
  ArrowRight,
  Check,
  FileSpreadsheet,
  AlertTriangle,
  HelpCircle,
  Brain,
  Zap,
  BookmarkCheck,
  ShieldCheck
} from 'lucide-react';
import { MistakeEntry, PYQQuestion, QuestionType, SubjectType, UserStats } from '../types';
import { StorageService } from '../services/storage';

interface PyqEngineProps {
  theme?: any;
  user?: any;
  pyqs?: PYQQuestion[];
  userStats?: UserStats;
  stats?: UserStats;
  onUpdateStats?: (newStats: UserStats) => void;
  onAddMistake?: (mistake: MistakeEntry) => void;
}

type PyqViewMode = 'filter' | 'random' | 'year' | 'chapter' | 'saved' | 'analytics';

export const PyqEngine: React.FC<PyqEngineProps> = ({
  pyqs,
  userStats,
  stats,
  onUpdateStats,
  onAddMistake,
}) => {
  const pyqPool = pyqs || StorageService.getPyqs();
  const currentStats = userStats || stats || {
    xp: 0,
    level: 1,
    coins: 0,
    currentStreak: 0,
    dailyStudyHoursToday: 0,
    questionsSolved: 0,
    pyqsSolved: 0,
    mockTestsCompleted: 0,
    accuracyPercentage: 0,
    rankTitle: 'Rank E',
    totalFocusMinutes: 0,
    chaptersCompleted: 0,
    revisionCompleted: 0,
    achievementsUnlocked: 0,
    heatmapData: {},
    unlockedThemes: ['shadow-core'],
    lastActiveDate: '',
    productivityScore: 0,
    mockTestsCount: 0
  };

  // Top level exam separation
  const [selectedExam, setSelectedExam] = useState<'JEE Main' | 'JEE Advanced' | 'NEET'>('JEE Main');

  // Sub-navigation view mode
  const [viewMode, setViewMode] = useState<PyqViewMode>('filter');

  // Filters
  const [selectedYear, setSelectedYear] = useState<number | 'All'>('All');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('Physics');
  const [selectedChapter, setSelectedChapter] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Random Mode count
  const [randomCount, setRandomCount] = useState<number>(10);

  // Active session questions
  const [activeSessionQuestions, setActiveSessionQuestions] = useState<PYQQuestion[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  // User responses
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<number, boolean>>({});

  // Timer
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Saved Bookmarks
  const [savedPyqIds, setSavedPyqIds] = useState<string[]>(StorageService.getSavedPyqIds());

  // Exam-specific Analytics State
  const [examAnalytics, setExamAnalytics] = useState(StorageService.getExamAnalytics(selectedExam));

  useEffect(() => {
    setExamAnalytics(StorageService.getExamAnalytics(selectedExam));
  }, [selectedExam]);

  // Timer interval for active session
  useEffect(() => {
    if (!isSessionActive) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSessionActive]);

  // Filter available PYQs for selected exam
  const filteredPyqs = pyqPool.filter((q) => {
    if (q.exam !== selectedExam) return false;
    if (selectedYear !== 'All' && q.year !== selectedYear) return false;
    if (selectedSubject && q.subject !== selectedSubject) return false;
    if (selectedChapter !== 'All' && q.chapter !== selectedChapter) return false;
    if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const availableChapters = Array.from(
    new Set(pyqPool.filter((q) => q.exam === selectedExam && q.subject === selectedSubject).map((q) => q.chapter))
  );

  const startPracticeSession = (questionsToUse: PYQQuestion[]) => {
    if (questionsToUse.length === 0) return;
    setActiveSessionQuestions(questionsToUse);
    setActiveIdx(0);
    setUserAnswers({});
    setMarkedForReview({});
    setSubmittedQuestions({});
    setTimerSeconds(0);
    setIsSessionActive(true);
  };

  const handleStartRandomPractice = () => {
    const examQuestions = pyqPool.filter((q) => q.exam === selectedExam && (selectedSubject ? q.subject === selectedSubject : true));
    const shuffled = [...examQuestions].sort(() => 0.5 - Math.random()).slice(0, randomCount);
    startPracticeSession(shuffled);
  };

  const handleStartYearPractice = (year: number) => {
    const yearQuestions = pyqPool.filter((q) => q.exam === selectedExam && q.year === year);
    startPracticeSession(yearQuestions);
  };

  const handleStartChapterPractice = (chap: string) => {
    const chapQuestions = pyqPool.filter((q) => q.exam === selectedExam && q.chapter === chap);
    startPracticeSession(chapQuestions);
  };

  const handleToggleBookmark = (qId: string) => {
    let updated: string[];
    if (savedPyqIds.includes(qId)) {
      updated = savedPyqIds.filter((id) => id !== qId);
    } else {
      updated = [...savedPyqIds, qId];
    }
    setSavedPyqIds(updated);
    StorageService.saveSavedPyqIds(updated);
  };

  const handleSubmitAnswer = (idx: number) => {
    const q = activeSessionQuestions[idx];
    if (!q || userAnswers[idx] === undefined) return;

    setSubmittedQuestions((prev) => ({ ...prev, [idx]: true }));

    let isCorrect = false;
    const ans = userAnswers[idx];

    if (q.questionType === 'NUMERICAL') {
      const val = parseFloat(ans);
      if (q.numericalAnswer) {
        isCorrect = !isNaN(val) && val >= q.numericalAnswer.min && val <= q.numericalAnswer.max;
      } else if (q.numericalAnswerText) {
        isCorrect = ans.toString().trim() === q.numericalAnswerText.toString().trim();
      }
    } else if (q.questionType === 'MCQ_MULTIPLE') {
      const correctList = Array.isArray(q.correctAnswerIndex) ? q.correctAnswerIndex : [q.correctAnswerIndex];
      const userList = Array.isArray(ans) ? ans : [ans];
      isCorrect =
        correctList.length === userList.length &&
        correctList.every((val) => userList.includes(val));
    } else {
      isCorrect = Number(ans) === Number(q.correctAnswerIndex);
    }

    // Record stats
    StorageService.recordPyqAttempt(selectedExam, q.chapter, q.year, isCorrect, 60);
    setExamAnalytics(StorageService.getExamAnalytics(selectedExam));

    // Update User XP
    if (onUpdateStats) {
      onUpdateStats({
        ...currentStats,
        questionsSolved: currentStats.questionsSolved + 1,
        pyqsSolved: currentStats.pyqsSolved + 1,
        xp: isCorrect ? currentStats.xp + 25 : currentStats.xp + 5,
      });
    }

    // Auto-Add to Mistake Book if wrong
    if (!isCorrect && onAddMistake) {
      const mistake: MistakeEntry = {
        id: 'mst_' + Date.now(),
        questionId: q.id,
        questionText: q.questionText,
        userAnswer: typeof ans === 'object' ? JSON.stringify(ans) : String(ans),
        correctAnswer:
          q.questionType === 'NUMERICAL'
            ? q.numericalAnswerText || `${q.numericalAnswer?.exact}`
            : q.options?.[Number(q.correctAnswerIndex)] || 'Option ' + q.correctAnswerIndex,
        subject: q.subject,
        chapter: q.chapter,
        topic: q.topic || 'General',
        category: 'Conceptual',
        whyWrong: `Attempted in ${selectedExam} PYQ Practice.`,
        correctConcept: q.conceptTested || 'Exam Concept Verification',
        dateAdded: new Date().toISOString().split('T')[0],
        reviewedCount: 0,
        mastered: false,
      };
      onAddMistake(mistake);
    }
  };

  const currentQ = activeSessionQuestions[activeIdx];

  return (
    <div className="space-y-6">
      {/* EXAM SELECTION HEADER */}
      <div className="p-6 rounded-2xl bg-[#121422]/90 border border-purple-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono mb-2">
            <Target className="w-3.5 h-3.5 text-purple-400" />
            <span>PAST YEAR QUESTION ENGINE (2016–2026)</span>
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-slate-100">NEXORA PYQ Repository</h1>
          <p className="text-xs text-slate-400 mt-1">
            Dedicated exam-wise past year question ecosystems with instant solution verification.
          </p>
        </div>

        {/* TOP LEVEL EXAM TOGGLES */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0b0c13] border border-white/5">
          {(['JEE Main', 'JEE Advanced', 'NEET'] as const).map((exam) => (
            <button
              key={exam}
              onClick={() => {
                setSelectedExam(exam);
                setIsSessionActive(false);
                setSelectedChapter('All');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                selectedExam === exam
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {exam}
            </button>
          ))}
        </div>
      </div>

      {/* SUB NAVIGATION MODES */}
      {!isSessionActive && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          <button
            onClick={() => setViewMode('filter')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
              viewMode === 'filter' ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Custom Filter ({filteredPyqs.length})
          </button>

          <button
            onClick={() => setViewMode('random')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
              viewMode === 'random' ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Random PYQs
          </button>

          <button
            onClick={() => setViewMode('year')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
              viewMode === 'year' ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Practice by Year
          </button>

          <button
            onClick={() => setViewMode('chapter')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
              viewMode === 'chapter' ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Practice by Chapter
          </button>

          <button
            onClick={() => setViewMode('saved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
              viewMode === 'saved' ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Saved PYQs ({savedPyqIds.length})
          </button>

          <button
            onClick={() => setViewMode('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
              viewMode === 'analytics' ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            {selectedExam} Analytics
          </button>
        </div>
      )}

      {/* MODE 1: CUSTOM FILTER PRACTICE */}
      {!isSessionActive && viewMode === 'filter' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              Configure PYQ Practice Filters ({selectedExam})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value as SubjectType);
                    setSelectedChapter('All');
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  {selectedExam !== 'NEET' && <option value="Mathematics">Mathematics</option>}
                  {selectedExam === 'NEET' && <option value="Biology">Biology (Botany & Zoology)</option>}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Exam Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value === 'All' ? 'All' : Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold"
                >
                  <option value="All">All Years (2016–2026)</option>
                  {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Chapter</label>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold"
                >
                  <option value="All">All Chapters</option>
                  {availableChapters.map((ch) => (
                    <option key={ch} value={ch}>
                      {ch}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="JEE Advanced Level">JEE Advanced Level</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-xs text-cyan-400 font-bold">
                {filteredPyqs.length} Official Questions Available
              </span>

              {filteredPyqs.length > 0 ? (
                <button
                  onClick={() => startPracticeSession(filteredPyqs)}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition-all"
                >
                  <Zap className="w-4 h-4" />
                  START PRACTICE SESSION
                </button>
              ) : (
                <div className="text-xs text-amber-400 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  No imported questions for this combination
                </div>
              )}
            </div>
          </div>

          {/* QUESTION LIST OR NO-DATA STATE */}
          {filteredPyqs.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-amber-500/30 text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="text-base font-black text-white">
                PYQs for {selectedExam} ({selectedYear === 'All' ? '2016-2026' : selectedYear}) are not available in the database yet.
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                NEXORA maintains strict copyright compliance and does not fabricate fake questions. Use the Admin Data Manager to import official datasets.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPyqs.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-5 rounded-3xl bg-slate-900/80 border border-white/5 space-y-3 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px] font-black uppercase">
                        {q.exam} {q.year}
                      </span>
                      {q.session && (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 text-[10px] font-bold">
                          {q.session}
                        </span>
                      )}
                      <span className="text-xs font-bold text-white">
                        {q.subject} • {q.chapter}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleBookmark(q.id)}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                        savedPyqIds.includes(q.id)
                          ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      {savedPyqIds.includes(q.id) ? 'Saved' : 'Save'}
                    </button>
                  </div>

                  <p className="text-xs font-medium text-slate-200 line-clamp-3">{q.questionText}</p>

                  <div className="flex items-center justify-between pt-2 text-[10px] text-slate-500 border-t border-slate-800">
                    <span>Source: {q.source}</span>
                    <span className="text-cyan-400 font-mono">{q.licenseStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODE 2: RANDOM PYQs */}
      {!isSessionActive && viewMode === 'random' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                RANDOM PYQ BLITZ MODE ({selectedExam})
              </h2>
              <p className="text-xs text-slate-400">
                Generate an unrepeated random set of questions from the imported {selectedExam} dataset.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-xs text-slate-300 font-bold">Select Question Set Size:</div>
            <div className="flex items-center gap-3 flex-wrap">
              {[10, 20, 30, 50, 100].map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => setRandomCount(cnt)}
                  className={`px-5 py-3 rounded-2xl text-xs font-black transition-all ${
                    randomCount === cnt
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {cnt} Questions
                </button>
              ))}
            </div>

            <button
              onClick={handleStartRandomPractice}
              className="px-8 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl"
            >
              <Zap className="w-4 h-4" />
              START RANDOM PRACTICE
            </button>
          </div>
        </div>
      )}

      {/* MODE 3: PRACTICE BY YEAR */}
      {!isSessionActive && viewMode === 'year' && (
        <div className="space-y-4">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            {selectedExam} Practice By Year (2016–2026)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016].map((yr) => {
              const count = pyqPool.filter((q) => q.exam === selectedExam && q.year === yr).length;
              return (
                <div
                  key={yr}
                  className="p-5 rounded-3xl bg-slate-900/80 border border-white/5 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-white">{selectedExam} {yr}</span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          count > 0 ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'bg-slate-950 text-slate-500'
                        }`}
                      >
                        {count > 0 ? `${count} Questions` : 'Not Imported Yet'}
                      </span>
                    </div>
                  </div>

                  {count > 0 ? (
                    <button
                      onClick={() => handleStartYearPractice(yr)}
                      className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2"
                    >
                      Attempt {yr} Paper
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="text-[10px] text-slate-500 italic text-center">
                      Dataset not imported yet
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 4: PRACTICE BY CHAPTER */}
      {!isSessionActive && viewMode === 'chapter' && (
        <div className="space-y-4">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            {selectedExam} Practice By Chapter ({selectedSubject})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableChapters.map((chap) => {
              const chapQuestions = pyqPool.filter((q) => q.exam === selectedExam && q.chapter === chap);
              const statsObj = examAnalytics.chapterStats[chap] || { attempted: 0, correct: 0 };
              const acc = statsObj.attempted > 0 ? Math.round((statsObj.correct / statsObj.attempted) * 100) : 0;

              return (
                <div
                  key={chap}
                  className="p-5 rounded-3xl bg-slate-900/80 border border-white/5 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-cyan-400">{selectedSubject}</div>
                    <div className="text-sm font-black text-white">{chap}</div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                      <span>Total Available: {chapQuestions.length}</span>
                      <span>•</span>
                      <span>Attempted: {statsObj.attempted}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">Accuracy: {acc}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartChapterPractice(String(chap))}
                    className="py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2"
                  >
                    Practice Chapter PYQs
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 5: SAVED PYQs */}
      {!isSessionActive && viewMode === 'saved' && (
        <div className="space-y-4">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-400" />
            My Bookmarked / Saved PYQs ({savedPyqIds.length})
          </h2>

          {savedPyqIds.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/5 text-center text-xs text-slate-400">
              No bookmarked questions yet. Click "Save" on any question to add it to your saved vault.
            </div>
          ) : (
            <div className="space-y-3">
              {pyqPool
                .filter((q) => savedPyqIds.includes(q.id))
                .map((q) => (
                  <div key={q.id} className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-400">
                        {q.exam} {q.year} • {q.subject} • {q.chapter}
                      </span>
                      <button
                        onClick={() => handleToggleBookmark(q.id)}
                        className="text-xs text-rose-400 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-xs text-slate-200">{q.questionText}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* MODE 6: EXAM ANALYTICS */}
      {!isSessionActive && viewMode === 'analytics' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-6">
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            {selectedExam} PERFORMANCE ANALYTICS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400 font-bold">Questions Attempted</div>
              <div className="text-2xl font-black text-white">{examAnalytics.attempted}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400 font-bold">Accuracy Percentage</div>
              <div className="text-2xl font-black text-emerald-400">
                {examAnalytics.attempted > 0 ? Math.round((examAnalytics.correct / examAnalytics.attempted) * 100) : 0}%
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400 font-bold">Total Time Spent</div>
              <div className="text-2xl font-black text-cyan-400">
                {Math.round(examAnalytics.totalTimeSeconds / 60)} min
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE PRACTICE SESSION ROOM */}
      {isSessionActive && currentQ && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/40 space-y-6 shadow-2xl">
          {/* Practice Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-xs font-black">
                {currentQ.exam} {currentQ.year}
              </span>
              <span className="text-xs font-bold text-white">
                Q{activeIdx + 1} of {activeSessionQuestions.length} • {currentQ.subject}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs font-mono text-cyan-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {Math.floor(timerSeconds / 60)}m {timerSeconds % 60}s
                </span>
              </div>

              <button
                onClick={() => setIsSessionActive(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 text-rose-400 border border-rose-500/30 text-xs font-bold"
              >
                Exit Session
              </button>
            </div>
          </div>

          {/* Question Palette Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
            {activeSessionQuestions.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`w-7 h-7 rounded-lg text-xs font-black transition-all ${
                  activeIdx === i
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : submittedQuestions[i]
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    : userAnswers[i] !== undefined
                    ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                    : 'bg-slate-950 text-slate-400'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-cyan-400">
              {currentQ.chapter} {currentQ.topic ? `• ${currentQ.topic}` : ''}
            </div>
            <div className="text-sm font-medium text-white leading-relaxed">{currentQ.questionText}</div>
          </div>

          {/* Options / Input */}
          {currentQ.questionType !== 'NUMERICAL' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(currentQ.options || []).map((opt, oIdx) => {
                const isSelected = userAnswers[activeIdx] === oIdx;
                const isSubmitted = submittedQuestions[activeIdx];
                const isCorrectOpt = oIdx === currentQ.correctAnswerIndex;

                let btnStyle = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-cyan-500/50';
                if (isSubmitted) {
                  if (isCorrectOpt) btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                  else if (isSelected && !isCorrectOpt) btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                } else if (isSelected) {
                  btnStyle = 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold';
                }

                return (
                  <button
                    key={oIdx}
                    disabled={isSubmitted}
                    onClick={() => setUserAnswers({ ...userAnswers, [activeIdx]: oIdx })}
                    className={`p-4 rounded-2xl border text-left text-xs transition-all flex items-start gap-3 ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs text-slate-400 font-bold">Enter Numerical Answer:</label>
              <input
                type="text"
                disabled={submittedQuestions[activeIdx]}
                value={userAnswers[activeIdx] || ''}
                onChange={(e) => setUserAnswers({ ...userAnswers, [activeIdx]: e.target.value })}
                placeholder="Type your answer..."
                className="w-full max-w-xs bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-cyan-300 font-mono font-bold"
              />
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              disabled={activeIdx === 0}
              onClick={() => setActiveIdx((prev) => prev - 1)}
              className="px-4 py-2 rounded-xl bg-slate-950 text-slate-300 text-xs font-bold disabled:opacity-40"
            >
              Previous
            </button>

            {!submittedQuestions[activeIdx] ? (
              <button
                onClick={() => handleSubmitAnswer(activeIdx)}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg"
              >
                Submit Answer
              </button>
            ) : (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Evaluated
              </span>
            )}

            <button
              disabled={activeIdx === activeSessionQuestions.length - 1}
              onClick={() => setActiveIdx((prev) => prev + 1)}
              className="px-4 py-2 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-xs font-bold disabled:opacity-40"
            >
              Next Question
            </button>
          </div>

          {/* Solution Explanation Box */}
          {submittedQuestions[activeIdx] && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-cyan-400 uppercase">Detailed Solution & Concept</span>
                <span className="text-[10px] text-slate-400 font-mono">Source: {currentQ.source}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                {currentQ.explanation}
              </p>
              {currentQ.conceptTested && (
                <div className="text-xs text-amber-300 font-bold bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/20">
                  Concept Tested: {currentQ.conceptTested}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
