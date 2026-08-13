import {
  AchievementItem,
  AudioTrack,
  FlashcardItem,
  FormulaItem,
  MistakeEntry,
  MockTestResult,
  NoteItem,
  PlannerState,
  PYQQuestion,
  ReferenceResource,
  RevisionItem,
  RoomWorkspaceState,
  SmartChapter,
  SpotifyPlaylist,
  SyllabusChapter,
  SyllabusExamType,
  TaskItem,
  ThemeId,
  UserAccount,
  UserPdfDocument,
  UserStats,
  VirtualSpaceEnvironment,
  WidgetConfig,
} from '../types';
import {
  INITIAL_ACHIEVEMENTS,
  INITIAL_AUDIO_TRACKS,
  INITIAL_FLASHCARDS,
  INITIAL_FORMULAS,
  INITIAL_NOTES,
  INITIAL_SPOTIFY_PLAYLISTS,
  INITIAL_USER_STATS,
  INITIAL_VIRTUAL_SPACES,
} from '../data/initialData';
import {
  INITIAL_JEE_SYLLABUS,
  INITIAL_NEET_SYLLABUS,
  getInitialSmartSyllabus,
  calculateChapterProgress,
} from '../data/syllabusData';
import { INITIAL_PYQS } from '../data/pyqData';
import { INITIAL_RESOURCES } from '../data/resourcesData';
import { AuthService } from './authService';

export class StorageService {
  private static getKey(key: string): string {
    const activeAcc = AuthService.getCurrentAccount();
    const userId = activeAcc ? activeAcc.id : 'default_guest';
    return `nexora_${userId}_${key}`;
  }

  static getTheme(): ThemeId {
    try {
      const saved = localStorage.getItem('nexora_active_theme');
      return (saved as ThemeId) || 'shadow-core';
    } catch {
      return 'shadow-core';
    }
  }

  static setTheme(theme: ThemeId): void {
    try {
      localStorage.setItem('nexora_active_theme', theme);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  }

  static getUserStats(): UserStats {
    const acc = AuthService.getCurrentAccount();
    if (!acc) return INITIAL_USER_STATS;
    return AuthService.getUserStats(acc.id);
  }

  static saveUserStats(stats: UserStats): void {
    const acc = AuthService.getCurrentAccount();
    if (acc) {
      AuthService.saveUserStats(acc.id, stats);
    }
  }

  static getSyllabus(): SyllabusChapter[] {
    try {
      const saved = localStorage.getItem(StorageService.getKey('syllabus'));
      if (saved) return JSON.parse(saved);
      const acc = AuthService.getCurrentAccount();
      return acc?.exam === 'NEET' ? INITIAL_NEET_SYLLABUS : INITIAL_JEE_SYLLABUS;
    } catch {
      const acc = AuthService.getCurrentAccount();
      return acc?.exam === 'NEET' ? INITIAL_NEET_SYLLABUS : INITIAL_JEE_SYLLABUS;
    }
  }

  static saveSyllabus(chapters: SyllabusChapter[]): void {
    try {
      localStorage.setItem(StorageService.getKey('syllabus'), JSON.stringify(chapters));
    } catch (e) {
      console.error('Failed to save syllabus', e);
    }
  }

  static getSmartSyllabus(exam: SyllabusExamType = 'JEE Main'): SmartChapter[] {
    try {
      const key = StorageService.getKey(`smart_syllabus_${exam.toLowerCase().replace(/\s+/g, '_')}`);
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed: SmartChapter[] = JSON.parse(saved);
        return parsed.map(calculateChapterProgress);
      }
      return getInitialSmartSyllabus(exam);
    } catch {
      return getInitialSmartSyllabus(exam);
    }
  }

  static saveSmartSyllabus(exam: SyllabusExamType, chapters: SmartChapter[]): void {
    try {
      const key = StorageService.getKey(`smart_syllabus_${exam.toLowerCase().replace(/\s+/g, '_')}`);
      localStorage.setItem(key, JSON.stringify(chapters));
    } catch (e) {
      console.error('Failed to save smart syllabus', e);
    }
  }

