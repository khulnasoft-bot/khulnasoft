import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Cpu, 
  Activity, 
  Workflow, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  Terminal,
  Layers,
  RotateCcw,
  Undo2,
  FileText,
  ChevronDown,
  Sparkles,
  Zap,
  MoreVertical,
  Check,
  AlertCircle,
  HardDrive,
  Play,
  Pause,
  Sliders,
  Radio,
  ExternalLink,
  ArrowUpRight
} from 'lucide-react';
import { MOCK_K8S_CLUSTERS, MOCK_DEPLOYMENTS } from '../data/mockData';
import { KubernetesCluster, DeploymentTarget } from '../types';
import { ResourceQuotaManager } from '../components/ResourceQuotaManager';
import { QuotaAlertMonitor } from '../components/QuotaAlertMonitor';
import { ClusterHealthAudit } from '../components/ClusterHealthAudit';
import { HpaAutoScalerManager } from '../components/HpaAutoScalerManager';
import { ClusterLogsModal } from '../components/ClusterLogsModal';

export const KubernetesPlatformView: React.FC = () => {
  const [selectedCluster, setSelectedCluster] = useState(MOCK_K8S_CLUSTERS[0]);
  const [isSyncingArgo, setIsSyncingArgo] = useState(false);
  
  // Quick Actions States for Clusters
  const [activeMenuClusterId, setActiveMenuClusterId] = useState<string | null>(null);
  const [logsCluster, setLogsCluster] = useState<KubernetesCluster | null>(null);
  const [actionStatus, setActionStatus] = useState<Record<string, { type: 'restarting' | 'rolling_back' | 'success'; message: string }>>({});

  // Real-Time Deployment Metrics State
  const [deployments, setDeployments] = useState<DeploymentTarget[]>(MOCK_DEPLOYMENTS);
  const [isAutoRefreshingMetrics, setIsAutoRefreshingMetrics] = useState<boolean>(true);
  const [isFetchingMetrics, setIsFetchingMetrics] = useState<boolean>(false);
  const [lastMetricsTimestamp, setLastMetricsTimestamp] = useState<string>(new Date().toLocaleTimeString());
  const [envFilter, setEnvFilter] = useState<'all' | 'production' | 'staging'>('all');

  // Simulated Metrics Server Fetching Function
  const fetchLatestMetrics = () => {
    setIsFetchingMetrics(true);
    setTimeout(() => {
      setDeployments((prevDeps) =>
        prevDeps.map((dep) => {
          const limitCpu = dep.cpuLimitMillicores || 1000;
          const limitMem = dep.memoryLimitMB || 2048;

          // Random slight variance simulating live pod workloads
          const currentCpu = dep.cpuUsageMillicores || 500;
          const deltaCpu = (Math.random() - 0.48) * 40; // slight random drift
          const newCpu = Math.min(limitCpu, Math.max(100, Math.round(currentCpu + deltaCpu)));

          const currentMem = dep.memoryUsageMB || 1000;
          const deltaMem = (Math.random() - 0.48) * 35;
          const newMem = Math.min(limitMem, Math.max(200, Math.round(currentMem + deltaMem)));

          const cpuPct = Math.round(((newCpu / limitCpu) * 100) * 10) / 10;
          const memPct = Math.round(((newMem / limitMem) * 100) * 10) / 10;

          return {
            ...dep,
            cpuUsageMillicores: newCpu,
            cpuUsagePercent: cpuPct,
            memoryUsageMB: newMem,
            memoryUsagePercent: memPct,
            lastMetricsFetchedAt: new Date().toLocaleTimeString(),
          };
        })
      );
      setLastMetricsTimestamp(new Date().toLocaleTimeString());
      setIsFetchingMetrics(false);
    }, 400);
  };

  // Real-time interval for metrics polling
  useEffect(() => {
    if (!isAutoRefreshingMetrics) return;

    const interval = setInterval(() => {
      fetchLatestMetrics();
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoRefreshingMetrics]);

  const handleSyncArgoCD = () => {
    setIsSyncingArgo(true);
    setTimeout(() => {
      setIsSyncingArgo(false);
    }, 1200);
  };

  const handleRestartDeployments = (cluster: KubernetesCluster) => {
    setActiveMenuClusterId(null);
    setActionStatus((prev) => ({
      ...prev,
      [cluster.id]: { type: 'restarting', message: `Initiating rollout restart across pods in ${cluster.name}...` },
    }));

    setTimeout(() => {
      setActionStatus((prev) => ({
        ...prev,
        [cluster.id]: { type: 'success', message: `Deployments restarted on ${cluster.name}. All pods active & healthy.` },
      }));

      setTimeout(() => {
        setActionStatus((prev) => {
          const updated = { ...prev };
          delete updated[cluster.id];
          return updated;
        });
      }, 4000);
    }, 1500);
  };

  const handleRollback = (cluster: KubernetesCluster) => {
    setActiveMenuClusterId(null);
    setActionStatus((prev) => ({
      ...prev,
      [cluster.id]: { type: 'rolling_back', message: `Rolling back deployments in ${cluster.name} to previous revision...` },
    }));

    setTimeout(() => {
      setActionStatus((prev) => ({
        ...prev,
        [cluster.id]: { type: 'success', message: `Successfully rolled back ${cluster.name} to revision v2.3.9.` },
      }));

      setTimeout(() => {
        setActionStatus((prev) => {
          const updated = { ...prev };
          delete updated[cluster.id];
          return updated;
        });
      }, 4000);
    }, 1500);
  };

  const handleViewLogs = (cluster: KubernetesCluster) => {
    setActiveMenuClusterId(null);
    setLogsCluster(cluster);
  };

  const filteredDeployments = deployments.filter((dep) => {
    if (envFilter === 'all') return true;
    return dep.environment === envFilter;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center space-x-3">
            <Container className="w-6 h-6 text-indigo-400" />
            <span>Kubernetes & GitOps Control Plane</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multi-cluster orchestration across GKE, EKS, and Bare Metal with ArgoCD GitOps, Cilium Service Mesh, and real-time pod resource telemetry.
          </p>
        </div>

        <button
          onClick={handleSyncArgoCD}
          disabled={isSyncingArgo}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncingArgo ? 'animate-spin' : ''}`} />
          <span>{isSyncingArgo ? 'Syncing ArgoCD GitOps...' : 'ArgoCD Sync All Apps'}</span>
        </button>
      </div>

      {/* Cluster Overview Grid with Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MOCK_K8S_CLUSTERS.map((cluster) => {
          const currentAction = actionStatus[cluster.id];
          const isMenuOpen = activeMenuClusterId === cluster.id;

          return (
            <div key={cluster.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 relative">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-base text-slate-100 font-mono flex items-center space-x-2">
                    <span>{cluster.name}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{cluster.provider} ({cluster.region})</div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{cluster.gitOpsStatus}</span>
                  </span>

                  {/* QUICK ACTIONS DROPDOWN MENU */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenuClusterId(isMenuOpen ? null : cluster.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:text-cyan-300 font-mono text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <Zap className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                      <span>Quick Actions</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Popup */}
                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-30 py-1 font-mono text-xs overflow-hidden">
                        <div className="px-3 py-1.5 text-[10px] text-slate-500 uppercase font-bold border-b border-slate-900">
                          Cluster Operations
                        </div>

                        <button
                          onClick={() => handleRestartDeployments(cluster)}
                          className="w-full px-3 py-2 text-left text-slate-200 hover:bg-slate-900 hover:text-cyan-300 flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Restart Deployments</span>
                        </button>

                        <button
                          onClick={() => handleRollback(cluster)}
                          className="w-full px-3 py-2 text-left text-slate-200 hover:bg-slate-900 hover:text-amber-300 flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <Undo2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Rollback to Last</span>
                        </button>

                        <div className="border-t border-slate-900 my-1"></div>

                        <button
                          onClick={() => handleViewLogs(cluster)}
                          className="w-full px-3 py-2 text-left text-slate-200 hover:bg-slate-900 hover:text-indigo-300 flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                          <span>View Cluster Pod Logs</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Banner Feedback State */}
              {currentAction && (
                <div
                  className={`p-3 rounded-xl border font-mono text-xs flex items-center space-x-2 animate-fade-in ${
                    currentAction.type === 'success'
                      ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                      : 'bg-cyan-950/80 border-cyan-800 text-cyan-300'
                  }`}
                >
                  {currentAction.type === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                  )}
                  <span>{currentAction.message}</span>
                </div>
              )}

              {/* Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">CPU USAGE</div>
                  <div className="text-cyan-400 font-bold text-sm mt-0.5">{cluster.cpuUsagePercent}%</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">MEMORY</div>
                  <div className="text-indigo-400 font-bold text-sm mt-0.5">{cluster.memUsagePercent}%</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">NODES</div>
                  <div className="text-slate-200 font-bold text-sm mt-0.5">{cluster.nodeCount}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">ACTIVE PODS</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">{cluster.activePodsCount}</div>
                </div>
              </div>

              {/* Direct Quick Action Buttons Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs font-mono text-slate-400">
                <div className="flex items-center space-x-3">
                  <span>Mesh: <span className="text-indigo-300 font-bold">{cluster.serviceMesh}</span></span>
                  <span>HPA: <span className="text-slate-200 font-bold">{cluster.hpaRulesCount}</span></span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleRestartDeployments(cluster)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-400 text-[11px] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                    title="Restart all cluster deployments"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restart</span>
                  </button>

                  <button
                    onClick={() => handleRollback(cluster)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-400 text-[11px] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                    title="Rollback deployments to previous revision"
                  >
                    <Undo2 className="w-3 h-3" />
                    <span>Rollback</span>
                  </button>

                  <button
                    onClick={() => handleViewLogs(cluster)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-indigo-300 text-[11px] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                    title="View live stdout/stderr pod logs"
                  >
                    <Terminal className="w-3 h-3 text-indigo-400" />
                    <span>Logs</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resource Quota Management */}
      <ResourceQuotaManager />

      {/* Automated Quota Usage Alert Monitor */}
      <QuotaAlertMonitor />

      {/* Cluster Health & CIS Pre-flight Security Audit */}
      <ClusterHealthAudit />

      {/* Auto-scaling HPA Policy Manager */}
      <HpaAutoScalerManager />

      {/* Real-Time Cluster Deployments Resource Metrics Matrix */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <div className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Real-Time Deployment CPU & Memory Telemetry</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              Live Prometheus & Kubernetes metrics-server API stream displaying millicore CPU usage and memory limits per cluster deployment.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            {/* Filter */}
            <div className="flex items-center space-x-1 bg-slate-950 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setEnvFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                  envFilter === 'all' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setEnvFilter('production')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                  envFilter === 'production' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Production
              </button>
              <button
                onClick={() => setEnvFilter('staging')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                  envFilter === 'staging' ? 'bg-slate-800 text-amber-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Staging
              </button>
            </div>

            {/* Auto Stream Toggle */}
            <button
              onClick={() => setIsAutoRefreshingMetrics(!isAutoRefreshingMetrics)}
              className={`px-3 py-1.5 rounded-xl border font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                isAutoRefreshingMetrics
                  ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isAutoRefreshingMetrics ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  <span>Stream Live</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Stream Paused</span>
                </>
              )}
            </button>

            {/* Manual Fetch Button */}
            <button
              onClick={fetchLatestMetrics}
              disabled={isFetchingMetrics}
              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetchingMetrics ? 'animate-spin' : ''}`} />
              <span>Fetch Metrics</span>
            </button>
          </div>
        </div>

        {/* Deployments Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredDeployments.map((dep) => {
            const cpuPercent = dep.cpuUsagePercent || 50;
            const memPercent = dep.memoryUsagePercent || 50;

            const cpuColor = cpuPercent > 85 ? 'text-rose-400 bg-rose-500' : cpuPercent > 70 ? 'text-amber-400 bg-amber-500' : 'text-cyan-400 bg-cyan-500';
            const memColor = memPercent > 85 ? 'text-rose-400 bg-rose-500' : memPercent > 70 ? 'text-amber-400 bg-amber-500' : 'text-indigo-400 bg-indigo-500';

            return (
              <div key={dep.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4 font-mono hover:border-slate-700 transition-all shadow-md">
                {/* Card Top Info */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-100 font-mono flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <span>{dep.name}</span>
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      dep.environment === 'production' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {dep.environment}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-0.5 font-sans">
                    <span>{dep.cloudProvider} ({dep.region})</span>
                    <span className="text-[10px] text-indigo-300 font-mono">{dep.gitOpsTool}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Cluster: <span className="text-slate-300 font-bold">{dep.clusterName}</span> • Replicas: <span className="text-slate-200 font-bold">{dep.replicaCount}</span>
                  </div>
                </div>

                {/* Real-time CPU Metric Gauge */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5 text-slate-300 font-bold">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      <span>CPU Usage</span>
                    </div>
                    <div className={`font-bold ${cpuPercent > 85 ? 'text-rose-400' : cpuPercent > 70 ? 'text-amber-400' : 'text-cyan-400'}`}>
                      {cpuPercent}%
                    </div>
                  </div>

                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${cpuColor.split(' ')[1]}`}
                      style={{ width: `${Math.min(100, cpuPercent)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>Allocated: <span className="text-slate-200 font-bold">{dep.cpuUsageMillicores} mCPU</span></span>
                    <span>Limit: <span className="text-slate-400">{dep.cpuLimitMillicores} mCPU</span></span>
                  </div>
                </div>

                {/* Real-time Memory Metric Gauge */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5 text-slate-300 font-bold">
                      <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                      <span>RAM Memory</span>
                    </div>
                    <div className={`font-bold ${memPercent > 85 ? 'text-rose-400' : memPercent > 70 ? 'text-amber-400' : 'text-indigo-400'}`}>
                      {memPercent}%
                    </div>
                  </div>

                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${memColor.split(' ')[1]}`}
                      style={{ width: `${Math.min(100, memPercent)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>Used: <span className="text-slate-200 font-bold">{(dep.memoryUsageMB! / 1024).toFixed(2)} GB</span> ({dep.memoryUsageMB} MB)</span>
                    <span>Limit: <span className="text-slate-400">{(dep.memoryLimitMB! / 1024).toFixed(1)} GB</span></span>
                  </div>
                </div>

                {/* Footer Meta & Telemetry Timestamp */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px] text-slate-500">
                  <div className="flex items-center space-x-1">
                    <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span>Telemetry: {dep.lastMetricsFetchedAt || lastMetricsTimestamp}</span>
                  </div>
                  <a
                    href={dep.endpointUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center space-x-0.5"
                  >
                    <span>Endpoint</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cluster Pod Logs Terminal Modal */}
      {logsCluster && (
        <ClusterLogsModal
          cluster={logsCluster}
          onClose={() => setLogsCluster(null)}
        />
      )}
    </div>
  );
};
