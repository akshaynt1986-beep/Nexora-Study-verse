import React, { useState } from 'react';
import { Music, Play, Maximize2, Minimize2, X, Headphones, ExternalLink, Sparkles } from 'lucide-react';
import { SpotifyPlaylist, TabId } from '../types';

interface SpotifyMiniPlayerProps {
  playlists: SpotifyPlaylist[];
  activePlaylistId?: string;
  onSelectPlaylist?: (id: string) => void;
  onNavigateTab: (tab: TabId) => void;
}

export const SpotifyMiniPlayer: React.FC<SpotifyMiniPlayerProps> = ({
  playlists,
  activePlaylistId,
  onNavigateTab,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (playlists.length === 0 || isDismissed) return null;

  const activePlaylist =
    playlists.find((p) => p.id === activePlaylistId) ||
    playlists.find((p) => p.favorite) ||
    playlists[0];

  if (!activePlaylist) return null;

  return (
    <div className="fixed bottom-3 right-3 sm:right-6 z-40 max-w-sm sm:max-w-md w-full transition-all duration-300">
      <div className="rounded-2xl bg-[#0d0e17]/95 border border-purple-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl overflow-hidden p-3 space-y-2">
        {/* TOP BAR CONTROL */}
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 truncate pr-2">
            <div className="w-6 h-6 rounded-md bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
              <Music className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-200 font-semibold truncate">
              {activePlaylist.customName}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="p-1 rounded text-slate-400 hover:text-purple-300 hover:bg-white/10"
              title={isExpanded ? 'Collapse Mini Player' : 'Expand Spotify Embed'}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => onNavigateTab('music')}
              className="px-2 py-1 rounded bg-purple-600/30 text-purple-200 border border-purple-500/30 hover:bg-purple-600 text-[11px] font-semibold flex items-center gap-1"
            >
              <span>Music Space</span>
            </button>

            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-white/10"
              title="Close Mini Player"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* EXPANDABLE COMPACT SPOTIFY IFRAME */}
        {isExpanded && (
          <div className="w-full rounded-xl overflow-hidden border border-purple-500/20 bg-[#0b0c13] pt-1">
            <iframe
              title={`Spotify Mini Player - ${activePlaylist.customName}`}
              src={`https://open.spotify.com/embed/playlist/${activePlaylist.spotifyPlaylistId}?utm_source=generator&theme=0`}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  );
};
