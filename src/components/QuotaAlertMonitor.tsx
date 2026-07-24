import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Mail, 
  Slack, 
  Sliders, 
  Cpu, 
  Gauge, 
  HardDrive, 
  RefreshCw, 
  History, 
  ShieldAlert, 
  Check, 
  X, 
  ExternalLink,
  Volume2,
  Zap
} from 'lucide-react';

export interface AlertNotification {
  id: string;
  timestamp: string;
  namespace: string;
  cluster: string;
  resourceType: 'CPU' | 'RAM Memory' | 'Storage' | 'Pods';
  usagePercentage: number;
  thresholdPercentage: number;
  channelSent: 'Slack' | 'Email' | 'Both';
  targetDestination: string;
  status: 'DELIVERED' | 'DISPATCHING' | 'FAILED';
}

const INITIAL_ALERTS: AlertNotification[] = [
  {
    id: 'alt-801',
    timestamp: '2026-07-24 08:25:10 UTC',
    namespace: 'khulnasoft-prod',
    cluster: 'GKE Primary Prod Cluster',
    resourceType: 'CPU',
    usagePercentage: 88.8,
    thresholdPercentage: 80,
    channelSent: 'Both',
    targetDestination: '#k8s-resource-alerts & devops-oncall@khulnasoft.com',
    status: 'DELIVERED'
  },
  {
    id: 'alt-800',
    timestamp: '2026-07-24 08:12:45 UTC',
    namespace: 'ml-inference-engine',
    cluster: 'BareMetal On-Prem DC1',
    resourceType: 'RAM Memory',
    usagePercentage: 87.5,
    thresholdPercentage: 80,
    channelSent: 'Slack',
    targetDestination: '#k8s-resource-alerts',
    status: 'DELIVERED'
  },
  {
    id: 'alt-799',
    timestamp: '2026-07-23 19:40:02 UTC',
    namespace: 'khulnasoft-prod',
    cluster: 'GKE Primary Prod Cluster',
    resourceType: 'RAM Memory',
    usagePercentage: 90.9,
    thresholdPercentage: 80,
    channelSent: 'Both',
    targetDestination: '#k8s-resource-alerts & devops-oncall@khulnasoft.com',
    status: 'DELIVERED'
  }
];

