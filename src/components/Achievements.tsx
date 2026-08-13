import React from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle,
  Coins,
  Lock,
  LockKeyhole,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';
import { AchievementItem, AnimeTheme, ThemeId, UserStats } from '../types';
import { ANIME_THEMES } from '../data/themes';
import { AudioSynthService } from '../services/audioSynth';

interface AchievementsProps {
  theme: AnimeTheme;
  userStats: UserStats;
  achievements: AchievementItem[];
  onClaimAchievement: (id: string, xp: number, coins: number) => void;
  onUnlockThemeWithCoins: (themeId: ThemeId, cost: number) => void;
  onSelectTheme: (themeId: ThemeId) => void;
}

export const Achievements: React.FC<AchievementsProps> = ({
  theme,
  userStats,
  achievements,
  onClaimAchievement,
  onUnlockThemeWithCoins,
  onSelectTheme,
}) => {
  const ranksList = [
    { rank: 'E-Rank Hunter', minLvl: 1 },
    { rank: 'D-Rank Hunter', minLvl: 3 },
    { rank: 'C-Rank Hunter', minLvl: 5 },
    { rank: 'B-Rank Hunter', minLvl: 8 },
    { rank: 'A-Rank Hunter', minLvl: 12 },
    { rank: 'S-Rank Hunter', minLvl: 15 },
    { rank: 'National Level Hunter', minLvl: 20 },
    { rank: 'Shadow Monarch', minLvl: 25 },
  ];

  const themePrices: Record<ThemeId, number> = {
    'shadow-core': 0,
    'cyber-tokyo': 0,
    'crimson-energy': 150,
    'midnight-blue': 150,
    'neon-future': 200,
    'astral-night': 250,
    'ocean-dream': 300,
  };

  const handleClaim = (ach: AchievementItem) => {
    AudioSynthService.playLevelUpSound();
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    onClaimAchievement(ach.id, ach.xpReward, ach.coinReward);
  };

  const handleBuyTheme = (themeId: ThemeId) => {
    const cost = themePrices[themeId] || 200;
    if (userStats.coins >= cost) {
      AudioSynthService.playLevelUpSound();
      confetti({ particleCount: 90, spread: 70 });
      onUnlockThemeWithCoins(themeId, cost);
    } else {
      alert(`Need ${cost - userStats.coins} more Coins to unlock this theme! Keep studying to earn Coins.`);
    }
  };

  return (
    <div id="achievements-view" className="space-y-6 pb-20 md:pb-8">
      {/* Title Header */}
      <div className={`p-6 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <Trophy className="w-4 h-4" />
            <span>System Hall of Fame & Theme Shop</span>
          </div>
          <h2 className={`text-2xl font-extrabold ${theme.textPrimary}`}>
            Hunter Ranks & Rewards
          </h2>
          <p className="text-xs text-white/70">
            Earn badges, level up hunter ranks, and unlock anime themes with your hard-earned Coins.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold font-mono text-sm">
            <Coins className="w-4 h-4" />
            <span>{userStats.coins} Coins</span>
          </div>

          <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold font-mono text-sm">
            <Sparkles className="w-4 h-4" />
            <span>LVL {userStats.level}</span>
          </div>
        </div>
      </div>

      {/* Hunter Ranks Progression Line */}
      <div className={`p-5 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} space-y-4`}>
        <h3 className={`text-base font-bold ${theme.textPrimary}`}>Hunter Rank Progression</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {ranksList.map((r, idx) => {
            const isReached = userStats.level >= r.minLvl;
            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isReached
                    ? `${theme.buttonGradient} border-cyan-400 text-white shadow-lg`
                    : 'bg-black/40 border-white/10 text-white/40'
                }`}
              >
                <div className="text-xl mb-1">{isReached ? '⚡' : '🔒'}</div>
                <div className="text-[11px] font-bold truncate">{r.rank}</div>
                <div className="text-[10px] font-mono opacity-70">Lvl {r.minLvl}+</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Gallery */}
      <div className="space-y-4">
        <h3 className={`text-base font-bold ${theme.textPrimary}`}>System Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} flex flex-col justify-between space-y-3`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl p-2 rounded-xl bg-black/40 border border-white/10">
                    {ach.badge}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{ach.title}</h4>
                    <p className="text-xs text-white/60 mt-0.5">{ach.description}</p>
                  </div>
                </div>
              </div>

              {/* Progress & Reward Claim */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-300">+{ach.xpReward} XP</span>
                  <span className="text-amber-400">+{ach.coinReward} Coins</span>
                </div>

                {ach.unlocked ? (
                  <button
                    disabled
                    className="w-full py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center space-x-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Unlocked & Claimed</span>
                  </button>
                ) : ach.progress >= 100 ? (
                  <button
                    onClick={() => handleClaim(ach)}
                    className={`w-full py-2 rounded-xl ${theme.buttonGradient} ${theme.accentGlow} text-white text-xs font-bold flex items-center justify-center space-x-1 shadow-lg hover:scale-105 transition-all`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Claim Reward!</span>
                  </button>
                ) : (
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 transition-all"
                      style={{ width: `${ach.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anime Theme Coin Shop */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={`text-base font-bold ${theme.textPrimary}`}>
            Anime Theme Unlock Shop
          </h3>
          <span className="text-xs text-amber-400 font-mono">
            {userStats.unlockedThemes.length} / {Object.keys(ANIME_THEMES).length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.values(ANIME_THEMES).map((t) => {
            const isUnlocked = userStats.unlockedThemes.includes(t.id);
            const isCurrent = theme.id === t.id;
            const price = themePrices[t.id] || 200;

            return (
              <div
                key={t.id}
                className={`p-4 rounded-2xl ${t.cardBg} border ${t.cardBorder} space-y-3 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-cyan-300 uppercase truncate">
                      {t.anime || t.name}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-white text-[9px] font-mono font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white">{t.name}</h4>
                  <p className="text-[10px] text-white/60 line-clamp-2 mt-1">{t.tagline}</p>
                </div>

                <div>
                  {isUnlocked ? (
                    <button
                      onClick={() => onSelectTheme(t.id)}
                      disabled={isCurrent}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-white/10 text-white/50 cursor-default'
                          : `${t.buttonGradient} text-white hover:scale-105`
                      }`}
                    >
                      {isCurrent ? 'Current Theme' : 'Apply Theme'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuyTheme(t.id)}
                      className="w-full py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center space-x-1 transition-all hover:scale-105"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Unlock for {price} C</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
