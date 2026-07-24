import React, { useState } from 'react';
import { 
  Sliders, 
  Cpu, 
  Gauge, 
  GitBranch, 
  GitCommit, 
  CheckCircle2, 
  RefreshCw, 
  Code2, 
  Copy, 
  Check, 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  Zap, 
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  Send,
  ExternalLink
} from 'lucide-react';

export interface HpaPolicy {
  id: string;
  name: string;
  namespace: string;
  targetDeployment: string;
  minReplicas: number;
  maxReplicas: number;
  currentReplicas: number;
  targetCpuPercent: number;
  currentCpuPercent: number;
  targetMemoryPercent: number;
  currentMemoryPercent: number;
  scaleUpWindowSeconds: number;
  scaleDownWindowSeconds: number;
  lastSyncedAt: string;
  gitCommitSha: string;
}

const INITIAL_HPAS: HpaPolicy[] = [
  {
    id: 'hpa-1',
    name: 'payment-gateway-hpa',
    namespace: 'khulnasoft-prod',
    targetDeployment: 'payment-gateway',
    minReplicas: 3,
    maxReplicas: 24,
    currentReplicas: 8,
    targetCpuPercent: 75,
    currentCpuPercent: 68,
    targetMemoryPercent: 80,
    currentMemoryPercent: 72,
    scaleUpWindowSeconds: 0,
    scaleDownWindowSeconds: 300,
    lastSyncedAt: '2026-07-24 07:45 UTC',
    gitCommitSha: 'a9f82c1'
  },
  {
    id: 'hpa-2',
    name: 'identity-service-hpa',
    namespace: 'khulnasoft-prod',
    targetDeployment: 'identity-service',
    minReplicas: 2,
    maxReplicas: 12,
    currentReplicas: 4,
    targetCpuPercent: 70,
    currentCpuPercent: 54,
    targetMemoryPercent: 75,
    currentMemoryPercent: 61,
    scaleUpWindowSeconds: 0,
    scaleDownWindowSeconds: 300,
    lastSyncedAt: '2026-07-23 14:10 UTC',
    gitCommitSha: 'c4e110b'
  },
  {
    id: 'hpa-3',
    name: 'telemetry-collector-hpa',
    namespace: 'khulnasoft-prod',
    targetDeployment: 'telemetry-collector',
    minReplicas: 5,
    maxReplicas: 50,
    currentReplicas: 18,
    targetCpuPercent: 80,
    currentCpuPercent: 82,
    targetMemoryPercent: 85,
    currentMemoryPercent: 78,
    scaleUpWindowSeconds: 15,
    scaleDownWindowSeconds: 600,
    lastSyncedAt: '2026-07-24 08:00 UTC',
    gitCommitSha: 'e72a91f'
  }
];

