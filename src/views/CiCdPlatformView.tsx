import React, { useState } from 'react';
import { 
  Workflow, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Play, 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { MOCK_CICD_PIPELINES } from '../data/mockData';
import { CiCdPipeline } from '../types';
import { PipelineTopologyMap } from '../components/PipelineTopologyMap';

export const CiCdPlatformView: React.FC = () => {
  const [selectedPipeline, setSelectedPipeline] = useState<CiCdPipeline>(MOCK_CICD_PIPELINES[0]);
  const [isTriggering, setIsTriggering] = useState(false);

  const handleTriggerPipeline = () => {
    setIsTriggering(true);
    setTimeout(() => {
      setIsTriggering(false);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center space-x-3">
            <Workflow className="w-6 h-6 text-emerald-400" />
            <span>CI/CD Automation Platform</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise build farm with self-hosted ephemeral Kubernetes runners, parallel test matrices, Trivy container security, and Cosign image signing.
          </p>
        </div>

        <button
          onClick={handleTriggerPipeline}
          disabled={isTriggering}
          className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
        >
          <Play className={`w-4 h-4 ${isTriggering ? 'animate-spin' : ''}`} />
          <span>{isTriggering ? 'Triggering K8s Runner...' : 'Trigger Manual Pipeline'}</span>
        </button>
      </div>

      {/* D3 Pipeline Topology Map DAG Visualizer */}
      <PipelineTopologyMap pipeline={selectedPipeline} />

      {/* Main Grid: Pipelines Left, Log Console Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Pipeline List */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
            Pipeline Executions ({MOCK_CICD_PIPELINES.length})
          </div>

          <div className="space-y-2">
            {MOCK_CICD_PIPELINES.map((pipe) => {
              const isSelected = pipe.id === selectedPipeline.id;
              return (
                <div
                  key={pipe.id}
                  onClick={() => setSelectedPipeline(pipe)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500/80 shadow-lg shadow-emerald-950/20'
                      : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">{pipe.repoName}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        pipe.status === 'success'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {pipe.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 truncate mt-1">{pipe.commitMessage}</div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-3 pt-2 border-t border-slate-800/80">
                    <span>{pipe.branch} ({pipe.commitSha})</span>
                    <span>{pipe.durationSeconds}s</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Execution Log Inspector */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-100">{selectedPipeline.pipelineName}</h2>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Repo: {selectedPipeline.repoName} • Triggered by: {selectedPipeline.triggeredBy}
                </div>
              </div>

              <div className="text-right text-xs font-mono">
                <span className="text-emerald-400 font-bold">Coverage: {selectedPipeline.coveragePercent}%</span>
              </div>
            </div>

            {/* Runner Metadata */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Runner: {selectedPipeline.runnerType}</span>
              </div>
              <span>{selectedPipeline.createdAt}</span>
            </div>

            {/* Step-by-Step Logs */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Pipeline Step Execution Logs
              </div>

              {selectedPipeline.steps.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {step.status === 'passed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                      <span className="font-bold text-slate-200">{step.name}</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">{step.durationSeconds}s</span>
                  </div>

                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80 text-[11px] text-slate-300 space-y-0.5 overflow-x-auto">
                    {step.logs.map((logLine, lIdx) => (
                      <div key={lIdx}>{logLine}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
