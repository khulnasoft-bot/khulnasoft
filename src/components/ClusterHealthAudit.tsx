import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Play, 
  Cpu, 
  Lock, 
  Zap, 
  Terminal, 
  FileCheck, 
  Layers, 
  Server, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export interface AuditFinding {
  id: string;
  category: 'Security' | 'Performance' | 'Network' | 'Control Plane';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  namespace: string;
  resource: string;
  description: string;
  remediationCommand: string;
  status: 'OPEN' | 'REMEDIATED';
}

export interface ClusterAuditResult {
  clusterId: string;
  clusterName: string;
  overallScore: number;
  lastAuditedAt: string;
  checksTotal: number;
  checksPassed: number;
  checksWarning: number;
  checksCritical: number;
  findings: AuditFinding[];
}

const INITIAL_AUDITS: Record<string, ClusterAuditResult> = {
  'gke-us-central1': {
    clusterId: 'gke-us-central1',
    clusterName: 'GKE Primary Prod Cluster (us-central1)',
    overallScore: 92,
    lastAuditedAt: '2026-07-24 08:28 UTC',
    checksTotal: 24,
    checksPassed: 21,
    checksWarning: 2,
    checksCritical: 1,
    findings: [
      {
        id: 'find-101',
        category: 'Security',
        severity: 'CRITICAL',
        title: 'Container running with privileged root securityContext',
        namespace: 'khulnasoft-prod',
        resource: 'pod/payment-gateway-worker-7d9b4',
        description: 'Pod container executes with allowPrivilegeEscalation: true and UID 0 (root), violating Pod Security Baseline standard.',
        remediationCommand: 'kubectl patch deployment payment-gateway-worker -n khulnasoft-prod --patch-file security-context.patch',
        status: 'OPEN'
      },
      {
        id: 'find-102',
        category: 'Network',
        severity: 'HIGH',
        title: 'Missing default-deny NetworkPolicy in namespace',
        namespace: 'security-zero-trust',
        resource: 'namespace/security-zero-trust',
        description: 'Ingress/Egress traffic between microservices is unconstrained due to missing default-deny CNI policy.',
        remediationCommand: 'kubectl apply -f https://khulnasoft.internal/policies/default-deny.yaml -n security-zero-trust',
        status: 'OPEN'
      },
      {
        id: 'find-103',
        category: 'Performance',
        severity: 'MEDIUM',
        title: 'Deployment missing CPU memory request limits',
        namespace: 'khulnasoft-prod',
        resource: 'deployment/telemetry-collector',
        description: 'No memory limits defined; pod is vulnerable to triggering OOMKilled events under traffic spikes.',
        remediationCommand: 'kubectl set resources deployment/telemetry-collector --limits=memory=512Mi,cpu=500m',
        status: 'OPEN'
      }
    ]
  },
  'eks-eu-west1': {
    clusterId: 'eks-eu-west1',
    clusterName: 'EKS Staging EU-West (eu-west-1)',
    overallScore: 88,
    lastAuditedAt: '2026-07-23 18:10 UTC',
    checksTotal: 24,
    checksPassed: 19,
    checksWarning: 4,
    checksCritical: 1,
    findings: [
      {
        id: 'find-201',
        category: 'Control Plane',
        severity: 'CRITICAL',
        title: 'ETCD Automated Backup Snapshot Age > 24 Hours',
        namespace: 'kube-system',
        resource: 'etcd/etcd-main-0',
        description: 'Last verified ETCD snapshot backup was taken 28 hours ago; cluster recovery RPO is compromised.',
        remediationCommand: 'kubectl exec -n kube-system etcd-main-0 -- etcdctl snapshot save /backup/etcd-now.db',
        status: 'OPEN'
      },
      {
        id: 'find-202',
        category: 'Security',
        severity: 'HIGH',
        title: 'ClusterRoleBinding grants wildcard (*) cluster-admin',
        namespace: 'kube-system',
        resource: 'clusterrolebinding/jenkins-admin-binding',
        description: 'ServiceAccount holds unrestricted cluster-admin privileges across all namespaces.',
        remediationCommand: 'kubectl apply -f https://khulnasoft.internal/rbac/jenkins-scoped-role.yaml',
        status: 'OPEN'
      }
    ]
  },
  'baremetal-onprem': {
    clusterId: 'baremetal-onprem',
    clusterName: 'BareMetal On-Prem DC1',
    overallScore: 95,
    lastAuditedAt: '2026-07-24 06:15 UTC',
    checksTotal: 24,
    checksPassed: 22,
    checksWarning: 2,
    checksCritical: 0,
    findings: [
      {
        id: 'find-301',
        category: 'Performance',
        severity: 'MEDIUM',
        title: 'Worker Node Memory Pressure Alarm (>85%)',
        namespace: 'system-node',
        resource: 'node/baremetal-node-04',
        description: 'Physical RAM usage on baremetal node 04 exceeds 86%, risking Kubelet pod eviction.',
        remediationCommand: 'kubectl cordon baremetal-node-04 && kubectl drain baremetal-node-04 --ignore-daemonsets',
        status: 'OPEN'
      }
    ]
  }
};

