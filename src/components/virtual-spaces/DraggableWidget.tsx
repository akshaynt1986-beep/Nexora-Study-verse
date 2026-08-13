import React, { useState, useRef } from 'react';
import {
  Minimize2,
  Maximize2,
  X,
  Clock as ClockIcon,
  CheckSquare,
  FileText,
  Calendar as CalendarIcon,
  Activity,
  Music,
  Target,
  Play,
  Pause,
  Plus,
  Sparkles,
} from 'lucide-react';
import {
  PlannerState,
  SpotifyPlaylist,
  StudySessionLog,
  SubjectType,
  TaskItem,
  UserStats,
  WidgetConfig,
} from '../../types';

interface DraggableWidgetProps {
  config: WidgetConfig;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onToggleMinimize: (id: string) => void;
  onClose: (id: string) => void;
  // Shared state props
  userStats: UserStats;
  tasks: TaskItem[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (title: string, subject: SubjectType) => void;
  spotifyPlaylists: SpotifyPlaylist[];
  onSessionComplete: (log: StudySessionLog) => void;
  plannerState: PlannerState;
  activeSubject: SubjectType;
  activeTopic: string;
}

export const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  config,
  onUpdatePosition,
  onToggleMinimize,
  onClose,
  userStats,
  tasks,
  onToggleTask,
  onAddTask,
  spotifyPlaylists,
  onSessionComplete,
  plannerState,
  activeSubject,
  activeTopic,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number }>({
    startX: 0,
    startY: 0,
    initX: config.x,
    initY: config.y,
  });

  // Timer local state for timer widget
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Notes local state for note widget
  const [quickNote, setQuickNote] = useState('• Physics: Finish Electrostatics PYQs\n• Chemistry: Review Ionic Equilibrium formulas\n• Math: Solve 15 Integration questions');

  // New task title state
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Handle Drag Start
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('textarea') || (e.target as HTMLElement).closest('iframe')) {
      return;
    }
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: config.x,
      initY: config.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = ((e.clientX - dragStartRef.current.startX) / window.innerWidth) * 100;
    const dy = ((e.clientY - dragStartRef.current.startY) / window.innerHeight) * 100;

    let newX = Math.max(1, Math.min(80, dragStartRef.current.initX + dx));
    let newY = Math.max(1, Math.min(80, dragStartRef.current.initY + dy));

    onUpdatePosition(config.id, Math.round(newX), Math.round(newY));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Timer control
  const toggleTimer = () => {
    if (isTimerRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsTimerRunning(false);
    } else {
      setIsTimerRunning(true);
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            // Log session completion
            onSessionComplete({
              id: `log-vs-${Date.now()}`,
              durationMinutes: 25,
              subject: activeSubject,
              topic: activeTopic || 'Virtual Space Deep Focus',
              mode: 'pomodoro',
              xpEarned: 150,
              coinsEarned: 25,
              timestamp: new Date().toISOString(),
            });
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  if (!config.visible) return null;

  const activeSpotify = spotifyPlaylists.find((p) => p.favorite) || spotifyPlaylists[0];

  return (
    <div
      style={{
        left: `${config.x}%`,
        top: `${config.y}%`,
      }}
      className={`fixed z-30 transition-shadow duration-200 select-none ${
        isDragging ? 'shadow-[0_20px_50px_rgba(168,85,247,0.3)] scale-[1.01]' : 'shadow-[0_8px_30px_rgba(0,0,0,0.6)]'
      }`}
    >
      <div className="rounded-2xl bg-[#0a0b14]/90 border border-purple-500/30 backdrop-blur-xl overflow-hidden w-[310px] sm:w-[340px]">
        {/* WIDGET TITLE BAR (DRAGGABLE HANDLE) */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="px-3.5 py-2 bg-[#101221] border-b border-white/10 flex items-center justify-between cursor-grab active:cursor-grabbing text-xs font-mono"
        >
          <div className="flex items-center gap-2 text-purple-300 font-semibold truncate">
            {config.id === 'timer' && <ClockIcon className="w-3.5 h-3.5 text-purple-400" />}
            {config.id === 'todo' && <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />}
            {config.id === 'notes' && <FileText className="w-3.5 h-3.5 text-amber-400" />}
            {config.id === 'calendar' && <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />}
            {config.id === 'progress' && <Activity className="w-3.5 h-3.5 text-indigo-400" />}
            {config.id === 'clock' && <ClockIcon className="w-3.5 h-3.5 text-pink-400" />}
            {config.id === 'music' && <Music className="w-3.5 h-3.5 text-purple-400" />}
            {config.id === 'goal' && <Target className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{config.title}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onToggleMinimize(config.id)}
              className="p-1 rounded text-slate-400 hover:text-purple-300 hover:bg-white/10"
            >
              {config.isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            </button>
            <button
              onClick={() => onClose(config.id)}
              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-white/10"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* WIDGET BODY CONTENT */}
        {!config.isMinimized && (
          <div className="p-3.5 text-xs">
            {/* 1. FOCUS TIMER WIDGET */}
            {config.id === 'timer' && (
              <div className="text-center space-y-3">
                <div className="text-3xl font-mono font-bold text-slate-100 tracking-wider py-2 bg-[#06070d] rounded-xl border border-purple-500/20 shadow-inner">
                  {Math.floor(timerSeconds / 60)
                    .toString()
                    .padStart(2, '0')}
                  :
                  {(timerSeconds % 60).toString().padStart(2, '0')}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={toggleTimer}
                    className={`px-4 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow transition-all ${
                      isTimerRunning
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-purple-600 hover:bg-purple-500 text-white'
                    }`}
                  >
                    {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isTimerRunning ? 'Pause' : 'Start Focus'}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (timerRef.current) clearInterval(timerRef.current);
                      setIsTimerRunning(false);
                      setTimerSeconds(25 * 60);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
                  >
                    Reset
                  </button>
                </div>
                <p className="text-[10px] text-purple-300/70 font-mono">
                  Subject: <span className="text-slate-200 font-semibold">{activeSubject}</span> ({activeTopic || 'General'})
                </p>
              </div>
            )}

            {/* 2. TO-DO TASKS WIDGET */}
            {config.id === 'todo' && (
              <div className="space-y-2.5">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newTaskTitle.trim()) return;
                    onAddTask(newTaskTitle.trim(), activeSubject);
                    setNewTaskTitle('');
                  }}
                  className="flex gap-1.5"
                >
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add task..."
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#06070d] border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="max-h-48 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                  {tasks.slice(0, 6).map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onToggleTask(t.id)}
                      className="p-2 rounded-lg bg-[#0d0e1a] border border-white/5 hover:border-purple-500/30 flex items-center justify-between cursor-pointer"
                    >
                      <span
                        className={`truncate font-medium ${
                          t.completed ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {t.title}
                      </span>
                      <span className="text-[10px] font-mono text-purple-400 font-bold shrink-0 ml-1">
                        +{t.xpReward} XP
                      </span>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <p className="text-[11px] text-slate-500 text-center py-2">No tasks added yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* 3. QUICK NOTES WIDGET */}
            {config.id === 'notes' && (
              <div>
                <textarea
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  rows={5}
                  className="w-full p-2.5 rounded-xl bg-[#06070d] border border-white/10 text-slate-200 font-mono text-xs focus:outline-none focus:border-purple-500 resize-none"
                  placeholder="Scratchpad for formulas, targets & notes..."
                />
              </div>
            )}

            {/* 4. DESK CLOCK WIDGET */}
            {config.id === 'clock' && (
              <div className="text-center py-1">
                <div className="text-2xl font-bold font-mono text-purple-200 tracking-wider">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
              </div>
            )}

            {/* 5. SPOTIFY MUSIC WIDGET */}
            {config.id === 'music' && (
              <div>
                {activeSpotify ? (
                  <iframe
                    title={`Spotify Virtual Space Player - ${activeSpotify.customName}`}
                    src={`https://open.spotify.com/embed/playlist/${activeSpotify.spotifyPlaylistId}?utm_source=generator&theme=0`}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-xl border border-purple-500/20"
                  />
                ) : (
                  <p className="text-slate-400 text-center py-4">No Spotify playlist selected.</p>
                )}
              </div>
            )}

            {/* 6. TODAY'S PROGRESS WIDGET */}
            {config.id === 'progress' && (
              <div className="space-y-2 font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Focus Hours Today:</span>
                  <span className="font-bold text-purple-300">{userStats.dailyStudyHoursToday.toFixed(1)} hrs</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Streak:</span>
                  <span className="font-bold text-amber-300">🔥 {userStats.currentStreak} Days</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Level Rank:</span>
                  <span className="font-bold text-emerald-300">{userStats.rankTitle}</span>
                </div>
              </div>
            )}

            {/* 7. STUDY GOAL WIDGET */}
            {config.id === 'goal' && (
              <div className="space-y-2 font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Daily Goal Target:</span>
                  <span className="font-bold text-purple-300">{plannerState.dailyTargetHours} Hours</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        (userStats.dailyStudyHoursToday / (plannerState.dailyTargetHours || 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
