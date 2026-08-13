import React, { useEffect, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {
  FileText,
  Folder,
  Plus,
  Save,
  Search,
  Sparkles,
  Star,
  Tag,
  Trash2,
} from 'lucide-react';
import { AnimeTheme, NoteItem, SubjectType } from '../types';
import { AudioSynthService } from '../services/audioSynth';

interface NotesProps {
  theme: AnimeTheme;
  notes: NoteItem[];
  onUpdateNotes: (notes: NoteItem[]) => void;
}

export const Notes: React.FC<NotesProps> = ({ theme, notes, onUpdateNotes }) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('All');

  // Active note editor state
  const activeNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const [title, setTitle] = useState(activeNote?.title || '');
  const [folder, setFolder] = useState(activeNote?.folder || '12th Maths');
  const [subject, setSubject] = useState<SubjectType>(activeNote?.subject || 'Mathematics');
  const [content, setContent] = useState(activeNote?.content || '');
  const [isFavorite, setIsFavorite] = useState(activeNote?.isFavorite || false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('preview');

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setFolder(activeNote.folder);
      setSubject(activeNote.subject);
      setContent(activeNote.content);
      setIsFavorite(activeNote.isFavorite);
    }
  }, [selectedNoteId]);

  const handleSaveCurrentNote = () => {
    AudioSynthService.playClickSound();
    if (!activeNote) return;

    const updated = notes.map((n) =>
      n.id === activeNote.id
        ? {
            ...n,
            title,
            folder,
            subject,
            content,
            isFavorite,
            updatedAt: new Date().toISOString(),
          }
        : n
    );
    onUpdateNotes(updated);
  };

  const handleCreateNewNote = () => {
    AudioSynthService.playClickSound();
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: 'New JEE Master Note',
      folder: '12th Maths',
      subject: 'Mathematics',
      content: `# New JEE Formula & Concept Note\n\nWrite your equations in LaTeX format e.g. $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$.\n`,
      isFavorite: false,
      updatedAt: new Date().toISOString(),
      tags: ['Maths', 'JEE'],
    };
    onUpdateNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string) => {
    AudioSynthService.playClickSound();
    const remaining = (notes || []).filter((n) => n.id !== id);
    onUpdateNotes(remaining);
    if (remaining.length > 0) {
      setSelectedNoteId(remaining[0].id);
    }
  };

  // Render text containing LaTeX expressions ($...$ or $$...$$)
  const renderLaTeXContent = (rawText: string) => {
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('# ')) {
        return (
          <h1 key={idx} className="text-xl font-bold text-cyan-300 mt-3 mb-2">
            {line.replace('# ', '')}
          </h1>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-lg font-bold text-white mt-2 mb-1">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote
            key={idx}
            className="p-3 my-2 border-l-4 border-amber-400 bg-black/40 text-xs italic text-amber-200 rounded-r-lg"
          >
            {line.replace('> ', '')}
          </blockquote>
        );
      }

      // Check for LaTeX formula block $$...$$ or inline $...$
      try {
        if (line.includes('$')) {
          const parts = line.split('$');
          return (
            <p key={idx} className="text-xs text-white/90 leading-relaxed my-1">
              {parts.map((part, pIdx) => {
                if (pIdx % 2 === 1) {
                  // Render math
                  try {
                    const html = katex.renderToString(part, { throwOnError: false });
                    return (
                      <span
                        key={pIdx}
                        className="inline-block px-1 font-serif text-cyan-300"
                        dangerouslySetInnerHTML={{ __html: html }}
                      />
                    );
                  } catch {
                    return <code key={pIdx}>{part}</code>;
                  }
                }
                return part;
              })}
            </p>
          );
        }
      } catch {
        // Fallback standard text
      }

      return (
        <p key={idx} className="text-xs text-white/80 leading-relaxed my-1">
          {line}
        </p>
      );
    });
  };

  const folders = ['All', '12th Maths', '12th Chemistry', '12th Physics', '11th Revision'];

  const filteredNotes = (notes || []).filter((n) => {
    if (selectedFolder !== 'All' && n.folder !== selectedFolder) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.folder.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="notes-view" className="space-y-6 pb-20 md:pb-8">
      {/* Title Header */}
      <div className="p-6 rounded-2xl bg-[#121422]/90 border border-purple-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-purple-300 mb-1">
            <FileText className="w-4 h-4 text-purple-400" />
            <span>Digital Study Notebook</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-100">JEE & NEET Study Notes</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            LaTeX formulas, organic mechanisms, and chapter summary notes.
          </p>
        </div>

        <button
          onClick={handleCreateNewNote}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-[0_4px_15px_rgba(168,85,247,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Main Grid: Sidebar List + Editor/Preview Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Notes Navigator */}
        <div className={`p-4 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} space-y-4`}>
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search notes or LaTeX formulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Folder Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
            {folders.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFolder(f)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap transition-all border ${
                  selectedFolder === f
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                    : 'bg-black/30 border-white/10 text-white/50 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Note Items List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredNotes.map((n) => {
              const isSelected = n.id === activeNote?.id;
              return (
                <div
                  key={n.id}
                  onClick={() => setSelectedNoteId(n.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? `${theme.buttonGradient} border-cyan-400 shadow-md text-white`
                      : 'bg-black/40 border-white/10 text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono opacity-80 uppercase">{n.folder}</span>
                    {n.isFavorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                  </div>
                  <h4 className="text-xs font-bold truncate">{n.title}</h4>
                  <p className="text-[10px] opacity-60 truncate mt-1">{n.content.slice(0, 60)}...</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Note Editor / Preview */}
        {activeNote && (
          <div className={`p-5 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} lg:col-span-2 space-y-4`}>
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <div className="flex bg-black/50 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                      activeTab === 'preview' ? 'bg-cyan-500 text-white font-bold' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    LaTeX Rendered
                  </button>
                  <button
                    onClick={() => setActiveTab('editor')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                      activeTab === 'editor' ? 'bg-cyan-500 text-white font-bold' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Edit Source
                  </button>
                </div>

                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-2 rounded-xl border transition-all ${
                    isFavorite
                      ? 'bg-amber-500/20 border-amber-400 text-amber-400'
                      : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                  }`}
                  title="Toggle Favorite"
                >
                  <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveCurrentNote}
                  className={`px-4 py-1.5 rounded-xl ${theme.buttonGradient} text-xs font-bold text-white flex items-center space-x-1 shadow-md`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Note</span>
                </button>

                <button
                  onClick={() => handleDeleteNote(activeNote.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-all"
                  title="Delete Note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Note Metadata Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title..."
                className="sm:col-span-2 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-bold focus:outline-none focus:border-cyan-400"
              />
              <select
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              >
                <option value="12th Maths">12th Maths</option>
                <option value="12th Chemistry">12th Chemistry</option>
                <option value="12th Physics">12th Physics</option>
                <option value="11th Revision">11th Revision</option>
              </select>
            </div>

            {/* Editor or Preview Pane */}
            {activeTab === 'editor' ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write Markdown and LaTeX ($...$)..."
                rows={16}
                className="w-full p-4 rounded-xl bg-black/60 border border-white/10 text-xs text-cyan-100 font-mono focus:outline-none focus:border-cyan-400 leading-relaxed"
              />
            ) : (
              <div className="min-h-[380px] p-5 rounded-xl bg-black/50 border border-white/10 overflow-y-auto space-y-1">
                {renderLaTeXContent(content)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
