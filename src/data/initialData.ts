import {
  AchievementItem,
  AudioTrack,
  FlashcardItem,
  FormulaItem,
  NoteItem,
  SpotifyPlaylist,
  UserStats,
  VirtualSpaceEnvironment,
} from '../types';

export const INITIAL_USER_STATS: UserStats = {
  xp: 0,
  coins: 0,
  level: 1,
  rankTitle: 'Rank E',
  productivityScore: 0,
  totalFocusMinutes: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  dailyStudyHoursToday: 0,
  questionsSolved: 0,
  pyqsSolved: 0,
  mockTestsCount: 0,
  accuracyPercentage: 0,
  chaptersCompleted: 0,
  revisionCompleted: 0,
  achievementsUnlocked: 0,
  heatmapData: {},
  unlockedThemes: ['shadow-core', 'cyber-tokyo', 'neon-future', 'midnight-blue'],
};

export const DEMO_USER_STATS: UserStats = {
  xp: 1420,
  coins: 380,
  level: 4,
  rankTitle: 'Rank C',
  productivityScore: 84,
  totalFocusMinutes: 1860,
  currentStreak: 7,
  longestStreak: 12,
  lastActiveDate: new Date().toISOString().split('T')[0],
  dailyStudyHoursToday: 4.2,
  questionsSolved: 240,
  pyqsSolved: 85,
  mockTestsCount: 3,
  accuracyPercentage: 78,
  chaptersCompleted: 6,
  revisionCompleted: 14,
  achievementsUnlocked: 2,
  heatmapData: (() => {
    const map: Record<string, number> = {};
    const now = new Date();
    for (let i = 0; i < 90; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      map[dateStr] = Math.floor(Math.random() * 200) + 90;
    }
    return map;
  })(),
  unlockedThemes: ['shadow-core', 'cyber-tokyo', 'neon-future', 'midnight-blue', 'crimson-energy'],
};

import { COMPREHENSIVE_FORMULA_VAULT } from './formulaVaultData';

export const INITIAL_FORMULAS: FormulaItem[] = COMPREHENSIVE_FORMULA_VAULT;

export const INITIAL_FLASHCARDS: FlashcardItem[] = [
  {
    id: 'fc-1',
    subject: 'Chemistry',
    chapter: 'General Organic Chemistry (GOC)',
    front: 'What is the order of stability for 3°, 2°, 1° carbocations?',
    back: '3° > 2° > 1° > Methyl\nStabilized by hyperconjugation (α-hydrogens) and inductive (+I) effect.',
    easeFactor: 2.5,
    repetitions: 0,
    intervalDays: 1,
    nextReviewDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 'fc-2',
    subject: 'Physics',
    chapter: 'Current Electricity',
    front: 'State Kirchhoff’s Voltage Law (KVL) and its conservation principle.',
    back: 'The algebraic sum of potential differences around any closed loop in a circuit is zero (ΣΔV = 0).\nBased on Conservation of Energy.',
    easeFactor: 2.5,
    repetitions: 0,
    intervalDays: 1,
    nextReviewDate: new Date().toISOString().split('T')[0],
  }
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'NEXORA Strategy: Master JEE Current Electricity',
    folder: 'Physics Notes',
    subject: 'Physics',
    content: `# Current Electricity & Circuit Analysis

## Key Concepts
1. **Kirchhoff's Laws**:
   - Junction Rule (KCL) -> Conservation of Charge.
   - Loop Rule (KVL) -> Conservation of Energy.

2. **Potentiometer Principles**:
   - Potential gradient $k = V/L$.
   - Comparison of EMFs: $E_1/E_2 = l_1/l_2$.

## Important Checklist
- Solve 20 PYQs on Wheatstone Bridge symmetry.
- Log any calculation mistakes directly into NEXORA Mistake Book!
`,
    isFavorite: true,
    updatedAt: new Date().toISOString(),
    tags: ['Physics', 'Current Electricity', 'JEE Main']
  }
];

export const INITIAL_AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'track-1',
    title: 'Rain on Cyber Tokyo Roof',
    artist: 'NEXORA Soundscapes',
    genre: 'Ambient',
    type: 'synth',
    synthPreset: 'rain',
  },
  {
    id: 'track-2',
    title: 'Alpha Wave Binaural Beats (432Hz)',
    artist: 'NEXORA Focus Science',
    genre: 'Focus Science',
    type: 'synth',
    synthPreset: 'binaural',
  },
  {
    id: 'track-3',
    title: 'Cyberpunk Neon Grid Ambient',
    artist: 'NEXORA Soundscapes',
    genre: 'Synthwave',
    type: 'synth',
    synthPreset: 'cyber',
  },
  {
    id: 'track-4',
    title: 'Deep Deep Focus Void',
    artist: 'NEXORA Focus Science',
    genre: 'Ambient',
    type: 'synth',
    synthPreset: 'deepfocus',
  },
  {
    id: 'track-5',
    title: 'Ocean Waves & Serene Mind',
    artist: 'NEXORA Soundscapes',
    genre: 'Ambient',
    type: 'synth',
    synthPreset: 'ocean',
  },
  {
    id: 'track-6',
    title: 'Warm Fireplace Study Ambiance',
    artist: 'NEXORA Soundscapes',
    genre: 'Ambient',
    type: 'synth',
    synthPreset: 'fireplace',
  }
];

