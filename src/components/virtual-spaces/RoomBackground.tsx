import React from 'react';
import { LightingMode, SubjectType, VirtualSpaceEnvironment } from '../../types';

interface RoomBackgroundProps {
  environment: VirtualSpaceEnvironment;
  lightingMode: LightingMode;
  activeSubject?: SubjectType;
  customBgUrl?: string;
  bgOpacity?: number;
}

export const RoomBackground: React.FC<RoomBackgroundProps> = ({
  environment,
  lightingMode,
  activeSubject = 'Physics',
  customBgUrl,
  bgOpacity = 0.9,
}) => {
  // Calculate effective lighting overlay
  const getLightingOverlay = () => {
    let mode = lightingMode;
    if (mode === 'auto') {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) mode = 'morning';
      else if (hour >= 12 && hour < 18) mode = 'morning'; // bright
      else if (hour >= 18 && hour < 22) mode = 'evening';
      else mode = 'night';
    }

    switch (mode) {
      case 'morning':
        return 'bg-gradient-to-b from-amber-500/10 via-amber-900/5 to-transparent pointer-events-none';
      case 'evening':
        return 'bg-gradient-to-b from-orange-600/15 via-purple-900/10 to-indigo-950/20 pointer-events-none';
      case 'night':
        return 'bg-gradient-to-b from-indigo-950/40 via-black/30 to-black/50 pointer-events-none';
      default:
        return 'pointer-events-none';
    }
  };

  if (environment.bgType === 'custom' || customBgUrl) {
    const url = customBgUrl || environment.customBgUrl;
    return (
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-slate-950">
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url('${url}')`,
            opacity: bgOpacity,
          }}
        />
        <div className={`absolute inset-0 ${getLightingOverlay()}`} />
      </div>
    );
  }

  // Render original stylized environments
  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-[#07080d] select-none">
      {/* 1. MIDNIGHT STUDY ROOM */}
      {environment.bgType === 'midnight-room' && (
        <div className="relative w-full h-full bg-gradient-to-b from-[#090b14] via-[#0e1220] to-[#060810]">
          {/* Starry Window */}
          <div className="absolute top-[8%] left-[20%] right-[20%] h-[48%] rounded-t-full border-4 border-slate-800/60 bg-[#060815] shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-purple-950/20 to-black/80" />
            {/* Subtle City Skyline */}
            <div className="absolute bottom-0 inset-x-0 h-16 flex items-end justify-between opacity-30 px-4">
              <div className="w-12 h-14 bg-slate-800 rounded-t-sm" />
              <div className="w-8 h-20 bg-slate-900 rounded-t-sm" />
              <div className="w-16 h-10 bg-slate-800 rounded-t-sm" />
              <div className="w-10 h-16 bg-slate-700/80 rounded-t-sm" />
              <div className="w-14 h-12 bg-slate-800 rounded-t-sm" />
            </div>
            {/* Window Frame Crossbars */}
            <div className="absolute inset-y-0 left-1/2 w-1 bg-slate-800/80 -translate-x-1/2" />
            <div className="absolute top-1/2 inset-x-0 h-1 bg-slate-800/80 -translate-y-1/2" />
          </div>

          {/* Study Desk & Table Lamp */}
          <div className="absolute bottom-0 inset-x-0 h-[42%] bg-gradient-to-t from-[#0a0a12] via-[#12111d] to-transparent border-t border-purple-500/20">
            {/* Desk Surface */}
            <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-r from-amber-950/20 via-purple-950/30 to-amber-950/20 border-b border-purple-500/10" />

            {/* Warm Desk Lamp Glow */}
            <div className="absolute top-2 right-[22%] w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

            {/* Academic Subject Wall Art */}
            <div className="absolute top-6 left-12 opacity-25 text-purple-300 font-mono text-xs space-y-1 pointer-events-none">
              {activeSubject === 'Physics' && (
                <>
                  <p>∇ · E = ρ / ε₀</p>
                  <p>∇ × B = μ₀J + μ₀ε₀(∂E/∂t)</p>
                  <p>E = -dΦ/dt</p>
                </>
              )}
              {activeSubject === 'Chemistry' && (
                <>
                  <p>ΔG° = -RT ln Keq</p>
                  <p>PV = nRT</p>
                  <p>pH = pKa + log([A⁻]/[HA])</p>
                </>
              )}
              {activeSubject === 'Mathematics' && (
                <>
                  <p>∫ e^x dx = e^x + C</p>
                  <p>lim (x→0) sin(x)/x = 1</p>
                  <p>e^(iπ) + 1 = 0</p>
                </>
              )}
              {activeSubject === 'Biology' && (
                <>
                  <p>DNA → RNA → Protein</p>
                  <p>C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O</p>
                  <p>ATP ⇌ ADP + Pi</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. RAINY WINDOW ROOM */}
      {environment.bgType === 'rainy-window' && (
        <div className="relative w-full h-full bg-gradient-to-b from-[#080d18] via-[#0d1728] to-[#060a12]">
          {/* Panoramic Rainy Window */}
          <div className="absolute top-[5%] inset-x-[10%] h-[60%] rounded-2xl border-2 border-slate-700/40 bg-[#070e1c] shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-[#071120] to-[#050812]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-black/80" />

            {/* Window Glass Panes */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1.5 p-1 bg-slate-800/40 pointer-events-none">
              <div className="bg-transparent border border-slate-700/30 rounded" />
              <div className="bg-transparent border border-slate-700/30 rounded" />
              <div className="bg-transparent border border-slate-700/30 rounded" />
              <div className="bg-transparent border border-slate-700/30 rounded" />
              <div className="bg-transparent border border-slate-700/30 rounded" />
              <div className="bg-transparent border border-slate-700/30 rounded" />
            </div>
          </div>

          {/* Wooden Study Countertop */}
          <div className="absolute bottom-0 inset-x-0 h-[38%] bg-gradient-to-t from-[#090e1a] via-[#10192b] to-transparent border-t border-blue-500/20" />
        </div>
      )}

      {/* 3. COZY CAFE */}
      {environment.bgType === 'cozy-cafe' && (
        <div className="relative w-full h-full bg-gradient-to-b from-[#180f0a] via-[#261811] to-[#0f0a07]">
          {/* Warm Edison Bulb Overhead Glows */}
          <div className="absolute top-0 inset-x-0 h-32 flex justify-around opacity-70">
            <div className="w-24 h-24 rounded-full bg-amber-500/20 blur-2xl animate-pulse" />
            <div className="w-32 h-32 rounded-full bg-amber-400/20 blur-3xl animate-pulse" />
            <div className="w-24 h-24 rounded-full bg-amber-500/20 blur-2xl animate-pulse" />
          </div>

          {/* Espresso Bar Wooden Shelf & Window */}
          <div className="absolute top-[12%] inset-x-[15%] h-[45%] rounded-xl border border-amber-900/40 bg-[#1e130d] p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-200/40 text-xs font-mono">
              <span>☕ NEXORA ARTISAN COFFEE ROOM</span>
              <span>JEE/NEET DEEP FOCUS ZONE</span>
            </div>
            <div className="text-center text-amber-300/20 text-3xl font-serif italic">
              "Focus is the art of knowing what to ignore."
            </div>
          </div>

          {/* Warm Dark Oak Table */}
          <div className="absolute bottom-0 inset-x-0 h-[45%] bg-gradient-to-t from-[#140b07] via-[#20130d] to-transparent border-t border-amber-700/30" />
        </div>
      )}

      {/* 4. QUIET LIBRARY */}
      {environment.bgType === 'quiet-library' && (
        <div className="relative w-full h-full bg-gradient-to-b from-[#120e0b] via-[#1f1914] to-[#0b0806]">
          {/* Bookshelves Pattern Layer */}
          <div className="absolute inset-x-[8%] top-[8%] h-[52%] border border-amber-900/30 rounded-xl bg-[#17120e] p-4 grid grid-cols-4 gap-4 opacity-80">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border-b-2 border-amber-800/40 flex items-end gap-1 px-1 pb-1">
                <div className="w-3 h-16 bg-amber-900/60 rounded-t-sm" />
                <div className="w-4 h-20 bg-amber-950/80 rounded-t-sm" />
                <div className="w-3.5 h-14 bg-amber-800/70 rounded-t-sm" />
                <div className="w-4 h-18 bg-yellow-950/60 rounded-t-sm" />
              </div>
            ))}
          </div>

          {/* Green Banker Lamp Glow & Mahogany Desk */}
          <div className="absolute bottom-0 inset-x-0 h-[42%] bg-gradient-to-t from-[#0e0a07] via-[#1a130e] to-transparent border-t border-emerald-900/40">
            <div className="absolute top-4 left-[15%] w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
          </div>
        </div>
      )}

      {/* 5. FOREST CABIN */}
      {environment.bgType === 'forest-cabin' && (
        <div className="relative w-full h-full bg-gradient-to-b from-[#08120c] via-[#0d1e15] to-[#050b07]">
          {/* Cabin Window facing Pine Trees */}
          <div className="absolute top-[8%] inset-x-[18%] h-[55%] rounded-2xl border-2 border-emerald-900/40 bg-[#06120a] shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/40 via-teal-950/20 to-black/80" />
            <div className="absolute bottom-0 inset-x-0 h-32 flex justify-around items-end opacity-40 text-emerald-300">
              <div className="text-4xl">🌲</div>
              <div className="text-6xl">🌲</div>
              <div className="text-5xl">🌲</div>
              <div className="text-6xl">🌲</div>
            </div>
          </div>

          {/* Log Cabin Desk */}
          <div className="absolute bottom-0 inset-x-0 h-[40%] bg-gradient-to-t from-[#071109] via-[#0e2114] to-transparent border-t border-emerald-800/30" />
        </div>
      )}

      {/* 6. NIGHT OBSERVATORY */}
      {environment.bgType === 'night-observatory' && (
        <div className="relative w-full h-full bg-gradient-to-b from-[#060515] via-[#0d0a26] to-[#04030d]">
          {/* Cosmic Sky Dome */}
          <div className="absolute top-[2%] inset-x-[5%] h-[68%] rounded-t-full border border-indigo-500/30 bg-[#060517] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_var(--tw-gradient-stops))] from-indigo-900/30 via-purple-950/20 to-black/90" />
            <div className="absolute top-1/4 left-1/3 text-indigo-300/20 font-mono text-xs">
              ✦ CONSTELLATION ASTRO-STUDY
            </div>
          </div>

          {/* Observatory Desk */}
          <div className="absolute bottom-0 inset-x-0 h-[35%] bg-gradient-to-t from-[#050412] via-[#0b0821] to-transparent border-t border-indigo-500/20" />
        </div>
      )}

      {/* 7. NIGHT CITY STUDY */}
      {environment.bgType === 'night-city' && (
        <div className="relative w-full h-full bg-gradient-to-b from-[#0c0617] via-[#160c29] to-[#08040f]">
          {/* Cyber City High Rise View */}
          <div className="absolute top-[6%] inset-x-[12%] h-[58%] rounded-xl border border-purple-500/30 bg-[#0a0514] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-pink-950/10 to-black/90" />
            <div className="absolute bottom-0 inset-x-0 h-24 flex items-end justify-between px-6 opacity-50">
              <div className="w-10 h-20 bg-purple-950 border-t border-purple-500/40" />
              <div className="w-14 h-28 bg-indigo-950 border-t border-indigo-500/40" />
              <div className="w-12 h-16 bg-pink-950 border-t border-pink-500/40" />
              <div className="w-16 h-24 bg-purple-950 border-t border-purple-500/40" />
            </div>
          </div>

          <div className="absolute bottom-0 inset-x-0 h-[38%] bg-gradient-to-t from-[#090412] via-[#130824] to-transparent border-t border-purple-500/20" />
        </div>
      )}

      {/* 8. CALM BEACH STUDY */}
      {environment.bgType === 'calm-beach' && (
        <div className="relative w-full h-full bg-gradient-to-b from-[#171008] via-[#24180d] to-[#0d0904]">
          <div className="absolute top-[8%] inset-x-[10%] h-[55%] rounded-2xl border border-amber-600/30 bg-[#1c1208] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 via-orange-950/20 to-black/80" />
            <div className="absolute bottom-8 inset-x-0 h-1 bg-amber-500/30" />
          </div>
          <div className="absolute bottom-0 inset-x-0 h-[40%] bg-gradient-to-t from-[#120b05] via-[#211409] to-transparent border-t border-amber-600/20" />
        </div>
      )}

      {/* 9. MOUNTAIN CABIN */}
      {environment.bgType === 'mountain-cabin' && (
        <div className="relative w-full h-full bg-gradient-to-b from-[#09111c] via-[#101c2b] to-[#060c14]">
          <div className="absolute top-[6%] inset-x-[12%] h-[58%] rounded-xl border border-slate-700/40 bg-[#0a1321] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-blue-950/20 to-black/80" />
            <div className="absolute bottom-0 inset-x-0 h-24 flex items-end justify-center gap-12 opacity-30 text-slate-300">
              <span className="text-6xl">🏔️</span>
              <span className="text-7xl">🏔️</span>
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-[40%] bg-gradient-to-t from-[#070e17] via-[#111e2e] to-transparent border-t border-slate-700/30" />
        </div>
      )}

      {/* 10. PEACEFUL ANIME-INSPIRED ROOM */}
      {environment.bgType === 'peaceful-anime' && (
        <div className="relative w-full h-full bg-gradient-to-b from-[#130b18] via-[#211129] to-[#0b050e]">
          <div className="absolute top-[8%] inset-x-[15%] h-[55%] rounded-2xl border border-pink-500/30 bg-[#160b1c] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-pink-950/20 to-black/80" />
            <div className="absolute top-4 right-6 text-pink-300/30 text-xs font-serif">
              🌸 桜の学習部屋 (Sakura Study Room)
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-[40%] bg-gradient-to-t from-[#0e0612] via-[#1d0d26] to-transparent border-t border-pink-500/20" />
        </div>
      )}

      {/* Lighting Mode Ambient Overlay */}
      <div className={`absolute inset-0 ${getLightingOverlay()}`} />
    </div>
  );
};
