import React, { useState } from 'react';
import {
  Compass,
  Star,
  Plus,
  Search,
  Sparkles,
  Volume2,
  ArrowRight,
  Flame,
  Clock,
  Heart,
  Layout,
} from 'lucide-react';
import {
  NexoraTheme,
  PlannerState,
  SpaceCategory,
  SpotifyPlaylist,
  StudySessionLog,
  SubjectType,
  TaskItem,
  UserStats,
  VirtualSpaceEnvironment,
} from '../../types';
import { StorageService } from '../../services/storage';
import { ImmersiveSpaceView } from './ImmersiveSpaceView';
import { CreateSpaceModal } from './CreateSpaceModal';

interface VirtualSpacesDashboardProps {
  theme: NexoraTheme;
  userStats: UserStats;
  tasks: TaskItem[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (title: string, subject: SubjectType) => void;
  spotifyPlaylists: SpotifyPlaylist[];
  onSessionComplete: (log: StudySessionLog) => void;
  plannerState: PlannerState;
}

const CATEGORIES: SpaceCategory[] = [
  'All',
  'Cozy',
  'Nature',
  'City',
  'Night',
  'Rain',
  'Quiet',
  'Café',
  'Library',
  'Custom',
];

export const VirtualSpacesDashboard: React.FC<VirtualSpacesDashboardProps> = ({
  theme,
  userStats,
  tasks,
  onToggleTask,
  onAddTask,
  spotifyPlaylists,
  onSessionComplete,
  plannerState,
}) => {
  const [spaces, setSpaces] = useState<VirtualSpaceEnvironment[]>(() =>
    StorageService.getVirtualSpaces()
  );
  const [activeCategory, setActiveCategory] = useState<SpaceCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpace, setActiveSpace] = useState<VirtualSpaceEnvironment | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const recentSpaceIds = StorageService.getRecentSpaceIds();

  // Save changes to spaces
  const updateSpaces = (newSpaces: VirtualSpaceEnvironment[]) => {
    setSpaces(newSpaces);
    StorageService.saveVirtualSpaces(newSpaces);
  };

  const handleToggleFavorite = (spaceId: string) => {
    const updated = spaces.map((s) => (s.id === spaceId ? { ...s, favorite: !s.favorite } : s));
    updateSpaces(updated);
  };

  const handleCreateSpace = (newSpace: VirtualSpaceEnvironment) => {
    const updated = [newSpace, ...spaces];
    updateSpaces(updated);
    setIsCreateModalOpen(false);
    setActiveSpace(newSpace);
  };

