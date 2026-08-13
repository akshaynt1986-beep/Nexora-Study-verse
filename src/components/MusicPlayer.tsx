import React, { useEffect, useRef, useState } from 'react';
import {
  Music,
  Plus,
  Star,
  Trash2,
  Edit2,
  ExternalLink,
  Volume2,
  VolumeX,
  Sparkles,
  Headphones,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  CloudRain,
  Radio,
  Flame,
  Volume1,
  Maximize2,
  Minimize2,
  Play
} from 'lucide-react';
import { AnimeTheme, AudioTrack, SpotifyPlaylist, TabId } from '../types';
import { AudioSynthService } from '../services/audioSynth';

export function extractSpotifyPlaylistId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Handle spotify:playlist:ID
  if (trimmed.startsWith('spotify:playlist:')) {
    const id = trimmed.split('spotify:playlist:')[1]?.split('?')[0]?.split(':')[0];
    return id && id.length >= 10 ? id : null;
  }

  // Handle https://open.spotify.com/playlist/ID or /embed/playlist/ID
  const match = trimmed.match(/(?:open\.spotify\.com\/(?:embed\/)?playlist\/)([a-zA-Z0-9]+)/);
  if (match && match[1]) {
    return match[1];
  }

  // Handle raw 15-35 char alphanumeric ID
  if (/^[a-zA-Z0-9]{15,35}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

interface MusicPlayerProps {
  theme: AnimeTheme;
  spotifyPlaylists: SpotifyPlaylist[];
  onUpdateSpotifyPlaylists: (playlists: SpotifyPlaylist[]) => void;
  tracks?: AudioTrack[];
  onUpdateTracks?: (tracks: AudioTrack[]) => void;
  onNavigateTab?: (tab: TabId) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  theme,
  spotifyPlaylists,
  onUpdateSpotifyPlaylists,
  tracks = [],
  onNavigateTab,
}) => {
  // Currently Active Playlist for the Main Player
  const [activePlaylistId, setActivePlaylistId] = useState<string>(() => {
    const fav = spotifyPlaylists.find((p) => p.favorite);
    return fav ? fav.id : spotifyPlaylists[0]?.id || '';
  });

  // Modal / Form state for adding playlist
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [customNameInput, setCustomNameInput] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);

  // Inline renaming state
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Player view mode (expanded 382px vs compact 152px)
  const [playerHeight, setPlayerHeight] = useState<'full' | 'compact'>('full');

  // Ambient Focus Audio Soundscapes state
  const [bgSoundscape, setBgSoundscape] = useState<
    'coffeeRain' | 'binaural' | 'cyber' | 'deepfocus' | 'ocean' | 'fireplace' | 'none'
  >('coffeeRain');
  const [isBgPlaying, setIsBgPlaying] = useState(false);
  const [bgVolume, setBgVolume] = useState(0.35);
  const bgSynthRef = useRef<{ stop: () => void; setVolume: (v: number) => void } | null>(null);

  // Sync active playlist if playlists array changes and active one is deleted
  useEffect(() => {
    if (spotifyPlaylists.length > 0) {
      const exists = spotifyPlaylists.some((p) => p.id === activePlaylistId);
      if (!exists) {
        const fav = spotifyPlaylists.find((p) => p.favorite);
        setActivePlaylistId(fav ? fav.id : spotifyPlaylists[0].id);
      }
    }
  }, [spotifyPlaylists, activePlaylistId]);

  // Ambient soundscape audio loop effect
  useEffect(() => {
    if (isBgPlaying && bgSoundscape !== 'none') {
      bgSynthRef.current = AudioSynthService.startSynthPreset(bgSoundscape, bgVolume);
    } else {
      if (bgSynthRef.current) {
        bgSynthRef.current.stop();
        bgSynthRef.current = null;
      }
    }

    return () => {
      if (bgSynthRef.current) {
        bgSynthRef.current.stop();
        bgSynthRef.current = null;
      }
    };
  }, [isBgPlaying, bgSoundscape]);

  useEffect(() => {
    if (bgSynthRef.current) {
      bgSynthRef.current.setVolume(bgVolume);
    }
  }, [bgVolume]);

  const activePlaylist =
    spotifyPlaylists.find((p) => p.id === activePlaylistId) ||
    spotifyPlaylists.find((p) => p.favorite) ||
    spotifyPlaylists[0];

  // Add Playlist Handler
  const handleAddPlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError(null);

    const extractedId = extractSpotifyPlaylistId(urlInput);
    if (!extractedId) {
      setUrlError('Please enter a valid Spotify playlist link (e.g. https://open.spotify.com/playlist/37i9dQZF1DX8Ueb12W1V9e)');
      return;
    }

    const cleanUrl = urlInput.trim().startsWith('http')
      ? urlInput.trim()
      : `https://open.spotify.com/playlist/${extractedId}`;

    const newPlaylist: SpotifyPlaylist = {
      id: 'sp_' + Date.now(),
      spotifyUrl: cleanUrl,
      spotifyPlaylistId: extractedId,
      customName: customNameInput.trim() || 'My Study Playlist',
      favorite: spotifyPlaylists.length === 0,
      createdAt: Date.now(),
      order: spotifyPlaylists.length + 1,
    };

    const updated = [newPlaylist, ...spotifyPlaylists];
    onUpdateSpotifyPlaylists(updated);
    setActivePlaylistId(newPlaylist.id);

    setUrlInput('');
    setCustomNameInput('');
    setIsAddModalOpen(false);
  };

  // Set Favorite Playlist
  const handleToggleFavorite = (id: string) => {
    const updated = spotifyPlaylists.map((p) => ({
      ...p,
      favorite: p.id === id,
    }));
    onUpdateSpotifyPlaylists(updated);
  };

  // Start Editing Label
  const startEditing = (p: SpotifyPlaylist) => {
    setEditingPlaylistId(p.id);
    setEditingName(p.customName);
  };

  // Save Renamed Label
  const saveEditing = (id: string) => {
    if (!editingName.trim()) return;
    const updated = spotifyPlaylists.map((p) =>
      p.id === id ? { ...p, customName: editingName.trim() } : p
    );
    onUpdateSpotifyPlaylists(updated);
    setEditingPlaylistId(null);
  };

  // Remove Playlist
  const handleRemovePlaylist = (id: string) => {
    const updated = spotifyPlaylists.filter((p) => p.id !== id);
    onUpdateSpotifyPlaylists(updated);
  };

  // Reorder Playlists
  const handleReorder = (id: string, direction: 'up' | 'down') => {
    const idx = spotifyPlaylists.findIndex((p) => p.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= spotifyPlaylists.length) return;

    const newList = [...spotifyPlaylists];
    const temp = newList[idx];
    newList[idx] = newList[targetIdx];
    newList[targetIdx] = temp;

    onUpdateSpotifyPlaylists(newList);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* HEADER DESK BANNER */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-[#121422]/90 border border-purple-500/20 shadow-[0_4px_25px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono mb-1">
              <Headphones className="w-3.5 h-3.5 text-purple-400" />
              <span>Personal Study Soundtracks • Spotify Integration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
              <span>🎵 Music Space</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-normal">
              Keep your favorite Spotify playlists and lo-fi soundscapes right inside NEXORA while studying.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(168,85,247,0.3)]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Spotify Playlist</span>
            </button>
          </div>
        </div>
      </div>

      {/* ADD PLAYLIST MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121422] border border-purple-500/30 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-300" />
                <h3 className="text-base font-heading font-bold text-slate-100">
                  Add Spotify Playlist
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setUrlError(null);
                }}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPlaylist} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 block">
                  Paste Spotify Playlist Link <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    setUrlError(null);
                  }}
                  placeholder="https://open.spotify.com/playlist/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0c13] border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
                  required
                />
                <p className="text-[11px] text-slate-400 font-mono">
                  Example: https://open.spotify.com/playlist/37i9dQZF1DX8Ueb12W1V9e
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 block">
                  Custom Study Label (e.g. "Physics Grind", "Lofi Study Room")
                </label>
                <input
                  type="text"
                  value={customNameInput}
                  onChange={(e) => setCustomNameInput(e.target.value)}
                  placeholder="e.g. Organic Chemistry Chill Beats"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0c13] border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              {urlError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs">
                  {urlError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-[0_2px_10px_rgba(168,85,247,0.3)]"
                >
                  Add Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MAIN FEATURED PLAYER & COZY SOUNDSCAPE GRID */}
      {activePlaylist ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2 COLS: EMBEDDED SPOTIFY PLAYER */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-2xl bg-[#121422]/90 border border-purple-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)] space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-950/70 border border-purple-500/30 flex items-center justify-center text-purple-300">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-purple-300 font-semibold uppercase tracking-wider">
                        {activePlaylist.favorite ? '⭐ Current Study Playlist' : 'Active Spotify Player'}
                      </span>
                    </div>
                    <h2 className="text-base font-heading font-bold text-slate-100">
                      {activePlaylist.customName}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleFavorite(activePlaylist.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition-all ${
                      activePlaylist.favorite
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                        : 'bg-slate-800/80 text-slate-400 border-white/10 hover:text-slate-200'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${activePlaylist.favorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span>{activePlaylist.favorite ? 'Favorite' : 'Set as Favorite'}</span>
                  </button>

                  <button
                    onClick={() => setPlayerHeight((prev) => (prev === 'full' ? 'compact' : 'full'))}
                    className="p-2 rounded-lg bg-slate-800/80 text-slate-300 border border-white/10 hover:bg-slate-700/80"
                    title={playerHeight === 'full' ? 'Compact View' : 'Full Tracklist View'}
                  >
                    {playerHeight === 'full' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>

                  <a
                    href={activePlaylist.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-800/80 text-slate-300 border border-white/10 hover:bg-slate-700/80"
                    title="Open on Spotify"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* SPOTIFY OFFICIAL EMBEDDED PLAYER IFRAME */}
              <div className="w-full overflow-hidden rounded-xl border border-purple-500/20 shadow-inner bg-[#0b0c13]">
                <iframe
                  title={`Spotify Playlist - ${activePlaylist.customName}`}
                  src={`https://open.spotify.com/embed/playlist/${activePlaylist.spotifyPlaylistId}?utm_source=generator&theme=0`}
                  width="100%"
                  height={playerHeight === 'full' ? '382' : '152'}
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="w-full transition-all duration-300"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  <span>Official Spotify Web Embed Player</span>
                </span>
                <span className="truncate max-w-[200px]">ID: {activePlaylist.spotifyPlaylistId}</span>
              </div>
            </div>
          </div>

          {/* RIGHT 1 COL: COZY AMBIENT SOUNDSCAPE SYNTHESIZER */}
          <div className="p-5 rounded-2xl bg-[#121422]/90 border border-purple-500/20 space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-purple-300 mb-1">
                <Radio className="w-4 h-4 text-purple-400" />
                <span>Ambient Study Layer</span>
              </div>
              <h3 className="text-base font-heading font-bold text-slate-100">
                Lo-Fi Soundscapes
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Overlay soft rain, 10Hz Alpha binaural beats, or quiet room ambiance under your Spotify music.
              </p>
            </div>

            <div className="space-y-2">
              {[
                { id: 'coffeeRain', label: '🌧️ Soft Rain & Cafe' },
                { id: 'binaural', label: '🧠 10Hz Alpha Focus Waves' },
                { id: 'cyber', label: '💻 Quiet Desk Ambiance' },
                { id: 'deepfocus', label: '🌊 Deep Sub Focus' },
                { id: 'fireplace', label: '🔥 Warm Fireplace Cracking' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    if (bgSoundscape === p.id && isBgPlaying) {
                      setIsBgPlaying(false);
                    } else {
                      setBgSoundscape(p.id as any);
                      setIsBgPlaying(true);
                    }
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between border ${
                    bgSoundscape === p.id && isBgPlaying
                      ? 'bg-purple-600/30 border-purple-400 text-purple-200 font-semibold'
                      : 'bg-[#0f111d] border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{p.label}</span>
                  {bgSoundscape === p.id && isBgPlaying ? (
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/40 animate-pulse">
                      Playing
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">Select</span>
                  )}
                </button>
              ))}
            </div>

            {isBgPlaying && (
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                  <span>Ambient Volume</span>
                  <span>{Math.round(bgVolume * 100)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={bgVolume}
                    onChange={(e) => setBgVolume(Number(e.target.value))}
                    className="w-full accent-purple-400"
                  />
                  <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* EMPTY STATE REQUIREMENT #10 */
        <div className="p-12 rounded-2xl bg-[#121422]/90 border border-purple-500/20 text-center space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
          <div className="w-16 h-16 rounded-2xl bg-purple-950/60 border border-purple-500/30 mx-auto flex items-center justify-center text-purple-300">
            <Music className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-xl font-heading font-bold text-slate-100">
              🎵 Your study soundtrack is empty.
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Add your Spotify playlist and keep your favorite study music right inside NEXORA.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-all inline-flex items-center gap-2 shadow-[0_4px_15px_rgba(168,85,247,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Spotify Playlist</span>
          </button>
        </div>
      )}

      {/* MY STUDY PLAYLISTS GRID */}
      {spotifyPlaylists.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-heading font-bold text-slate-100 flex items-center gap-2">
                <Headphones className="w-4 h-4 text-purple-300" />
                <span>🎧 My Study Playlists</span>
              </h2>
              <p className="text-xs text-slate-400">
                Click any playlist to open its Spotify player above.
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-purple-300 bg-purple-950/40 border border-purple-500/20 hover:bg-purple-900/40 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Playlist</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spotifyPlaylists.map((p, idx) => {
              const isActive = activePlaylist?.id === p.id;
              const isEditing = editingPlaylistId === p.id;

              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-xl transition-all border flex flex-col justify-between space-y-3 ${
                    isActive
                      ? 'bg-[#151829] border-purple-500/40 shadow-[0_4px_20px_rgba(168,85,247,0.15)]'
                      : 'bg-[#121422]/80 border-white/5 hover:border-purple-500/20'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleToggleFavorite(p.id)}
                        className={`p-1.5 rounded-lg transition-all ${
                          p.favorite
                            ? 'text-amber-400 bg-amber-950/40 border border-amber-500/30'
                            : 'text-slate-500 hover:text-amber-400'
                        }`}
                        title={p.favorite ? 'Current Favorite Playlist' : 'Set as Favorite'}
                      >
                        <Star className={`w-4 h-4 ${p.favorite ? 'fill-amber-400' : ''}`} />
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleReorder(p.id, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-20"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleReorder(p.id, 'down')}
                          disabled={idx === spotifyPlaylists.length - 1}
                          className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-20"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemovePlaylist(p.id)}
                          className="p-1 text-slate-500 hover:text-rose-400"
                          title="Delete Playlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 px-2.5 py-1 rounded-lg bg-[#0b0c13] border border-purple-400 text-xs text-slate-100"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEditing(p.id)}
                          className="p-1 rounded bg-purple-600 text-white"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-heading font-bold text-slate-100 truncate">
                          {p.customName}
                        </h3>
                        <button
                          onClick={() => startEditing(p)}
                          className="p-1 text-slate-500 hover:text-purple-300 shrink-0"
                          title="Rename Label"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    <div className="text-[11px] font-mono text-slate-400 truncate flex items-center gap-1">
                      <Music className="w-3 h-3 text-purple-400 shrink-0" />
                      <span className="truncate">{p.spotifyUrl}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">
                      {p.favorite ? '⭐ Favorite' : `Playlist #${idx + 1}`}
                    </span>

                    <button
                      onClick={() => setActivePlaylistId(p.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isActive
                          ? 'bg-purple-600 text-white shadow'
                          : 'bg-slate-800/80 text-purple-300 hover:bg-slate-700/80'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isActive ? 'Active Player' : 'Open Player'}</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* ADD PLAYLIST CARD BUTTON */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="p-6 rounded-xl border border-dashed border-purple-500/20 hover:border-purple-500/40 bg-[#121422]/40 hover:bg-[#121422]/70 transition-all flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-purple-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold">Add Spotify Playlist</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