export const HpaAutoScalerManager: React.FC = () => {
  const [hpaList, setHpaList] = useState<HpaPolicy[]>(INITIAL_HPAS);
  const [selectedHpaId, setSelectedHpaId] = useState<string>(INITIAL_HPAS[0].id);
  const [isSyncingGit, setIsSyncingGit] = useState<boolean>(false);
  const [copiedYaml, setCopiedYaml] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active form state for visual editor
  const selectedHpa = hpaList.find((h) => h.id === selectedHpaId) || hpaList[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updateSelectedHpa = (field: keyof HpaPolicy, value: any) => {
    setHpaList((prev) =>
      prev.map((item) => {
        if (item.id === selectedHpaId) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleCreateNewHpa = () => {
    const newEntry: HpaPolicy = {
      id: `hpa-${Date.now()}`,
      name: `custom-app-${Date.now().toString().slice(-4)}-hpa`,
      namespace: 'khulnasoft-prod',
      targetDeployment: 'analytics-worker',
      minReplicas: 2,
      maxReplicas: 10,
      currentReplicas: 2,
      targetCpuPercent: 75,
      currentCpuPercent: 40,
      targetMemoryPercent: 80,
      currentMemoryPercent: 45,
      scaleUpWindowSeconds: 0,
      scaleDownWindowSeconds: 300,
      lastSyncedAt: 'Draft (Not Synced)',
      gitCommitSha: 'pending'
    };

    setHpaList([...hpaList, newEntry]);
    setSelectedHpaId(newEntry.id);
    showToast(`New HPA policy draft created for '${newEntry.targetDeployment}'`);
  };

  const handleSyncToGit = () => {
    setIsSyncingGit(true);
    setTimeout(() => {
      const newSha = Math.random().toString(16).substring(2, 9);
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC';

      setHpaList((prev) =>
        prev.map((item) => {
          if (item.id === selectedHpaId) {
            return {
              ...item,
              gitCommitSha: newSha,
              lastSyncedAt: timestamp
            };
          }
          return item;
        })
      );

      setIsSyncingGit(false);
      showToast(`HPA manifest committed to GitOps repo (Commit: ${newSha})!`);
    }, 1200);
  };

  const generateHpaYaml = (hpa: HpaPolicy) => {
    return `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ${hpa.name}
  namespace: ${hpa.namespace}
  labels:
    app.kubernetes.io/managed-by: khulnasoft-platform
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ${hpa.targetDeployment}
  minReplicas: ${hpa.minReplicas}
  maxReplicas: ${hpa.maxReplicas}
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: ${hpa.targetCpuPercent}
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: ${hpa.targetMemoryPercent}
  behavior:
    scaleUp:
      stabilizationWindowSeconds: ${hpa.scaleUpWindowSeconds}
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
    scaleDown:
      stabilizationWindowSeconds: ${hpa.scaleDownWindowSeconds}
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60`;
  };

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(generateHpaYaml(selectedHpa));
    setCopiedYaml(true);
    setTimeout(() => setCopiedYaml(false), 2000);
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 font-sans relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-3 px-4 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono text-xs shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold mb-1">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>Kubernetes HorizontalPodAutoscaler (HPA v2) Visual Editor</span>
            <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px]">
              GitOps Sync
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-100 flex items-center space-x-2">
            <span>Auto-scaling Policy Manager</span>
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleCreateNewHpa}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>New HPA Policy</span>
          </button>

          <button
            onClick={handleSyncToGit}
            disabled={isSyncingGit}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shadow-md shadow-cyan-500/20 disabled:opacity-50"
          >
            {isSyncingGit ? (
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <GitCommit className="w-4 h-4" />
            )}
            <span>Commit & Sync HPA to Git</span>
          </button>
        </div>
      </div>

      {/* Active HPA Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 font-mono text-xs">
        {hpaList.map((hpa) => (
          <button
            key={hpa.id}
            onClick={() => setSelectedHpaId(hpa.id)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer min-w-[200px] shrink-0 ${
              selectedHpaId === hpa.id
                ? 'bg-slate-950 border-cyan-500 ring-2 ring-cyan-500/20'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-100 text-xs truncate">{hpa.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                {hpa.currentReplicas} Pods
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Target: {hpa.targetDeployment}</div>
          </button>
        ))}
      </div>

      {/* Visual Editor & Live Manifest Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Visual Slider & Parameter Controls */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-5 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <span className="text-slate-200 font-bold flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Visual Autoscaling Policy Controls</span>
            </span>
            <span className="text-[10px] text-slate-500">Namespace: {selectedHpa.namespace}</span>
          </div>

          {/* Target Deployment Name */}
          <div className="space-y-1">
            <label className="text-slate-400 text-[10px] uppercase font-bold">Target Deployment Name</label>
            <input
              type="text"
              value={selectedHpa.targetDeployment}
              onChange={(e) => updateSelectedHpa('targetDeployment', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl p-2.5 text-slate-100 font-bold text-xs"
            />
          </div>

          {/* Replica Constraints (Min / Max Replicas) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>MIN REPLICAS</span>
                <span className="text-cyan-400 font-bold">{selectedHpa.minReplicas} Pods</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={selectedHpa.minReplicas}
                onChange={(e) => updateSelectedHpa('minReplicas', Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>MAX REPLICAS</span>
                <span className="text-indigo-400 font-bold">{selectedHpa.maxReplicas} Pods</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={selectedHpa.maxReplicas}
                onChange={(e) => updateSelectedHpa('maxReplicas', Number(e.target.value))}
                className="w-full accent-indigo-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Metric Targets (CPU / RAM Utilization Thresholds) */}
          <div className="space-y-4">
            {/* CPU Target */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-slate-200 font-bold text-xs">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Target CPU Utilization Threshold</span>
                </span>
                <span className="text-cyan-400 font-bold text-xs">{selectedHpa.targetCpuPercent}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="95"
                step="5"
                value={selectedHpa.targetCpuPercent}
                onChange={(e) => updateSelectedHpa('targetCpuPercent', Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="text-[10px] text-slate-500">
                Current Live CPU Load: <span className="text-slate-300 font-bold">{selectedHpa.currentCpuPercent}%</span>
              </div>
            </div>

            {/* RAM Target */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-slate-200 font-bold text-xs">
                  <Gauge className="w-4 h-4 text-indigo-400" />
                  <span>Target Memory (RAM) Utilization</span>
                </span>
                <span className="text-indigo-400 font-bold text-xs">{selectedHpa.targetMemoryPercent}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="95"
                step="5"
                value={selectedHpa.targetMemoryPercent}
                onChange={(e) => updateSelectedHpa('targetMemoryPercent', Number(e.target.value))}
                className="w-full accent-indigo-400 cursor-pointer"
              />
              <div className="text-[10px] text-slate-500">
                Current Live RAM Usage: <span className="text-slate-300 font-bold">{selectedHpa.currentMemoryPercent}%</span>
              </div>
            </div>
          </div>

          {/* Scaling Window Stabilization Behavior */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <label className="text-slate-400 text-[10px] uppercase font-bold">Scale Up Delay (s)</label>
              <input
                type="number"
                value={selectedHpa.scaleUpWindowSeconds}
                onChange={(e) => updateSelectedHpa('scaleUpWindowSeconds', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs font-bold"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <label className="text-slate-400 text-[10px] uppercase font-bold">Scale Down Window (s)</label>
              <input
                type="number"
                value={selectedHpa.scaleDownWindowSeconds}
                onChange={(e) => updateSelectedHpa('scaleDownWindowSeconds', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* Right: Live Generated K8s YAML & Git Status */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-200 font-bold flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Real-Time Kubernetes HPA Manifest</span>
              </span>

              <button
                onClick={handleCopyYaml}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[10px] flex items-center space-x-1 cursor-pointer transition-colors"
              >
                {copiedYaml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copiedYaml ? 'Copied' : 'Copy Manifest'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 text-[11px] overflow-x-auto leading-relaxed max-h-[360px]">
              <code>{generateHpaYaml(selectedHpa)}</code>
            </pre>
          </div>

          {/* Git Sync Status Footer */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center space-x-1.5">
                <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                <span>GitOps Repo Sync State:</span>
              </span>
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ArgoCD In-Sync</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>Last Commit SHA: <strong className="text-slate-300">{selectedHpa.gitCommitSha}</strong></span>
              <span>{selectedHpa.lastSyncedAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
