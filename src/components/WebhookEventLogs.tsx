import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  Search, 
  Copy, 
  Check, 
  Filter, 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  RefreshCw, 
  ShieldCheck, 
  AlertCircle, 
  Radio, 
  Code2, 
  GitCommit, 
  GitPullRequest, 
  Workflow, 
  Tag, 
  Send
} from 'lucide-react';
import { WebhookDeliveryLog } from '../types';

interface WebhookEventLogsProps {
  logs: WebhookDeliveryLog[];
  onRedeliver: (log: WebhookDeliveryLog) => void;
  onSimulateEvent?: () => void;
  isSimulating?: boolean;
}

export const WebhookEventLogs: React.FC<WebhookEventLogsProps> = ({
  logs,
  onRedeliver,
  onSimulateEvent,
  isSimulating = false
}) => {
  const [selectedEventType, setSelectedEventType] = useState<string>('All');
  const [selectedStatusCategory, setSelectedStatusCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(logs[0]?.id || null);
  const [inspectorTab, setInspectorTab] = useState<'payload' | 'headers' | 'response'>('payload');
  const [copied, setCopied] = useState<boolean>(false);

  // Status badge styling generator
  const getStatusBadge = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) {
      if (statusCode === 202) {
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-800/80">
            <Clock className="w-3 h-3 text-amber-400 animate-spin" />
            <span>202 Processing</span>
          </span>
        );
      }
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>{statusCode} Success</span>
        </span>
      );
    }
    if (statusCode >= 100 && statusCode < 200) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-950/80 text-blue-300 border border-blue-800/80">
          <Radio className="w-3 h-3 text-blue-400 animate-pulse" />
          <span>{statusCode} In-Flight</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950/80 text-rose-400 border border-rose-800/80">
        <XCircle className="w-3 h-3 text-rose-400" />
        <span>{statusCode} Error</span>
      </span>
    );
  };

  // Event icon generator
  const getEventIcon = (event: string) => {
    switch (event) {
      case 'push':
        return <GitCommit className="w-3.5 h-3.5 text-cyan-400" />;
      case 'pull_request':
        return <GitPullRequest className="w-3.5 h-3.5 text-purple-400" />;
      case 'workflow_run':
      case 'workflow_job':
        return <Workflow className="w-3.5 h-3.5 text-emerald-400" />;
      case 'release':
        return <Tag className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Code2 className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    // Event filter
    const matchesEvent = selectedEventType === 'All' || log.event === selectedEventType;

    // Status category filter
    let matchesStatus = true;
    if (selectedStatusCategory === 'success') {
      matchesStatus = log.statusCode >= 200 && log.statusCode < 300 && log.statusCode !== 202;
    } else if (selectedStatusCategory === 'processing') {
      matchesStatus = log.statusCode === 202 || (log.statusCode >= 100 && log.statusCode < 200);
    } else if (selectedStatusCategory === 'error') {
      matchesStatus = log.statusCode >= 400;
    }

    // Text search filter
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      log.guid.toLowerCase().includes(query) ||
      log.repoName.toLowerCase().includes(query) ||
      log.event.toLowerCase().includes(query) ||
      JSON.stringify(log.requestPayload).toLowerCase().includes(query);

    return matchesEvent && matchesStatus && matchesSearch;
  });

  const expandedLog = logs.find((l) => l.id === expandedLogId) || filteredLogs[0] || logs[0];

  const handleCopyJson = (content: any) => {
    navigator.clipboard.writeText(typeof content === 'string' ? content : JSON.stringify(content, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-5">
      {/* Filters & Control Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter webhooks by GUID, repository, commit SHA, PR number..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-bold">Event:</span>
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-slate-200">All Events</option>
              <option value="push" className="bg-slate-900 text-slate-200">push</option>
              <option value="pull_request" className="bg-slate-900 text-slate-200">pull_request</option>
              <option value="workflow_run" className="bg-slate-900 text-slate-200">workflow_run</option>
              <option value="release" className="bg-slate-900 text-slate-200">release</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
            <span className="text-slate-500 font-bold">Status:</span>
            <select
              value={selectedStatusCategory}
              onChange={(e) => setSelectedStatusCategory(e.target.value)}
              className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-slate-200">All Statuses</option>
              <option value="success" className="bg-slate-900 text-emerald-400">200 Success</option>
              <option value="processing" className="bg-slate-900 text-amber-300">202 Processing</option>
              <option value="error" className="bg-slate-900 text-rose-400">500 Errors</option>
            </select>
          </div>

          {onSimulateEvent && (
            <button
              onClick={onSimulateEvent}
              disabled={isSimulating}
              className="flex items-center space-x-1.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className={`w-3.5 h-3.5 ${isSimulating ? 'animate-bounce text-cyan-400' : ''}`} />
              <span>{isSimulating ? 'Simulating...' : 'Trigger Event'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabular Log List */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Incoming Webhook Deliveries ({filteredLogs.length})
            </h3>
          </div>
          <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>HMAC SHA-256 Validated</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[10px] uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Event & Action</th>
                <th className="py-3 px-4">Repository</th>
                <th className="py-3 px-4">Delivery GUID</th>
                <th className="py-3 px-4 text-right">Duration</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500 text-xs">
                    No webhook payloads match the active filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isExpanded = expandedLogId === log.id;

                  return (
                    <React.Fragment key={log.id}>
                      <tr
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${
                          isExpanded ? 'bg-slate-800/70' : ''
                        }`}
                      >
                        <td className="py-3 px-4 whitespace-nowrap">
                          {getStatusBadge(log.statusCode)}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getEventIcon(log.event)}
                            <span className="font-bold text-cyan-300">{log.event}</span>
                            {log.action && (
                              <span className="text-[10px] text-slate-400">({log.action})</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap font-bold text-slate-200">
                          {log.repoName}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                          {log.guid.substring(0, 18)}...
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap text-right font-bold text-cyan-400">
                          {log.durationMs}ms
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap text-right text-slate-400 text-[11px]">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedLogId(isExpanded ? null : log.id);
                              }}
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                              title="Inspect JSON Payload"
                            >
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRedeliver(log);
                              }}
                              className="p-1 rounded bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 transition-colors"
                              title="Redeliver Webhook Payload"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Payload Inspector Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="p-0 bg-slate-950/90 border-b border-cyan-500/30">
                            <div className="p-4 space-y-3 font-mono text-xs">
                              {/* Inspector Top Bar */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                                <div className="flex items-center space-x-2 text-slate-300">
                                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                  <span className="font-bold">Webhook Delivery GUID:</span>
                                  <span className="text-cyan-300">{log.guid}</span>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => setInspectorTab('payload')}
                                    className={`px-3 py-1 rounded-lg transition-colors ${
                                      inspectorTab === 'payload'
                                        ? 'bg-cyan-500 text-slate-950 font-bold'
                                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                                    }`}
                                  >
                                    Request Payload
                                  </button>
                                  <button
                                    onClick={() => setInspectorTab('headers')}
                                    className={`px-3 py-1 rounded-lg transition-colors ${
                                      inspectorTab === 'headers'
                                        ? 'bg-cyan-500 text-slate-950 font-bold'
                                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                                    }`}
                                  >
                                    Headers
                                  </button>
                                  <button
                                    onClick={() => setInspectorTab('response')}
                                    className={`px-3 py-1 rounded-lg transition-colors ${
                                      inspectorTab === 'response'
                                        ? 'bg-cyan-500 text-slate-950 font-bold'
                                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                                    }`}
                                  >
                                    Response Body
                                  </button>
                                </div>
                              </div>

                              {/* Inspector Display Panel */}
                              {inspectorTab === 'payload' && (
                                <div className="relative">
                                  <button
                                    onClick={() => handleCopyJson(log.requestPayload)}
                                    className="absolute right-3 top-3 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center space-x-1 text-[10px]"
                                  >
                                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                    <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                                  </button>
                                  <pre className="p-4 rounded-xl bg-slate-900 text-cyan-200 border border-slate-800 overflow-x-auto max-h-72 leading-relaxed text-[11px]">
                                    {JSON.stringify(log.requestPayload, null, 2)}
                                  </pre>
                                </div>
                              )}

                              {inspectorTab === 'headers' && (
                                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-[11px]">
                                  {Object.entries(log.requestHeaders).map(([k, v]) => (
                                    <div key={k} className="flex justify-between border-b border-slate-800/60 pb-1">
                                      <span className="text-indigo-300 font-bold">{k}:</span>
                                      <span className="text-slate-300">{v}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {inspectorTab === 'response' && (
                                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-[11px]">
                                  <div className="flex items-center justify-between text-slate-400">
                                    <span>Status: <strong className="text-emerald-400">{log.statusCode} {log.statusText}</strong></span>
                                    <span>Latency: {log.durationMs}ms</span>
                                  </div>
                                  <pre className="p-3 rounded-lg bg-slate-950 text-emerald-300 border border-slate-800 overflow-x-auto max-h-60">
                                    {log.responseBody}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
