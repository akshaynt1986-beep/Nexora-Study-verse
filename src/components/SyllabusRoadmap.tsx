import React, { useState } from 'react';
import { Compass, Search, Filter, CheckCircle2, Clock, Sparkles, BookOpen, ChevronRight, Layers } from 'lucide-react';
import { SubjectType, SyllabusChapter } from '../types';

interface SyllabusRoadmapProps {
  syllabus: SyllabusChapter[];
  onUpdateSyllabus: (updated: SyllabusChapter[]) => void;
  onOpenChapterWorkspace: (chapter: SyllabusChapter) => void;
}

export const SyllabusRoadmap: React.FC<SyllabusRoadmapProps> = ({
  syllabus,
  onUpdateSyllabus,
  onOpenChapterWorkspace,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('Physics');
  const [gradeFilter, setGradeFilter] = useState<'All' | '11' | '12'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChapters = (syllabus || []).filter((ch) => {
    if (ch.subject !== selectedSubject) return false;
    if (gradeFilter !== 'All' && ch.classGrade !== gradeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ch.name.toLowerCase().includes(q);
      const matchTopic = ch.topics.some((t) => t.title.toLowerCase().includes(q));
      if (!matchName && !matchTopic) return false;
    }
    return true;
  });

  const handleStatusChange = (chapterId: string, newStatus: SyllabusChapter['status']) => {
    const updated = syllabus.map((ch) => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          status: newStatus,
          topics: ch.topics.map((t) => ({
            ...t,
            status: newStatus === 'Mastered' ? 'Mastered' : t.status,
          })),
        };
      }
      return ch;
    });
    onUpdateSyllabus(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Complete Exam Syllabus Navigator</span>
          </div>
          <h1 className="text-2xl font-black text-white">Syllabus & Roadmap Tracker</h1>
          <p className="text-xs text-slate-400">
            Track your progress chapter-by-chapter across 11th and 12th standards.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2">
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 text-xs font-bold text-white rounded-xl py-2 px-3 focus:outline-none focus:border-cyan-400"
          >
            <option value="All">All Classes (11 & 12)</option>
            <option value="11">Class 11th Only</option>
            <option value="12">Class 12th Only</option>
          </select>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        {(['Physics', 'Chemistry', 'Mathematics', 'Biology'] as SubjectType[]).map((subj) => (
          <button
            key={subj}
            onClick={() => setSelectedSubject(subj)}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
              selectedSubject === subj
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {subj}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder={`Search ${selectedSubject} chapters or topics...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none"
        />
      </div>

      {/* Chapter Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChapters.map((chapter) => (
          <div
            key={chapter.id}
            className="p-5 rounded-2xl bg-slate-950/80 border border-cyan-500/20 hover:border-cyan-400/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">
                  Class {chapter.classGrade} • {chapter.weightage} Weightage
                </span>

                <select
                  value={chapter.status}
                  onChange={(e) => handleStatusChange(chapter.id, e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 text-[10px] font-bold text-cyan-300 rounded-lg py-1 px-2 focus:outline-none"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="Learning">Learning</option>
                  <option value="Practicing">Practicing</option>
                  <option value="Revising">Revising</option>
                  <option value="Strong">Strong</option>
                  <option value="Mastered">Mastered</option>
                </select>
              </div>

              <h3 className="text-base font-extrabold text-white mb-2">{chapter.name}</h3>

              <div className="space-y-1.5 mb-4">
                {chapter.topics.map((t) => (
                  <div key={t.id} className="flex items-center gap-2 text-xs text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    <span>{t.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onOpenChapterWorkspace(chapter)}
              className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-xs font-bold text-cyan-300 flex items-center justify-center gap-2 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Open Chapter Workspace
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