  // Filtered list
  const filteredSpaces = spaces.filter((s) => {
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const favoriteSpaces = spaces.filter((s) => s.favorite);
  const recentSpaces = recentSpaceIds
    .map((id) => spaces.find((s) => s.id === id))
    .filter(Boolean) as VirtualSpaceEnvironment[];

  if (activeSpace) {
    return (
      <ImmersiveSpaceView
        environment={activeSpace}
        onExitSpace={() => setActiveSpace(null)}
        userStats={userStats}
        tasks={tasks}
        onToggleTask={onToggleTask}
        onAddTask={onAddTask}
        spotifyPlaylists={spotifyPlaylists}
        onSessionComplete={onSessionComplete}
        plannerState={plannerState}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* HEADER HERO */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#0d0e1b] via-[#15172e] to-[#0d0e1b] border border-purple-500/20 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold">
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              <span>NEXORA Digital Room Operating System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Choose Your Study Space
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Step inside immersive 3D digital study environments. Mix ambient rain, coffee shop hums & fireplace crackles with your personal Spotify study soundtracks.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs font-mono shadow-[0_0_25px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2 shrink-0 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create My Space</span>
          </button>
        </div>
      </div>

      {/* SEARCH BAR & CATEGORY FILTERS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search study rooms (e.g., rain, library, café, cabin)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0b0c15] border border-white/10 text-slate-200 text-xs font-mono focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* CATEGORIES PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 text-xs font-mono">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold border transition-all shrink-0 ${
                activeCategory === cat
                  ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'bg-[#0d0e19] border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* RECENTLY USED SPACES (IF ANY & NO SEARCH) */}
      {!searchQuery && activeCategory === 'All' && recentSpaces.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-200 font-mono flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>Recently Used Spaces</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentSpaces.map((sp) => (
              <RoomCard
                key={`recent-${sp.id}`}
                space={sp}
                onEnter={() => setActiveSpace(sp)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

      {/* FAVORITE / MY SPACES (IF ANY & NO SEARCH) */}
      {!searchQuery && activeCategory === 'All' && favoriteSpaces.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-200 font-mono flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>My Favorite Spaces</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteSpaces.map((sp) => (
              <RoomCard
                key={`fav-${sp.id}`}
                space={sp}
                onEnter={() => setActiveSpace(sp)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

      {/* MAIN SPACES GRID */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-200 font-mono flex items-center gap-2">
          <Layout className="w-4 h-4 text-indigo-400" />
          <span>All Study Environments ({filteredSpaces.length})</span>
        </h2>

        {filteredSpaces.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0b0c15] border border-white/5 text-center space-y-2">
            <p className="text-slate-400 text-sm">No virtual study rooms match your search.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="text-xs font-mono text-purple-400 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSpaces.map((sp) => (
              <RoomCard
                key={sp.id}
                space={sp}
                onEnter={() => setActiveSpace(sp)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      {/* CREATE CUSTOM SPACE MODAL */}
      {isCreateModalOpen && (
        <CreateSpaceModal
          onCreateSpace={handleCreateSpace}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
};

// ROOM CARD SUBCOMPONENT
interface RoomCardProps {
  space: VirtualSpaceEnvironment;
  onEnter: () => void;
  onToggleFavorite: (id: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ space, onEnter, onToggleFavorite }) => {
  return (
    <div className="group rounded-2xl bg-[#0d0e19] border border-purple-500/20 hover:border-purple-500/50 shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
      {/* PREVIEW BOX */}
      <div className={`relative h-44 bg-gradient-to-br ${space.previewGradient} p-4 flex flex-col justify-between overflow-hidden`}>
        {space.customBgUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-105 transition-transform duration-500"
            style={{ backgroundImage: `url('${space.customBgUrl}')` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e19] via-transparent to-black/40" />

        {/* TOP BAR */}
        <div className="relative z-10 flex items-center justify-between text-xs">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-purple-200 font-mono font-semibold border border-white/10">
            {space.category}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(space.id);
            }}
            className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-slate-300 hover:text-amber-400 transition-colors"
            title="Favorite Space"
          >
            <Star
              className={`w-4 h-4 ${
                space.favorite ? 'text-amber-400 fill-amber-400' : 'text-slate-400'
              }`}
            />
          </button>
        </div>

        {/* BOTTOM TITLE IN PREVIEW */}
        <div className="relative z-10 space-y-0.5">
          <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
            {space.name}
          </h3>
          <p className="text-[11px] text-slate-300 line-clamp-1 opacity-90">{space.description}</p>
        </div>
      </div>

      {/* CARD BODY */}
      <div className="p-4 space-y-3 bg-[#0d0e19]">
        {/* AMBIENT SOUND BADGES */}
        <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-mono">
          <span className="text-slate-400 flex items-center gap-1 shrink-0">
            <Volume2 className="w-3 h-3 text-purple-400" />
            <span>Sounds:</span>
          </span>
          {space.defaultSounds.map((snd) => (
            <span
              key={snd.soundId}
              className="px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/20 text-purple-300 capitalize"
            >
              {snd.soundId}
            </span>
          ))}
        </div>

        {/* ENTER SPACE BUTTON */}
        <button
          onClick={onEnter}
          className="w-full py-2.5 px-4 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/30 hover:border-purple-400 font-mono text-xs font-semibold flex items-center justify-center gap-2 shadow transition-all"
        >
          <span>Enter Space</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
