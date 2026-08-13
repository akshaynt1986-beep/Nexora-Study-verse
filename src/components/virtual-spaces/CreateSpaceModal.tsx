import React, { useState } from 'react';
import { Plus, X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { SpaceCategory, SubjectType, VirtualSpaceEnvironment, WeatherEffect } from '../../types';

interface CreateSpaceModalProps {
  onCreateSpace: (newSpace: VirtualSpaceEnvironment) => void;
  onClose: () => void;
}

export const CreateSpaceModal: React.FC<CreateSpaceModalProps> = ({
  onCreateSpace,
  onClose,
}) => {
  const [name, setName] = useState('My Custom Study Desk');
  const [category, setCategory] = useState<SpaceCategory>('Cozy');
  const [description, setDescription] = useState('My personal custom study room in NEXORA.');
  const [bgType, setBgType] = useState<'midnight-room' | 'custom'>('custom');
  const [customBgUrl, setCustomBgUrl] = useState('');
  const [academicTheme, setAcademicTheme] = useState<SubjectType>('Physics');
  const [defaultWeather, setDefaultWeather] = useState<WeatherEffect>('stars');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSpace: VirtualSpaceEnvironment = {
      id: `space-custom-${Date.now()}`,
      name: name.trim(),
      category,
      description: description.trim() || 'Custom personal study space.',
      previewGradient: 'from-purple-950 via-slate-900 to-black',
      bgType: bgType === 'custom' && customBgUrl.trim() ? 'custom' : 'midnight-room',
      customBgUrl: customBgUrl.trim() || undefined,
      defaultSounds: [
        { soundId: 'rain', volume: 0.5 },
        { soundId: 'keyboard', volume: 0.2 },
      ],
      defaultWeather,
      favorite: true,
      isCustom: true,
      academicTheme,
    };

    onCreateSpace(newSpace);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#0e0f19]/95 border border-purple-500/30 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#121324]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                <span>Create My Study Space</span>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              </h3>
              <p className="text-xs text-slate-400">Design your personalized Virtual Space</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-mono">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Space Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. JEE Advanced Physics Cell"
              className="w-full px-3 py-2 rounded-xl bg-[#101221] border border-white/10 text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SpaceCategory)}
                className="w-full px-3 py-2 rounded-xl bg-[#101221] border border-white/10 text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="Cozy">Cozy</option>
                <option value="Nature">Nature</option>
                <option value="City">City</option>
                <option value="Night">Night</option>
                <option value="Rain">Rain</option>
                <option value="Quiet">Quiet</option>
                <option value="Café">Café</option>
                <option value="Library">Library</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Subject Focus</label>
              <select
                value={academicTheme}
                onChange={(e) => setAcademicTheme(e.target.value as SubjectType)}
                className="w-full px-3 py-2 rounded-xl bg-[#101221] border border-white/10 text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Biology">Biology</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Background Wallpaper URL (Optional)</label>
            <input
              type="url"
              value={customBgUrl}
              onChange={(e) => {
                setCustomBgUrl(e.target.value);
                setBgType('custom');
              }}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 rounded-xl bg-[#101221] border border-white/10 text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Default Weather Effect</label>
            <select
              value={defaultWeather}
              onChange={(e) => setDefaultWeather(e.target.value as WeatherEffect)}
              className="w-full px-3 py-2 rounded-xl bg-[#101221] border border-white/10 text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="none">None</option>
              <option value="stars">Starlight</option>
              <option value="rain">Soft Rain</option>
              <option value="snow">Snowflakes</option>
              <option value="fireflies">Fireflies</option>
              <option value="fog">Fog</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Space</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
