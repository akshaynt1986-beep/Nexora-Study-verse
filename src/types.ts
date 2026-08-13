export type ExamType = 'JEE' | 'NEET';
export type ClassGrade = '11' | '12' | 'Dropper';
export type TargetExamType = 'JEE Main' | 'JEE Advanced' | 'NEET';
export type PrepLevel = 'Not Started' | 'Beginner' | 'Intermediate' | 'Advanced';

export type TabId =
  | 'dashboard'
  | 'syllabus'
  | 'virtual-spaces'
  | 'music'
  | 'roadmap'
  | 'study'
  | 'practice'
  | 'pyqs'
  | 'mock-tests'
  | 'mistake-book'
  | 'revision'
  | 'resource-library'
  | 'notes'
  | 'formula-vault'
  | 'flashcards'
  | 'analytics'
  | 'planner'
  | 'focus'
  | 'calendar'
  | 'achievements'
  | 'profile'
  | 'settings'
  | 'admin';

export type ThemeId =
  | 'shadow-core'
  | 'cyber-tokyo'
  | 'crimson-energy'
  | 'midnight-blue'
  | 'neon-future'
  | 'astral-night'
  | 'ocean-dream';

export type SubjectType = 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology' | 'General';
export type PriorityType = 'S-Rank' | 'A-Rank' | 'B-Rank' | 'C-Rank';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  exam: ExamType;
  classGrade: ClassGrade;
  targetYear: number;
  targetExam: TargetExamType;
  targetScoreRank: string;
  targetCollege?: string;
  dailyStudyHours: number;
  prepLevel: PrepLevel;
  weakSubjects?: string[];
  strongSubjects?: string[];
  isAdmin?: boolean;
  isOnboarded: boolean;
  createdAt: string;
}

export interface UserStats {
  xp: number;
  coins: number;
  level: number;
  rankTitle: 'Rank E' | 'Rank D' | 'Rank C' | 'Rank B' | 'Rank A' | 'Rank S' | 'Rank SS' | 'Rank SSS';
  productivityScore: number;
  totalFocusMinutes: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  dailyStudyHoursToday: number;
  questionsSolved: number;
  pyqsSolved: number;
  mockTestsCount: number;
  accuracyPercentage: number;
  chaptersCompleted: number;
  revisionCompleted: number;
  achievementsUnlocked: number;
  heatmapData: Record<string, number>; // YYYY-MM-DD -> minutes studied
  unlockedThemes: ThemeId[];
}

export type SyllabusExamType = 'JEE Main' | 'JEE Advanced' | 'NEET';

export type ChapterStatusType = 'Not Started' | 'Learning' | 'In Progress' | 'Completed' | 'Needs Revision';

export interface DetailedSubtopic {
  id: string;
  title: string;
  completed: boolean;
}

export interface DetailedTopic {
  id: string;
  title: string;
  completionPercentage: number; // 0 to 100
  status?: 'Not Started' | 'Learning' | 'In Progress' | 'Completed' | 'Needs Revision';
  subtopics?: DetailedSubtopic[];
}

export interface ChapterActivityMetrics {
  lecturesCompleted: number;
  totalLectures: number;
  dppsCompleted: number;
  totalDpps: number;
  questionsPracticed: number;
  pyqsSolved: number;
  totalPyqs: number;
  pyqAccuracy: number; // e.g. 82
  mockQuestionsAttempted: number;
  formulasRevised: boolean;
  notesCompleted: boolean;
  revisionCompleted: boolean;
}

export interface SmartChapter {
  id: string;
  exam: SyllabusExamType;
  name: string;
  subject: SubjectType;
  category?: 'Physical' | 'Organic' | 'Inorganic' | 'Botany' | 'Zoology';
  classGrade: '11' | '12';
  weightage: 'High' | 'Medium' | 'Low';
  status: ChapterStatusType;
  prerequisites?: string[]; // IDs or names of required prerequisite chapters
  prerequisiteNames?: string[];
  topics: DetailedTopic[];
  metrics: ChapterActivityMetrics;
  targetCompletionDate?: string;
  lastStudiedDate?: string;
  overallProgress: number; // 0 - 100%
  healthStatus?: 'Weak' | 'Average' | 'Strong';
}

export interface ChapterTopic {
  id: string;
  title: string;
  status: 'Not Started' | 'Learning' | 'Practicing' | 'Revising' | 'Strong' | 'Mastered';
  subtopics?: string[];
}