export const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'ach-1',
    title: 'System Initialized: First Steps',
    description: 'Complete your first study session or mission in NEXORA.',
    badge: '⚡',
    xpReward: 100,
    coinReward: 50,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'ach-2',
    title: 'Streak Novice (3 Days)',
    description: 'Maintain a 3-day continuous study streak.',
    badge: '🔥',
    xpReward: 150,
    coinReward: 60,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'ach-3',
    title: 'Streak Master (7 Days)',
    description: 'Maintain a 7-day continuous study streak.',
    badge: '👑',
    xpReward: 300,
    coinReward: 120,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'ach-4',
    title: 'PYQ Destroyer',
    description: 'Solve 50 PYQ questions accurately.',
    badge: '🎯',
    xpReward: 400,
    coinReward: 150,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'ach-5',
    title: 'Mistake Book Disciplinarian',
    description: 'Log and review 10 mistakes in your Mistake Book.',
    badge: '📖',
    xpReward: 250,
    coinReward: 80,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'ach-6',
    title: 'Weekly Boss Victor',
    description: 'Complete a 75-question Weekly Boss Challenge.',
    badge: '⚔️',
    xpReward: 500,
    coinReward: 200,
    progress: 0,
    unlocked: false,
  }
];

export const INITIAL_SPOTIFY_PLAYLISTS: SpotifyPlaylist[] = [
  {
    id: 'sp-1',
    spotifyUrl: 'https://open.spotify.com/playlist/0vvR1A5722244243',
    spotifyPlaylistId: '0vvR1A5722244243',
    customName: 'Lofi Study Beats',
    favorite: true,
    createdAt: 1700000000000,
    order: 1,
  },
  {
    id: 'sp-2',
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX8Ueb12W1V9e',
    spotifyPlaylistId: '37i9dQZF1DX8Ueb12W1V9e',
    customName: 'Deep Focus & Solitude',
    favorite: false,
    createdAt: 1700000000100,
    order: 2,
  },
  {
    id: 'sp-3',
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdLEN2aqioXM',
    spotifyPlaylistId: '37i9dQZF1DXdLEN2aqioXM',
    customName: 'JEE / NEET Grind Instrumental',
    favorite: false,
    createdAt: 1700000000200,
    order: 3,
  },
  {
    id: 'sp-4',
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWQR02S2S91A',
    spotifyPlaylistId: '37i9dQZF1DWWQR02S2S91A',
    customName: 'Night Study Vibes',
    favorite: false,
    createdAt: 1700000000300,
    order: 4,
  },
];