  static resetSmartSyllabus(exam: SyllabusExamType, subject?: string, chapterId?: string): SmartChapter[] {
    try {
      const initial = getInitialSmartSyllabus(exam);
      const current = StorageService.getSmartSyllabus(exam);

      let updated: SmartChapter[];
      if (chapterId) {
        updated = current.map((c) => {
          if (c.id === chapterId) {
            const initCh = initial.find((i) => i.id === chapterId) || c;
            return {
              ...initCh,
              status: 'Not Started',
              overallProgress: 0,
              topics: initCh.topics.map((t) => ({
                ...t,
                completionPercentage: 0,
                status: 'Not Started',
                subtopics: t.subtopics?.map((s) => ({ ...s, completed: false })),
              })),
              metrics: {
                ...initCh.metrics,
                lecturesCompleted: 0,
                dppsCompleted: 0,
                questionsPracticed: 0,
                pyqsSolved: 0,
                pyqAccuracy: 0,
                mockQuestionsAttempted: 0,
                formulasRevised: false,
                notesCompleted: false,
                revisionCompleted: false,
              },
            };
          }
          return c;
        });
      } else if (subject) {
        updated = current.map((c) => {
          if (c.subject === subject) {
            const initCh = initial.find((i) => i.id === c.id) || c;
            return {
              ...initCh,
              status: 'Not Started',
              overallProgress: 0,
              topics: initCh.topics.map((t) => ({
                ...t,
                completionPercentage: 0,
                status: 'Not Started',
                subtopics: t.subtopics?.map((s) => ({ ...s, completed: false })),
              })),
              metrics: {
                ...initCh.metrics,
                lecturesCompleted: 0,
                dppsCompleted: 0,
                questionsPracticed: 0,
                pyqsSolved: 0,
                pyqAccuracy: 0,
                mockQuestionsAttempted: 0,
                formulasRevised: false,
                notesCompleted: false,
                revisionCompleted: false,
              },
            };
          }
          return c;
        });
      } else {
        updated = initial;
      }

      const calculated = updated.map(calculateChapterProgress);
      StorageService.saveSmartSyllabus(exam, calculated);
      return calculated;
    } catch {
      return getInitialSmartSyllabus(exam);
    }
  }

