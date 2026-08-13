import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Settings,
  Maximize2,
  Minimize2,
  ArrowLeft,
  CheckSquare,
  Clock,
  Music,
  FileText,
  Calendar,
  Target,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  LightingMode,
  PlannerState,
  RoomWorkspaceState,
  SpotifyPlaylist,
  StudySessionLog,
  SubjectType,
  TaskItem,
  UserStats,
  VirtualSpaceEnvironment,
  WidgetConfig,
  WidgetType,
} from '../../types';
import { StorageService } from '../../services/storage';
import { AmbientMixerService } from '../../services/ambientMixer';
import { RoomBackground } from './RoomBackground';
import { WeatherOverlay } from './WeatherOverlay';
import { DraggableWidget } from './DraggableWidget';
import { AmbientMixerPanel } from './AmbientMixerPanel';
import { CustomizeSpaceModal } from './CustomizeSpaceModal';

interface ImmersiveSpaceViewProps {
  environment: VirtualSpaceEnvironment;
  onExitSpace: () => void;
  userStats: UserStats;
  tasks: TaskItem[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (title: string, subject: SubjectType) => void;
  spotifyPlaylists: SpotifyPlaylist[];
  onSessionComplete: (log: StudySessionLog) => void;
  plannerState: PlannerState;
}

export const ImmersiveSpaceView: React.FC<ImmersiveSpaceViewProps> = ({
  environment,
  onExitSpace,
  userStats,
  tasks,
  onToggleTask,
  onAddTask,
  spotifyPlaylists,
  onSessionComplete,
  plannerState,
}) => {
  // Load room-specific workspace state
  const [workspaceState, setWorkspaceState] = useState<RoomWorkspaceState>(() =>
    StorageService.getRoomWorkspace(environment.id, environment.defaultSounds)
  );

  const [isMixerOpen, setIsMixerOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [customBgUrl, setCustomBgUrl] = useState(environment.customBgUrl || '');

  // Record this space as recently used
  useEffect(() => {
    StorageService.addRecentSpaceId(environment.id);
  }, [environment.id]);

  // Sync ambient sound mixer
  useEffect(() => {
    if (!workspaceState.isAmbientMuted) {
      AmbientMixerService.applySoundMap(workspaceState.ambientSoundVolumes);
    } else {
      AmbientMixerService.stopAll();
    }

    return () => {
      AmbientMixerService.stopAll();
    };
  }, [workspaceState.ambientSoundVolumes, workspaceState.isAmbientMuted]);

  // Save workspace state on change
  useEffect(() => {
    StorageService.saveRoomWorkspace(environment.id, workspaceState);
  }, [workspaceState, environment.id]);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Widget management helpers
  const handleUpdateWidgetPos = (id: string, x: number, y: number) => {
    setWorkspaceState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => (w.id === id ? { ...w, x, y } : w)),
    }));
  };

  const handleToggleWidgetMin = (id: string) => {
    setWorkspaceState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => (w.id === id ? { ...w, isMinimized: !w.isMinimized } : w)),
    }));
  };

  const handleToggleWidgetVis = (id: WidgetType) => {
    setWorkspaceState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w)),
    }));
  };

  const handleSoundVolumeChange = (soundId: string, volume: number) => {
    setWorkspaceState((prev) => ({
      ...prev,
      ambientSoundVolumes: {
        ...prev.ambientSoundVolumes,
        [soundId]: volume,
      },
    }));
  };

  const handleResetSoundMix = () => {
    const defaultMap: Record<string, number> = {};
    environment.defaultSounds.forEach((s) => {
      defaultMap[s.soundId] = s.volume;
    });
    setWorkspaceState((prev) => ({
      ...prev,
      ambientSoundVolumes: defaultMap,
    }));
  };

  const handleResetLayout = () => {
    setWorkspaceState((prev) => ({
      ...prev,
      widgets: StorageService.getDefaultWidgets(),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen overflow-hidden bg-black text-slate-100 font-sans select-none">
      {/* 1. ROOM ATMOSPHERIC BACKGROUND */}
      <RoomBackground
        environment={environment}
        lightingMode={workspaceState.lightingMode}
        activeSubject={workspaceState.activeSubject}
        customBgUrl={customBgUrl}
        bgOpacity={workspaceState.bgOpacity}
      />

      {/* 2. ATMOSPHERIC WEATHER OVERLAY */}
      <WeatherOverlay
        effect={workspaceState.weatherEffect !== 'none' ? workspaceState.weatherEffect : environment.defaultWeather}
        intensity={workspaceState.weatherIntensity}
      />

      {/* 3. TOP BAR: MINIMAL SUBJECT & ROOM TITLE HEADER */}
      {!isFocusMode && (
        <div className="fixed top-3 inset-x-3 sm:inset-x-6 z-40 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={onExitSpace}
              className="px-3 py-1.5 rounded-xl bg-[#0a0b14]/80 border border-purple-500/30 text-purple-200 hover:bg-purple-900/60 font-mono text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md shadow-lg"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit Space</span>
            </button>

            <div className="px-3 py-1.5 rounded-xl bg-[#0a0b14]/80 border border-white/10 text-slate-200 font-mono text-xs flex items-center gap-2 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold">{environment.name}</span>
            </div>
          </div>

          <div className="pointer-events-auto px-4 py-1.5 rounded-xl bg-[#0a0b14]/80 border border-purple-500/30 text-purple-300 font-mono text-xs font-semibold backdrop-blur-md shadow-lg flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>
              Studying <strong className="text-white">{workspaceState.activeSubject}</strong> — {workspaceState.activeTopic || 'General'}
            </span>
          </div>
        </div>
      )}

      {/* 4. WORKSPACE DRAGGABLE WIDGETS */}
      {workspaceState.widgets.map((wConfig) => {
        if (isFocusMode && wConfig.id !== 'timer' && wConfig.id !== 'todo') return null;
        return (
          <DraggableWidget
            key={wConfig.id}
            config={wConfig}
            onUpdatePosition={handleUpdateWidgetPos}
            onToggleMinimize={handleToggleWidgetMin}
            onClose={(id) => handleToggleWidgetVis(id as WidgetType)}
            userStats={userStats}
            tasks={tasks}
            onToggleTask={onToggleTask}
            onAddTask={onAddTask}
            spotifyPlaylists={spotifyPlaylists}
            onSessionComplete={onSessionComplete}
            plannerState={plannerState}
            activeSubject={workspaceState.activeSubject}
            activeTopic={workspaceState.activeTopic}
          />
        );
      })}

      {/* 5. FLOATING BOTTOM CONTROL TOOLBAR */}
      <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center pointer-events-none">
        <div className="pointer-events-auto px-3 py-2 rounded-2xl bg-[#0a0b14]/90 border border-purple-500/30 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex items-center gap-1.5 text-xs font-mono">
          {/* Ambient Sound Mixer */}
          <button
            onClick={() => setIsMixerOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 text-purple-200 font-semibold flex items-center gap-1.5 transition-all"
            title="Open Ambient Sound Mixer"
          >
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Sounds</span>
          </button>

          {/* Spotify Music Toggle */}
          <button
            onClick={() => handleToggleWidgetVis('music')}
            className="px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 text-purple-200 font-semibold flex items-center gap-1.5 transition-all"
            title="Toggle Spotify Music Widget"
          >
            <Music className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Music</span>
          </button>

          {/* Focus Timer Widget Toggle */}
          <button
            onClick={() => handleToggleWidgetVis('timer')}
            className="px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 text-purple-200 font-semibold flex items-center gap-1.5 transition-all"
            title="Toggle Focus Timer"
          >
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Timer</span>
          </button>

          {/* Tasks Widget Toggle */}
          <button
            onClick={() => handleToggleWidgetVis('todo')}
            className="px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 text-purple-200 font-semibold flex items-center gap-1.5 transition-all"
            title="Toggle Tasks Widget"
          >
            <CheckSquare className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Tasks</span>
          </button>

          {/* Notes Widget Toggle */}
          <button
            onClick={() => handleToggleWidgetVis('notes')}
            className="px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 text-purple-200 font-semibold flex items-center gap-1.5 transition-all"
            title="Toggle Notes Widget"
          >
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Notes</span>
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Customize Space */}
          <button
            onClick={() => setIsCustomizeOpen(true)}
            className="p-1.5 rounded-xl text-slate-300 hover:text-purple-300 hover:bg-white/10"
            title="Customize Space"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Focus Mode Toggle */}
          <button
            onClick={() => setIsFocusMode((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-xl border font-semibold flex items-center gap-1 transition-all ${
              isFocusMode
                ? 'bg-amber-950/80 border-amber-500/40 text-amber-200'
                : 'text-slate-300 hover:text-purple-300 hover:bg-white/10 border-transparent'
            }`}
            title="Toggle Focus Mode"
          >
            {isFocusMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFocusMode ? 'Focused' : 'Focus Mode'}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl text-slate-300 hover:text-purple-300 hover:bg-white/10"
            title="Fullscreen Mode"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 6. MODALS */}
      {isMixerOpen && (
        <AmbientMixerPanel
          volumes={workspaceState.ambientSoundVolumes}
          onVolumeChange={handleSoundVolumeChange}
          onReset={handleResetSoundMix}
          onClose={() => setIsMixerOpen(false)}
          isMuted={workspaceState.isAmbientMuted}
          onToggleMute={() =>
            setWorkspaceState((prev) => ({ ...prev, isAmbientMuted: !prev.isAmbientMuted }))
          }
        />
      )}

      {isCustomizeOpen && (
        <CustomizeSpaceModal
          workspaceState={workspaceState}
          onUpdateWorkspace={setWorkspaceState}
          onResetLayout={handleResetLayout}
          onClose={() => setIsCustomizeOpen(false)}
          customBgUrl={customBgUrl}
          onSetCustomBgUrl={setCustomBgUrl}
        />
      )}
    </div>
  );
};
