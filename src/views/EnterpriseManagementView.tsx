import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Lock, 
  FileText, 
  Activity, 
  DollarSign, 
  CheckCircle2,
  PieChart,
  Terminal,
  Layers,
  FolderTree
} from 'lucide-react';
import { BusinessLayerHub } from '../components/BusinessLayerHub';
import { RecommendedPlatformArchitecture } from '../components/RecommendedPlatformArchitecture';

export const EnterpriseManagementView: React.FC = () => {
  const [subTab, setSubTab] = useState<'business' | 'architecture' | 'rbac' | 'audit'>('business');

  const auditLogs = [
    { time: '07:10:14', user: 'Aria Thorne', action: 'Approved PR #142 for core-api', ip: '10.240.0.12' },
    { time: '07:08:22', user: 'Marcus Chen', action: 'Updated Gemini AI thinking level policy', ip: '10.240.0.18' },
    { time: '07:01:05', user: 'System Bot', action: 'Cosign KMS signed OCI image ghcr.io/khulnasoft/core-api:a7b3c91', ip: '10.240.2.4' },
    { time: '06:54:11', user: 'Viktor Lindqvist', action: 'Triggered ArgoCD GitOps sync on GKE cluster', ip: '10.240.0.22' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* View Header with Sub-Tab Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center space-x-3">
            <Building2 className="w-6 h-6 text-indigo-400" />
            <span>Organization Business Layer & Platform Architecture</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Executive organization metrics, 3-tier platform architecture, suggested repository taxonomy, RBAC permissions matrix, and audit trails.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <button
            onClick={() => setSubTab('business')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              subTab === 'business'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Organization Dashboard</span>
          </button>

          <button
            onClick={() => setSubTab('architecture')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              subTab === 'architecture'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Platform Architecture</span>
          </button>

          <button
            onClick={() => setSubTab('rbac')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              subTab === 'rbac'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>RBAC Matrix</span>
          </button>

          <button
            onClick={() => setSubTab('audit')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              subTab === 'audit'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Audit Stream</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {subTab === 'business' && <BusinessLayerHub />}

      {subTab === 'architecture' && <RecommendedPlatformArchitecture />}

      {subTab === 'rbac' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Enterprise RBAC Access Matrix & Multi-Tenant Boundaries
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-slate-100 flex items-center justify-between">
                <span>Platform Engineers</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300">ADMIN</span>
              </div>
              <p className="text-slate-400 text-[11px] font-sans">Full access to K8s operator, ArgoCD GitOps, KMS Cosign signing keys, and RBAC matrix.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-slate-100 flex items-center justify-between">
                <span>Software Engineers</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">DEVELOPER</span>
              </div>
              <p className="text-slate-400 text-[11px] font-sans">Access to software catalog, PR reviews, CI/CD pipelines, and AI Engineering Assistant.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-slate-100 flex items-center justify-between">
                <span>Security Auditors</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400">AUDITOR</span>
              </div>
              <p className="text-slate-400 text-[11px] font-sans">Read-only access to Trivy CVE findings, OPA Policy compliance reports, and audit logs.</p>
            </div>
          </div>
        </div>
      )}

      {subTab === 'audit' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 font-mono text-xs">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Real-Time Security Audit Log Stream
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="flex items-start space-x-3 text-slate-300 border-b border-slate-900 pb-2">
                <span className="text-slate-500 text-[11px]">{log.time}</span>
                <span className="text-cyan-400 font-bold">{log.user}</span>
                <span className="text-slate-200">{log.action}</span>
                <span className="text-slate-500 text-[10px] ml-auto">({log.ip})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
