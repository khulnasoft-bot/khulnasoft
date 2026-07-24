import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Workflow, 
  Activity, 
  RotateCcw, 
  Zap,
  Info,
  CheckCircle2
} from 'lucide-react';
import { useFeatureFlags } from '../context/FeatureFlagsContext';

interface FeatureFlagsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeatureFlagsDrawer: React.FC<FeatureFlagsDrawerProps> = ({ isOpen, onClose }) => {
  const { flags, toggleFlag, setAllFlags, resetToDefaults } = useFeatureFlags();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = ['all', 'AI / LLM', 'Security & eBPF', 'GitOps & Infra', 'Observability'];

  const filteredFlags = flags.filter(
    (f) => selectedCategory === 'all' || f.category === selectedCategory
  );

  const activeCount = flags.filter((f) => f.enabled).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex justify-end">
      <div 
        id="feature-flags-drawer-panel"
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div>
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-extrabold text-slate-100">Enterprise Feature Flags</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Runtime provider context: toggle experimental features live without redeploying.
            </p>
          </div>

          <button
            id="btn-close-flags-drawer"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls & Category Filter */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">
              Active: <strong className="text-cyan-400">{activeCount}</strong> / {flags.length}
            </span>
            <div className="flex items-center space-x-2">
              <button
                id="btn-enable-all-flags"
                onClick={() => setAllFlags(true)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold cursor-pointer"
              >
                Enable All
              </button>
              <button
                id="btn-disable-all-flags"
                onClick={() => setAllFlags(false)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-[11px] cursor-pointer"
              >
                Disable All
              </button>
              <button
                id="btn-reset-flags"
                onClick={resetToDefaults}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 cursor-pointer"
                title="Reset to Defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex space-x-1 overflow-x-auto text-xs pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all capitalize shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Flags List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredFlags.map((flag) => {
            return (
              <div
                key={flag.id}
                id={`flag-card-${flag.id}`}
                className={`p-4 rounded-xl border transition-all ${
                  flag.enabled
                    ? 'bg-slate-950/80 border-cyan-500/50 shadow-md shadow-cyan-950/20'
                    : 'bg-slate-950/40 border-slate-800 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-100">{flag.name}</span>
                      {flag.experimental && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/80">
                          EXP
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{flag.description}</p>
                    <div className="text-[10px] font-mono text-cyan-400 mt-1 uppercase">
                      Category: {flag.category}
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    id={`toggle-${flag.id}`}
                    onClick={() => toggleFlag(flag.id)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      flag.enabled ? 'bg-cyan-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                        flag.enabled ? 'translate-x-6 bg-slate-950' : 'translate-x-1 bg-slate-400'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-center text-[11px] text-slate-500 font-mono">
          Changes take effect instantly across all application views in real-time.
        </div>
      </div>
    </div>
  );
};
