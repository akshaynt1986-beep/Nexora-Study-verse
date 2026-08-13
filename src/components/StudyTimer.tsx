import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle,
  Coins,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Timer,
  Volume2,
  VolumeX,
  Clock,
  Music,
  Headphones,
  ExternalLink
} from 'lucide-react';
import { AnimeTheme, SpotifyPlaylist, StudySessionLog, SubjectType, TabId, UserStats } from '../types';
import { AudioSynthService } from '../services/audioSynth';

interface StudyTimerProps {
  theme: AnimeTheme;
  userStats: UserStats;
  onSessionComplete: (log: StudySessionLog) => void;
  spotifyPlaylists?: SpotifyPlaylist[];
  onNavigateTab?: (tab: TabId) => void;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({
  theme,
  userStats,
  onSessionComplete,
  spotifyPlaylists = [],
  onNavigateTab,
}) => {
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'stopwatch' | 'countdown'>('pomodoro');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('Physics');
  const [sessionTopic, setSessionTopic] = useState('Current Electricity & Circuit Practice');
  const [pomodoroWorkMinutes, setPomodoroWorkMinutes] = useState(25);

  // Spotify Study Music Prompt & Player
  const [playMusicChoice, setPlayMusicChoice] = useState<'prompt' | 'yes' | 'no'>('prompt');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [ambientAudioPreset, setAmbientAudioPreset] = useState<'rain' | 'binaural' | 'cyber' | 'deepfocus' | 'none'>('none');
  const [ambientVolume, setAmbientVolume] = useState(0.5);

  const synthRef = useRef<{ stop: () => void; setVolume: (v: number) => void } | null>(null);

  // Sync initial countdown time when mode or pomodoro minutes change
  useEffect(() => {
    if (!isRunning) {
      if (timerMode === 'pomodoro') {
        setTimeLeftSeconds(pomodoroWorkMinutes * 60);
      } else if (timerMode === 'countdown') {
        setTimeLeftSeconds(60 * 60); // Default 60 mins
      } else {
        setTimeLeftSeconds(0); // Stopwatch starts at 0
      }
    }
  }, [timerMode, pomodoroWorkMinutes]);

  // Main Timer Interval Loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (timerMode === 'stopwatch') {
            return prev + 1;
          } else {
            if (prev <= 1) {
              handleTimerComplete();
              return 0;
            }
            return prev - 1;
          }
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timerMode]);

  // Handle ambient synth sound playing
  useEffect(() => {
    if (ambientAudioPreset === 'none') {
      if (synthRef.current) {
        synthRef.current.stop();
        synthRef.current = null;
      }
    } else {
      synthRef.current = AudioSynthService.startSynthPreset(ambientAudioPreset, ambientVolume);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
        synthRef.current = null;
      }
    };
  }, [ambientAudioPreset]);

  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.setVolume(ambientVolume);
    }
  }, [ambientVolume]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    AudioSynthService.playXpGainSound();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    const minutesSpent = timerMode === 'stopwatch' ? Math.max(1, Math.floor(timeLeftSeconds / 60)) : pomodoroWorkMinutes;
    const xpReward = minutesSpent * 5;
    const coinReward = Math.floor(minutesSpent * 1.5);

    const log: StudySessionLog = {
      id: `session-${Date.now()}`,
      timestamp: new Date().toISOString(),
      durationMinutes: minutesSpent,
      mode: timerMode,
      subject: selectedSubject,
      topic: sessionTopic || 'General Focus',
      xpEarned: xpReward,
      coinsEarned: coinReward,
    };

    onSessionComplete(log);
  };

  const toggleTimer = () => {
    AudioSynthService.playClickSound();
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    AudioSynthService.playClickSound();
    setIsRunning(false);
    if (timerMode === 'pomodoro') setTimeLeftSeconds(pomodoroWorkMinutes * 60);
    else if (timerMode === 'countdown') setTimeLeftSeconds(60 * 60);
    else setTimeLeftSeconds(0);
  };

  // Calculate circular progress percentage
  const totalTargetSeconds = timerMode === 'pomodoro' ? pomodoroWorkMinutes * 60 : timerMode === 'countdown' ? 3600 : 3600;
  const progressPercent =
    timerMode === 'stopwatch'
      ? Math.min(100, (timeLeftSeconds / 3600) * 100)
      : Math.max(0, ((totalTargetSeconds - timeLeftSeconds) / totalTargetSeconds) * 100);

  const hoursNum = Math.floor(timeLeftSeconds / 3600);
  const minsNum = Math.floor((timeLeftSeconds % 3600) / 60);
  const secsNum = timeLeftSeconds % 60;

  const displayHours = hoursNum > 0 ? String(hoursNum).padStart(2, '0') + ':' : '';
  const displayMinutes = String(minsNum).padStart(2, '0');
  const displaySeconds = String(secsNum).padStart(2, '0');

  return (
    <div id="study-timer-view" className={`space-y-6 max-w-7xl mx-auto pb-12 ${isFocusMode ? 'fixed inset-0 z-50 bg-[#090a0f] p-8 overflow-y-auto flex flex-col justify-between' : ''}`}>
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#121422]/90 border border-purple-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-purple-300 mb-1">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>Cozy Study Desk Timer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-100">
            {timerMode === 'pomodoro' ? 'Pomodoro Focus Session' : timerMode === 'stopwatch' ? 'Stopwatch Study Log' : 'Target Countdown'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Earn XP and maintain your daily study streak while solving problems.
          </p>
        </div>

        {/* Mode Selector & Fullscreen Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-[#0b0c13] p-1 rounded-xl border border-white/5">
            {(['pomodoro', 'stopwatch', 'countdown'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setTimerMode(mode);
                  setIsRunning(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                  timerMode === mode ? 'bg-purple-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsFocusMode((prev) => !prev)}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-300 transition-all"
            title={isFocusMode ? 'Exit Fullscreen Focus' : 'Fullscreen Focus Mode'}
          >
            {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Clock Circle & Controls Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Session Parameters */}
        <div className="p-5 rounded-2xl bg-[#121422]/90 border border-purple-500/20 space-y-4">
          <h3 className="text-sm font-heading font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Focus Session Setup</span>
          </h3>

          {/* Subject Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 block">Subject</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Physics', 'Chemistry', 'Maths', 'General'] as SubjectType[]).map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={`p-2 rounded-xl text-xs font-semibold transition-all border ${
                    selectedSubject === subj
                      ? 'bg-purple-600/30 border-purple-400 text-purple-200 shadow'
                      : 'bg-[#0f111d] border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 block">Topic / Chapter</label>
            <input
              type="text"
              value={sessionTopic}
              onChange={(e) => setSessionTopic(e.target.value)}
              placeholder="e.g. Current Electricity / Chemical Bonding..."
              className="w-full px-3 py-2 rounded-xl bg-[#0f111d] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Pomodoro Duration Selector */}
          {timerMode === 'pomodoro' && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">Duration Target</label>
              <div className="flex gap-2">
                {[15, 25, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setPomodoroWorkMinutes(mins)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                      pomodoroWorkMinutes === mins
                        ? 'bg-purple-600 border-purple-400 text-white font-semibold'
                        : 'bg-[#0f111d] border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ambient Lo-Fi Synthesizer */}
          <div className="space-y-2 pt-3 border-t border-white/5">
            <label className="text-xs font-medium text-purple-300 block flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Lo-Fi Focus Ambience</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'none', label: 'Mute' },
                { id: 'rain', label: 'Soft Rain' },
                { id: 'binaural', label: '10Hz Alpha' },
                { id: 'cyber', label: 'Quiet Desk' },
                { id: 'deepfocus', label: 'Deep Waves' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setAmbientAudioPreset(p.id as unknown as 'rain')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono transition-all border ${
                    ambientAudioPreset === p.id
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300 font-semibold'
                      : 'bg-[#0f111d] border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {ambientAudioPreset !== 'none' && (
              <div className="flex items-center space-x-2 pt-1">
                <VolumeX className="w-3 h-3 text-slate-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={ambientVolume}
                  onChange={(e) => setAmbientVolume(Number(e.target.value))}
                  className="w-full accent-purple-400"
                />
                <Volume2 className="w-3 h-3 text-slate-400" />
              </div>
            )}
          </div>

          {/* Spotify Study Music Integration */}
          <div className="space-y-2 pt-3 border-t border-white/5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-purple-300 block flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5" />
                <span>Spotify Study Music</span>
              </label>
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('music')}
                  className="text-[10px] font-mono text-purple-400 hover:underline"
                >
                  Manage
                </button>
              )}
            </div>

            {playMusicChoice === 'prompt' ? (
              <div className="p-3 rounded-xl bg-[#0d0e17] border border-purple-500/20 text-center space-y-2">
                <p className="text-xs text-slate-300 font-semibold">Play Study Music?</p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPlayMusicChoice('yes')}
                    className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setPlayMusicChoice('no')}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                  >
                    Not now
                  </button>
                </div>
              </div>
            ) : playMusicChoice === 'yes' ? (
              <div className="space-y-2">
                {(() => {
                  const activeSp = spotifyPlaylists.find((p) => p.favorite) || spotifyPlaylists[0];
                  if (!activeSp) {
                    return (
                      <div className="p-3 rounded-xl bg-[#0d0e17] border border-white/5 text-xs text-slate-400 text-center space-y-1">
                        <p>No Spotify playlist added yet.</p>
                        {onNavigateTab && (
                          <button
                            onClick={() => onNavigateTab('music')}
                            className="text-purple-300 font-semibold hover:underline"
                          >
                            + Add Playlist in Music Space
                          </button>
                        )}
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200 truncate">{activeSp.customName}</span>
                        <button
                          onClick={() => setPlayMusicChoice('no')}
                          className="text-[10px] text-slate-400 hover:text-slate-200"
                        >
                          Hide
                        </button>
                      </div>
                      <iframe
                        title={`Focus Spotify Embed - ${activeSp.customName}`}
                        src={`https://open.spotify.com/embed/playlist/${activeSp.spotifyPlaylistId}?utm_source=generator&theme=0`}
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="rounded-xl border border-purple-500/20"
                      />
                    </div>
                  );
                })()}
              </div>
            ) : (
              <button
                onClick={() => setPlayMusicChoice('yes')}
                className="w-full py-1.5 px-3 rounded-xl bg-[#0f111d] border border-white/5 hover:border-purple-500/30 text-xs font-mono text-purple-300 flex items-center justify-center gap-2"
              >
                <Music className="w-3.5 h-3.5" />
                <span>Open Spotify Player</span>
              </button>
            )}
          </div>
        </div>

        {/* Center: Large Readability Circular Timer Display */}
        <div className="p-8 rounded-2xl bg-[#121422]/90 border border-purple-500/20 lg:col-span-2 flex flex-col items-center justify-center space-y-6 relative overflow-hidden backdrop-blur-xl">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            {/* Background Circle Track */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="42%"
                className="stroke-slate-800 fill-none"
                strokeWidth="10"
              />
              <circle
                cx="50%"
                cy="50%"
                r="42%"
                className="stroke-purple-400 fill-none transition-all duration-1000"
                strokeWidth="10"
                strokeDasharray="600"
                strokeDashoffset={600 - (600 * progressPercent) / 100}
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0px 0px 8px rgba(168, 85, 247, 0.4))' }}
              />
            </svg>

            {/* Central Readable Timer */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-mono uppercase text-purple-300 tracking-widest mb-1.5">
                FOCUS SESSION — {selectedSubject}
              </span>
              <div className="text-4xl sm:text-5xl font-mono font-bold text-slate-100 tracking-wider">
                {displayHours}{displayMinutes}:{displaySeconds}
              </div>
              <span className="text-xs text-slate-400 truncate max-w-[180px] mt-2 font-normal">
                {sessionTopic}
              </span>
            </div>
          </div>

          {/* Clock Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={resetTimer}
              className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-300 transition-all"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={toggleTimer}
              className="px-7 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-base flex items-center space-x-2.5 shadow-[0_4px_20px_rgba(168,85,247,0.35)] transition-all"
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Focus</span>
                </>
              )}
            </button>

            <button
              onClick={handleTimerComplete}
              className="p-3.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 transition-all"
              title="Finish & Log Progress"
            >
              <CheckCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-400 font-mono pt-1">
            <span className="flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 text-purple-300" />
              <span>+5 XP / min</span>
            </span>
            <span className="flex items-center space-x-1">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>+1.5 Coins / min</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
