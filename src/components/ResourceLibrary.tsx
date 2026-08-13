import React, { useState } from 'react';
import {
  Library,
  BookOpen,
  FileText,
  UploadCloud,
  Search,
  ExternalLink,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Folder,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { NexoraTheme, ReferenceResource, SubjectType, UserPdfDocument } from '../types';
import { StorageService } from '../services/storage';
import { AudioSynthService } from '../services/audioSynth';

interface ResourceLibraryProps {
  theme: NexoraTheme;
}

export const ResourceLibrary: React.FC<ResourceLibraryProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'standard' | 'my-pdfs'>('standard');
  const [resources] = useState<ReferenceResource[]>(StorageService.getReferenceResources());
  const [userPdfs, setUserPdfs] = useState<UserPdfDocument[]>(StorageService.getUserPdfs());
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // AI PDF upload / note state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFolder, setUploadFolder] = useState('Physics Notes');
  const [uploadExcerpt, setUploadExcerpt] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isProcessingAi, setIsProcessingAi] = useState(false);

  const handleUploadPdf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle) return;

    const newDoc: UserPdfDocument = {
      id: 'pdf_' + Date.now(),
      title: uploadTitle,
      folder: uploadFolder,
      fileSize: '1.4 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      tags: [uploadFolder.split(' ')[0]],
      isFavorite: false,
      contentExcerpt: uploadExcerpt || 'Handwritten coaching notes & formula summary.',
    };

    const updated = [newDoc, ...userPdfs];
    setUserPdfs(updated);
    StorageService.saveUserPdfs(updated);

    setUploadTitle('');
    setUploadExcerpt('');
    setShowUploadModal(false);
    AudioSynthService.playSuccessSound();
  };

  const handleToggleFavorite = (id: string) => {
    const updated = userPdfs.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
    setUserPdfs(updated);
    StorageService.saveUserPdfs(updated);
    AudioSynthService.playClickSound();
  };

  const handleDeletePdf = (id: string) => {
    const updated = (userPdfs || []).filter((p) => p.id !== id);
    setUserPdfs(updated);
    StorageService.saveUserPdfs(updated);
  };

  const filteredResources = (resources || []).filter((r) => {
    if (subjectFilter !== 'All' && r.subject !== subjectFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        r.bookName.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl ${theme.cardBg} ${theme.cardBorder} flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden`}>
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 text-xs font-extrabold border border-cyan-500/30">
            <Library className="w-4 h-4" /> Recommended Standard Books & Personal PDF Vault
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            NEXORA Resource Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Access curated standard references (HC Verma, Irodov, MS Chouhan, NCERT) and store your own uploaded coaching notes & test solution PDFs.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => setActiveTab('standard')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all border ${
              activeTab === 'standard'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                : 'bg-slate-900 text-slate-400 border-white/10'
            }`}
          >
            Standard Books
          </button>
          <button
            onClick={() => setActiveTab('my-pdfs')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all border ${
              activeTab === 'my-pdfs'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                : 'bg-slate-900 text-slate-400 border-white/10'
            }`}
          >
            My Notes Drive
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className={`p-4 rounded-2xl ${theme.cardBg} ${theme.cardBorder} flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-xl border border-white/10 text-xs">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Subjects</option>
              <option value="Physics" className="bg-slate-900">Physics</option>
              <option value="Chemistry" className="bg-slate-900">Chemistry</option>
              <option value="Mathematics" className="bg-slate-900">Mathematics</option>
              <option value="Biology" className="bg-slate-900">Biology</option>
            </select>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search books & notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 font-medium"
          />
        </div>
      </div>

      {/* STANDARD BOOKS TAB */}
      {activeTab === 'standard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className={`p-5 rounded-2xl ${theme.cardBg} ${theme.cardBorder} space-y-4 flex flex-col justify-between transition-all hover:scale-[1.01]`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-400 font-extrabold text-[10px] uppercase border border-cyan-500/30">
                    {res.subject}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 font-bold text-[10px] border border-white/10">
                    {res.category}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black text-white">{res.bookName}</h4>
                  <div className="text-xs font-extrabold text-cyan-400 mt-0.5">By {res.author}</div>
                </div>

                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {res.description}
                </p>
              </div>

              <a
                href={res.officialLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-extrabold text-xs uppercase tracking-wider border border-cyan-500/30 hover:border-cyan-400 transition-all flex items-center justify-center gap-2"
              >
                <span>View Official Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* MY PDF NOTES DRIVE TAB */}
      {activeTab === 'my-pdfs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Folder className="w-4 h-4 text-cyan-400" /> My Personal PDF & Note Files
            </h3>

            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
            >
              <UploadCloud className="w-4 h-4" /> Upload Document
            </button>
          </div>

          {userPdfs.length === 0 ? (
            <div className={`p-12 text-center rounded-2xl ${theme.cardBg} ${theme.cardBorder} space-y-3`}>
              <UploadCloud className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-wider">
                No Personal PDFs Uploaded
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Upload your handwritten coaching notes, formula cheat sheets, or DPP solutions to keep them organized.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userPdfs.map((pdf) => (
                <div
                  key={pdf.id}
                  className={`p-5 rounded-2xl ${theme.cardBg} ${theme.cardBorder} space-y-3 flex flex-col justify-between`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 font-extrabold text-[10px] uppercase border border-indigo-500/30">
                        {pdf.folder}
                      </span>
                      <button
                        onClick={() => handleToggleFavorite(pdf.id)}
                        className={`p-1 rounded-lg border transition-all ${
                          pdf.isFavorite
                            ? 'text-amber-400 bg-amber-950/40 border-amber-500/40'
                            : 'text-slate-500 border-transparent hover:text-white'
                        }`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    <h4 className="text-sm font-black text-white">{pdf.title}</h4>
                    <p className="text-xs text-slate-300 font-medium">{pdf.contentExcerpt}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs text-slate-400">
                    <span>
                      {pdf.fileSize} • {pdf.uploadDate}
                    </span>
                    <button
                      onClick={() => handleDeletePdf(pdf.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-950 border border-cyan-500/30 rounded-3xl p-6 space-y-4 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-cyan-400" /> Upload Study Document / Notes
            </h3>

            <form onSubmit={handleUploadPdf} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. HC Verma Volume 1 Chapter 3 Solved Examples"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white font-medium outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Folder Category</label>
                <select
                  value={uploadFolder}
                  onChange={(e) => setUploadFolder(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white font-bold outline-none"
                >
                  <option value="Physics Notes">Physics Notes</option>
                  <option value="Chemistry Notes">Chemistry Notes</option>
                  <option value="Mathematics Notes">Mathematics Notes</option>
                  <option value="Biology Notes">Biology Notes</option>
                  <option value="Mock Solutions">Mock Test Solutions</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Excerpt / Summary Note</label>
                <textarea
                  rows={3}
                  placeholder="Key concepts or page numbers covered in this document..."
                  value={uploadExcerpt}
                  onChange={(e) => setUploadExcerpt(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white font-medium outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black uppercase tracking-wider"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