export const QuotaAlertMonitor: React.FC = () => {
  const [threshold, setThreshold] = useState<number>(80);
  const [slackChannel, setSlackChannel] = useState<string>('#k8s-resource-alerts');
  const [emailRecipients, setEmailRecipients] = useState<string>('devops-oncall@khulnasoft.com, sre@khulnasoft.com');
  const [slackEnabled, setSlackEnabled] = useState<boolean>(true);
  const [emailEnabled, setEmailEnabled] = useState<boolean>(true);
  const [alertLogs, setAlertLogs] = useState<AlertNotification[]>(INITIAL_ALERTS);
  const [isTestingWebhook, setIsTestingWebhook] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Simulated active namespaces with current metrics
  const monitoredNamespaces = [
    {
      namespace: 'khulnasoft-prod',
      cluster: 'GKE Primary Prod Cluster',
      cpuUsage: 88.8,
      ramUsage: 90.9,
      storageUsage: 84.0,
      env: 'production'
    },
    {
      namespace: 'ml-inference-engine',
      cluster: 'BareMetal On-Prem DC1',
      cpuUsage: 69.5,
      ramUsage: 87.5,
      storageUsage: 60.0,
      env: 'production'
    },
    {
      namespace: 'security-zero-trust',
      cluster: 'GKE Primary Prod Cluster',
      cpuUsage: 70.0,
      ramUsage: 60.9,
      storageUsage: 55.0,
      env: 'production'
    },
    {
      namespace: 'khulnasoft-staging',
      cluster: 'EKS Staging EU-West',
      cpuUsage: 42.5,
      ramUsage: 50.4,
      storageUsage: 63.3,
      env: 'staging'
    }
  ];

  // Namespaces exceeding the configured threshold
  const breachingNamespaces = monitoredNamespaces.filter(
    (ns) => ns.cpuUsage >= threshold || ns.ramUsage >= threshold || ns.storageUsage >= threshold
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendTestAlert = () => {
    setIsTestingWebhook(true);
    setTimeout(() => {
      const newAlert: AlertNotification = {
        id: `alt-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        namespace: 'khulnasoft-prod',
        cluster: 'GKE Primary Prod Cluster',
        resourceType: 'CPU',
        usagePercentage: 88.8,
        thresholdPercentage: threshold,
        channelSent: slackEnabled && emailEnabled ? 'Both' : slackEnabled ? 'Slack' : 'Email',
        targetDestination: `${slackEnabled ? slackChannel : ''} ${emailEnabled ? emailRecipients : ''}`.trim(),
        status: 'DELIVERED'
      };

      setAlertLogs([newAlert, ...alertLogs]);
      setIsTestingWebhook(false);
      showToast(`Automated alert payload successfully dispatched to ${slackChannel} and email recipients!`);
    }, 900);
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 font-sans relative">
      {/* Toast Alert Banner */}
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
            <Bell className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Automated Resource Quota Monitor & Alerting Engine</span>
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px]">
              {breachingNamespaces.length} Threshold Breaches
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-100 flex items-center space-x-2">
            <span>Quota Usage Monitoring & Slack/Email Dispatch</span>
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSendTestAlert}
            disabled={isTestingWebhook}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shadow-md shadow-amber-500/20"
          >
            {isTestingWebhook ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Dispatch Test Alert</span>
          </button>
        </div>
      </div>

      {/* Threshold Configuration & Channels Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Threshold Slider & Metric Selection */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <span className="text-slate-200 font-bold flex items-center space-x-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Breach Threshold Rule</span>
            </span>
            <span className="text-amber-400 font-bold font-mono text-sm">{threshold}%</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Alert Trigger Percentage</span>
              <span className="text-slate-200 font-bold">{threshold}% Limit Exceeded</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>50% (Permissive)</span>
              <span className="text-cyan-400 font-bold">80% (Recommended)</span>
              <span>95% (Critical Only)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-slate-400 text-[10px] uppercase font-bold">Monitored Resource Metrics</div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center space-x-2 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>CPU Core Limits</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>RAM Memory</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Storage GiB</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Max Pod Counts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Slack & Email Webhook Configuration */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <span className="text-slate-200 font-bold flex items-center space-x-1.5">
              <Send className="w-4 h-4 text-emerald-400" />
              <span>Notification Dispatch Channels</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              Active
            </span>
          </div>

          {/* Slack Integration Card */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-slate-200">
                <span className="p-1 rounded bg-slate-800 text-emerald-400">#</span>
                <span>Slack Webhook Integration</span>
              </div>
              <input
                type="checkbox"
                checked={slackEnabled}
                onChange={(e) => setSlackEnabled(e.target.checked)}
                className="accent-emerald-400 cursor-pointer"
              />
            </div>
            <input
              type="text"
              value={slackChannel}
              onChange={(e) => setSlackChannel(e.target.value)}
              placeholder="#channel-name"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs focus:border-emerald-500 font-mono"
            />
          </div>

          {/* Email Recipients Card */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-slate-200">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>Email On-Call List</span>
              </div>
              <input
                type="checkbox"
                checked={emailEnabled}
                onChange={(e) => setEmailEnabled(e.target.checked)}
                className="accent-indigo-400 cursor-pointer"
              />
            </div>
            <input
              type="text"
              value={emailRecipients}
              onChange={(e) => setEmailRecipients(e.target.value)}
              placeholder="comma separated emails"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Right: Active Threshold Breaches Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <span className="text-slate-200 font-bold flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Breaching Namespaces (&gt;{threshold}%)</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold">
              {breachingNamespaces.length} Critical
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {breachingNamespaces.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-[11px] italic">
                All namespaces are operating below the {threshold}% resource quota limit.
              </div>
            ) : (
              breachingNamespaces.map((ns, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-900 border border-amber-800/60 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-100 text-xs">{ns.namespace}</div>
                    <div className="text-[10px] text-slate-400">{ns.cluster}</div>
                  </div>
                  <div className="text-right">
                    {ns.cpuUsage >= threshold && (
                      <div className="text-rose-400 font-bold text-[10px]">CPU: {ns.cpuUsage}%</div>
                    )}
                    {ns.ramUsage >= threshold && (
                      <div className="text-amber-400 font-bold text-[10px]">RAM: {ns.ramUsage}%</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Dispatched Alerts Audit History */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-900 pb-2">
          <div className="flex items-center space-x-2 text-slate-200 font-bold">
            <History className="w-4 h-4 text-cyan-400" />
            <span>Automated Slack/Email Dispatch Audit History</span>
          </div>
          <span className="text-[10px] text-slate-500">Live Webhook Log</span>
        </div>

        <div className="space-y-2">
          {alertLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-slate-700 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-bold">
                    {log.status}
                  </span>
                  <span className="font-bold text-slate-100">{log.namespace}</span>
                  <span className="text-slate-400 text-[10px]">({log.cluster})</span>
                </div>
                <div className="text-slate-300 text-[11px]">
                  Alert: <strong className="text-rose-400">{log.resourceType}</strong> usage reached{' '}
                  <strong className="text-amber-300">{log.usagePercentage}%</strong> (exceeded {log.thresholdPercentage}% quota threshold)
                </div>
                <div className="text-[10px] text-slate-500">Target: {log.targetDestination}</div>
              </div>

              <div className="text-right text-slate-500 text-[10px] shrink-0 font-mono">
                <div>{log.timestamp}</div>
                <div className="text-cyan-400 font-bold">Via {log.channelSent}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
