import React, { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  CheckSquare,
  Coins,
  Edit2,
  Plus,
  Sparkles,
  Tag,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import { AnimeTheme, PriorityType, SubjectType, TaskItem, UserStats } from '../types';
import { AudioSynthService } from '../services/audioSynth';

interface TodoManagerProps {
  theme: AnimeTheme;
  tasks: TaskItem[];
  userStats: UserStats;
  onUpdateTasks: (tasks: TaskItem[]) => void;
  onTaskCompletedRewards: (xp: number, coins: number) => void;
}

export const TodoManager: React.FC<TodoManagerProps> = ({
  theme,
  tasks,
  onUpdateTasks,
  onTaskCompletedRewards,
}) => {
  const [filterSubject, setFilterSubject] = useState<SubjectType | 'All'>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<SubjectType>('Maths');
  const [priority, setPriority] = useState<PriorityType>('S-Rank');
  const [deadline, setDeadline] = useState('Today');
  const [category, setCategory] = useState<TaskItem['category']>('Question Practice');
  const [isBacklog, setIsBacklog] = useState(false);
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);

  const filteredTasks = (tasks || []).filter((t) => {
    if (filterSubject !== 'All' && t.subject !== filterSubject) return false;
    if (filterCategory !== 'All' && t.category !== filterCategory) return false;
    return true;
  });

  const handleToggleTask = (id: string) => {
    AudioSynthService.playClickSound();
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const newlyCompleted = !t.completed;
        if (newlyCompleted) {
          AudioSynthService.playXpGainSound();
          onTaskCompletedRewards(t.xpReward, t.coinReward);
        }
        return { ...t, completed: newlyCompleted };
      }
      return t;
    });
    onUpdateTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    AudioSynthService.playClickSound();
    onUpdateTasks((tasks || []).filter((t) => t.id !== id));
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      const updated = tasks.map((t) =>
        t.id === editingTask.id
          ? {
              ...t,
              title,
              subject,
              priority,
              deadline,
              category,
              isBacklog,
              estimatedMinutes,
            }
          : t
      );
      onUpdateTasks(updated);
      setEditingTask(null);
    } else {
      const newTask: TaskItem = {
        id: `task-${Date.now()}`,
        title,
        subject,
        priority,
        deadline,
        completed: false,
        category,
        xpReward: priority === 'S-Rank' ? 150 : priority === 'A-Rank' ? 120 : 80,
        coinReward: priority === 'S-Rank' ? 40 : priority === 'A-Rank' ? 30 : 20,
        isBacklog,
        estimatedMinutes,
      };
      onUpdateTasks([newTask, ...tasks]);
    }

    resetForm();
    setShowAddModal(false);
  };

  const resetForm = () => {
    setTitle('');
    setSubject('Maths');
    setPriority('S-Rank');
    setDeadline('Today');
    setCategory('Question Practice');
    setIsBacklog(false);
    setEstimatedMinutes(60);
  };

  const openEditModal = (task: TaskItem) => {
    setEditingTask(task);
    setTitle(task.title);
    setSubject(task.subject);
    setPriority(task.priority);
    setDeadline(task.deadline || 'Today');
    setCategory(task.category);
    setIsBacklog(task.isBacklog || false);
    setEstimatedMinutes(task.estimatedMinutes || 60);
    setShowAddModal(true);
  };

  const getPriorityBadgeClass = (p: PriorityType) => {
    switch (p) {
      case 'S-Rank':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'A-Rank':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'B-Rank':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div id="todo-manager-view" className="space-y-6 pb-20 md:pb-8">
      {/* Title Header */}
      <div className={`p-6 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <CheckSquare className="w-4 h-4" />
            <span>S-Rank Quest Log</span>
          </div>
          <h2 className={`text-2xl font-extrabold ${theme.textPrimary}`}>JEE Task Manager</h2>
          <p className="text-xs text-white/70">
            Organize daily lectures, 11th revision targets, and limits problem sets.
          </p>
        </div>

        <button
          id="btn-add-task"
          onClick={() => {
            resetForm();
            setEditingTask(null);
            setShowAddModal(true);
          }}
          className={`px-5 py-2.5 rounded-xl ${theme.buttonGradient} ${theme.accentGlow} font-bold text-sm flex items-center space-x-2 shadow-lg transition-all hover:scale-105`}
        >
          <Plus className="w-4 h-4" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Progress Overview Bar */}
      <div className={`p-4 rounded-xl ${theme.cardBg} border ${theme.cardBorder} space-y-2`}>
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Quest Clearance Progress</span>
          </span>
          <span className="font-mono text-cyan-300">
            {completedCount} / {tasks.length} Done ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${theme.buttonGradient} transition-all duration-500`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-white/50 mr-1 font-mono">Subject:</span>
          {(['All', 'Physics', 'Chemistry', 'Maths', 'General'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterSubject(s)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border ${
                filterSubject === s
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                  : 'bg-black/40 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-white/50 mr-1 font-mono">Category:</span>
          {(['All', '12th Syllabus', '11th Revision', 'Backlog', 'Question Practice', 'Test Prep'] as const).map(
            (c) => (
              <button
                key={c}
                onClick={() => setFilterCategory(c)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border ${
                  filterCategory === c
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300 font-bold'
                    : 'bg-black/40 border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {c}
              </button>
            )
          )}
        </div>
      </div>

      {/* Task List Cards */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-white/50 border border-dashed border-white/10 rounded-2xl">
            No tasks found matching current filters. Click "Add New Task" above to create one.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-xl ${theme.cardBg} border ${
                task.completed ? 'border-emerald-500/20 opacity-60' : theme.cardBorder
              } flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all hover:scale-[1.005]`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => handleToggleTask(task.id)}
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                      : 'border-white/30 hover:border-cyan-400'
                  }`}
                >
                  {task.completed && <CheckCircle className="w-4 h-4 fill-current text-white" />}
                </button>

                <div>
                  <h4
                    className={`text-sm font-bold ${
                      task.completed ? 'line-through text-white/40' : 'text-white'
                    }`}
                  >
                    {task.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                    <span
                      className={`px-2 py-0.5 rounded border text-[10px] font-bold font-mono ${getPriorityBadgeClass(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-white/70 font-mono">
                      {task.subject}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-[10px] text-cyan-300 font-mono">
                      {task.category}
                    </span>
                    {task.isBacklog && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-[10px] text-amber-300 font-mono">
                        Backlog
                      </span>
                    )}
                    {task.deadline && (
                      <span className="text-white/50 text-[10px] font-mono flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-cyan-400" />
                        <span>{task.deadline}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Task Rewards & Actions */}
              <div className="flex items-center justify-between md:justify-end space-x-3 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                <div className="flex items-center space-x-2 text-xs font-mono">
                  <span className="text-cyan-300 font-bold">+{task.xpReward} XP</span>
                  <span className="text-amber-400 font-bold">+{task.coinReward} C</span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(task)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-400 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} space-y-4 shadow-2xl`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className={`text-base font-bold ${theme.textPrimary}`}>
                {editingTask ? 'Edit Task' : 'Create New Quest Task'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1">
                  Task Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Limits Question Practice Q100-Q150..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as SubjectType)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Maths">Maths</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PriorityType)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="S-Rank">S-Rank (High Priority)</option>
                    <option value="A-Rank">A-Rank (Medium)</option>
                    <option value="B-Rank">B-Rank (Normal)</option>
                    <option value="C-Rank">C-Rank (Low)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskItem['category'])}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="12th Syllabus">12th Syllabus</option>
                    <option value="11th Revision">11th Revision</option>
                    <option value="Backlog">Backlog</option>
                    <option value="Question Practice">Question Practice</option>
                    <option value="Test Prep">Test Prep</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">Deadline</label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="Today / Tomorrow / Sunday..."
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isBacklog"
                  checked={isBacklog}
                  onChange={(e) => setIsBacklog(e.target.checked)}
                  className="rounded border-white/20 bg-black/50 text-cyan-400 focus:ring-cyan-400"
                />
                <label htmlFor="isBacklog" className="text-xs text-white/80">
                  Mark as Backlog Item
                </label>
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl ${theme.buttonGradient} font-bold text-xs text-white flex items-center justify-center space-x-2`}
              >
                <Plus className="w-4 h-4" />
                <span>{editingTask ? 'Save Changes' : 'Create Task'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
