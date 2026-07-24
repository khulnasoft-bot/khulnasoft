import React, { useState } from 'react';
import { 
  Cpu, 
  HardDrive, 
  Layers, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Save, 
  Edit3, 
  Zap, 
  Gauge, 
  ShieldAlert, 
  RefreshCw,
  X
} from 'lucide-react';

export interface NamespaceQuota {
  id: string;
  namespace: string;
  clusterId: string;
  clusterName: string;
  cpuUsedCores: number;
  cpuLimitCores: number;
  ramUsedGiB: number;
  ramLimitGiB: number;
  storageUsedGiB: number;
  storageLimitGiB: number;
  maxPodsLimit: number;
  currentPodsCount: number;
  gpuLimit: number;
  gpuUsed: number;
  environment: 'production' | 'staging' | 'development' | 'system';
}

const INITIAL_QUOTAS: NamespaceQuota[] = [
  {
    id: 'nq-prod-core',
    namespace: 'khulnasoft-prod',
    clusterId: 'gke-us-central1',
    clusterName: 'GKE Primary Prod Cluster',
    cpuUsedCores: 28.4,
    cpuLimitCores: 32,
    ramUsedGiB: 58.2,
    ramLimitGiB: 64,
    storageUsedGiB: 420,
    storageLimitGiB: 500,
    maxPodsLimit: 120,
    currentPodsCount: 84,
    gpuLimit: 4,
    gpuUsed: 2,
    environment: 'production'
  },
  {
    id: 'nq-security-mesh',
    namespace: 'security-zero-trust',
    clusterId: 'gke-us-central1',
    clusterName: 'GKE Primary Prod Cluster',
    cpuUsedCores: 11.2,
    cpuLimitCores: 16,
    ramUsedGiB: 19.5,
    ramLimitGiB: 32,
    storageUsedGiB: 110,
    storageLimitGiB: 200,
    maxPodsLimit: 60,
    currentPodsCount: 28,
    gpuLimit: 0,
    gpuUsed: 0,
    environment: 'production'
  },
  {
    id: 'nq-staging',
    namespace: 'khulnasoft-staging',
    clusterId: 'eks-eu-west1',
    clusterName: 'EKS Staging EU-West',
    cpuUsedCores: 6.8,
    cpuLimitCores: 16,
    ramUsedGiB: 12.1,
    ramLimitGiB: 24,
    storageUsedGiB: 95,
    storageLimitGiB: 150,
    maxPodsLimit: 50,
    currentPodsCount: 19,
    gpuLimit: 2,
    gpuUsed: 0,
    environment: 'staging'
  },
  {
    id: 'nq-ml-pipelines',
    namespace: 'ml-inference-engine',
    clusterId: 'baremetal-onprem',
    clusterName: 'BareMetal On-Prem DC1',
    cpuUsedCores: 44.5,
    cpuLimitCores: 64,
    ramUsedGiB: 112.0,
    ramLimitGiB: 128,
    storageUsedGiB: 1200,
    storageLimitGiB: 2000,
    maxPodsLimit: 80,
    currentPodsCount: 42,
    gpuLimit: 16,
    gpuUsed: 12,
    environment: 'production'
  },
  {
    id: 'nq-dev-sandbox',
    namespace: 'developer-sandboxes',
    clusterId: 'eks-eu-west1',
    clusterName: 'EKS Staging EU-West',
    cpuUsedCores: 3.1,
    cpuLimitCores: 8,
    ramUsedGiB: 7.4,
    ramLimitGiB: 16,
    storageUsedGiB: 45,
    storageLimitGiB: 100,
    maxPodsLimit: 30,
    currentPodsCount: 11,
    gpuLimit: 0,
    gpuUsed: 0,
    environment: 'development'
  }
];

