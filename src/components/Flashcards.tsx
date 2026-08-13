import React, { useState } from 'react';
import {
  CheckCircle,
  Clock,
  Edit2,
  Layers,
  Plus,
  RotateCw,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { AnimeTheme, FlashcardItem, SubjectType } from '../types';
import { AudioSynthService } from '../services/audioSynth';

interface FlashcardsProps {
  theme: AnimeTheme;
  flashcards: FlashcardItem[];
  onUpdateFlashcards: (cards: FlashcardItem[]) => void;
  onCardReviewedRewards: (xp: number, coins: number) => void;
}

export const Flashcards: React.FC<FlashcardsProps> = ({
  theme,
  flashcards,
  onUpdateFlashcards,
  onCardReviewedRewards,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | 'All'>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New flashcard form
  const [subject, setSubject] = useState<SubjectType>('Chemistry');
  const [chapter, setChapter] = useState('Organic Reactions');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const filteredCards = (flashcards || []).filter(
    (c) => selectedSubject === 'All' || c.subject === selectedSubject
  );

  const activeCard = filteredCards[currentIndex] || filteredCards[0];

  const handleFlip = () => {
    AudioSynthService.playClickSound();
    setIsFlipped(!isFlipped);
  };

  const handleRateCard = (difficulty: 'easy' | 'medium' | 'hard') => {
    AudioSynthService.playXpGainSound();
    setIsFlipped(false);

    if (!activeCard) return;

    let easeDelta = 0;
    let daysToAdd = 1;

    if (difficulty === 'easy') {
      easeDelta = 0.15;
      daysToAdd = activeCard.intervalDays * 2 + 2;
    } else if (difficulty === 'medium') {
      daysToAdd = activeCard.intervalDays + 1;
    } else {
      easeDelta = -0.2;
      daysToAdd = 1;
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysToAdd);

    const updated = flashcards.map((c) =>
      c.id === activeCard.id
        ? {
            ...c,
            easeFactor: Math.max(1.3, c.easeFactor + easeDelta),
            repetitions: c.repetitions + 1,
            intervalDays: daysToAdd,
            nextReviewDate: nextDate.toISOString().split('T')[0],
          }
        : c
    );

    onUpdateFlashcards(updated);
    onCardReviewedRewards(25, 10);

    // Advance to next card
    if (filteredCards.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }
  };

  const handleCreateFlashcard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;

    const newCard: FlashcardItem = {
      id: `fc-${Date.now()}`,
      subject,
      chapter,
      front,
      back,
      easeFactor: 2.5,
      repetitions: 0,
      intervalDays: 1,
      nextReviewDate: new Date().toISOString().split('T')[0],
    };

    onUpdateFlashcards([newCard, ...flashcards]);
    setFront('');
    setBack('');
    setShowAddModal(false);
  };

  const handleDeleteCard = (id: string) => {
    AudioSynthService.playClickSound();
    const remaining = (flashcards || []).filter((c) => c.id !== id);
    onUpdateFlashcards(remaining);
    if (currentIndex >= remaining.length) {
      setCurrentIndex(Math.max(0, remaining.length - 1));
    }
  };

  return (
    <div id="flashcards-view" className="space-y-6 pb-20 md:pb-8">
      {/* Title Header */}
      <div className={`p-6 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <Layers className="w-4 h-4" />
            <span>Spaced Repetition Memory Matrix</span>
          </div>
          <h2 className={`text-2xl font-extrabold ${theme.textPrimary}`}>JEE Flashcards</h2>
          <p className="text-xs text-white/70">
            Active recall for organic mechanisms, fluid formulas, and limits shortcuts.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className={`px-5 py-2.5 rounded-xl ${theme.buttonGradient} ${theme.accentGlow} font-bold text-sm flex items-center space-x-2 shadow-lg transition-all hover:scale-105`}
        >
          <Plus className="w-4 h-4" />
          <span>New Flashcard</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
        <span className="text-xs text-white/50 font-mono">Subject:</span>
        {(['All', 'Physics', 'Chemistry', 'Maths'] as const).map((s) => (
          <button
            key={s}
            onClick={() => {
              setSelectedSubject(s);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all border ${
              selectedSubject === s
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                : 'bg-black/40 border-white/10 text-white/60 hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Interactive 3D Card Review Engine */}
      {filteredCards.length > 0 && activeCard ? (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-white/60 font-mono">
            <span>
              Card {currentIndex + 1} of {filteredCards.length}
            </span>
            <span className="text-cyan-400">{activeCard.chapter}</span>
          </div>

          {/* Flip Container */}
          <div
            onClick={handleFlip}
            className={`w-full min-h-[280px] p-8 rounded-3xl ${theme.cardBg} border ${theme.cardBorder} cursor-pointer flex flex-col justify-between shadow-2xl transition-all duration-500 hover:scale-[1.01] relative`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                {activeCard.subject}
              </span>
              <span className="text-white/40 font-mono text-[10px]">
                {isFlipped ? 'Answer View' : 'Question View (Click to Flip)'}
              </span>
            </div>

            <div className="my-6 text-center">
              <p className="text-xs text-cyan-300/60 uppercase font-mono tracking-widest mb-2">
                {isFlipped ? 'SOLUTION / BACK' : 'QUESTION / FRONT'}
              </p>
              <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed">
                {isFlipped ? activeCard.back : activeCard.front}
              </h3>
            </div>

            <div className="flex items-center justify-center space-x-2 text-xs text-white/40 font-mono">
              <RotateCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Tap to flip card</span>
            </div>
          </div>

          {/* Spaced Repetition Rating Buttons */}
          {isFlipped && (
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleRateCard('hard')}
                className="py-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex flex-col items-center justify-center transition-all hover:scale-105"
              >
                <span>Hard</span>
                <span className="text-[10px] font-normal text-rose-300/70">Review in 1d</span>
              </button>

              <button
                onClick={() => handleRateCard('medium')}
                className="py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex flex-col items-center justify-center transition-all hover:scale-105"
              >
                <span>Good</span>
                <span className="text-[10px] font-normal text-amber-300/70">
                  Review in {activeCard.intervalDays + 1}d
                </span>
              </button>

              <button
                onClick={() => handleRateCard('easy')}
                className="py-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex flex-col items-center justify-center transition-all hover:scale-105"
              >
                <span>Easy</span>
                <span className="text-[10px] font-normal text-emerald-300/70">
                  Review in {activeCard.intervalDays * 2 + 2}d
                </span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center text-white/50 border border-dashed border-white/10 rounded-2xl">
          No flashcards found for this subject. Click "New Flashcard" to create one.
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} space-y-4 shadow-2xl`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className={`text-base font-bold ${theme.textPrimary}`}>Create New Flashcard</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFlashcard} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as SubjectType)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Maths">Maths</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">Chapter</label>
                  <input
                    type="text"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    placeholder="e.g. Limits / SN1 Mechanism..."
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1">
                  Question / Front Side
                </label>
                <textarea
                  required
                  rows={3}
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                  placeholder="e.g. What is the order of stability for carbocations in SN1?"
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1">
                  Answer / Back Side
                </label>
                <textarea
                  required
                  rows={3}
                  value={back}
                  onChange={(e) => setBack(e.target.value)}
                  placeholder="e.g. 3° > 2° > 1° > Methyl due to hyperconjugation..."
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl ${theme.buttonGradient} font-bold text-xs text-white flex items-center justify-center space-x-2`}
              >
                <Plus className="w-4 h-4" />
                <span>Save Flashcard</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
