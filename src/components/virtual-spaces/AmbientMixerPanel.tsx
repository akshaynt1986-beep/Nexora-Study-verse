import React from 'react';
import { Volume2, VolumeX, RotateCcw, X, Play, Pause, Sparkles } from 'lucide-react';
import { AMBIENT_SOUNDS, AmbientMixerService } from '../../services/ambientMixer';

interface AmbientMixerPanelProps {
  volumes: Record<string, number>;
  onVolumeChange: (soundId: string, volume: number) => void;
  onReset: () => void;
  onClose: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const AmbientMixerPanel: React.FC<AmbientMixerPanelProps> = ({
  volumes,
  onVolumeChange,
  onReset,
  onClose,
  isMuted,
  onToggleMute,
}) => {
  const handlePreset = (presetMap: Record<string, number>) => {
    Object.keys(volumes).forEach((sId) => {
      onVolumeChange(sId, presetMap[sId] || 0);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-[#0e0f19]/95 border border-purple-500/30 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#121324]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Ambient Sound Mixer</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Synthesizer Engine
                </span>
              </h3>
              <p className="text-xs text-slate-400">Combine multiple continuous soundscapes for deep study focus</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QUICK PRESETS BAR */}
        <div className="p-3 bg-[#0a0b12] border-b border-white/5 flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <span className="text-slate-400 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Presets:</span>
          </span>
          <button
            onClick={() => handlePreset({ rain: 0.7, thunder: 0.25, fireplace: 0.2 })}
            className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-500/30 shrink-0"
          >
            🌧️ Rainy Storm
          </button>
          <button
            onClick={() => handlePreset({ cafe: 0.6, rain: 0.3, keyboard: 0.2 })}
            className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-500/30 shrink-0"
          >
            ☕ Rainy Café
          </button>
          <button
            onClick={() => handlePreset({ forest: 0.6, fireplace: 0.3, birds: 0.2 })}
            className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-500/30 shrink-0"
          >
            🌲 Cabin Retreat
          </button>
          <button
            onClick={() => handlePreset({ library: 0.7, keyboard: 0.25 })}
            className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-500/30 shrink-0"
          >
            📚 Library Silence
          </button>
        </div>

        {/* SOUND SLIDERS GRID */}
        <div className="p-4 overflow-y-auto space-y-3 custom-scrollbar flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AMBIENT_SOUNDS.map((snd) => {
              const currentVol = volumes[snd.id] ?? 0;
              const isActive = currentVol > 0;

              return (
                <div
                  key={snd.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-purple-950/30 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                      : 'bg-[#101221] border-white/5 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <span className="text-base">{snd.icon}</span>
                      <span>{snd.name}</span>
                    </span>
                    <span className="font-mono text-purple-300 font-bold">
                      {Math.round(currentVol * 100)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={currentVol}
                      onChange={(e) => onVolumeChange(snd.id, parseFloat(e.target.value))}
                      className="w-full accent-purple-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER CONTROLS */}
        <div className="p-4 bg-[#0a0b12] border-t border-white/10 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMute}
              className={`px-3 py-2 rounded-xl border font-semibold flex items-center gap-2 transition-all ${
                isMuted
                  ? 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                  : 'bg-purple-950/60 border-purple-500/40 text-purple-200'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isMuted ? 'Muted' : 'Sound Active'}</span>
            </button>

            <button
              onClick={onReset}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Mix</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