export const ResourceQuotaManager: React.FC = () => {
  const [quotas, setQuotas] = useState<NamespaceQuota[]>(INITIAL_QUOTAS);
  const [editingQuotaId, setEditingQuotaId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<NamespaceQuota>>({});
  const [selectedEnvFilter, setSelectedEnvFilter] = useState<string>('all');
  const [isApplyingYaml, setIsApplyingYaml] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);

  // New Quota Form state
  const [newNamespace, setNewNamespace] = useState('');
  const [newClusterName, setNewClusterName] = useState('GKE Primary Prod Cluster');
  const [newEnv, setNewEnv] = useState<'production' | 'staging' | 'development'>('production');
  const [newCpuLimit, setNewCpuLimit] = useState(16);
  const [newRamLimit, setNewRamLimit] = useState(32);
  const [newStorageLimit, setNewStorageLimit] = useState(200);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const startEditing = (quota: NamespaceQuota) => {
    setEditingQuotaId(quota.id);
    setEditForm({
      cpuLimitCores: quota.cpuLimitCores,
      ramLimitGiB: quota.ramLimitGiB,
      storageLimitGiB: quota.storageLimitGiB,
      maxPodsLimit: quota.maxPodsLimit,
      gpuLimit: quota.gpuLimit
    });
  };

  const cancelEditing = () => {
    setEditingQuotaId(null);
    setEditForm({});
  };

  const handleSaveQuota = (id: string) => {
    setIsApplyingYaml(true);
    setTimeout(() => {
      setQuotas((prev) =>
        prev.map((q) => {
          if (q.id === id) {
            return {
              ...q,
              cpuLimitCores: Number(editForm.cpuLimitCores) || q.cpuLimitCores,
              ramLimitGiB: Number(editForm.ramLimitGiB) || q.ramLimitGiB,
              storageLimitGiB: Number(editForm.storageLimitGiB) || q.storageLimitGiB,
              maxPodsLimit: Number(editForm.maxPodsLimit) || q.maxPodsLimit,
              gpuLimit: Number(editForm.gpuLimit) ?? q.gpuLimit
            };
          }
          return q;
        })
      );
      setIsApplyingYaml(false);
      setEditingQuotaId(null);
      showNotification('K8s ResourceQuota manifest successfully applied via kubectl!');
    }, 800);
  };

  const handleCreateNewQuota = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNamespace.trim()) return;

    const newEntry: NamespaceQuota = {
      id: `nq-${Date.now()}`,
      namespace: newNamespace.trim().toLowerCase(),
      clusterId: 'custom-cluster',
      clusterName: newClusterName,
      cpuUsedCores: 0.5,
      cpuLimitCores: Number(newCpuLimit),
      ramUsedGiB: 1.2,
      ramLimitGiB: Number(newRamLimit),
      storageUsedGiB: 10,
      storageLimitGiB: Number(newStorageLimit),
      maxPodsLimit: 40,
      currentPodsCount: 2,
      gpuLimit: 0,
      gpuUsed: 0,
      environment: newEnv
    };

    setQuotas([newEntry, ...quotas]);
    setIsNewModalOpen(false);
    setNewNamespace('');
    showNotification(`New ResourceQuota manifest created for namespace '${newEntry.namespace}'!`);
  };

  const filteredQuotas = selectedEnvFilter === 'all' 
    ? quotas 
    : quotas.filter((q) => q.environment === selectedEnvFilter);

  // Overall calculations
  const totalCpuLimit = quotas.reduce((acc, q) => acc + q.cpuLimitCores, 0);
  const totalCpuUsed = quotas.reduce((acc, q) => acc + q.cpuUsedCores, 0);
  const totalRamLimit = quotas.reduce((acc, q) => acc + q.ramLimitGiB, 0);
  const totalRamUsed = quotas.reduce((acc, q) => acc + q.ramUsedGiB, 0);

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 font-sans relative">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-3 px-4 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono text-xs shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs font-bold mb-1">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Kubernetes Namespace Resource Quota & LimitRanges</span>
            <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px]">
              kubectl v1.30 API
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-100 flex items-center space-x-2">
            <span>Resource Quota Limits & Allocation</span>
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          {/* Environment Filter Pills */}
          <div className="flex items-center space-x-1 font-mono text-xs bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['all', 'production', 'staging', 'development'].map((env) => (
              <button
                key={env}
                onClick={() => setSelectedEnvFilter(env)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  selectedEnvFilter === env
                    ? 'bg-indigo-600 text-white font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {env}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center space-x-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shadow-md shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Namespace Quota</span>
          </button>
        </div>
      </div>

      {/* Top Resource Aggregate Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Aggregate CPU Cores</span>
            </span>
            <span className="font-bold text-cyan-400">
              {Math.round((totalCpuUsed / totalCpuLimit) * 100)}% Allocated
            </span>
          </div>
          <div className="text-xl font-black text-slate-100">
            {totalCpuUsed.toFixed(1)} / {totalCpuLimit} <span className="text-xs text-slate-500">Cores</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-cyan-400 transition-all"
              style={{ width: `${Math.min(100, (totalCpuUsed / totalCpuLimit) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center space-x-1.5">
              <Gauge className="w-4 h-4 text-indigo-400" />
              <span>Aggregate RAM Memory</span>
            </span>
            <span className="font-bold text-indigo-400">
              {Math.round((totalRamUsed / totalRamLimit) * 100)}% Allocated
            </span>
          </div>
          <div className="text-xl font-black text-slate-100">
            {totalRamUsed.toFixed(1)} / {totalRamLimit} <span className="text-xs text-slate-500">GiB</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-indigo-500 transition-all"
              style={{ width: `${Math.min(100, (totalRamUsed / totalRamLimit) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center space-x-1.5">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>Persistent Storage</span>
            </span>
            <span className="text-emerald-400 font-bold">1,870 / 2,950 GiB</span>
          </div>
          <div className="text-xl font-black text-slate-100">63.3% Allocated</div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: '63.3%' }} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>GPU Accelerators</span>
            </span>
            <span className="text-amber-400 font-bold">14 / 22 GPUs</span>
          </div>
          <div className="text-xl font-black text-slate-100">63.6% Active</div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-amber-400 transition-all" style={{ width: '63.6%' }} />
          </div>
        </div>
      </div>

      {/* Namespace Quotas Table List */}
      <div className="space-y-3 font-mono text-xs">
        {filteredQuotas.map((q) => {
          const isEditing = editingQuotaId === q.id;
          const cpuRatio = (q.cpuUsedCores / q.cpuLimitCores) * 100;
          const ramRatio = (q.ramUsedGiB / q.ramLimitGiB) * 100;

          const isCpuWarning = cpuRatio > 85;
          const isRamWarning = ramRatio > 85;

          return (
            <div
              key={q.id}
              className={`p-4 rounded-xl bg-slate-950 border transition-all space-y-3 ${
                isEditing
                  ? 'border-cyan-500 ring-2 ring-cyan-500/20 bg-slate-900/90'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Top Row Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-2">
                <div className="flex items-center space-x-3">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-100 text-sm">{q.namespace}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          q.environment === 'production'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : q.environment === 'staging'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                        }`}
                      >
                        {q.environment}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[10px]">{q.clusterName}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {(isCpuWarning || isRamWarning) && (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Quota Limit Warning</span>
                    </span>
                  )}

                  {!isEditing ? (
                    <button
                      onClick={() => startEditing(q)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Edit Quotas</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={cancelEditing}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveQuota(q.id)}
                        disabled={isApplyingYaml}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
                      >
                        {isApplyingYaml ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                        <span>Apply K8s Manifest</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Resource Metrics & Inline Edit Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                {/* CPU Cores Control */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="flex items-center space-x-1">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      <span>CPU LIMIT</span>
                    </span>
                    <span className={cpuRatio > 85 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                      {q.cpuUsedCores} / {isEditing ? editForm.cpuLimitCores : q.cpuLimitCores} Cores ({Math.round(cpuRatio)}%)
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="space-y-1">
                      <input
                        type="number"
                        min="1"
                        max="256"
                        value={editForm.cpuLimitCores ?? q.cpuLimitCores}
                        onChange={(e) => setEditForm({ ...editForm, cpuLimitCores: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-cyan-500 rounded p-1 text-slate-100 font-bold text-xs"
                      />
                      <div className="text-[9px] text-slate-500">Unit: milliCPU / Cores</div>
                    </div>
                  ) : (
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all ${cpuRatio > 85 ? 'bg-amber-400' : 'bg-cyan-400'}`}
                        style={{ width: `${Math.min(100, cpuRatio)}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* RAM Memory Control */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="flex items-center space-x-1">
                      <Gauge className="w-3.5 h-3.5 text-indigo-400" />
                      <span>RAM LIMIT</span>
                    </span>
                    <span className={ramRatio > 85 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                      {q.ramUsedGiB} / {isEditing ? editForm.ramLimitGiB : q.ramLimitGiB} GiB ({Math.round(ramRatio)}%)
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="space-y-1">
                      <input
                        type="number"
                        min="2"
                        max="512"
                        value={editForm.ramLimitGiB ?? q.ramLimitGiB}
                        onChange={(e) => setEditForm({ ...editForm, ramLimitGiB: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-indigo-500 rounded p-1 text-slate-100 font-bold text-xs"
                      />
                      <div className="text-[9px] text-slate-500">Unit: GiB Memory</div>
                    </div>
                  ) : (
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all ${ramRatio > 85 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                        style={{ width: `${Math.min(100, ramRatio)}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Storage & Pod Limit */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>STORAGE & PODS</span>
                    <span className="text-slate-300 font-bold">
                      {q.currentPodsCount} / {isEditing ? editForm.maxPodsLimit : q.maxPodsLimit} Pods
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-1">
                      <div>
                        <div className="text-[9px] text-slate-500">Storage (GiB)</div>
                        <input
                          type="number"
                          value={editForm.storageLimitGiB ?? q.storageLimitGiB}
                          onChange={(e) => setEditForm({ ...editForm, storageLimitGiB: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-slate-100 font-bold text-xs"
                        />
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-500">Max Pods</div>
                        <input
                          type="number"
                          value={editForm.maxPodsLimit ?? q.maxPodsLimit}
                          onChange={(e) => setEditForm({ ...editForm, maxPodsLimit: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-slate-100 font-bold text-xs"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-300 text-[11px]">
                      Storage: <strong>{q.storageUsedGiB} / {q.storageLimitGiB} GiB</strong>
                    </div>
                  )}
                </div>

                {/* GPU Limit & Status */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="flex items-center space-x-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>GPU ALLOCATION</span>
                    </span>
                    <span className="text-amber-400 font-bold">
                      {q.gpuUsed} / {isEditing ? editForm.gpuLimit : q.gpuLimit} GPUs
                    </span>
                  </div>

                  {isEditing ? (
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="32"
                        value={editForm.gpuLimit ?? q.gpuLimit}
                        onChange={(e) => setEditForm({ ...editForm, gpuLimit: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-amber-500 rounded p-1 text-slate-100 font-bold text-xs"
                      />
                      <div className="text-[9px] text-slate-500">NVIDIA A100 / H100 units</div>
                    </div>
                  ) : (
                    <div className="text-slate-300 text-[11px]">
                      {q.gpuLimit > 0 ? (
                        <span className="text-amber-300 font-bold">{q.gpuLimit} GPUs Provisioned</span>
                      ) : (
                        <span className="text-slate-500 italic">No GPUs Requested</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Namespace Quota Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-cyan-400 font-mono font-bold text-sm">
                <Plus className="w-5 h-5" />
                <span>Create Kubernetes ResourceQuota</span>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewQuota} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 uppercase text-[10px] font-bold">Target Namespace Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. analytics-data-engine"
                  value={newNamespace}
                  onChange={(e) => setNewNamespace(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-2 text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 uppercase text-[10px] font-bold">Target Cluster</label>
                <select
                  value={newClusterName}
                  onChange={(e) => setNewClusterName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-100"
                >
                  <option value="GKE Primary Prod Cluster">GKE Primary Prod Cluster (us-central1)</option>
                  <option value="EKS Staging EU-West">EKS Staging EU-West (eu-west-1)</option>
                  <option value="BareMetal On-Prem DC1">BareMetal On-Prem DC1</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 uppercase text-[9px] font-bold">CPU Cores</label>
                  <input
                    type="number"
                    value={newCpuLimit}
                    onChange={(e) => setNewCpuLimit(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 uppercase text-[9px] font-bold">RAM (GiB)</label>
                  <input
                    type="number"
                    value={newRamLimit}
                    onChange={(e) => setNewRamLimit(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 uppercase text-[9px] font-bold">Storage (GiB)</label>
                  <input
                    type="number"
                    value={newStorageLimit}
                    onChange={(e) => setNewStorageLimit(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  Apply ResourceQuota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
