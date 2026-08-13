import React, { useState } from 'react';
import {
  Settings,
  X,
  Sun,
  Moon,
  CloudRain,
  Image as ImageIcon,
  RotateCcw,
  Sliders,
  LayoutGrid,
  BookOpen,
} from 'lucide-react';
import {
  LightingMode,
  RoomWorkspaceState,
  SubjectType,
  WeatherEffect,
  WeatherIntensity,
  WidgetType,
} from '../../types';

interface CustomizeSpaceModalProps {
  workspaceState: RoomWorkspaceState;
  onUpdateWorkspace: (updater: (prev: RoomWorkspaceState) => RoomWorkspaceState) => void;
  onResetLayout: () => void;
  onClose: () => void;
  customBgUrl?: string;
  onSetCustomBgUrl: (url: string) => void;
}

export const CustomizeSpaceModal: React.FC<CustomizeSpaceModalProps> = ({
  workspaceState,
  onUpdateWorkspace,
  onResetLayout,
  onClose,
  customBgUrl = '',
  onSetCustomBgUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'atmosphere' | 'widgets' | 'background' | 'academic'>('atmosphere');
  const [bgUrlInput, setBgUrlInput] = useState(customBgUrl);

  const handleApplyBg = () => {
    onSetCustomBgUrl(bgUrlInput.trim());
  };

  const toggleWidget = (widgetId: WidgetType) => {
    onUpdateWorkspace((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => (w.id === widgetId ? { ...w, visible: !w.visible } : w)),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-[#0e0f19]/95 border border-purple-500/30 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#121324]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Customize Study Space</h3>
              <p className="text-xs text-slate-400">Personalize lighting, weather, widgets & atmosphere</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TAB HEADERS */}
        <div className="flex border-b border-white/5 bg-[#0a0b12] text-xs font-mono">
          <button
            onClick={() => setActiveTab('atmosphere')}
            className={`flex-1 py-3 border-b-2 font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'atmosphere'
                ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Atmosphere</span>
          </button>

          <button
            onClick={() => setActiveTab('widgets')}
            className={`flex-1 py-3 border-b-2 font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'widgets'
                ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Widgets</span>
          </button>

          <button
            onClick={() => setActiveTab('academic')}
            className={`flex-1 py-3 border-b-2 font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'academic'
                ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Subject Goal</span>
          </button>

          <button
            onClick={() => setActiveTab('background')}
            className={`flex-1 py-3 border-b-2 font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'background'
                ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Background</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="p-5 overflow-y-auto space-y-5 custom-scrollbar flex-1 text-xs">
          {activeTab === 'atmosphere' && (
            <div className="space-y-4">
              {/* LIGHTING MODE */}
              <div>
                <label className="text-slate-300 font-semibold block mb-2">Lighting & Time of Day</label>
                <div className="grid grid-cols-4 gap-2 font-mono">
                  {(['auto', 'morning', 'evening', 'night'] as LightingMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => onUpdateWorkspace((prev) => ({ ...prev, lightingMode: m }))}
                      className={`p-2.5 rounded-xl border text-center capitalize font-semibold transition-all ${
                        workspaceState.lightingMode === m
                          ? 'bg-purple-600 border-purple-400 text-white shadow'
                          : 'bg-[#101221] border-white/5 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* WEATHER EFFECT */}
              <div>
                <label className="text-slate-300 font-semibold block mb-2">Weather Atmosphere</label>
                <div className="grid grid-cols-3 gap-2 font-mono">
                  {(['none', 'rain', 'snow', 'fog', 'fireflies', 'stars', 'clouds'] as WeatherEffect[]).map((fx) => (
                    <button
                      key={fx}
                      onClick={() => onUpdateWorkspace((prev) => ({ ...prev, weatherEffect: fx }))}
                      className={`p-2 rounded-xl border text-center capitalize font-semibold transition-all ${
                        workspaceState.weatherEffect === fx
                          ? 'bg-purple-950/80 border-purple-500/60 text-purple-200'
                          : 'bg-[#101221] border-white/5 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {fx}
                    </button>
                  ))}
                </div>
              </div>

              {/* WEATHER INTENSITY */}
              {workspaceState.weatherEffect !== 'none' && (
                <div>
                  <label className="text-slate-300 font-semibold block mb-2">Weather Intensity</label>
                  <div className="grid grid-cols-4 gap-2 font-mono">
                    {(['off', 'low', 'medium', 'high'] as WeatherIntensity[]).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => onUpdateWorkspace((prev) => ({ ...prev, weatherIntensity: lvl }))}
                        className={`p-2 rounded-xl border text-center capitalize font-semibold transition-all ${
                          workspaceState.weatherIntensity === lvl
                            ? 'bg-purple-600 border-purple-400 text-white'
                            : 'bg-[#101221] border-white/5 text-slate-400'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'widgets' && (
            <div className="space-y-3">
              <p className="text-slate-400">Toggle active desktop productivity widgets in your space:</p>
              <div className="grid grid-cols-2 gap-2 font-mono">
                {workspaceState.widgets.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => toggleWidget(w.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between font-semibold transition-all ${
                      w.visible
                        ? 'bg-purple-950/50 border-purple-500/40 text-purple-200'
                        : 'bg-[#101221] border-white/5 text-slate-500'
                    }`}
                  >
                    <span>{w.title}</span>
                    <span className="text-xs">{w.visible ? '✓ On' : 'Off'}</span>
                  </button>
                ))}
              </div>

              <div className="pt-3 border-t border-white/5 flex justify-end">
                <button
                  onClick={onResetLayout}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Desk Layout</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="space-y-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-2">Active Subject Focus</label>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  {(['Physics', 'Chemistry', 'Mathematics', 'Biology'] as SubjectType[]).map((subj) => (
                    <button
                      key={subj}
                      onClick={() => onUpdateWorkspace((prev) => ({ ...prev, activeSubject: subj }))}
                      className={`p-3 rounded-xl border font-semibold text-left transition-all ${
                        workspaceState.activeSubject === subj
                          ? 'bg-purple-600 border-purple-400 text-white'
                          : 'bg-[#101221] border-white/5 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Target Topic / Chapter</label>
                <input
                  type="text"
                  value={workspaceState.activeTopic}
                  onChange={(e) =>
                    onUpdateWorkspace((prev) => ({ ...prev, activeTopic: e.target.value }))
                  }
                  placeholder="e.g. Electrostatics & Capacitance"
                  className="w-full px-3 py-2 rounded-xl bg-[#101221] border border-white/10 text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'background' && (
            <div className="space-y-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Custom Image URL</label>
                <p className="text-slate-400 mb-2">Paste a public wallpaper URL for your personal room background:</p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={bgUrlInput}
                    onChange={(e) => setBgUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#101221] border border-white/10 text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={handleApplyBg}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                  >
                    Set
                  </button>
                </div>
              </div>

              {customBgUrl && (
                <button
                  onClick={() => {
                    setBgUrlInput('');
                    onSetCustomBgUrl('');
                  }}
                  className="text-rose-400 hover:underline font-mono"
                >
                  Remove Custom Image & Use Default
                </button>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-[#0a0b12] border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