export const INITIAL_VIRTUAL_SPACES: VirtualSpaceEnvironment[] = [
  {
    id: 'space-midnight',
    name: 'Midnight Study Room',
    category: 'Night',
    description: 'A quiet late-night study desk with warm lamp glow and starlight views.',
    previewGradient: 'from-[#0d1117] via-[#161b22] to-[#1f242d]',
    bgType: 'midnight-room',
    defaultSounds: [
      { soundId: 'rain', volume: 0.4 },
      { soundId: 'night', volume: 0.3 },
      { soundId: 'keyboard', volume: 0.15 },
    ],
    defaultWeather: 'stars',
    favorite: true,
    academicTheme: 'Physics',
  },
  {
    id: 'space-rainy',
    name: 'Rainy Window Room',
    category: 'Rain',
    description: 'Cozy study desk overlooking soft rain drops and gentle storm ambiance.',
    previewGradient: 'from-[#0b1320] via-[#121d2d] to-[#1a293d]',
    bgType: 'rainy-window',
    defaultSounds: [
      { soundId: 'rain', volume: 0.7 },
      { soundId: 'thunder', volume: 0.2 },
      { soundId: 'wind', volume: 0.2 },
    ],
    defaultWeather: 'rain',
    favorite: true,
    academicTheme: 'Chemistry',
  },
  {
    id: 'space-cafe',
    name: 'Cozy Café',
    category: 'Café',
    description: 'Warm coffee shop atmosphere with soft background murmur and espresso warmth.',
    previewGradient: 'from-[#1c120c] via-[#2c1d14] to-[#3a281c]',
    bgType: 'cozy-cafe',
    defaultSounds: [
      { soundId: 'cafe', volume: 0.6 },
      { soundId: 'rain', volume: 0.25 },
      { soundId: 'keyboard', volume: 0.15 },
    ],
    defaultWeather: 'none',
    favorite: false,
    academicTheme: 'General',
  },
  {
    id: 'space-library',
    name: 'Quiet Library',
    category: 'Library',
    description: 'Deep focus inside a majestic wooden library surrounded by knowledge.',
    previewGradient: 'from-[#141210] via-[#231e1a] to-[#312923]',
    bgType: 'quiet-library',
    defaultSounds: [
      { soundId: 'library', volume: 0.7 },
      { soundId: 'keyboard', volume: 0.2 },
      { soundId: 'wind', volume: 0.1 },
    ],
    defaultWeather: 'none',
    favorite: true,
    academicTheme: 'Mathematics',
  },
  {
    id: 'space-forest',
    name: 'Forest Cabin',
    category: 'Nature',
    description: 'Rustic wooden cabin surrounded by pine trees, soft breeze, and wildlife chirps.',
    previewGradient: 'from-[#0b1a12] via-[#12281c] to-[#1a3828]',
    bgType: 'forest-cabin',
    defaultSounds: [
      { soundId: 'forest', volume: 0.6 },
      { soundId: 'fireplace', volume: 0.35 },
      { soundId: 'birds', volume: 0.2 },
    ],
    defaultWeather: 'fog',
    favorite: false,
    academicTheme: 'Biology',
  },
  {
    id: 'space-observatory',
    name: 'Night Observatory',
    category: 'Night',
    description: 'Stargazing under an open cosmic dome with glowing constellations.',
    previewGradient: 'from-[#08071a] via-[#110e30] to-[#1a1647]',
    bgType: 'night-observatory',
    defaultSounds: [
      { soundId: 'night', volume: 0.5 },
      { soundId: 'wind', volume: 0.3 },
      { soundId: 'ocean', volume: 0.2 },
    ],
    defaultWeather: 'stars',
    favorite: false,
    academicTheme: 'Physics',
  },
  {
    id: 'space-city',
    name: 'Night City Study',
    category: 'City',
    description: 'High-rise apartment window looking over glowing city skylines and distant traffic.',
    previewGradient: 'from-[#13091e] via-[#1f1030] to-[#2b1842]',
    bgType: 'night-city',
    defaultSounds: [
      { soundId: 'city', volume: 0.5 },
      { soundId: 'rain', volume: 0.3 },
      { soundId: 'train', volume: 0.2 },
    ],
    defaultWeather: 'clouds',
    favorite: false,
    academicTheme: 'General',
  },
  {
    id: 'space-beach',
    name: 'Calm Beach Study',
    category: 'Nature',
    description: 'Sunset coastal retreat with rhythmic ocean waves and warm evening sea breeze.',
    previewGradient: 'from-[#1a140d] via-[#2d2216] to-[#40301e]',
    bgType: 'calm-beach',
    defaultSounds: [
      { soundId: 'ocean', volume: 0.7 },
      { soundId: 'wind', volume: 0.25 },
      { soundId: 'birds', volume: 0.15 },
    ],
    defaultWeather: 'clouds',
    favorite: false,
    academicTheme: 'General',
  },
  {
    id: 'space-mountain',
    name: 'Mountain Cabin',
    category: 'Cozy',
    description: 'Warm fireplace and wooden desk looking out over snow-capped alpine peaks.',
    previewGradient: 'from-[#101720] via-[#1a2533] to-[#253447]',
    bgType: 'mountain-cabin',
    defaultSounds: [
      { soundId: 'fireplace', volume: 0.6 },
      { soundId: 'wind', volume: 0.3 },
      { soundId: 'thunder', volume: 0.1 },
    ],
    defaultWeather: 'snow',
    favorite: false,
    academicTheme: 'Chemistry',
  },
  {
    id: 'space-anime',
    name: 'Peaceful Anime-inspired Room',
    category: 'Cozy',
    description: 'Aesthetic Japanese-styled desk with falling cherry blossom petals in soft twilight.',
    previewGradient: 'from-[#1a0f1e] via-[#2d1834] to-[#40224a]',
    bgType: 'peaceful-anime',
    defaultSounds: [
      { soundId: 'rain', volume: 0.4 },
      { soundId: 'birds', volume: 0.25 },
      { soundId: 'library', volume: 0.3 },
    ],
    defaultWeather: 'fireflies',
    favorite: true,
    academicTheme: 'Physics',
  },
];

