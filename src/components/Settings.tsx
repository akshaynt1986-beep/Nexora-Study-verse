import React, { useRef, useState } from 'react';
import {
  Download,
  LogOut,
  Moon,
  RotateCcw,
  Settings as SettingsIcon,
  Sparkles,
  Sun,
  Upload,
  Volume2,
  Zap,
} from 'lucide-react';
import { AnimeTheme, ThemeId, UserStats } from '../types';
import { ANIME_THEMES } from '../data/themes';
import { StorageService } from '../services/storage';

interface SettingsProps {
  theme: AnimeTheme;
  userStats: UserStats;
  onSelectTheme: (themeId: ThemeId) => void;
  onReloadAllData: () => void;
  onLogout?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  theme,
  userStats,
  onSelectTheme,
  onReloadAllData,
  onLogout,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [pwaInstalled, setPwaInstalled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExportData = () => {
    const jsonStr = StorageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudyVerse_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = StorageService.importAllData(content);
        if (success) {
          alert('Data successfully imported!');
          onReloadAllData();
        } else {
          alert('Failed to parse backup file.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all study stats, notes, and tasks to default?')) {
      StorageService.resetToDefault();
      onReloadAllData();
    }
  };

  return (
    <div id="settings-view" className="space-y-6 pb-20 md:pb-8">
      {/* Title Header */}
      <div className={`p-6 rounded-2xl ${theme.cardBg} border ${theme.cardBorder}`}>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
          <SettingsIcon className="w-4 h-4" />
          <span>Anime OS Configuration</span>
        </div>
        <h2 className={`text-2xl font-extrabold ${theme.textPrimary}`}>
          System Settings & Data Backup
        </h2>
        <p className="text-xs text-white/70">
          Customize active theme, background animations, sound effects, and export offline backups.
        </p>
      </div>

      {/* Theme Switcher Grid */}
      <div className={`p-5 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} space-y-4`}>
        <h3 className={`text-base font-bold ${theme.textPrimary} flex items-center space-x-2`}>
          <Sparkles className={`w-4 h-4 ${theme.accentColor}`} />
          <span>Active Anime Theme ({Object.keys(ANIME_THEMES).length} Themes)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.values(ANIME_THEMES).map((t) => {
            const isUnlocked = userStats.unlockedThemes.includes(t.id);
            const isSelected = theme.id === t.id;

            return (
              <button
                key={t.id}
                onClick={() => isUnlocked && onSelectTheme(t.id)}
                disabled={!isUnlocked}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? `${t.buttonGradient} border-cyan-400 shadow-lg font-bold text-white scale-[1.02]`
                    : isUnlocked
                    ? `${t.cardBg} border-white/10 text-white/80 hover:bg-white/10`
                    : 'bg-black/50 border-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                <div className="text-[10px] font-mono uppercase opacity-70 truncate">{t.anime}</div>
                <div className="text-xs font-bold truncate mt-0.5">{t.name}</div>
                {!isUnlocked && <span className="text-[10px] text-amber-400 font-mono mt-1 block">🔒 In Coin Shop</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* System Toggles */}
      <div className={`p-5 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} space-y-4`}>
        <h3 className={`text-base font-bold ${theme.textPrimary}`}>System Preferences</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Audio & Sound FX</div>
              <div className="text-[10px] text-white/50">Play audio cues on XP gain and clicks</div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                soundEnabled ? 'bg-cyan-500 text-white' : 'bg-white/10 text-white/50'
              }`}
            >
              {soundEnabled ? 'ENABLED' : 'MUTED'}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Particle Background FX</div>
              <div className="text-[10px] text-white/50">Interactive particles canvas rendering</div>
            </div>
            <button
              onClick={() => setAnimationsEnabled(!animationsEnabled)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                animationsEnabled ? 'bg-cyan-500 text-white' : 'bg-white/10 text-white/50'
              }`}
            >
              {animationsEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
        </div>
      </div>

      {/* Data Export / Import / Reset */}
      <div className={`p-5 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} space-y-4`}>
        <h3 className={`text-base font-bold ${theme.textPrimary}`}>Offline Local Storage Backup</h3>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportData}
            className={`px-5 py-2.5 rounded-xl ${theme.buttonGradient} text-xs font-bold text-white flex items-center space-x-2 shadow-md hover:scale-105 transition-all`}
          >
            <Download className="w-4 h-4" />
            <span>Export Full JSON Data</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center space-x-2 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Import Backup File</span>
            <input
              type="file"
              ref={fileInputRef}
              accept="application/json"
              onChange={handleImportData}
              className="hidden"
            />
          </button>

          <button
            onClick={handleResetData}
            className="px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-bold text-rose-400 flex items-center space-x-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Data</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white flex items-center space-x-2 transition-all ml-auto shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
