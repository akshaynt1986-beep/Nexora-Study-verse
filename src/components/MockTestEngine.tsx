import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  RotateCcw,
  PlusCircle,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Zap,
  Target,
  FileText,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import {
  MistakeEntry,
  MockTest,
  MockTestResult,
  NexoraTheme,
  PYQQuestion,
  UserStats,
} from '../types';
import { StorageService } from '../services/storage';
import { AudioSynthService } from '../services/audioSynth';

interface MockTestEngineProps {
  theme: NexoraTheme;
  userStats: UserStats;
  onUpdateStats: (updater: (prev: UserStats) => UserStats) => void;
  onAddMistake?: (mistake: Omit<MistakeEntry, 'id'>) => void;
}

export const MockTestEngine: React.FC<MockTestEngineProps> = ({
  theme,
  userStats,
  onUpdateStats,
  onAddMistake,
}) => {
  const [pyqPool] = useState<PYQQuestion[]>(StorageService.getPyqs());
  const [results, setResults] = useState<MockTestResult[]>(StorageService.getMockTestResults());

  // Top level Exam Selection
  const [selectedExam, setSelectedExam] = useState<'JEE Main' | 'JEE Advanced' | 'NEET'>('JEE Main');

  // View state
  const [activeTab, setActiveTab] = useState<'mocks' | 'pyp' | 'history'>('mocks');

  // Test Execution State
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [testCompletedResult, setTestCompletedResult] = useState<MockTestResult | null>(null);

  // Timer countdown
  useEffect(() => {
    if (!activeTest || secondsRemaining <= 0) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTest, secondsRemaining]);

  // Launch a new Mock Test
  const handleStartTest = (
    testTitle: string,
    mode: 'JEE Main' | 'JEE Advanced' | 'NEET',
    durationMins: number,
    paperType?: 'Paper 1' | 'Paper 2' | 'Full Paper',
    subjectOnly?: string
  ) => {
    let questions = pyqPool.filter((q) => {
      if (q.exam !== mode) return false;
      if (paperType && q.paper && q.paper !== paperType) return false;
      if (subjectOnly && q.subject !== subjectOnly) return false;
      return true;
    });

    if (questions.length === 0) {
      questions = pyqPool.filter((q) => q.exam === mode);
    }

    if (questions.length === 0) {
      questions = pyqPool;
    }

    // Prepare questions
    const selectedQuestions = [...questions].sort(() => 0.5 - Math.random()).slice(0, mode === 'NEET' ? 20 : 15);

    const test: MockTest = {
      id: 'test_' + Date.now(),
      title: testTitle,
      mode,
      durationMinutes: durationMins,
      totalMarks: selectedQuestions.length * 4,
      totalQuestions: selectedQuestions.length,
      questions: selectedQuestions,
    };

    setActiveTest(test);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setMarkedForReview({});
    setSecondsRemaining(durationMins * 60);
    setTestCompletedResult(null);
    AudioSynthService.playNotificationSound();
  };

  const handleFinishTest = () => {
    if (!activeTest) return;

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let totalScore = 0;
    let negativeMarks = 0;

    const subjectScores: Record<string, { correct: number; incorrect: number; score: number }> = {};
    const weakConcepts: string[] = [];

    activeTest.questions.forEach((q, idx) => {
      const uAns = userAnswers[idx];

      if (!subjectScores[q.subject]) {
        subjectScores[q.subject] = { correct: 0, incorrect: 0, score: 0 };
      }

      if (uAns === undefined || uAns === '' || uAns === null) {
        unattemptedCount++;
        return;
      }

      let isCorrect = false;

      if (q.questionType === 'NUMERICAL') {
        const val = parseFloat(uAns);
        if (q.numericalAnswer) {
          isCorrect = !isNaN(val) && val >= q.numericalAnswer.min && val <= q.numericalAnswer.max;
        } else if (q.numericalAnswerText) {
          isCorrect = uAns.toString().trim() === q.numericalAnswerText.toString().trim();
        }
      } else if (q.questionType === 'MCQ_MULTIPLE') {
        const correctList = Array.isArray(q.correctAnswerIndex) ? q.correctAnswerIndex : [q.correctAnswerIndex];
        const userList = Array.isArray(uAns) ? uAns : [uAns];
        isCorrect =
          correctList.length === userList.length &&
          correctList.every((val) => userList.includes(val));
      } else {
        isCorrect = Number(uAns) === Number(q.correctAnswerIndex);
      }

      if (isCorrect) {
        correctCount++;
        const marks = activeTest.mode === 'JEE Advanced' ? 4 : 4;
        totalScore += marks;
        subjectScores[q.subject].correct++;
        subjectScores[q.subject].score += marks;
      } else {
        incorrectCount++;
        const neg = activeTest.mode === 'JEE Advanced' ? 2 : 1;
        totalScore -= neg;
        negativeMarks += neg;
        subjectScores[q.subject].incorrect++;
        subjectScores[q.subject].score -= neg;

        if (q.conceptTested) {
          weakConcepts.push(q.conceptTested);
        }

        // Add to mistake book
        if (onAddMistake) {
          onAddMistake({
            questionId: q.id,
            questionText: q.questionText,
            userAnswer: typeof uAns === 'object' ? JSON.stringify(uAns) : String(uAns),
            correctAnswer: q.options?.[Number(q.correctAnswerIndex)] || 'Option ' + q.correctAnswerIndex,
            subject: q.subject,
            chapter: q.chapter,
            topic: q.topic || 'General',
            category: 'Conceptual',
            whyWrong: `Incorrect response during ${activeTest.title}`,
            correctConcept: q.conceptTested || 'Exam Concept Verification',
            dateAdded: new Date().toISOString().split('T')[0],
            reviewedCount: 0,
            mastered: false,
          });
        }
      }
    });

    const accuracy =
      correctCount + incorrectCount > 0
        ? Math.round((correctCount / (correctCount + incorrectCount)) * 100)
        : 0;

    const attemptRate = Math.round(
      ((correctCount + incorrectCount) / activeTest.totalQuestions) * 100
    );

    const timeTaken = Math.round((activeTest.durationMinutes * 60 - secondsRemaining) / 60);

    const result: MockTestResult = {
      id: 'res_' + Date.now(),
      testId: activeTest.id,
      testTitle: activeTest.title,
      dateCompleted: new Date().toISOString().split('T')[0],
      timeTakenMinutes: Math.max(1, timeTaken),
      score: totalScore,
      maxScore: activeTest.totalMarks,
      accuracyPercentage: accuracy,
      attemptRatePercentage: attemptRate,
      correctCount,
      incorrectCount,
      unattemptedCount,
      negativeMarks,
      subjectScores,
      weakConcepts: Array.from(new Set(weakConcepts)),
      aiRecommendation:
        accuracy >= 85
          ? `Exceptional accuracy in ${activeTest.mode}! Maintain momentum by attempting JEE Advanced / high-level problem sets.`
          : accuracy >= 60
          ? `Solid performance. Focus on reducing negative marks in ${weakConcepts.slice(0, 2).join(', ') || 'weak concepts'}.`
          : `Review fundamentals. Revise formulas and revisit mistake entries in ${weakConcepts.slice(0, 3).join(', ') || 'core chapters'}.`,
    };

    const updatedResults = [result, ...results];
    setResults(updatedResults);
    StorageService.saveMockTestResults(updatedResults);

    setTestCompletedResult(result);
    setActiveTest(null);

    // Update user stats
    onUpdateStats((prev) => ({
      ...prev,
      mockTestsCount: (prev.mockTestsCount || 0) + 1,
      xp: prev.xp + Math.max(10, totalScore * 5),
    }));
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 border border-purple-500/30 text-purple-300 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>AUTHENTIC EXAM PATTERN MOCK TEST SYSTEM</span>
          </div>
          <h1 className="text-2xl font-black text-white">NEXORA Exam Simulations</h1>
          <p className="text-xs text-slate-400">
            Separated mock test engines for JEE Main, JEE Advanced, and NEET with real marking schemes and percentile estimation.
          </p>
        </div>

        {/* TOP LEVEL EXAM TOGGLES */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-white/10">
          {(['JEE Main', 'JEE Advanced', 'NEET'] as const).map((exam) => (
            <button
              key={exam}
              onClick={() => {
                setSelectedExam(exam);
                setTestCompletedResult(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                selectedExam === exam
                  ? exam === 'JEE Main'
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                    : exam === 'JEE Advanced'
                    ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/20'
                    : 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {exam}
            </button>
          ))}
        </div>
      </div>

      {/* SUB NAVIGATION TAB */}
      {!activeTest && !testCompletedResult && (
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('mocks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'mocks' ? 'bg-slate-800 text-purple-400 border border-purple-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {selectedExam} Mock Tests
          </button>
          <button
            onClick={() => setActiveTab('pyp')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'pyp' ? 'bg-slate-800 text-purple-400 border border-purple-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Previous Year Full Papers
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'history' ? 'bg-slate-800 text-purple-400 border border-purple-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Test Performance History ({results.length})
          </button>
        </div>
      )}

      {/* TAB 1: MOCK TEST CATALOG FOR SELECTED EXAM */}
      {!activeTest && !testCompletedResult && activeTab === 'mocks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Full Syllabus Test */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-purple-500/30 space-y-4 flex flex-col justify-between hover:border-purple-400 transition-all">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30 text-[10px] font-black uppercase">
                  Full Exam Pattern
                </span>
                <h3 className="text-base font-black text-white">{selectedExam} Full Syllabus Mock #1</h3>
                <p className="text-xs text-slate-400">
                  Comprehensive mock test following authentic {selectedExam} timing, marking schemes, and question balance.
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-300 pt-2">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    {selectedExam === 'NEET' ? '180 Mins' : '180 Mins'}
                  </span>
                  <span>•</span>
                  <span>{selectedExam === 'NEET' ? '720 Marks' : '300 Marks'}</span>
                </div>
              </div>

              <button
                onClick={() => handleStartTest(`${selectedExam} Full Mock Test #1`, selectedExam, 180)}
                className="w-full py-3 rounded-2xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                Start Full Test
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Subject-Wise Mock Test */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/30 space-y-4 flex flex-col justify-between hover:border-cyan-400 transition-all">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px] font-black uppercase">
                  Subject Focused
                </span>
                <h3 className="text-base font-black text-white">{selectedExam} Physics Mastery Test</h3>
                <p className="text-xs text-slate-400">
                  Speed and accuracy test strictly covering Physics past year & high-yield problems.
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-300 pt-2">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    60 Mins
                  </span>
                  <span>•</span>
                  <span>Physics Only</span>
                </div>
              </div>

              <button
                onClick={() => handleStartTest(`${selectedExam} Physics Test`, selectedExam, 60, undefined, 'Physics')}
                className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                Start Physics Test
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Chemistry Mock Test */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 space-y-4 flex flex-col justify-between hover:border-emerald-400 transition-all">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase">
                  Subject Focused
                </span>
                <h3 className="text-base font-black text-white">{selectedExam} Chemistry Power Test</h3>
                <p className="text-xs text-slate-400">
                  Timed test covering Physical, Organic, and Inorganic Chemistry.
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-300 pt-2">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    60 Mins
                  </span>
                  <span>•</span>
                  <span>Chemistry Only</span>
                </div>
              </div>

              <button
                onClick={() => handleStartTest(`${selectedExam} Chemistry Test`, selectedExam, 60, undefined, 'Chemistry')}
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                Start Chemistry Test
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PREVIOUS YEAR PAPERS */}
      {!activeTest && !testCompletedResult && activeTab === 'pyp' && (
        <div className="space-y-4">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            Official Previous Year Full Paper Simulations ({selectedExam})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[2026, 2025, 2024, 2023, 2022].map((yr) => (
              <div key={yr} className="p-5 rounded-3xl bg-slate-900/80 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-white">{selectedExam} {yr} Full Paper</span>
                  <span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                    Official Exam Simulation
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Simulate the exact official exam atmosphere for {selectedExam} {yr}.
                </p>
                <button
                  onClick={() => handleStartTest(`${selectedExam} ${yr} Official Simulation`, selectedExam, 180)}
                  className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2"
                >
                  Attempt Official {yr} Paper
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PERFORMANCE HISTORY */}
      {!activeTest && !testCompletedResult && activeTab === 'history' && (
        <div className="space-y-4">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            Past Test Results & Analytics
          </h2>

          {results.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/5 text-center text-xs text-slate-400">
              No test attempts logged yet. Complete a mock test to view detailed performance metrics.
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((res) => (
                <div key={res.id} className="p-5 rounded-3xl bg-slate-900/80 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-sm font-black text-white">{res.testTitle}</span>
                    <span className="text-xs text-slate-400 font-mono">{res.dateCompleted}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-300 flex-wrap">
                    <span>
                      Score: <strong className="text-cyan-400">{res.score}</strong> / {res.maxScore}
                    </span>
                    <span>
                      Accuracy: <strong className="text-emerald-400">{res.accuracyPercentage}%</strong>
                    </span>
                    <span>Time Taken: {res.timeTakenMinutes} mins</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TEST RUNNING ROOM */}
      {activeTest && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-purple-500/40 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 flex-wrap gap-2">
            <div>
              <span className="text-xs text-purple-400 font-bold">{activeTest.mode} Exam Simulation</span>
              <h2 className="text-lg font-black text-white">{activeTest.title}</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-mono text-purple-300 bg-slate-950 px-4 py-2 rounded-2xl border border-purple-500/30">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>
                  {Math.floor(secondsRemaining / 3600)}h {Math.floor((secondsRemaining % 3600) / 60)}m {secondsRemaining % 60}s
                </span>
              </div>

              <button
                onClick={handleFinishTest}
                className="px-5 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg"
              >
                Finish & Submit
              </button>
            </div>
          </div>

          {/* Question Palette */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
            {activeTest.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuestionIdx(i)}
                className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
                  currentQuestionIdx === i
                    ? 'bg-purple-500 text-slate-950 shadow-md'
                    : userAnswers[i] !== undefined
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-950 text-slate-400'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Active Question Statement */}
          {activeTest.questions[currentQuestionIdx] && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-purple-400">
                Q{currentQuestionIdx + 1} • {activeTest.questions[currentQuestionIdx].subject} • {activeTest.questions[currentQuestionIdx].chapter}
              </div>

              <p className="text-sm font-medium text-white leading-relaxed">
                {activeTest.questions[currentQuestionIdx].questionText}
              </p>

              {activeTest.questions[currentQuestionIdx].questionType !== 'NUMERICAL' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(activeTest.questions[currentQuestionIdx].options || []).map((opt, oIdx) => {
                    const isSelected = userAnswers[currentQuestionIdx] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => setUserAnswers({ ...userAnswers, [currentQuestionIdx]: oIdx })}
                        className={`p-4 rounded-2xl border text-left text-xs transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-purple-950 border-purple-500 text-purple-200 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-purple-500/40'
                        }`}
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
                  <label className="block text-xs text-slate-400 font-bold">Numerical Value Answer:</label>
                  <input
                    type="text"
                    value={userAnswers[currentQuestionIdx] || ''}
                    onChange={(e) => setUserAnswers({ ...userAnswers, [currentQuestionIdx]: e.target.value })}
                    placeholder="Enter answer..."
                    className="w-full max-w-xs bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-purple-300 font-mono font-bold"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              disabled={currentQuestionIdx === 0}
              onClick={() => setCurrentQuestionIdx((prev) => prev - 1)}
              className="px-4 py-2 rounded-xl bg-slate-950 text-slate-300 text-xs font-bold disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={currentQuestionIdx === activeTest.questions.length - 1}
              onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
              className="px-4 py-2 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/30 text-xs font-bold disabled:opacity-40"
            >
              Next Question
            </button>
          </div>
        </div>
      )}

      {/* COMPLETED TEST RESULTS DISPLAY */}
      {testCompletedResult && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs text-emerald-400 font-bold">Test Evaluation Complete</span>
              <h2 className="text-xl font-black text-white">{testCompletedResult.testTitle}</h2>
            </div>
            <button
              onClick={() => setTestCompletedResult(null)}
              className="px-4 py-2 rounded-xl bg-slate-950 text-slate-300 text-xs font-bold hover:text-white"
            >
              Close Results
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400 font-bold">Final Score</div>
              <div className="text-2xl font-black text-cyan-400">
                {testCompletedResult.score} / {testCompletedResult.maxScore}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400 font-bold">Accuracy Percentage</div>
              <div className="text-2xl font-black text-emerald-400">
                {testCompletedResult.accuracyPercentage}%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400 font-bold">Attempt Rate</div>
              <div className="text-2xl font-black text-purple-400">
                {testCompletedResult.attemptRatePercentage}%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400 font-bold">Negative Marks</div>
              <div className="text-2xl font-black text-rose-400">
                -{testCompletedResult.negativeMarks}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2">
            <div className="text-xs font-black text-cyan-400 uppercase">AI Mentor Diagnostic & Strategy</div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{testCompletedResult.aiRecommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
};