  static getTasks(): TaskItem[] {
    try {
      const saved = localStorage.getItem(StorageService.getKey('tasks'));
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  static saveTasks(tasks: TaskItem[]): void {
    try {
      localStorage.setItem(StorageService.getKey('tasks'), JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  }

  static getMistakes(): MistakeEntry[] {
    try {
      const saved = localStorage.getItem(StorageService.getKey('mistakes'));
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  static saveMistakes(mistakes: MistakeEntry[]): void {
    try {
      localStorage.setItem(StorageService.getKey('mistakes'), JSON.stringify(mistakes));
    } catch (e) {
      console.error('Failed to save mistakes', e);
    }
  }

  static getRevisions(): RevisionItem[] {
    try {
      const saved = localStorage.getItem(StorageService.getKey('revisions'));
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  static saveRevisions(revisions: RevisionItem[]): void {
    try {
      localStorage.setItem(StorageService.getKey('revisions'), JSON.stringify(revisions));
    } catch (e) {
      console.error('Failed to save revisions', e);
    }
  }

  static getMockTestResults(): MockTestResult[] {
    try {
      const saved = localStorage.getItem(StorageService.getKey('mock_results'));
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  static saveMockTestResults(results: MockTestResult[]): void {
    try {
      localStorage.setItem(StorageService.getKey('mock_results'), JSON.stringify(results));
    } catch (e) {
      console.error('Failed to save test results', e);
    }
  }

  static getUserPdfs(): UserPdfDocument[] {
    try {
      const saved = localStorage.getItem(StorageService.getKey('user_pdfs'));
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  static saveUserPdfs(pdfs: UserPdfDocument[]): void {
    try {
      localStorage.setItem(StorageService.getKey('user_pdfs'), JSON.stringify(pdfs));
    } catch (e) {
      console.error('Failed to save user PDFs', e);
    }
  }

  static getFormulas(): FormulaItem[] {
    try {
      const saved = localStorage.getItem(StorageService.getKey('formulas'));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_FORMULAS.length) {
          return parsed;
        }
      }
      return INITIAL_FORMULAS;
    } catch {
      return INITIAL_FORMULAS;
    }
  }

  static saveFormulas(formulas: FormulaItem[]): void {
    try {
      localStorage.setItem(StorageService.getKey('formulas'), JSON.stringify(formulas));
    } catch (e) {
      console.error('Failed to save formulas', e);
    }
  }

  static getFlashcards(): FlashcardItem[] {
    try {
      const saved = localStorage.getItem(StorageService.getKey('flashcards'));
      return saved ? JSON.parse(saved) : INITIAL_FLASHCARDS;
    } catch {
      return INITIAL_FLASHCARDS;
    }
  }

  static saveFlashcards(cards: FlashcardItem[]): void {
    try {
      localStorage.setItem(StorageService.getKey('flashcards'), JSON.stringify(cards));
    } catch (e) {
      console.error('Failed to save flashcards', e);
    }
  }

  static getNotes(): NoteItem[] {
    try {
      const saved = localStorage.getItem(StorageService.getKey('notes'));
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  }

  static saveNotes(notes: NoteItem[]): void {
    try {
      localStorage.setItem(StorageService.getKey('notes'), JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes', e);
    }
  }

  static getAudioTracks(): AudioTrack[] {
    return INITIAL_AUDIO_TRACKS;
  }

  static getSpotifyPlaylists(): SpotifyPlaylist[] {
    try {
      const saved = localStorage.getItem(StorageService.getKey('spotify_playlists'));
      return saved ? JSON.parse(saved) : INITIAL_SPOTIFY_PLAYLISTS;
    } catch {
      return INITIAL_SPOTIFY_PLAYLISTS;
    }
  }

  static saveSpotifyPlaylists(playlists: SpotifyPlaylist[]): void {
    try {
      localStorage.setItem(StorageService.getKey('spotify_playlists'), JSON.stringify(playlists));
    } catch (e) {
      console.error('Failed to save Spotify playlists', e);
    }
  }

  static getAchievements(): AchievementItem[] {
    try {
      const saved = localStorage.getItem(StorageService.getKey('achievements'));
      return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  }

  static saveAchievements(achievements: AchievementItem[]): void {
    try {
      localStorage.setItem(StorageService.getKey('achievements'), JSON.stringify(achievements));
    } catch (e) {
      console.error('Failed to save achievements', e);
    }
  }

  static getPlannerState(): PlannerState {
    const defaultPlanner: PlannerState = {
      dailyTargetHours: 8,
      physicsHours: 2.5,
      chemistryHours: 2.5,
      mathHours: 3.0,
      biologyHours: 0,
      weeklyGoalMinutes: 2400,
      targetExam: 'JEE Main + Advanced',
      currentClass: '12th',
      backlogs: [
        {
          id: 'b-1',
          subject: 'Physics',
          title: 'Rotational Motion Dynamics',
          type: 'Lecture',
          totalCount: 8,
          completedCount: 3,
          unit: 'lectures',
        },
        {
          id: 'b-2',
          subject: 'Chemistry',
          title: 'Ionic Equilibrium',
          type: 'Lecture',
          totalCount: 6,
          completedCount: 2,
          unit: 'lectures',
        },
      ],
      limitsTarget: { total: 50, completed: 10 },
      remainingLectures: { organic: 12, inorganic: 8 },
    };

    try {
      const saved = localStorage.getItem(StorageService.getKey('planner'));
      return saved ? { ...defaultPlanner, ...JSON.parse(saved) } : defaultPlanner;
    } catch {
      return defaultPlanner;
    }
  }

  static savePlannerState(planner: PlannerState): void {
    try {
      localStorage.setItem(StorageService.getKey('planner'), JSON.stringify(planner));
    } catch (e) {
      console.error('Failed to save planner', e);
    }
  }

  static exportAllData(): string {
    const data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('nexora_')) {
        data[k] = localStorage.getItem(k);
      }
    }
    return JSON.stringify(data, null, 2);
  }

  static importAllData(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      Object.keys(parsed).forEach((k) => {
        if (k.startsWith('nexora_')) {
          localStorage.setItem(k, parsed[k]);
        }
      });
      return true;
    } catch {
      return false;
    }
  }

  static resetToDefault(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('nexora_')) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  }

  static getPyqs(): PYQQuestion[] {
    try {
      const saved = localStorage.getItem('nexora_global_pyqs');
      if (saved) {
        const parsed: PYQQuestion[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge initial default PYQs with imported PYQs to prevent duplicates
          const initialIds = new Set(INITIAL_PYQS.map(q => q.id));
          const uniqueSaved = parsed.filter(q => !initialIds.has(q.id));
          return [...INITIAL_PYQS, ...uniqueSaved];
        }
      }
      return INITIAL_PYQS;
    } catch {
      return INITIAL_PYQS;
    }
  }

  static savePyqs(pyqs: PYQQuestion[]): void {
    try {
      localStorage.setItem('nexora_global_pyqs', JSON.stringify(pyqs));
    } catch (e) {
      console.error('Failed to save PYQs', e);
    }
  }

  static getSavedPyqIds(): string[] {
    try {
      const saved = localStorage.getItem(StorageService.getKey('saved_pyqs'));
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  static saveSavedPyqIds(ids: string[]): void {
    try {
      localStorage.setItem(StorageService.getKey('saved_pyqs'), JSON.stringify(ids));
    } catch (e) {
      console.error('Failed to save bookmarked PYQ IDs', e);
    }
  }

  static getExamAnalytics(exam: 'JEE Main' | 'JEE Advanced' | 'NEET'): {
    attempted: number;
    correct: number;
    incorrect: number;
    totalTimeSeconds: number;
    chapterStats: Record<string, { attempted: number; correct: number }>;
    yearStats: Record<number, { attempted: number; correct: number }>;
  } {
    const defaultStats = {
      attempted: 0,
      correct: 0,
      incorrect: 0,
      totalTimeSeconds: 0,
      chapterStats: {},
      yearStats: {},
    };
    try {
      const saved = localStorage.getItem(StorageService.getKey(`exam_analytics_${exam}`));
      return saved ? { ...defaultStats, ...JSON.parse(saved) } : defaultStats;
    } catch {
      return defaultStats;
    }
  }

  static recordPyqAttempt(
    exam: 'JEE Main' | 'JEE Advanced' | 'NEET',
    chapter: string,
    year: number,
    isCorrect: boolean,
    timeTakenSeconds: number
  ): void {
    const stats = StorageService.getExamAnalytics(exam);
    stats.attempted += 1;
    if (isCorrect) stats.correct += 1;
    else stats.incorrect += 1;
    stats.totalTimeSeconds += timeTakenSeconds;

    if (!stats.chapterStats[chapter]) {
      stats.chapterStats[chapter] = { attempted: 0, correct: 0 };
    }
    stats.chapterStats[chapter].attempted += 1;
    if (isCorrect) stats.chapterStats[chapter].correct += 1;

    if (!stats.yearStats[year]) {
      stats.yearStats[year] = { attempted: 0, correct: 0 };
    }
    stats.yearStats[year].attempted += 1;
    if (isCorrect) stats.yearStats[year].correct += 1;

    try {
      localStorage.setItem(StorageService.getKey(`exam_analytics_${exam}`), JSON.stringify(stats));
    } catch (e) {
      console.error(`Failed to save analytics for ${exam}`, e);
    }
  }

  static getReferenceResources(): ReferenceResource[] {
    return INITIAL_RESOURCES;
  }

  static getVirtualSpaces(): VirtualSpaceEnvironment[] {
    try {
      const saved = localStorage.getItem(StorageService.getKey('virtual_spaces'));
      if (saved) {
        const parsed: VirtualSpaceEnvironment[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return INITIAL_VIRTUAL_SPACES;
    } catch {
      return INITIAL_VIRTUAL_SPACES;
    }
  }

  static saveVirtualSpaces(spaces: VirtualSpaceEnvironment[]): void {
    try {
      localStorage.setItem(StorageService.getKey('virtual_spaces'), JSON.stringify(spaces));
    } catch (e) {
      console.error('Failed to save virtual spaces', e);
    }
  }

  static getRecentSpaceIds(): string[] {
    try {
      const saved = localStorage.getItem(StorageService.getKey('recent_spaces'));
      return saved ? JSON.parse(saved) : ['space-rainy', 'space-midnight', 'space-cafe'];
    } catch {
      return ['space-rainy', 'space-midnight', 'space-cafe'];
    }
  }

  static addRecentSpaceId(spaceId: string): void {
    try {
      const recents = StorageService.getRecentSpaceIds().filter((id) => id !== spaceId);
      recents.unshift(spaceId);
      const trimmed = recents.slice(0, 5);
      localStorage.setItem(StorageService.getKey('recent_spaces'), JSON.stringify(trimmed));
    } catch (e) {
      console.error('Failed to save recent space', e);
    }
  }

  static getDefaultWidgets(): WidgetConfig[] {
    return [
      { id: 'timer', title: 'Focus Timer', visible: true, x: 62, y: 12, width: 340, height: 380 },
      { id: 'todo', title: 'To-Do Tasks', visible: true, x: 4, y: 12, width: 320, height: 400 },
      { id: 'music', title: 'Spotify Music', visible: true, x: 62, y: 62, width: 340, height: 210 },
      { id: 'clock', title: 'Desk Clock', visible: true, x: 38, y: 4, width: 260, height: 110 },
      { id: 'notes', title: 'Quick Notes', visible: false, x: 4, y: 62, width: 300, height: 220 },
      { id: 'calendar', title: 'Study Calendar', visible: false, x: 34, y: 22, width: 320, height: 320 },
      { id: 'progress', title: "Today's Progress", visible: false, x: 34, y: 60, width: 300, height: 200 },
      { id: 'goal', title: 'Study Goal', visible: false, x: 38, y: 16, width: 280, height: 120 },
    ];
  }

  static getRoomWorkspace(spaceId: string, defaultSoundsList?: Array<{ soundId: string; volume: number }>): RoomWorkspaceState {
    const defaultSoundMap: Record<string, number> = {};
    if (defaultSoundsList) {
      defaultSoundsList.forEach((s) => {
        defaultSoundMap[s.soundId] = s.volume;
      });
    }

    const defaultState: RoomWorkspaceState = {
      spaceId,
      widgets: StorageService.getDefaultWidgets(),
      lightingMode: 'auto',
      weatherEffect: 'none',
      weatherIntensity: 'medium',
      bgOpacity: 0.9,
      activeSubject: 'Physics',
      activeTopic: 'Electrostatics',
      ambientSoundVolumes: defaultSoundMap,
      isAmbientMuted: false,
    };

    try {
      const saved = localStorage.getItem(StorageService.getKey(`room_workspace_${spaceId}`));
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultState,
          ...parsed,
          widgets: Array.isArray(parsed.widgets) && parsed.widgets.length > 0 ? parsed.widgets : defaultState.widgets,
          ambientSoundVolumes: { ...defaultSoundMap, ...parsed.ambientSoundVolumes },
        };
      }
      return defaultState;
    } catch {
      return defaultState;
    }
  }

  static saveRoomWorkspace(spaceId: string, state: RoomWorkspaceState): void {
    try {
      localStorage.setItem(StorageService.getKey(`room_workspace_${spaceId}`), JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save room workspace', e);
    }
  }
}