export const ClusterHealthAudit: React.FC = () => {
  const [selectedClusterId, setSelectedClusterId] = useState<string>('gke-us-central1');
  const [audits, setAudits] = useState<Record<string, ClusterAuditResult>>(INITIAL_AUDITS);
  const [isRunningAudit, setIsRunningAudit] = useState<boolean>(false);
  const [auditProgress, setAuditProgress] = useState<number>(0);
  const [auditStepName, setAuditStepName] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentAudit = audits[selectedClusterId] || audits['gke-us-central1'];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRunAudit = () => {
    setIsRunningAudit(true);
    setAuditProgress(10);
    setAuditStepName('1/5 Inspecting PodSecurityStandards & CIS Benchmarks...');

    const timer1 = setTimeout(() => {
      setAuditProgress(35);
      setAuditStepName('2/5 Scanning CNI NetworkPolicies & Calico ingress rules...');
    }, 600);

    const timer2 = setTimeout(() => {
      setAuditProgress(65);
      setAuditStepName('3/5 Auditing RBAC ClusterRoleBindings & SA tokens...');
    }, 1200);

    const timer3 = setTimeout(() => {
      setAuditProgress(85);
      setAuditStepName('4/5 Validating Kubelet memory pressure & ETCD backup state...');
    }, 1800);

    const timer4 = setTimeout(() => {
      setAuditProgress(100);
      setAuditStepName('5/5 Pre-flight audit complete! Generating score matrix...');

      setTimeout(() => {
        setIsRunningAudit(false);
        setAudits((prev) => ({
          ...prev,
          [selectedClusterId]: {
            ...prev[selectedClusterId],
            lastAuditedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC'
          }
        }));
        showToast(`Cluster Health Audit finished for ${currentAudit.clusterName}!`);
      }, 500);
    }, 2400);
  };

  const handleRemediate = (findingId: string) => {
    setAudits((prev) => {
      const cluster = prev[selectedClusterId];
      const updatedFindings = cluster.findings.map((f) => {
        if (f.id === findingId) {
          return { ...f, status: 'REMEDIATED' as const };
        }
        return f;
      });

      const openCriticals = updatedFindings.filter((f) => f.status === 'OPEN' && f.severity === 'CRITICAL').length;
      const openTotal = updatedFindings.filter((f) => f.status === 'OPEN').length;

      return {
        ...prev,
        [selectedClusterId]: {
          ...cluster,
          checksPassed: cluster.checksTotal - openTotal,
          checksCritical: openCriticals,
          overallScore: Math.min(100, cluster.overallScore + 4),
          findings: updatedFindings
        }
      };
    });

    showToast('Remediation patch applied! Policy check marked as PASSED.');
  };

  const filteredFindings = activeCategoryFilter === 'ALL'
    ? currentAudit.findings
    : currentAudit.findings.filter((f) => f.category.toUpperCase() === activeCategoryFilter.toUpperCase());

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 font-sans relative">
      {/* Toast Notification Banner */}
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
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Kubernetes CIS Benchmark & Pre-Flight Audit Utility</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
              K8s v1.30 Compliant
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-100 flex items-center space-x-2">
            <span>Cluster Health & Security Pre-Flight Audit</span>
          </h2>
        </div>

        {/* Controls: Cluster Switcher & Audit Run Trigger */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={selectedClusterId}
            onChange={(e) => setSelectedClusterId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono text-xs focus:border-cyan-500"
          >
            <option value="gke-us-central1">GKE Primary Prod Cluster (us-central1)</option>
            <option value="eks-eu-west1">EKS Staging EU-West (eu-west-1)</option>
            <option value="baremetal-onprem">BareMetal On-Prem DC1</option>
          </select>

          <button
            onClick={handleRunAudit}
            disabled={isRunningAudit}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shadow-md shadow-cyan-500/20 disabled:opacity-50"
          >
            {isRunningAudit ? (
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            <span>{isRunningAudit ? 'Auditing Cluster...' : 'Run Pre-Flight Audit'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar during active scanning */}
      {isRunningAudit && (
        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-800/80 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-cyan-300 font-bold">
            <span className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{auditStepName}</span>
            </span>
            <span>{auditProgress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300"
              style={{ width: `${auditProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Top Health Score & Findings Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        {/* Score Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Overall Audit Health</span>
            <span className="text-[10px] text-slate-500">Grade A</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-emerald-400">{currentAudit.overallScore}</span>
            <span className="text-slate-500 font-bold text-sm">/ 100</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Last Audited: <span className="text-slate-300 font-bold">{currentAudit.lastAuditedAt}</span>
          </div>
        </div>

        {/* Passed Checks */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Checks Passed</span>
            </span>
            <span className="text-emerald-400 font-bold">
              {Math.round((currentAudit.checksPassed / currentAudit.checksTotal) * 100)}%
            </span>
          </div>
          <div className="text-2xl font-black text-slate-100">
            {currentAudit.checksPassed} / {currentAudit.checksTotal}
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${(currentAudit.checksPassed / currentAudit.checksTotal) * 100}%` }}
            />
          </div>
        </div>

        {/* Warnings */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center space-x-1.5 text-amber-400 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Warnings</span>
            </span>
            <span className="text-amber-400 font-bold">{currentAudit.checksWarning} Issues</span>
          </div>
          <div className="text-2xl font-black text-amber-300">{currentAudit.checksWarning}</div>
          <div className="text-[10px] text-slate-400">Needs optimization or limits tuning</div>
        </div>

        {/* Critical misconfigurations */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center space-x-1.5 text-rose-400 font-bold">
              <XCircle className="w-4 h-4" />
              <span>Critical Security Blockers</span>
            </span>
            <span className="text-rose-400 font-bold">{currentAudit.checksCritical} Blocker</span>
          </div>
          <div className="text-2xl font-black text-rose-400">{currentAudit.checksCritical}</div>
          <div className="text-[10px] text-slate-400">Violates Pod Security / RBAC Policy</div>
        </div>
      </div>

      {/* Audit Findings Breakdown & Remediation Table */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
        {/* Filter Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-3">
          <div className="flex items-center space-x-2 text-slate-200 font-bold">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Audit Findings & One-Click Kubectl Remediation</span>
          </div>

          <div className="flex items-center space-x-1 text-[10px]">
            {['ALL', 'SECURITY', 'NETWORK', 'PERFORMANCE', 'CONTROL PLANE'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeCategoryFilter === cat
                    ? 'bg-cyan-500 text-slate-950 font-black'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Findings List */}
        <div className="space-y-3">
          {filteredFindings.length === 0 ? (
            <div className="p-6 text-center text-slate-500 italic">
              No audit findings reported for category '{activeCategoryFilter}'.
            </div>
          ) : (
            filteredFindings.map((finding) => {
              const isRemediated = finding.status === 'REMEDIATED';

              return (
                <div
                  key={finding.id}
                  className={`p-4 rounded-xl border transition-all space-y-3 ${
                    isRemediated
                      ? 'bg-slate-950/40 border-slate-850 opacity-60'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          finding.severity === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : finding.severity === 'HIGH'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                        }`}
                      >
                        {finding.severity}
                      </span>

                      <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 text-[10px] uppercase font-bold">
                        {finding.category}
                      </span>

                      <span className="font-bold text-slate-100 text-xs">{finding.title}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-slate-500 text-[10px]">{finding.namespace}</span>

                      {isRemediated ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Remediated</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleRemediate(finding.id)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] flex items-center space-x-1 cursor-pointer shadow-sm transition-all"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>Apply Patch</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-300 text-xs font-sans leading-relaxed">
                    {finding.description}
                  </p>

                  {/* Remediation Kubectl Snippet */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 flex items-center justify-between overflow-x-auto">
                    <div className="flex items-center space-x-2">
                      <Terminal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{finding.remediationCommand}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
