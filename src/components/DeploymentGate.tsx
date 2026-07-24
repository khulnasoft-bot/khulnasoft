import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  UserCheck, 
  Key, 
  History, 
  FileText, 
  ChevronRight, 
  ShieldAlert, 
  RefreshCw, 
  Plus, 
  Check, 
  X, 
  Send,
  Sparkles,
  Info
} from 'lucide-react';

export interface ApproverRole {
  id: string;
  role: 'Security Lead' | 'DevOps Lead' | 'QA Lead';
  approverName: string;
  email: string;
  status: 'approved' | 'pending' | 'rejected';
  approvedAt?: string;
  mfaMethod: 'YubiKey Hardware Key' | 'Okta Verify TOTP' | 'WebAuthn Passkey';
}

export interface DeploymentReleaseRequest {
  id: string;
  versionTag: string;
  repository: string;
  commitSha: string;
  commitMessage: string;
  author: string;
  targetCluster: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  vulnerabilityCount: string;
  requestedAt: string;
  requiredApprovals: number;
  approvers: ApproverRole[];
  status: 'pending_approval' | 'approved' | 'rejected' | 'bypassed';
}

export interface AuditLogEntry {
  id: string;
  releaseId: string;
  versionTag: string;
  repository: string;
  action: 'APPROVED' | 'REJECTED' | 'REQUESTED' | 'OVERRIDE_GRANTED';
  actor: string;
  actorRole: string;
  timestamp: string;
  targetCluster: string;
  notes: string;
}

const INITIAL_REQUEST: DeploymentReleaseRequest = {
  id: 'rel-9842',
  versionTag: 'v1.8.4-prod',
  repository: 'khulnasoft/identity-service',
  commitSha: '8f9a2b1',
  commitMessage: 'feat(auth): enable RS256 token signing key rotation & OIDC auto-refresh',
  author: 'alex.chen@khulnasoft.com',
  targetCluster: 'GKE Primary Prod Cluster (us-central1)',
  riskLevel: 'Medium',
  vulnerabilityCount: '0 Critical, 0 High',
  requestedAt: '2026-07-24 08:14 UTC',
  requiredApprovals: 3,
  approvers: [
    {
      id: 'appr-1',
      role: 'DevOps Lead',
      approverName: 'Sarah Jenkins',
      email: 'sarah.j@khulnasoft.com',
      status: 'approved',
      approvedAt: '08:16 UTC',
      mfaMethod: 'YubiKey Hardware Key'
    },
    {
      id: 'appr-2',
      role: 'QA Lead',
      approverName: 'Michael Chang',
      email: 'm.chang@khulnasoft.com',
      status: 'approved',
      approvedAt: '08:18 UTC',
      mfaMethod: 'WebAuthn Passkey'
    },
    {
      id: 'appr-3',
      role: 'Security Lead',
      approverName: 'Elena Rostova',
      email: 'elena.r@khulnasoft.com',
      status: 'pending',
      mfaMethod: 'Okta Verify TOTP'
    }
  ],
  status: 'pending_approval'
};

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-101',
    releaseId: 'rel-9842',
    versionTag: 'v1.8.4-prod',
    repository: 'khulnasoft/identity-service',
    action: 'APPROVED',
    actor: 'Michael Chang',
    actorRole: 'QA Lead',
    timestamp: '2026-07-24 08:18:02 UTC',
    targetCluster: 'GKE Primary Prod Cluster',
    notes: 'Automated E2E test suite passed (1,240 tests, 0 failures).'
  },
  {
    id: 'aud-100',
    releaseId: 'rel-9842',
    versionTag: 'v1.8.4-prod',
    repository: 'khulnasoft/identity-service',
    action: 'APPROVED',
    actor: 'Sarah Jenkins',
    actorRole: 'DevOps Lead',
    timestamp: '2026-07-24 08:16:14 UTC',
    targetCluster: 'GKE Primary Prod Cluster',
    notes: 'Canary progressive rollout configuration verified.'
  },
  {
    id: 'aud-99',
    releaseId: 'rel-9841',
    versionTag: 'v2.1.0-prod',
    repository: 'khulnasoft/payment-gateway',
    action: 'APPROVED',
    actor: 'Elena Rostova',
    actorRole: 'Security Lead',
    timestamp: '2026-07-23 16:45:10 UTC',
    targetCluster: 'EKS Staging EU-West',
    notes: 'Cosign keyless signature & SLSA Level 3 attestation verified.'
  },
  {
    id: 'aud-98',
    releaseId: 'rel-9839',
    versionTag: 'v0.9.1-beta',
    repository: 'khulnasoft/telemetry-collector',
    action: 'REJECTED',
    actor: 'Elena Rostova',
    actorRole: 'Security Lead',
    timestamp: '2026-07-22 11:20:00 UTC',
    targetCluster: 'BareMetal On-Prem DC1',
    notes: 'Rejected due to unpatched CVE-2024-21626 container breakout risk.'
  }
];

