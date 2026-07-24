import React, { useState } from 'react';
import { 
  Webhook, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Play, 
  RotateCcw, 
  ShieldCheck, 
  Search, 
  Plus, 
  Terminal, 
  Copy, 
  Check, 
  Filter, 
  Activity, 
  Radio, 
  Send, 
  Code2, 
  ExternalLink, 
  Layers, 
  Lock, 
  Settings2, 
  Trash2, 
  RefreshCw, 
  Sparkles, 
  AlertTriangle,
  Github,
  Zap,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { MOCK_REPOSITORIES } from '../data/mockData';
import { WebhookConfig, WebhookDeliveryLog } from '../types';
import { WebhookEventLogs } from '../components/WebhookEventLogs';

// Mock Webhook Configurations
const INITIAL_WEBHOOK_CONFIGS: WebhookConfig[] = [
  {
    id: 'wh_core_api',
    repoId: 'repo-core-api',
    repoName: 'khulnasoft/core-api',
    url: 'https://api.khulnasoft.com/v1/webhooks/github/core-api',
    contentType: 'application/json',
    secretMasked: 'gh_sec_••••••••9842a',
    events: ['push', 'pull_request', 'workflow_job', 'release'],
    active: true,
    sslVerification: true,
    createdAt: '2026-01-15T08:30:00Z',
    lastDeliveryStatus: '200 OK',
    lastDeliveryTime: '2 mins ago',
    totalDeliveries: 14280,
    failureRate: 0.02
  },
  {
    id: 'wh_ai_gateway',
    repoId: 'repo-ai-gateway',
    repoName: 'khulnasoft/ai-gateway',
    url: 'https://api.khulnasoft.com/v1/webhooks/github/ai-gateway',
    contentType: 'application/json',
    secretMasked: 'gh_sec_••••••••1029f',
    events: ['push', 'pull_request', 'check_suite', 'repository_dispatch'],
    active: true,
    sslVerification: true,
    createdAt: '2026-02-01T12:00:00Z',
    lastDeliveryStatus: '200 OK',
    lastDeliveryTime: '8 mins ago',
    totalDeliveries: 8940,
    failureRate: 0.01
  },
  {
    id: 'wh_ebpf_agent',
    repoId: 'repo-ebpf-agent',
    repoName: 'khulnasoft/ebpf-agent',
    url: 'https://security.khulnasoft.com/hooks/ebpf-events',
    contentType: 'application/json',
    secretMasked: 'gh_sec_••••••••7731c',
    events: ['push', 'release', 'issues', 'issue_comment'],
    active: true,
    sslVerification: true,
    createdAt: '2026-03-10T14:20:00Z',
    lastDeliveryStatus: '200 OK',
    lastDeliveryTime: '15 mins ago',
    totalDeliveries: 5120,
    failureRate: 0.05
  },
  {
    id: 'wh_graph_indexer',
    repoId: 'repo-knowledge-graph',
    repoName: 'khulnasoft/knowledge-graph',
    url: 'https://graph.khulnasoft.com/ingest/github-webhook',
    contentType: 'application/json',
    secretMasked: 'gh_sec_••••••••4481e',
    events: ['push', 'pull_request', 'create', 'delete'],
    active: false,
    sslVerification: true,
    createdAt: '2026-04-05T09:10:00Z',
    lastDeliveryStatus: '500 Server Error',
    lastDeliveryTime: '1 hour ago',
    totalDeliveries: 1240,
    failureRate: 2.10
  }
];

// Mock Incoming Webhook Delivery Payload Logs
const INITIAL_DELIVERY_LOGS: WebhookDeliveryLog[] = [
  {
    id: 'del_98f12a34',
    webhookId: 'wh_core_api',
    repoName: 'khulnasoft/core-api',
    event: 'push',
    action: 'push',
    timestamp: '2026-07-24T07:38:12Z',
    durationMs: 38,
    statusCode: 200,
    statusText: '200 OK',
    guid: '8f91a23b-4c56-789d-0123-ef456789abcd',
    signatureVerified: true,
    requestHeaders: {
      'Host': 'api.khulnasoft.com',
      'User-Agent': 'GitHub-Hookshot/f31c2d',
      'Content-Type': 'application/json',
      'X-GitHub-Event': 'push',
      'X-GitHub-Delivery': '8f91a23b-4c56-789d-0123-ef456789abcd',
      'X-Hub-Signature-256': 'sha256=a891f1c2d3e4f567890123456789abcdef0123456789abcdef0123456789abcd'
    },
    requestPayload: {
      ref: 'refs/heads/main',
      before: 'a7b3c91d8e20f4a5b6c7d8e90123456789abcdef',
      after: 'f4e3d2c1b0a9876543210fedcba9876543210fed',
      repository: {
        id: 74829102,
        name: 'core-api',
        full_name: 'khulnasoft/core-api',
        private: true,
        html_url: 'https://github.com/khulnasoft/core-api',
        default_branch: 'main'
      },
      pusher: {
        name: 'aria-thorne',
        email: 'aria.thorne@khulnasoft.com'
      },
      commits: [
        {
          id: 'f4e3d2c1b0a9876543210fedcba9876543210fed',
          message: 'feat(auth): integrate OIDC token revocation & OpenTelemetry spans',
          timestamp: '2026-07-24T07:38:00Z',
          author: { name: 'Aria Thorne', email: 'aria.thorne@khulnasoft.com' },
          added: ['pkg/auth/oidc_revocation.go', 'pkg/telemetry/spans.go'],
          modified: ['go.mod', 'go.sum', 'cmd/server/main.go'],
          removed: []
        }
      ]
    },
    responseHeaders: {
      'Content-Type': 'application/json',
      'X-KhulnaSoft-Pipeline-Dispatched': 'true',
      'X-Processing-Time-Ms': '38'
    },
    responseBody: JSON.stringify({
      status: 'success',
      event: 'push',
      repository: 'khulnasoft/core-api',
      actionsTaken: [
        'Ingested commit f4e3d2c into Knowledge Graph',
        'Triggered CI/CD Pipeline #142',
        'Dispatched AI Repo Code Review Bot'
      ],
      timestamp: '2026-07-24T07:38:12.038Z'
    }, null, 2)
  },
  {
    id: 'del_77c41b89',
    webhookId: 'wh_ai_gateway',
    repoName: 'khulnasoft/ai-gateway',
    event: 'pull_request',
    action: 'opened',
    timestamp: '2026-07-24T07:22:45Z',
    durationMs: 44,
    statusCode: 200,
    statusText: '200 OK',
    guid: '77c41b89-1122-3344-5566-778899aabbcc',
    signatureVerified: true,
    requestHeaders: {
      'Host': 'api.khulnasoft.com',
      'User-Agent': 'GitHub-Hookshot/f31c2d',
      'Content-Type': 'application/json',
      'X-GitHub-Event': 'pull_request',
      'X-GitHub-Delivery': '77c41b89-1122-3344-5566-778899aabbcc',
      'X-Hub-Signature-256': 'sha256=b992f2d3e4f567890123456789abcdef0123456789abcdef0123456789abcd'
    },
    requestPayload: {
      action: 'opened',
      number: 89,
      pull_request: {
        id: 198230192,
        title: 'feat(gemini): streaming thinking level controls and prompt policy',
        user: { login: 'marcus-chen' },
        state: 'open',
        head: { ref: 'feat/gemini-thinking-level', sha: 'c8f92e1' },
        base: { ref: 'main', sha: '99a1b2c' },
        changed_files: 6,
        additions: 184,
        deletions: 12
      }
    },
    responseHeaders: {
      'Content-Type': 'application/json',
      'X-KhulnaSoft-Pipeline-Dispatched': 'true',
      'X-Processing-Time-Ms': '44'
    },
    responseBody: JSON.stringify({
      status: 'success',
      event: 'pull_request.opened',
      repository: 'khulnasoft/ai-gateway',
      actionsTaken: [
        'Dispatched Gemini 3.6 Automated PR Code Reviewer',
        'Started Security & License Compliance Matrix'
      ],
      timestamp: '2026-07-24T07:22:45.044Z'
    }, null, 2)
  },
  {
    id: 'del_55e20d11',
    webhookId: 'wh_ebpf_agent',
    repoName: 'khulnasoft/ebpf-agent',
    event: 'release',
    action: 'published',
    timestamp: '2026-07-24T06:55:01Z',
    durationMs: 52,
    statusCode: 200,
    statusText: '200 OK',
    guid: '55e20d11-9988-7766-5544-33221100aabb',
    signatureVerified: true,
    requestHeaders: {
      'Host': 'security.khulnasoft.com',
      'User-Agent': 'GitHub-Hookshot/f31c2d',
      'Content-Type': 'application/json',
      'X-GitHub-Event': 'release',
      'X-GitHub-Delivery': '55e20d11-9988-7766-5544-33221100aabb',
      'X-Hub-Signature-256': 'sha256=c113f3d4e5f67890123456789abcdef0123456789abcdef0123456789abcd'
    },
    requestPayload: {
      action: 'published',
      release: {
        tag_name: 'v2.1.0',
        target_commitish: 'main',
        name: 'eBPF Kernel Probes v2.1.0 - Cilium mTLS Enforcement',
        draft: false,
        prerelease: false,
        author: { login: 'elena-rostova' }
      }
    },
    responseHeaders: {
      'Content-Type': 'application/json',
      'X-KhulnaSoft-Pipeline-Dispatched': 'true',
      'X-Processing-Time-Ms': '52'
    },
    responseBody: JSON.stringify({
      status: 'success',
      event: 'release.published',
      repository: 'khulnasoft/ebpf-agent',
      actionsTaken: [
        'Triggered Multi-Cluster ArgoCD Production Rollout',
        'Signed Cosign Release Artifacts'
      ],
      timestamp: '2026-07-24T06:55:01.052Z'
    }, null, 2)
  },
  {
    id: 'del_11a88b99',
    webhookId: 'wh_graph_indexer',
    repoName: 'khulnasoft/knowledge-graph',
    event: 'push',
    action: 'push',
    timestamp: '2026-07-24T06:10:30Z',
    durationMs: 120,
    statusCode: 500,
    statusText: '500 Internal Server Error',
    guid: '11a88b99-3322-1100-4455-667788990011',
    signatureVerified: true,
    requestHeaders: {
      'Host': 'graph.khulnasoft.com',
      'User-Agent': 'GitHub-Hookshot/f31c2d',
      'Content-Type': 'application/json',
      'X-GitHub-Event': 'push',
      'X-GitHub-Delivery': '11a88b99-3322-1100-4455-667788990011',
      'X-Hub-Signature-256': 'sha256=d224f4e5f67890123456789abcdef0123456789abcdef0123456789abcd'
    },
    requestPayload: {
      ref: 'refs/heads/feature/neo4j-cluster',
      commits: [
        {
          id: '998210abc',
          message: 'fix(schema): update Cypher query index topology',
          author: { name: 'Siddharth N' }
        }
      ]
    },
    responseHeaders: {
      'Content-Type': 'application/json',
      'X-KhulnaSoft-Error': 'Database Connection Timeout'
    },
    responseBody: JSON.stringify({
      error: 'Internal Server Error',
      message: 'Neo4j ingestion pool connection refused on port 7687',
      code: 'ERR_GRAPH_DB_UNAVAILABLE',
      timestamp: '2026-07-24T06:10:30.120Z'
    }, null, 2)
  }
];

export const WebhooksDashboardView: React.FC = () => {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(INITIAL_WEBHOOK_CONFIGS);
  const [logs, setLogs] = useState<WebhookDeliveryLog[]>(INITIAL_DELIVERY_LOGS);
  
  const [activeTab, setActiveTab] = useState<'deliveries' | 'configs' | 'analytics'>('deliveries');
  const [selectedLogId, setSelectedLogId] = useState<string>(INITIAL_DELIVERY_LOGS[0].id);
  const [selectedRepoFilter, setSelectedRepoFilter] = useState<string>('All');
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [inspectorView, setInspectorView] = useState<'request' | 'response' | 'headers'>('request');
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);
  const [isSimulatingEvent, setIsSimulatingEvent] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // New Webhook Form Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newRepoId, setNewRepoId] = useState<string>(MOCK_REPOSITORIES[0].id);
  const [newEndpointUrl, setNewEndpointUrl] = useState<string>('https://api.khulnasoft.com/v1/webhooks/github/custom-service');
  const [newSecret, setNewSecret] = useState<string>('gh_sec_993812a');
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['push', 'pull_request', 'workflow_job']);
  const [sslVerify, setSslVerify] = useState<boolean>(true);

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesRepo = selectedRepoFilter === 'All' || log.repoName === selectedRepoFilter;
    const matchesEvent = selectedEventFilter === 'All' || log.event === selectedEventFilter;
    const matchesStatus = selectedStatusFilter === 'All' || 
      (selectedStatusFilter === '200' && log.statusCode === 200) ||
      (selectedStatusFilter === '500' && log.statusCode >= 500);
    
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      log.guid.toLowerCase().includes(query) ||
      log.repoName.toLowerCase().includes(query) ||
      log.event.toLowerCase().includes(query) ||
      JSON.stringify(log.requestPayload).toLowerCase().includes(query);

    return matchesRepo && matchesEvent && matchesStatus && matchesSearch;
  });

  const selectedLog = logs.find(l => l.id === selectedLogId) || logs[0];

  // Toggle active status of a webhook
  const handleToggleActive = (id: string) => {
    setWebhooks(prev => prev.map(wh => {
      if (wh.id === id) {
        return { ...wh, active: !wh.active };
      }
      return wh;
    }));
  };

  // Simulate fire webhook
  const handleSimulateWebhook = () => {
    setIsSimulatingEvent(true);
    setTimeout(() => {
      const targetRepo = MOCK_REPOSITORIES[Math.floor(Math.random() * 4)];
      const eventsList = ['push', 'pull_request', 'workflow_job', 'release', 'check_suite'];
      const chosenEvent = eventsList[Math.floor(Math.random() * eventsList.length)];
      const randomSha = Math.random().toString(36).substring(2, 10);
      const newGuid = `${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}-4000-8000-${Math.random().toString(36).substring(2, 14)}`;

      const newLog: WebhookDeliveryLog = {
        id: `del_${Math.random().toString(36).substring(2, 10)}`,
        webhookId: 'wh_core_api',
        repoName: `${targetRepo.org}/${targetRepo.name}`,
        event: chosenEvent,
        action: chosenEvent === 'pull_request' ? 'opened' : 'push',
        timestamp: new Date().toISOString(),
        durationMs: Math.floor(Math.random() * 30) + 20,
        statusCode: 200,
        statusText: '200 OK',
        guid: newGuid,
        signatureVerified: true,
        requestHeaders: {
          'Host': 'api.khulnasoft.com',
          'User-Agent': 'GitHub-Hookshot/f31c2d',
          'Content-Type': 'application/json',
          'X-GitHub-Event': chosenEvent,
          'X-GitHub-Delivery': newGuid,
          'X-Hub-Signature-256': `sha256=${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`
        },
        requestPayload: {
          ref: 'refs/heads/main',
          before: 'a0b1c2d3e4f5',
          after: randomSha,
          repository: {
            full_name: `${targetRepo.org}/${targetRepo.name}`,
            html_url: `https://github.com/${targetRepo.org}/${targetRepo.name}`
          },
          pusher: { name: 'khulnasoft-bot', email: 'bot@khulnasoft.com' },
          simulated: true
        },
        responseHeaders: {
          'Content-Type': 'application/json',
          'X-KhulnaSoft-Processed': 'true'
        },
        responseBody: JSON.stringify({
          status: 'success',
          event: chosenEvent,
          message: 'Real-time webhook payload processed successfully by event bus',
          timestamp: new Date().toISOString()
        }, null, 2)
      };

      setLogs(prev => [newLog, ...prev]);
      setSelectedLogId(newLog.id);
      setIsSimulatingEvent(false);
    }, 800);
  };

  // Re-deliver specific log payload
  const handleRedeliver = (log: WebhookDeliveryLog) => {
    setIsSimulatingEvent(true);
    setTimeout(() => {
      const redeliveredLog: WebhookDeliveryLog = {
        ...log,
        id: `del_${Math.random().toString(36).substring(2, 10)}`,
        timestamp: new Date().toISOString(),
        durationMs: Math.floor(Math.random() * 20) + 15,
        statusCode: 200,
        statusText: '200 OK (Redelivered)',
        responseBody: JSON.stringify({
          status: 'success',
          redelivered: true,
          originalGuid: log.guid,
          message: 'Payload successfully re-ingested into event stream',
          timestamp: new Date().toISOString()
        }, null, 2)
      };

      setLogs(prev => [redeliveredLog, ...prev]);
      setSelectedLogId(redeliveredLog.id);
      setIsSimulatingEvent(false);
    }, 600);
  };

  // Create new Webhook Config
  const handleCreateWebhook = () => {
    const repoObj = MOCK_REPOSITORIES.find(r => r.id === newRepoId) || MOCK_REPOSITORIES[0];
    const newConfig: WebhookConfig = {
      id: `wh_${Math.random().toString(36).substring(2, 8)}`,
      repoId: repoObj.id,
      repoName: `${repoObj.org}/${repoObj.name}`,
      url: newEndpointUrl,
      contentType: 'application/json',
      secretMasked: 'gh_sec_••••••••' + newSecret.slice(-4),
      events: selectedEvents,
      active: true,
      sslVerification: sslVerify,
      createdAt: new Date().toISOString(),
      lastDeliveryStatus: '200 OK',
      lastDeliveryTime: 'Just now',
      totalDeliveries: 1,
      failureRate: 0.0
    };

    setWebhooks(prev => [newConfig, ...prev]);
    setShowAddModal(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 1500);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-800/60 shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs font-bold mb-1">
              <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>GitHub Event Bus & Webhook Gateway</span>
              <span className="px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
                HMAC SHA-256 Enforced
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-100 flex items-center space-x-3">
              <Webhook className="w-6 h-6 text-indigo-400" />
              <span>Repository Webhooks & Real-Time Payload Engine</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Monitor, debug, and manage incoming GitHub webhooks in real time. Validate HMAC signatures, inspect request headers and JSON payloads, and test event triggers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSimulateWebhook}
              disabled={isSimulatingEvent}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-mono text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className={`w-3.5 h-3.5 text-cyan-400 ${isSimulatingEvent ? 'animate-bounce' : ''}`} />
              <span>{isSimulatingEvent ? 'Firing Event...' : 'Simulate GitHub Payload'}</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Webhook Endpoint</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs pt-2 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Total Ingested Events</div>
            <div className="text-xl font-black text-slate-100">29,360</div>
            <div className="text-[10px] text-emerald-400">100% Signature Verified</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Delivery Success Rate</div>
            <div className="text-xl font-black text-emerald-400">99.82%</div>
            <div className="text-[10px] text-slate-400">HTTP 200 OK Response</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Avg Processing Latency</div>
            <div className="text-xl font-black text-cyan-400">38.4 ms</div>
            <div className="text-[10px] text-slate-400">Event Ingestion to Pipeline</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Active Endpoints</div>
            <div className="text-xl font-black text-indigo-400">{webhooks.filter(w => w.active).length} / {webhooks.length}</div>
            <div className="text-[10px] text-indigo-300">Active Repositories</div>
          </div>
        </div>

        {/* View Tab Switcher */}
        <div className="flex space-x-2 pt-1 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveTab('deliveries')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'deliveries'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Real-Time Payload Logs ({filteredLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('configs')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'configs'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Webhook Configurations ({webhooks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Event Bus Architecture</span>
          </button>
        </div>
      </div>

      {/* TAB 1: REAL-TIME PAYLOAD LOGS & INSPECTOR */}
      {activeTab === 'deliveries' && (
        <WebhookEventLogs 
          logs={logs} 
          onRedeliver={handleRedeliver} 
          onSimulateEvent={handleSimulateWebhook} 
          isSimulating={isSimulatingEvent} 
        />
      )}

      {/* TAB 2: WEBHOOK CONFIGURATIONS */}
      {activeTab === 'configs' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-100 flex items-center space-x-2">
                <Settings2 className="w-5 h-5 text-indigo-400" />
                <span>Configured Webhook Endpoints ({webhooks.length})</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage destination URLs, HMAC secrets, subscribed events, and SSL verification settings per repository.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md"
            >
              + Create New Webhook
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {webhooks.map((wh) => (
              <div
                key={wh.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs font-mono"
              >
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-sm text-cyan-300">{wh.repoName}</span>
                    <div className="text-[10px] text-slate-500">ID: {wh.id}</div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleActive(wh.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                        wh.active
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}
                    >
                      {wh.active ? '● Active' : '○ Paused'}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-slate-300 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Payload URL:</span>
                    <span className="text-slate-200 font-bold truncate max-w-[240px]">{wh.url}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Content Type:</span>
                    <span className="text-cyan-400 font-bold">{wh.contentType}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">HMAC Secret:</span>
                    <span className="text-slate-400 font-bold">{wh.secretMasked}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">SSL Verification:</span>
                    <span className="text-emerald-400 font-bold">Enabled (TLS 1.3)</span>
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-900">
                  <div className="text-slate-500 text-[10px]">Subscribed Events:</div>
                  <div className="flex flex-wrap gap-1">
                    {wh.events.map((evt, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800 text-[10px]">
                        {evt}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[10px] text-slate-500">
                  <span>Deliveries: {wh.totalDeliveries.toLocaleString()}</span>
                  <span>Last status: <strong className="text-emerald-400">{wh.lastDeliveryStatus}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EVENT BUS ARCHITECTURE */}
      {activeTab === 'analytics' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-black text-slate-100 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Event-Driven Webhook Ingestion Architecture</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              How GitHub webhook events flow through KhulnaSoft platform consumers.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="text-cyan-400 font-bold uppercase tracking-wider">GitHub → KhulnaSoft Webhook Event Flow</div>
            <pre className="p-4 bg-slate-900 text-cyan-200 rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
{`[GitHub Hookshot] ─── (HTTPS POST with X-Hub-Signature-256) ───► [KhulnaSoft Ingress Gateway]
                                                                        │
                                                                        ▼
                                                          [HMAC Signature Verifier]
                                                                        │
                                                                        ▼
                                                          [Kafka / NATS Event Bus]
                                                                        │
         ┌──────────────────────────────┼───────────────────────────────┼─────────────────────────────┐
         ▼                              ▼                               ▼                             ▼
[Knowledge Graph Indexer]     [CI/CD Build Dispatcher]     [Gemini AI Code Reviewer]     [eBPF Kernel Security Auditor]
 (Updates AST & Cypher)        (Triggers GKE Runner)        (Generates Pull Review)       (Validates Syscall Policy)`}
            </pre>
          </div>
        </div>
      )}

      {/* MODAL: ADD WEBHOOK ENDPOINT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-cyan-300 flex items-center space-x-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <span>Configure New Repository Webhook</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Set up a webhook payload listener to trigger real-time events, knowledge graph indexing, and automated AI reviews.
            </p>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Target Repository</label>
                <select
                  value={newRepoId}
                  onChange={(e) => setNewRepoId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-cyan-300 focus:outline-none focus:border-cyan-500"
                >
                  {MOCK_REPOSITORIES.map(r => (
                    <option key={r.id} value={r.id}>{r.org}/{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Payload Endpoint URL</label>
                <input
                  type="text"
                  value={newEndpointUrl}
                  onChange={(e) => setNewEndpointUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">HMAC Secret Key</label>
                <input
                  type="password"
                  value={newSecret}
                  onChange={(e) => setNewSecret(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Subscribed Events</label>
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  {['push', 'pull_request', 'workflow_job', 'release', 'issues', 'repository_dispatch'].map((evt) => (
                    <label key={evt} className="flex items-center space-x-2 text-slate-300 text-[11px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(evt)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEvents(prev => [...prev, evt]);
                          } else {
                            setSelectedEvents(prev => prev.filter(item => item !== evt));
                          }
                        }}
                        className="rounded border-slate-800 bg-slate-900 text-cyan-500 focus:ring-0"
                      />
                      <span>{evt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWebhook}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-colors cursor-pointer"
              >
                Add Webhook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
