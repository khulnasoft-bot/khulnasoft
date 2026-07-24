import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  FileCheck2, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { MOCK_VULNERABILITIES, MOCK_POLICIES } from '../data/mockData';
import { CommitSecurityPipeline } from '../components/CommitSecurityPipeline';

export const SecurityCenterView: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center space-x-3">
            <ShieldAlert className="w-6 h-6 text-emerald-400" />
            <span>Zero Trust Security & Policy Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated SAST/DAST scanning, secret leak prevention, Open Policy Agent (OPA) rule evaluation, and Cosign image provenance.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Security Score: 94/100</span>
        </div>
      </div>

      {/* Every Commit Security Pipeline Hub */}
      <CommitSecurityPipeline />

      {/* Policy-as-Code Rules Grid */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Enforced Open Policy Agent (OPA) Rules
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_POLICIES.map((pol) => (
            <div key={pol.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-200">{pol.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {pol.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">{pol.description}</p>
              <div className="text-[10px] text-emerald-400 font-mono pt-1 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Result: {pol.evaluationResult}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vulnerabilities & CVE Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Software Vulnerability Scan Findings (Trivy / SAST)
        </div>

        <div className="space-y-3">
          {MOCK_VULNERABILITIES.map((vuln) => (
            <div key={vuln.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-rose-300">{vuln.cveId}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                    {vuln.severity}
                  </span>
                  <span className="text-slate-400 text-xs">({vuln.repositoryName})</span>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  vuln.status === 'RESOLVED' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                }`}>
                  {vuln.status}
                </span>
              </div>

              <div className="text-slate-200 font-sans text-xs">{vuln.title}</div>
              <div className="text-slate-400 text-[11px]">Summary: {vuln.summary}</div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                <span>Package: {vuln.packageName} ({vuln.affectedVersion}) → Fixed in {vuln.fixedVersion}</span>
                <span>Discovered: {vuln.discoveredAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
