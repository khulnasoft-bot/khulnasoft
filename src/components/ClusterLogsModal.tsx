import React, { useState, useEffect } from 'react';
import { Terminal, X, Play, Pause, Download, Copy, Check, Search, Filter, RefreshCw, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import { KubernetesCluster } from '../types';

interface ClusterLogsModalProps {
  cluster: KubernetesCluster | null;
  onClose: () => void;
}

interface LogEntry {
  id: string;
  timestamp: string;
  podName: string;
  namespace: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
}

export const ClusterLogsModal: React.FC<ClusterLogsModalProps> = ({ cluster, onClose }) => {
  if (!cluster) return null;

  const [selectedNamespace, setSelectedNamespace] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const initialLogs: LogEntry[] = [
    { id: '1', timestamp: new Date(Date.now() - 120000).toISOString(), podName: 'core-api-pod-89f7a', namespace: 'khulnasoft-core', level: 'INFO', message: 'gRPC server listening on 0.0.0.0:50051 (TLS enabled)' },
    { id: '2', timestamp: new Date(Date.now() - 105000).toISOString(), podName: 'ai-gateway-pod-102x', namespace: 'khulnasoft-ai', level: 'INFO', message: 'Gemini 3.6 Flash streaming channel established successfully' },
    { id: '3', timestamp: new Date(Date.now() - 90000).toISOString(), podName: 'k8s-operator-pod-33b', namespace: 'kube-system', level: 'WARN', message: 'Istio VirtualService sync delayed by 120ms (retrying reconciliation)' },
    { id: '4', timestamp: new Date(Date.now() - 75000).toISOString(), podName: 'core-api-pod-89f7a', namespace: 'khulnasoft-core', level: 'INFO', message: 'PostgreSQL ConnectionPool health check PASSED (latency 0.8ms)' },
    { id: '5', timestamp: new Date(Date.now() - 60000).toISOString(), podName: 'telemetry-pod-45c', namespace: 'khulnasoft-core', level: 'DEBUG', message: 'Flushed 14,200 OpenTelemetry spans to ClickHouse buffer' },
    { id: '6', timestamp: new Date(Date.now() - 45000).toISOString(), podName: 'ai-gateway-pod-102x', namespace: 'khulnasoft-ai', level: 'INFO', message: 'Context window extended to 2,000,000 tokens for session #8819' },
    { id: '7', timestamp: new Date(Date.now() - 30000).toISOString(), podName: 'cilium-agent-pod-77d', namespace: 'kube-system', level: 'INFO', message: 'eBPF security policy rule #141 enforced for zero-trust ingress' },
    { id: '8', timestamp: new Date(Date.now() - 15000).toISOString(), podName: 'core-api-pod-89f7a', namespace: 'khulnasoft-core', level: 'INFO', message: 'OIDC JWT bearer token validated for aria.thorne@khulnasoft.com' },
  ];

  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);

  // Simulated log streaming effect
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const pods = [
        { pod: 'core-api-pod-89f7a', ns: 'khulnasoft-core' },
        { pod: 'ai-gateway-pod-102x', ns: 'khulnasoft-ai' },
        { pod: 'k8s-operator-pod-33b', ns: 'kube-system' },
        { pod: 'telemetry-pod-45c', ns: 'khulnasoft-core' },
      ];

      const levels: ('INFO' | 'WARN' | 'ERROR' | 'DEBUG')[] = ['INFO', 'INFO', 'INFO', 'WARN', 'DEBUG', 'ERROR'];
      const messages = [
        'GET /api/v1/health HTTP/1.1 200 OK - 2ms',
        'Cache hit for Redis key session:auth:9941',
        'Worker thread #4 executed AST parse job in 14ms',
        'Trivy image scan result: 0 Critical, 0 High vulnerabilities',
        'Cosign KMS signature verified for OCI container layer',
        'HPA auto-scaler evaluated target CPU 42% <= threshold 70%',
      ];

      const randomPod = pods[Math.floor(Math.random() * pods.length)];
      const randomLevel = levels[Math.floor(Math.random() * levels.length)];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];

      const newLog: LogEntry = {
        id: Math.random().toString(),
        timestamp: new Date().toISOString(),
        podName: randomPod.pod,
        namespace: randomPod.ns,
        level: randomLevel,
        message: randomMsg,
      };

      setLogs((prev) => [...prev.slice(-100), newLog]);
    }, 2500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const filteredLogs = logs.filter((log) => {
    const matchesNs = selectedNamespace === 'all' || log.namespace === selectedNamespace;
    const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel;
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.podName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesNs && matchesLevel && matchesSearch;
  });

  const handleCopy = () => {
    const text = filteredLogs.map((l) => `[${l.timestamp}] [${l.level}] [${l.namespace}/${l.podName}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setLogs([]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[80vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs">
        {/* Terminal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-100 flex items-center space-x-2">
                <span>Cluster Pod Logs: {cluster.name}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
                  {cluster.region}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Real-time streaming stdout/stderr log output from active Kubernetes pods.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Toolbar */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search log output..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500 outline-none w-48"
              />
            </div>

            <select
              value={selectedNamespace}
              onChange={(e) => setSelectedNamespace(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:border-cyan-500 outline-none"
            >
              <option value="all">All Namespaces</option>
              <option value="khulnasoft-core">khulnasoft-core</option>
              <option value="khulnasoft-ai">khulnasoft-ai</option>
              <option value="kube-system">kube-system</option>
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:border-cyan-500 outline-none"
            >
              <option value="all">All Levels</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
              <option value="DEBUG">DEBUG</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-colors ${
                isStreaming
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume Stream</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white flex items-center space-x-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
              title="Clear Logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Logs Console Window */}
        <div className="flex-1 p-4 bg-slate-950 overflow-y-auto space-y-1 font-mono text-[11px] leading-relaxed select-text scrollbar-thin scrollbar-thumb-slate-800">
          {filteredLogs.length === 0 ? (
            <div className="text-slate-500 text-center py-12">No log output matched the filter criteria.</div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start space-x-2 hover:bg-slate-900/60 py-0.5 px-1 rounded">
                <span className="text-slate-500 shrink-0">{log.timestamp.substring(11, 19)}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                    log.level === 'INFO'
                      ? 'bg-cyan-950 text-cyan-400 border border-cyan-900'
                      : log.level === 'WARN'
                      ? 'bg-amber-950 text-amber-400 border border-amber-900'
                      : log.level === 'ERROR'
                      ? 'bg-rose-950 text-rose-400 border border-rose-900'
                      : 'bg-indigo-950 text-indigo-300 border border-indigo-900'
                  }`}
                >
                  {log.level}
                </span>
                <span className="text-slate-400 shrink-0">[{log.namespace}/{log.podName}]:</span>
                <span className="text-slate-200 break-all">{log.message}</span>
              </div>
            ))
          )}
        </div>

        {/* Terminal Footer */}
        <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Connected to Pod Log Stream (gRPC Stream)</span>
          </div>
          <span>Showing {filteredLogs.length} entries</span>
        </div>
      </div>
    </div>
  );
};