export const DeploymentGate: React.FC = () => {
  const [releaseRequest, setReleaseRequest] = useState<DeploymentReleaseRequest>(INITIAL_REQUEST);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [isMfaModalOpen, setIsMfaModalOpen] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [activeTab, setActiveTab] = useState<'request' | 'audit'>('request');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const approvedCount = releaseRequest.approvers.filter((a) => a.status === 'approved').length;
  const isFullyApproved = approvedCount === releaseRequest.requiredApprovals;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSimulateSecurityApproval = () => {
    if (mfaCode.trim().length < 4) return;

    // Approve the pending Security Lead role
    const updatedApprovers = releaseRequest.approvers.map((appr) => {
      if (appr.role === 'Security Lead') {
        return {
          ...appr,
          status: 'approved' as const,
          approvedAt: new Date().toISOString().substring(11, 19) + ' UTC'
        };
      }
      return appr;
    });

    const newApprovedCount = updatedApprovers.filter((a) => a.status === 'approved').length;
    const isNowApproved = newApprovedCount === releaseRequest.requiredApprovals;

    setReleaseRequest({
      ...releaseRequest,
      approvers: updatedApprovers,
      status: isNowApproved ? 'approved' : 'pending_approval'
    });

    // Add Audit Log entry
    const newLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      releaseId: releaseRequest.id,
      versionTag: releaseRequest.versionTag,
      repository: releaseRequest.repository,
      action: 'APPROVED',
      actor: 'Elena Rostova (You)',
      actorRole: 'Security Lead',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      targetCluster: releaseRequest.targetCluster,
      notes: 'MFA Okta TOTP hardware verification passed. Release Gate cleared for canary rollout.'
    };

    setAuditLogs([newLog, ...auditLogs]);
    setIsMfaModalOpen(false);
    setMfaCode('');
    showToast('MFA Authentication successful! Production Release Gate APPROVED.');
  };

  const handleRejectRelease = () => {
    setReleaseRequest({
      ...releaseRequest,
      status: 'rejected',
      approvers: releaseRequest.approvers.map((a) =>
        a.role === 'Security Lead' ? { ...a, status: 'rejected' as const } : a
      )
    });

    const newLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      releaseId: releaseRequest.id,
      versionTag: releaseRequest.versionTag,
      repository: releaseRequest.repository,
      action: 'REJECTED',
      actor: 'Elena Rostova (You)',
      actorRole: 'Security Lead',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      targetCluster: releaseRequest.targetCluster,
      notes: 'Manual security hold placed by Security Lead.'
    };

    setAuditLogs([newLog, ...auditLogs]);
    showToast('Release request REJECTED and blocked in deployment gate.');
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

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold mb-1">
            <Lock className="w-4 h-4 text-rose-400" />
            <span>Multi-Factor Release Governance & Audit Control</span>
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px]">
              Zero-Trust Gate
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-100 flex items-center space-x-2">
            <span>Production Deployment Gate</span>
          </h2>
        </div>

        {/* Navigation Tab Switcher */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-xs">
          <button
            onClick={() => setActiveTab('request')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'request'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Active Request ({approvedCount}/{releaseRequest.requiredApprovals})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'audit'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Log ({auditLogs.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'request' ? (
        <div className="space-y-6">
          {/* Release Request Summary Panel */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-100 text-base">{releaseRequest.versionTag}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        releaseRequest.status === 'approved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : releaseRequest.status === 'rejected'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {releaseRequest.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-slate-400 text-xs font-mono">{releaseRequest.repository}</div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center space-x-3 font-mono text-xs">
                <div className="text-right">
                  <div className="text-slate-400 text-[10px]">Approvals Progress</div>
                  <div className="text-cyan-400 font-bold">
                    {approvedCount} of {releaseRequest.requiredApprovals} Multi-Factor Sign-offs
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-slate-800 flex items-center justify-center font-bold text-xs text-slate-200 relative">
                  <div
                    className="absolute inset-0 rounded-full border-4 border-cyan-400 transition-all"
                    style={{
                      clipPath: `inset(0 0 0 ${100 - (approvedCount / releaseRequest.requiredApprovals) * 100}%)`
                    }}
                  />
                  <span>{Math.round((approvedCount / releaseRequest.requiredApprovals) * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Request Summary Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                <div className="text-slate-500 uppercase text-[9px] font-bold">Commit SHA & Author</div>
                <div className="text-slate-200 font-bold text-xs">{releaseRequest.commitSha}</div>
                <div className="text-slate-400 text-[10px] truncate">{releaseRequest.author}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                <div className="text-slate-500 uppercase text-[9px] font-bold">Target Environment</div>
                <div className="text-cyan-300 font-bold text-xs truncate">{releaseRequest.targetCluster}</div>
                <div className="text-slate-400 text-[10px]">ArgoCD Progressive Canary</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                <div className="text-slate-500 uppercase text-[9px] font-bold">Vulnerability Audit</div>
                <div className="text-emerald-400 font-bold text-xs">{releaseRequest.vulnerabilityCount}</div>
                <div className="text-slate-400 text-[10px]">Trivy & Semgrep Gate Passed</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                <div className="text-slate-500 uppercase text-[9px] font-bold">Risk Level Rating</div>
                <div className="text-amber-300 font-bold text-xs flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{releaseRequest.riskLevel} Risk Release</span>
                </div>
                <div className="text-slate-400 text-[10px]">Requires 3-Role MFA</div>
              </div>
            </div>

            {/* Release Description / Commit Message */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono text-xs">
              <div className="text-slate-400 text-[10px] uppercase font-bold">Release Description & Changelog</div>
              <p className="text-slate-300 text-xs font-sans leading-relaxed">
                "{releaseRequest.commitMessage}"
              </p>
            </div>

            {/* Approvers Sign-off Matrix */}
            <div className="space-y-3 pt-2 font-mono text-xs">
              <div className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                Required Multi-Factor Role Sign-Offs:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {releaseRequest.approvers.map((appr) => (
                  <div
                    key={appr.id}
                    className={`p-3.5 rounded-xl border transition-all space-y-2 ${
                      appr.status === 'approved'
                        ? 'bg-slate-900 border-emerald-800/60'
                        : 'bg-slate-900/80 border-amber-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100">{appr.role}</span>
                      {appr.status === 'approved' ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-bold flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Signed</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[9px] font-bold flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Pending</span>
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-300">{appr.approverName}</div>
                    <div className="text-[10px] text-slate-500">{appr.email}</div>

                    <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                      <span>MFA: {appr.mfaMethod}</span>
                      {appr.approvedAt && <span className="text-emerald-400 font-bold">{appr.approvedAt}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gate Action Buttons */}
            <div className="pt-3 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400 font-mono">
                {isFullyApproved ? (
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>All multi-factor sign-offs collected. Ready for automated canary rollout.</span>
                  </span>
                ) : (
                  <span>Awaiting final Security Lead TOTP sign-off before canary dispatch.</span>
                )}
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto shrink-0 font-mono text-xs">
                {releaseRequest.status === 'pending_approval' && (
                  <>
                    <button
                      onClick={handleRejectRelease}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-300 border border-slate-700 hover:border-rose-800 font-bold transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>Reject Release</span>
                    </button>

                    <button
                      onClick={() => setIsMfaModalOpen(true)}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black transition-all cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center space-x-1.5"
                    >
                      <Key className="w-4 h-4" />
                      <span>Authenticate & Approve Gate (MFA)</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Audit History Log Table */
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <div className="flex items-center space-x-2 text-slate-200 font-bold text-sm">
              <History className="w-4 h-4 text-cyan-400" />
              <span>Immutable Governance & Approval Audit Trail</span>
            </div>
            <span className="text-[10px] text-slate-500">Encrypted Log Store</span>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all space-y-1.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        log.action === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="font-bold text-slate-100">{log.versionTag}</span>
                    <span className="text-slate-400 text-[10px]">({log.repository})</span>
                  </div>

                  <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-300 text-[11px]">
                  <div>
                    <span className="text-cyan-300 font-bold">{log.actor}</span> ({log.actorRole}) →{' '}
                    <span className="text-slate-400">{log.targetCluster}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-sans italic bg-slate-950 p-2 rounded-lg border border-slate-800/50">
                  "{log.notes}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MFA Step-Up Authentication Modal */}
      {isMfaModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-cyan-400 font-mono font-bold text-sm">
                <Key className="w-5 h-5" />
                <span>Security Lead MFA Approval Step-Up</span>
              </div>
              <button
                onClick={() => setIsMfaModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Role Identity</div>
                <div className="text-slate-200 font-bold">Elena Rostova (Security Lead)</div>
                <div className="text-slate-500 text-[10px]">elena.r@khulnasoft.com</div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 text-[11px] font-bold">Enter Okta Verify TOTP Code / Security Key Passcode:</label>
                <input
                  type="text"
                  placeholder="e.g. 892 104"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl p-2.5 text-center text-slate-100 font-bold text-lg tracking-widest"
                  autoFocus
                />
                <div className="text-[10px] text-slate-500 text-center">Simulated code: enter any 6 digits (e.g. 123456)</div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 font-sans">
                <button
                  type="button"
                  onClick={() => setIsMfaModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSimulateSecurityApproval}
                  disabled={mfaCode.trim().length < 4}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 disabled:opacity-40 cursor-pointer"
                >
                  Confirm Sign-Off
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