export interface SyllabusChapter {
  id: string;
  name: string;
  subject: SubjectType;
  category?: 'Physical' | 'Organic' | 'Inorganic' | 'Botany' | 'Zoology';
  classGrade: '11' | '12';
  weightage: 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'Learning' | 'Practicing' | 'Revising' | 'Strong' | 'Mastered';
  topics: ChapterTopic[];
  totalQuestionsCount: number;
  completedQuestionsCount: number;
}

export type QuestionType =
  | 'MCQ_SINGLE'
  | 'MCQ_MULTIPLE'
  | 'NUMERICAL'
  | 'MATCH'
  | 'ASSERTION_REASON';

export interface PYQQuestion {
  id: string;
  exam: 'JEE Main' | 'JEE Advanced' | 'NEET';
  year: number;
  session?: string;
  paper?: 'Paper 1' | 'Paper 2' | 'Full Paper';
  subject: SubjectType;
  category?: 'Physical' | 'Organic' | 'Inorganic' | 'Botany' | 'Zoology';
  chapter: string;
  topic?: string;
  questionType: QuestionType;
  questionText: string;
  options?: string[];
  correctAnswerIndex?: number | number[];
  numericalAnswer?: { min: number; max: number; exact?: number };
  numericalAnswerText?: string;
  explanation: string;
  conceptTested?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'JEE Advanced Level';
  timeLimitSeconds?: number;
  imageUrl?: string;
  source: string;
  licenseStatus: 'Official Exam Record' | 'Public Educational Resource' | 'Admin Uploaded';
  formulasUsed?: string[];
}

export interface MistakeEntry {
  id: string;
  questionId?: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  subject: SubjectType;
  chapter: string;
  topic: string;
  category: 'Conceptual' | 'Calculation' | 'Formula' | 'Silly Mistake' | 'Time Management';
  whyWrong: string;
  correctConcept: string;
  dateAdded: string;
  reviewedCount: number;
  mastered: boolean;
}

export interface RevisionItem {
  id: string;
  subject: SubjectType;
  chapter: string;
  topic: string;
  questionCount: number;
  stage: 1 | 2 | 3 | 4 | 5; // Day 1, Day 3, Day 7, Day 14, Day 30
  dueDate: string;
  lastReviewedDate?: string;
}

export interface ReferenceResource {
  id: string;
  bookName: string;
  author: string;
  subject: SubjectType;
  category: 'NCERT' | 'Standard Reference' | 'Question Bank' | 'Advanced Problem Book';
  edition?: string;
  description: string;
  officialLink: string;
  legalType: 'Official Link' | 'Public Domain / Open Resource' | 'User Uploaded';
  pdfUrl?: string;
}

export interface UserPdfDocument {
  id: string;
  title: string;
  folder: string;
  fileSize: string;
  uploadDate: string;
  tags: string[];
  isFavorite: boolean;
  contentExcerpt?: string;
}

export interface MockTest {
  id: string;
  title: string;
  mode: 'JEE Main' | 'JEE Advanced' | 'NEET' | 'Subject Test' | 'Chapter Test';
  durationMinutes: number;
  totalMarks: number;
  totalQuestions: number;
  questions: PYQQuestion[];
}

export interface MockTestResult {
  id: string;
  testId: string;
  testTitle: string;
  dateCompleted: string;
  timeTakenMinutes: number;
  score: number;
  maxScore: number;
  accuracyPercentage: number;
  attemptRatePercentage: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  negativeMarks: number;
  subjectScores: Record<string, { correct: number; incorrect: number; score: number }>;
  weakConcepts: string[];
  aiRecommendation: string;
}

export interface TaskItem {
  id: string;
  title: string;
  subject: SubjectType;
  priority: PriorityType;
  deadline?: string;
  completed: boolean;
  category: '12th Syllabus' | '11th Revision' | 'Backlog' | 'Question Practice' | 'Test Prep';
  xpReward: number;
  coinReward: number;
  isBacklog?: boolean;
  estimatedMinutes?: number;
}

export interface FormulaItem {
  id: string;
  exam?: 'JEE Main' | 'JEE Advanced' | 'Both';
  subject: SubjectType;
  category?: 'Physical' | 'Organic' | 'Inorganic' | 'General';
  chapter: string;
  subtopic?: string;
  title: string;
  latex: string;
  explanation: string;
  derivedFormulas?: string[];
  specialCases?: string[];
  keyVariables: string[];
  commonMistakes?: string;
  conditions?: string;
  units?: string;
  constants?: string;
  shortcuts?: string;
  isFavorite: boolean;
  difficulty?: 'JEE Main' | 'JEE Advanced';
  isConceptualOnly?: boolean;
}

export interface FlashcardItem {
  id: string;
  subject: SubjectType;
  chapter: string;
  front: string;
  back: string;
  easeFactor: number;
  repetitions: number;
  intervalDays: number;
  nextReviewDate: string;
}

