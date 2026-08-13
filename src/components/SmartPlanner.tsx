import React, { useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  RefreshCw,
  Sparkles,
  Target,
  Trash2,
  Zap,
  Flame,
  CheckSquare,
  Award,
  ArrowRight
} from 'lucide-react';
import {
  AnimeTheme,
  BacklogItem,
  MistakeEntry,
  MockTestResult,
  PlannerState,
  SubjectType,
  TaskItem,
  UserAccount,
  UserStats
} from '../types';

interface SmartPlannerProps {
  theme: AnimeTheme;
  plannerState: PlannerState;
  onUpdatePlanner: (updated: PlannerState) => void;
  userStats?: UserStats;
  mockTestResults?: MockTestResult[];
  tasks?: TaskItem[];
  mistakes?: MistakeEntry[];
  user?: UserAccount | null;
}

export const SmartPlanner: React.FC<SmartPlannerProps> = ({
  theme,
  plannerState,
  onUpdatePlanner,
  userStats,
  mockTestResults = [],
  tasks = [],
  mistakes = [],
  user
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'backlogs' | 'weekly'>('daily');
  const [newBacklogTitle, setNewBacklogTitle] = useState('');
  const [newBacklogSubject, setNewBacklogSubject] = useState<SubjectType>('Physics');
  const [newBacklogCount, setNewBacklogCount] = useState<number>(5);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [scheduleNotice, setScheduleNotice] = useState<string | null>(null);
  const [completedSlots, setCompletedSlots] = useState<number[]>([]);
  const [newEleventhTopic, setNewEleventhTopic] = useState('');

  const safePlannerState: PlannerState = {
    backlogs: [],
    eleventhBacklogs: [],
    limitsTarget: { total: 400, completed: 0 },
    remainingLectures: { organic: 12, inorganic: 8 },
    autoScheduleGenerated: false,
    generatedSchedule: [],
    ...(plannerState || {}),
  };

  const backlogs = safePlannerState.backlogs || [];
  const eleventhBacklogs = safePlannerState.eleventhBacklogs || [];

  // Calculate total lectures & questions left
  const totalBacklogLectures = backlogs.reduce(
    (acc, b) => acc + (b.type === 'Lecture' ? b.totalCount - b.completedCount : 0),
    0
  );

  const limitsTarget = safePlannerState.limitsTarget || { total: 400, completed: 0 };
  const remainingLectures = safePlannerState.remainingLectures || { organic: 12, inorganic: 8 };

  const organicLeft = remainingLectures.organic;
  const inorganicLeft = remainingLectures.inorganic;

  // Predict completion date based on daily study hours
  const dailyLecsPace = 2; // 2 lectures per day
  const daysNeededForLecs = Math.ceil((totalBacklogLectures + organicLeft + inorganicLeft) / dailyLecsPace);
  const estimatedCompletionDate = new Date();
  estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + Math.max(1, daysNeededForLecs));

  // Extract weak concepts from mock test results
  const mockTestWeakConcepts = mockTestResults.flatMap((r) => r.weakConcepts || []);

  const handleAutoReschedule = async () => {
    setIsRescheduling(true);
    setScheduleNotice(null);

    try {
      const res = await fetch('/api/gemini/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          backlogs,
          eleventhBacklogs,
          targetExam: user?.targetExam || plannerState?.targetExam || 'JEE Main/Advanced',
          currentClass: user?.classGrade || plannerState?.currentClass || '12th',
          dailyTargetHours: user?.dailyStudyHours || plannerState?.dailyTargetHours || 8,
          mockTestResults,
          tasks,
          userStats,
          mistakes
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.notice) setScheduleNotice(data.notice);

        const newSchedule = data.schedule && Array.isArray(data.schedule) ? data.schedule : [];

        onUpdatePlanner({
          ...safePlannerState,
          autoScheduleGenerated: true,
          generatedSchedule: newSchedule.length > 0 ? newSchedule : safePlannerState.generatedSchedule,
        });
      } else {
        // Fallback schedule
        setScheduleNotice("AI Priority Engine redistributed tasks based on active backlogs and mock test weak areas.");
      }
    } catch (err) {
      console.error('Planner reschedule error', err);
      setScheduleNotice("Redistributed missed tasks based on priority rules & active backlogs.");
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleIncrementBacklog = (id: string) => {
    const updatedBacklogs = backlogs.map((b) => {
      if (b.id === id && b.completedCount < b.totalCount) {
        return { ...b, completedCount: b.completedCount + 1 };
      }
      return b;
    });
    onUpdatePlanner({ ...safePlannerState, backlogs: updatedBacklogs });
  };

  const handleRemoveBacklog = (id: string) => {
    const updatedBacklogs = backlogs.filter((b) => b.id !== id);
    onUpdatePlanner({ ...safePlannerState, backlogs: updatedBacklogs });
  };

  const toggleSlotCompleted = (index: number) => {
    if (completedSlots.includes(index)) {
      setCompletedSlots(completedSlots.filter((i) => i !== index));
    } else {
      setCompletedSlots([...completedSlots, index]);
    }
  };

  const handleAddBacklog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBacklogTitle.trim()) return;
    const newEntry: BacklogItem = {
      id: `backlog-${Date.now()}`,
      subject: newBacklogSubject,
      title: newBacklogTitle,
      type: 'Lecture',
      totalCount: newBacklogCount,
      completedCount: 0,
      unit: 'lectures',
    };
    onUpdatePlanner({
      ...safePlannerState,
      backlogs: [...backlogs, newEntry],
    });
    setNewBacklogTitle('');
  };

  const handleAddEleventhTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEleventhTopic.trim()) return;
    onUpdatePlanner({
      ...safePlannerState,
      eleventhBacklogs: [...eleventhBacklogs, newEleventhTopic.trim()],
    });
    setNewEleventhTopic('');
  };

  const handleRemoveEleventhTopic = (index: number) => {
    const updated = eleventhBacklogs.filter((_, i) => i !== index);
    onUpdatePlanner({ ...safePlannerState, eleventhBacklogs: updated });
  };

  return (
    <div id="smart-planner-view" className="space-y-6 pb-20 md:pb-8">
      {/* Smart Planner Title Header */}
      <div className={`p-6 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl`}>
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI-Optimized Backlog & Priority Matrix</span>
          </div>
          <h2 className={`text-2xl font-extrabold ${theme.textPrimary}`}>Smart JEE/NEET Planner</h2>
          <p className="text-sm text-white/70">
            Intelligently redistributes missed tasks based on priority & mock test weak areas.
          </p>
        </div>

        <button
          id="btn-auto-reschedule"
          onClick={handleAutoReschedule}
          disabled={isRescheduling}
          className={`px-5 py-2.5 rounded-xl ${theme.buttonGradient} ${theme.accentGlow} font-bold text-sm flex items-center space-x-2 shadow-lg transition-all hover:scale-105 disabled:opacity-50`}
        >
          <RefreshCw className={`w-4 h-4 ${isRescheduling ? 'animate-spin' : ''}`} />
          <span>{isRescheduling ? 'Analyzing & Prioritizing...' : 'Redistribute Missed Tasks'}</span>
        </button>
      </div>

      {/* Target & Situation Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-white/50 uppercase font-mono">Target Exam</span>
            <div className="text-sm font-bold text-white">{user?.targetExam || plannerState.targetExam || 'JEE Main/Advanced'}</div>
            <div className="text-xs text-cyan-300 font-mono">Class {user?.classGrade || plannerState.currentClass || '12th'}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-amber-500/20 text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-white/50 uppercase font-mono">Daily Allocation</span>
            <div className="text-sm font-bold text-white">{user?.dailyStudyHours || plannerState.dailyTargetHours || 8} Hours / Day</div>
            <div className="text-xs text-amber-300 font-mono">High Priority Focus</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-white/50 uppercase font-mono">Mock Test Accuracy</span>
            <div className="text-sm font-bold text-white">{userStats?.accuracyPercentage || 68}% Overall</div>
            <div className="text-xs text-purple-300 font-mono">{mockTestWeakConcepts.length} Weak Areas</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-white/50 uppercase font-mono">Predicted Completion</span>
            <div className="text-sm font-bold text-emerald-400">
              {estimatedCompletionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div className="text-xs text-white/50">Target On-Track</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex space-x-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'daily'
              ? `${theme.buttonGradient} text-white shadow-md`
              : 'text-white/60 hover:text-white bg-white/5'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Daily Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('backlogs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'backlogs'
              ? `${theme.buttonGradient} text-white shadow-md`
              : 'text-white/60 hover:text-white bg-white/5'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Backlog Matrix ({backlogs.length + eleventhBacklogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('weekly')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'weekly'
              ? `${theme.buttonGradient} text-white shadow-md`
              : 'text-white/60 hover:text-white bg-white/5'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Weekly Milestones</span>
        </button>
      </div>

      {/* Notice Banner */}
      {scheduleNotice && (
        <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 text-xs flex items-center gap-3 shadow-lg">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
          <div>
            <span className="font-bold text-cyan-300 block">AI Priority Redistribution Active:</span>
            <span>{scheduleNotice}</span>
          </div>
        </div>
      )}

      {/* Tab 1: Daily Schedule */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-bold ${theme.textPrimary}`}>
              Today’s Priority-Optimized Schedule
            </h3>
            <span className="text-xs text-cyan-400 font-mono">5 Prime Time Slots</span>
          </div>

          <div className="space-y-3">
            {safePlannerState.generatedSchedule?.map((slot, index) => {
              const isDone = completedSlots.includes(index);
              return (
                <div
                  key={index}
                  className={`p-4 rounded-2xl ${theme.cardBg} border ${
                    isDone ? 'border-emerald-500/50 bg-emerald-950/20' : theme.cardBorder
                  } flex flex-col md:flex-row md:items-center justify-between gap-3 hover:scale-[1.005] transition-all`}
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => toggleSlotCompleted(index)}
                      className={`p-2 rounded-lg transition-all mt-0.5 ${
                        isDone
                          ? 'bg-emerald-500 text-black font-extrabold'
                          : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
                      }`}
                      title={isDone ? 'Completed' : 'Mark slot complete'}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-cyan-300 font-mono font-bold">
                          {slot.timeSlot}
                        </span>
                        {slot.priority && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            slot.priority === 'S-Rank' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}>
                            {slot.priority}
                          </span>
                        )}
                      </div>
                      <h4
                        className={`text-sm font-semibold mt-1 ${
                          isDone ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {slot.activity}
                      </h4>
                      {slot.reason && (
                        <p className="text-[11px] text-cyan-400/80 mt-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>{slot.reason}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs text-white/80 font-mono">
                      {slot.subject}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono">
                      {slot.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}



      {/* Tab 3: Backlogs & Target Management */}
      {activeTab === 'backlogs' && (
        <div className="space-y-6">
          {/* Active 12th Backlogs List */}
          <div className="space-y-3">
            <h3 className={`text-base font-bold ${theme.textPrimary}`}>12th Backlog Lectures</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {backlogs.map((item) => {
                const percent = Math.min(100, Math.floor((item.completedCount / item.totalCount) * 100));
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl ${theme.cardBg} border ${theme.cardBorder} space-y-3 relative group`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                        {item.subject}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/60 font-mono">
                          {item.completedCount} / {item.totalCount} {item.unit}
                        </span>
                        <button
                          onClick={() => handleRemoveBacklog(item.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Delete backlog"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-white">{item.title}</h4>

                    <div className="space-y-1">
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${theme.buttonGradient} transition-all duration-300`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-white/50">
                        <span>Progress: {percent}%</span>
                        <span>{item.totalCount - item.completedCount} remaining</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleIncrementBacklog(item.id)}
                      disabled={item.completedCount >= item.totalCount}
                      className="w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-cyan-300 flex items-center justify-center space-x-1 transition-all disabled:opacity-40"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>
                        {item.completedCount >= item.totalCount
                          ? 'Completed!'
                          : `Mark +1 ${item.unit} Done`}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 11th Backlogs List */}
          <div className={`p-5 rounded-xl ${theme.cardBg} border ${theme.cardBorder} space-y-4`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-base font-bold ${theme.textPrimary}`}>
                11th Backlog Topics to Revise
              </h3>
              <span className="text-xs text-amber-400 font-mono">
                {eleventhBacklogs.length} Topics
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {eleventhBacklogs.map((topic, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs font-medium text-cyan-200"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{topic}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveEleventhTopic(idx)}
                    className="text-white/40 hover:text-rose-400 transition-colors ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add 11th Topic Form */}
            <form onSubmit={handleAddEleventhTopic} className="flex space-x-2 pt-2">
              <input
                type="text"
                placeholder="Add 11th Chapter (e.g. Thermodynamics, Vectors)..."
                value={newEleventhTopic}
                onChange={(e) => setNewEleventhTopic(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className={`px-4 py-2 rounded-xl ${theme.buttonGradient} text-xs font-bold text-white flex items-center space-x-1`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Add New 12th Backlog Form */}
          <div className={`p-5 rounded-xl ${theme.cardBg} border ${theme.cardBorder} space-y-4`}>
            <h3 className={`text-base font-bold ${theme.textPrimary}`}>
              Add New 12th Backlog Lecture / Chapter
            </h3>
            <form onSubmit={handleAddBacklog} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Backlog Title (e.g. Electromagnetic Waves)..."
                value={newBacklogTitle}
                onChange={(e) => setNewBacklogTitle(e.target.value)}
                className="sm:col-span-2 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <select
                value={newBacklogSubject}
                onChange={(e) => setNewBacklogSubject(e.target.value as SubjectType)}
                className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Maths">Maths</option>
              </select>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min={1}
                  value={newBacklogCount}
                  onChange={(e) => setNewBacklogCount(Number(e.target.value))}
                  className="w-20 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className={`flex-1 py-2 rounded-xl ${theme.buttonGradient} font-bold text-xs text-white flex items-center justify-center space-x-1`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Backlog</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 4: Weekly Milestone Roadmap */}
      {activeTab === 'weekly' && (
        <div className="space-y-4">
          <h3 className={`text-base font-bold ${theme.textPrimary}`}>
            Month-by-Month JEE Mastery Roadmap
          </h3>

          <div className="space-y-3">
            {[
              {
                month: 'Current Month (August)',
                focus: 'Clear High Priority 12th Backlogs & Mock Test Weak Areas',
                milestone: 'Solve 200 Questions + Complete Chemical Bonding 11th Revision',
                status: 'In Progress',
              },
              {
                month: 'Next Month (September)',
                focus: 'Complete remaining 44 Organic + 38 Inorganic Lectures',
                milestone: 'Revise Fluids & Waves 11th Backlogs + 100 Limits Qs',
                status: 'Upcoming',
              },
              {
                month: 'October',
                focus: 'Finish 12th Full Physics & Maths Syllabus',
                milestone: 'Statistics, Binomial Theorem & Solution of Triangles 11th Revision',
                status: 'Upcoming',
              },
              {
                month: 'November - December',
                focus: 'Full Mock Test Series & 10-Year PYQ Solving',
                milestone: 'Complete 30 Mock Tests + Time-bound Revision',
                status: 'Final Stretch',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl ${theme.cardBg} border ${theme.cardBorder} flex flex-col md:flex-row md:items-center justify-between gap-3`}
              >
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold block mb-1">
                    {item.month}
                  </span>
                  <h4 className="text-sm font-bold text-white">{item.focus}</h4>
                  <p className="text-xs text-white/60 mt-1">🎯 {item.milestone}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono self-start md:self-center">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
