import React, { useEffect, useState } from 'react';
import {
  AchievementItem,
  AudioTrack,
  FlashcardItem,
  FormulaItem,
  MistakeEntry,
  NoteItem,
  NexoraTheme,
  PlannerState,
  RevisionItem,
  SpotifyPlaylist,
  StudySessionLog,
  SyllabusChapter,
  TaskItem,
  ThemeId,
  UserAccount,
  UserStats,
} from './types';
import { NEXORA_THEMES } from './data/themes';
import { StorageService } from './services/storage';
import { AuthService } from './services/authService';

import { ParticleBackground } from './components/ParticleBackground';
import { Sidebar, TabId } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SyllabusRoadmap } from './components/SyllabusRoadmap';
import { ChapterWorkspace } from './components/ChapterWorkspace';
import { PyqEngine } from './components/PyqEngine';
import { MockTestEngine } from './components/MockTestEngine';
import { MistakeBook } from './components/MistakeBook';
import { SpacedRepetition } from './components/SpacedRepetition';
import { ResourceLibrary } from './components/ResourceLibrary';
import { SmartPlanner } from './components/SmartPlanner';
import { StudyTimer } from './components/StudyTimer';
import { TodoManager } from './components/TodoManager';
import { Notes } from './components/Notes';
import { Flashcards } from './components/Flashcards';
import { FormulaBook } from './components/FormulaBook';
import { MusicPlayer } from './components/MusicPlayer';
import { VirtualSpacesDashboard } from './components/virtual-spaces/VirtualSpacesDashboard';
import { SpotifyMiniPlayer } from './components/SpotifyMiniPlayer';
import { Analytics } from './components/Analytics';
import { StudyCalendar } from './components/StudyCalendar';
import { Achievements } from './components/Achievements';
import { ProfileTargets } from './components/ProfileTargets';
import { Settings } from './components/Settings';
import { AdminPortal } from './components/AdminPortal';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { OnboardingWizard } from './components/OnboardingWizard';
import { Menu, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Authentication & Session
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(AuthService.getCurrentAccount());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  // App State initialized from StorageService for active user
  const [themeId, setThemeId] = useState<ThemeId>(StorageService.getTheme());
  const [userStats, setUserStats] = useState<UserStats>(StorageService.getUserStats());
  const [syllabus, setSyllabus] = useState<SyllabusChapter[]>(StorageService.getSyllabus());
  const [plannerState, setPlannerState] = useState<PlannerState>(StorageService.getPlannerState());
  const [tasks, setTasks] = useState<TaskItem[]>(StorageService.getTasks());
  const [mistakes, setMistakes] = useState<MistakeEntry[]>(StorageService.getMistakes());
  const [revisions, setRevisions] = useState<RevisionItem[]>(StorageService.getRevisions());
  const [formulas, setFormulas] = useState<FormulaItem[]>(StorageService.getFormulas());
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>(StorageService.getFlashcards());
  const [notes, setNotes] = useState<NoteItem[]>(StorageService.getNotes());
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>(StorageService.getAudioTracks());
  const [spotifyPlaylists, setSpotifyPlaylists] = useState<SpotifyPlaylist[]>(StorageService.getSpotifyPlaylists());
  const [achievements, setAchievements] = useState<AchievementItem[]>(StorageService.getAchievements());

  const [selectedChapterWorkspace, setSelectedChapterWorkspace] = useState<SyllabusChapter | null>(null);

  const activeTheme: NexoraTheme = NEXORA_THEMES[themeId] || NEXORA_THEMES['shadow-core'];

  // Sync session & data whenever user switches or updates
  const reloadUserData = () => {
    setUserStats(StorageService.getUserStats());
    setSyllabus(StorageService.getSyllabus());
    setPlannerState(StorageService.getPlannerState());
    setTasks(StorageService.getTasks());
    setMistakes(StorageService.getMistakes());
    setRevisions(StorageService.getRevisions());
    setFormulas(StorageService.getFormulas());
    setFlashcards(StorageService.getFlashcards());
    setNotes(StorageService.getNotes());
    setSpotifyPlaylists(StorageService.getSpotifyPlaylists());
    setAchievements(StorageService.getAchievements());
  };

  useEffect(() => {
    StorageService.setTheme(themeId);
  }, [themeId]);

  useEffect(() => {
    if (currentUser) {
      StorageService.saveUserStats(userStats);
    }
  }, [userStats, currentUser]);

  useEffect(() => {
    if (currentUser) {
      StorageService.saveSyllabus(syllabus);
    }
  }, [syllabus, currentUser]);

  useEffect(() => {
    if (currentUser) {
      StorageService.savePlannerState(plannerState);
    }
  }, [plannerState, currentUser]);

  useEffect(() => {
    if (currentUser) {
      StorageService.saveTasks(tasks);
    }
  }, [tasks, currentUser]);

  useEffect(() => {
    if (currentUser) {
      StorageService.saveMistakes(mistakes);
    }
  }, [mistakes, currentUser]);

  useEffect(() => {
    if (currentUser) {
      StorageService.saveRevisions(revisions);
    }
  }, [revisions, currentUser]);

  useEffect(() => {
    if (currentUser) {
      StorageService.saveFormulas(formulas);
    }
  }, [formulas, currentUser]);

  useEffect(() => {
    if (currentUser) {
      StorageService.saveFlashcards(flashcards);
    }
  }, [flashcards, currentUser]);

  useEffect(() => {
    if (currentUser) {
      StorageService.saveNotes(notes);
    }
  }, [notes, currentUser]);

  useEffect(() => {
    if (currentUser) {
      StorageService.saveSpotifyPlaylists(spotifyPlaylists);
    }
  }, [spotifyPlaylists, currentUser]);

  useEffect(() => {
    if (currentUser) {
      StorageService.saveAchievements(achievements);
    }
  }, [achievements, currentUser]);

  // Award XP and Coins helper
  const awardXpAndCoins = (xpAmount: number, coinsAmount: number) => {
    setUserStats((prev) => {
      const newXp = prev.xp + xpAmount;
      const newCoins = prev.coins + coinsAmount;
      const maxXp = prev.level * 500;
      let newLevel = prev.level;
      let newRank = prev.rankTitle;

      if (newXp >= maxXp) {
        newLevel += 1;
        if (newLevel >= 25) newRank = 'Rank SSS';
        else if (newLevel >= 20) newRank = 'Rank SS';
        else if (newLevel >= 15) newRank = 'Rank S';
        else if (newLevel >= 12) newRank = 'Rank A';
        else if (newLevel >= 8) newRank = 'Rank B';
        else if (newLevel >= 5) newRank = 'Rank C';
        else if (newLevel >= 3) newRank = 'Rank D';
      }

      return {
        ...prev,
        xp: newXp,
        coins: newCoins,
        level: newLevel,
        rankTitle: newRank as any,
      };
    });
  };

  const handleStudySessionComplete = (log: StudySessionLog) => {
    awardXpAndCoins(log.xpEarned, log.coinsEarned);

    const todayStr = new Date().toISOString().split('T')[0];
    setUserStats((prev) => {
      const updatedHeatmap = { ...prev.heatmapData };
      updatedHeatmap[todayStr] = (updatedHeatmap[todayStr] || 0) + log.durationMinutes;

      const newFocusTotal = prev.totalFocusMinutes + log.durationMinutes;
      const newTodayHours = Math.round((prev.dailyStudyHoursToday + log.durationMinutes / 60) * 10) / 10;

      return {
        ...prev,
        totalFocusMinutes: newFocusTotal,
        dailyStudyHoursToday: newTodayHours,
        heatmapData: updatedHeatmap,
      };
    });
  };

  const handleUnlockThemeWithCoins = (unlockedThemeId: ThemeId, cost: number) => {
    if (userStats.coins >= cost) {
      setUserStats((prev) => ({
        ...prev,
        coins: prev.coins - cost,
        unlockedThemes: [...prev.unlockedThemes, unlockedThemeId],
      }));
      setThemeId(unlockedThemeId);
    }
  };

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        if (nextCompleted) {
          awardXpAndCoins(t.xpReward, 10);
        }
        return { ...t, completed: nextCompleted };
      }
      return t;
    });
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  const handleAddTask = (title: string, subject: any) => {
    const newTask: TaskItem = {
      id: 'task_' + Date.now(),
      title,
      subject: subject || 'Physics',
      completed: false,
      priority: 'A-Rank',
      category: 'Question Practice',
      deadline: new Date().toISOString().split('T')[0],
      xpReward: 50,
      coinReward: 10,
      estimatedMinutes: 25,
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  const handleAuthSuccess = (account: UserAccount) => {
    setCurrentUser(account);
    setAuthModalOpen(false);
    reloadUserData();
  };

  const handleOnboardingComplete = (updatedAcc: UserAccount) => {
    setCurrentUser(updatedAcc);
    reloadUserData();
  };

  // If no user is authenticated, render the high-converting LandingPage
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500 selection:text-slate-950">
        <LandingPage
          onStartSignUp={() => {
            setAuthMode('signup');
            setAuthModalOpen(true);
          }}
          onStartLogin={() => {
            setAuthMode('login');
            setAuthModalOpen(true);
          }}
          onEnterDemoMode={() => {
            // Enter demo account session
            const demoAccount =
              AuthService.login('demo@nexora.ai', 'demo123') ||
              AuthService.signUp('Demo Aspirant', 'demo@nexora.ai', 'demo123', 'JEE', 2026);
            handleAuthSuccess(demoAccount);
          }}
        />

        {authModalOpen && (
          <AuthModal
            mode={authMode}
            onClose={() => setAuthModalOpen(false)}
            onSuccess={handleAuthSuccess}
            onSwitchMode={(mode) => setAuthMode(mode)}
          />
        )}
      </div>
    );
  }

  // If user is registered but not onboarded, show Onboarding Wizard
  if (!currentUser.isOnboarded) {
    return (
      <div className="min-h-screen bg-slate-950 text-white font-sans flex items-center justify-center p-4">
        <OnboardingWizard user={currentUser} onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  // MAIN NEXORA OS WORKSPACE
  return (
    <div className={`min-h-screen bg-gradient-to-br ${activeTheme.bgGradient} text-slate-100 flex flex-col lg:flex-row relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950 font-sans`}>
      {/* Background Particle Effects */}
      <ParticleBackground theme={activeTheme} />

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={currentUser}
        stats={userStats}
        onLogout={handleLogout}
        isOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Mobile Header Bar */}
        <header className="lg:hidden p-4 bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 rounded-xl bg-slate-900 text-cyan-400 border border-cyan-500/30"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
              NEXORA OS
            </span>
          </div>

          <div className="text-xs font-black text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/30">
            Lvl {userStats.level}
          </div>
        </header>

        {/* Tab Content Display */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 z-10 max-w-7xl mx-auto w-full min-w-0 space-y-6">
          {activeTab === 'dashboard' && (
            <Dashboard
              theme={activeTheme}
              user={currentUser}
              stats={userStats}
              planner={plannerState}
              setActiveTab={setActiveTab}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'roadmap' && (
            <SyllabusRoadmap
              syllabus={syllabus}
              onUpdateSyllabus={setSyllabus}
              onOpenChapterWorkspace={(ch) => setSelectedChapterWorkspace(ch)}
            />
          )}

          {activeTab === 'pyqs' && (
            <PyqEngine
              theme={activeTheme}
              user={currentUser}
              userStats={userStats}
              onUpdateStats={setUserStats}
              onAddMistake={(m) => {
                const newM: MistakeEntry = {
                  ...m,
                  id: 'mst_' + Date.now(),
                };
                const updated = [newM, ...mistakes];
                setMistakes(updated);
                StorageService.saveMistakes(updated);
              }}
            />
          )}

          {activeTab === 'mock-tests' && (
            <MockTestEngine
              theme={activeTheme}
              userStats={userStats}
              onUpdateStats={setUserStats}
              onAddMistake={(m) => {
                const newM: MistakeEntry = {
                  ...m,
                  id: 'mst_' + Date.now(),
                };
                const updated = [newM, ...mistakes];
                setMistakes(updated);
                StorageService.saveMistakes(updated);
              }}
            />
          )}

          {activeTab === 'mistake-book' && (
            <MistakeBook
              theme={activeTheme}
              mistakes={mistakes}
              onUpdateMistakes={setMistakes}
            />
          )}

          {activeTab === 'revision' && (
            <SpacedRepetition
              theme={activeTheme}
              revisions={revisions}
              onUpdateRevisions={setRevisions}
              onRewardXpCoins={awardXpAndCoins}
            />
          )}

          {activeTab === 'resource-library' && <ResourceLibrary theme={activeTheme} />}

          {activeTab === 'notes' && (
            <Notes
              theme={activeTheme}
              notes={notes}
              onUpdateNotes={setNotes}
            />
          )}

          {activeTab === 'formula-vault' && (
            <FormulaBook
              theme={activeTheme}
              formulas={formulas}
              mistakes={mistakes}
              onUpdateFormulas={setFormulas}
            />
          )}

          {activeTab === 'flashcards' && (
            <Flashcards
              theme={activeTheme}
              flashcards={flashcards}
              onUpdateFlashcards={setFlashcards}
              onCardReviewedRewards={(xp, coins) => awardXpAndCoins(xp, coins)}
            />
          )}

          {activeTab === 'planner' && (
            <SmartPlanner
              theme={activeTheme}
              plannerState={plannerState}
              onUpdatePlanner={setPlannerState}
              userStats={userStats}
              tasks={tasks}
              mistakes={mistakes}
              user={currentUser}
            />
          )}

          {activeTab === 'virtual-spaces' && (
            <VirtualSpacesDashboard
              theme={activeTheme}
              userStats={userStats}
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              spotifyPlaylists={spotifyPlaylists}
              onSessionComplete={handleStudySessionComplete}
              plannerState={plannerState}
            />
          )}

          {activeTab === 'music' && (
            <MusicPlayer
              theme={activeTheme}
              spotifyPlaylists={spotifyPlaylists}
              onUpdateSpotifyPlaylists={setSpotifyPlaylists}
              tracks={audioTracks}
              onUpdateTracks={setAudioTracks}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'focus' && (
            <div className="space-y-6">
              <StudyTimer
                theme={activeTheme}
                userStats={userStats}
                onSessionComplete={handleStudySessionComplete}
                spotifyPlaylists={spotifyPlaylists}
                onNavigateTab={setActiveTab}
              />
              <MusicPlayer
                theme={activeTheme}
                spotifyPlaylists={spotifyPlaylists}
                onUpdateSpotifyPlaylists={setSpotifyPlaylists}
                tracks={audioTracks}
                onUpdateTracks={setAudioTracks}
                onNavigateTab={setActiveTab}
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <Analytics
              theme={activeTheme}
              userStats={userStats}
            />
          )}

          {activeTab === 'calendar' && (
            <StudyCalendar theme={activeTheme} user={currentUser} />
          )}

          {activeTab === 'achievements' && (
            <Achievements
              theme={activeTheme}
              userStats={userStats}
              achievements={achievements}
              onClaimAchievement={(id, xp, coins) => {
                const updated = achievements.map((a) => (a.id === id ? { ...a, unlocked: true } : a));
                setAchievements(updated);
                awardXpAndCoins(xp, coins);
              }}
              onUnlockThemeWithCoins={handleUnlockThemeWithCoins}
              onSelectTheme={setThemeId}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileTargets
              theme={activeTheme}
              user={currentUser}
              stats={userStats}
              onUpdateAccount={(acc) => setCurrentUser(acc)}
            />
          )}

          {activeTab === 'settings' && (
            <Settings
              theme={activeTheme}
              userStats={userStats}
              onSelectTheme={setThemeId}
              onReloadAllData={reloadUserData}
              onLogout={handleLogout}
            />
          )}

          {activeTab === 'admin' && (
            <AdminPortal theme={activeTheme} />
          )}
        </main>
      </div>

      {/* Chapter Workspace Modal */}
      {selectedChapterWorkspace && (
        <ChapterWorkspace
          chapter={selectedChapterWorkspace}
          onClose={() => setSelectedChapterWorkspace(null)}
          onNavigateToTab={(tab) => {
            setActiveTab(tab);
            setSelectedChapterWorkspace(null);
          }}
        />
      )}

      {/* Persistent Spotify Mini Player */}
      <SpotifyMiniPlayer
        playlists={spotifyPlaylists}
        onNavigateTab={setActiveTab}
      />
    </div>
  );
}