export interface NoteItem {
  id: string;
  title: string;
  folder: string;
  content: string;
  subject: SubjectType;
  isFavorite: boolean;
  updatedAt: string;
  tags: string[];
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  genre: 'Lofi' | 'Synthwave' | 'Ambient' | 'Focus Science' | 'Custom';
  type: 'synth' | 'custom';
  synthPreset?: 'rain' | 'binaural' | 'cyber' | 'deepfocus' | 'lofiChords' | 'ocean' | 'fireplace' | 'librarySilence' | 'coffeeRain' | 'animeCafeLofi';
  audioUrl?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  xpReward: number;
  coinReward: number;
  progress: number; // 0 to 100
  unlocked: boolean;
}

export interface NexoraTheme {
  id: ThemeId;
  name: string;
  tagline: string;
  bgGradient: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  accentColor: string;
  accentGlow: string;
  buttonGradient: string;
  iconName: string;
  particles: 'shadow' | 'sparks' | 'aura' | 'cyber' | 'stars' | 'flames' | 'none';
  anime?: string;
  fontFamily?: string;
}

export type AnimeTheme = NexoraTheme;

export interface BacklogItem {
  id: string;
  subject: SubjectType;
  title: string;
  type: string;
  totalCount: number;
  completedCount: number;
  unit: string;
}

export type BacklogSubject = BacklogItem;

export interface StudySessionLog {
  id: string;
  durationMinutes: number;
  subject: SubjectType;
  topic?: string;
  mode: 'pomodoro' | 'stopwatch' | 'custom';
  xpEarned: number;
  coinsEarned: number;
  timestamp: string;
}

export interface PlannerState {
  dailyTargetHours: number;
  physicsHours: number;
  chemistryHours: number;
  mathHours: number;
  biologyHours: number;
  weeklyGoalMinutes: number;
  targetExam?: string;
  currentClass?: string;
  backlogs: BacklogItem[];
  eleventhBacklogs?: string[];
  limitsTarget: { total: number; completed: number };
  remainingLectures: { organic: number; inorganic: number };
  autoScheduleGenerated?: boolean;
  generatedSchedule?: Array<{
    timeSlot: string;
    activity: string;
    subject: SubjectType;
    category: string;
    priority?: string;
    reason?: string;
  }>;
}

export interface SpotifyPlaylist {
  id: string;
  spotifyUrl: string;
  spotifyPlaylistId: string;
  customName: string;
  favorite: boolean;
  createdAt: number;
  order: number;
}

export type SpaceCategory =
  | 'All'
  | 'Cozy'
  | 'Nature'
  | 'City'
  | 'Night'
  | 'Rain'
  | 'Quiet'
  | 'Café'
  | 'Library'
  | 'Custom';

export type WeatherEffect = 'none' | 'rain' | 'snow' | 'fog' | 'fireflies' | 'stars' | 'clouds';
export type WeatherIntensity = 'off' | 'low' | 'medium' | 'high';
export type LightingMode = 'auto' | 'morning' | 'evening' | 'night';

export interface VirtualSpaceEnvironment {
  id: string;
  name: string;
  category: SpaceCategory;
  description: string;
  previewGradient: string;
  bgType:
    | 'midnight-room'
    | 'rainy-window'
    | 'cozy-cafe'
    | 'quiet-library'
    | 'forest-cabin'
    | 'night-observatory'
    | 'night-city'
    | 'calm-beach'
    | 'mountain-cabin'
    | 'peaceful-anime'
    | 'custom';
  customBgUrl?: string;
  defaultSounds: Array<{ soundId: string; volume: number }>;
  defaultWeather: WeatherEffect;
  favorite: boolean;
  isCustom?: boolean;
  academicTheme?: SubjectType;
}

export type WidgetType = 'timer' | 'todo' | 'notes' | 'calendar' | 'progress' | 'clock' | 'music' | 'goal';

export interface WidgetConfig {
  id: WidgetType;
  title: string;
  visible: boolean;
  x: number; // pixel or % position
  y: number;
  width?: number;
  height?: number;
  isMinimized?: boolean;
}

export interface RoomWorkspaceState {
  spaceId: string;
  widgets: WidgetConfig[];
  lightingMode: LightingMode;
  weatherEffect: WeatherEffect;
  weatherIntensity: WeatherIntensity;
  bgOpacity: number; // 0.1 to 1.0
  activeSubject: SubjectType;
  activeTopic: string;
  ambientSoundVolumes: Record<string, number>; // soundId -> 0 to 1
  isAmbientMuted: boolean;
}

