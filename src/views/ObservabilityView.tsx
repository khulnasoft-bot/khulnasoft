import React, { useState } from 'react';
import { 
  Activity, 
  Cpu, 
  Terminal, 
  BarChart2, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Zap, 
  Sparkles, 
  DollarSign, 
  Radio, 
  Layers, 
  RefreshCw, 
  ExternalLink, 
  Flame, 
  ShieldAlert, 
  TrendingUp, 
  Server, 
  Database, 
  Bell, 
  GitBranch, 
  ArrowUpRight,
  Code2,
  Check,
  Send,
  SearchCode
} from 'lucide-react';
import { 
  MOCK_SERVICES_TELEMETRY, 
  MOCK_TRACES, 
  MOCK_ALERTS, 
  MicroserviceTelemetry, 
  TraceGroup 
} from '../components/ServiceObservabilityHub';
import { DiscoveryAnalytics } from '../components/DiscoveryAnalytics';

export const ObservabilityView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'discovery-analytics' | 'metrics' | 'logs' | 'traces' | 'alerts' | 'health-slo' | 'cost-tokens'
  >('overview');

  const [selectedServiceId, setSelectedServiceId] = useState<string>('all');
  const [promQlQuery, setPromQlQuery] = useState('sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))');
  const [logQlQuery, setLogQlQuery] = useState('{namespace="khulnasoft-prod"} |= "error"');
  const [logFilterLevel, setLogFilterLevel] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL');
  const [selectedTraceId, setSelectedTraceId] = useState<string>(MOCK_TRACES[0].traceId);
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredServices = selectedServiceId === 'all'
    ? MOCK_SERVICES_TELEMETRY
    : MOCK_SERVICES_TELEMETRY.filter(s => s.id === selectedServiceId);

  // Mock Loki Logs
  const [lokiLogs, setLokiLogs] = useState([
    { time: '08:39:01.042', service: 'khulnasoft/core-api', level: 'INFO', msg: 'gRPC request routed to /khulnasoft.v1.Gateway/Dispatch (latency: 1.2ms, status: 200)' },
    { time: '08:38:59.912', service: 'khulnasoft/ai-gateway', level: 'INFO', msg: 'Gemini 3.6 Flash streaming response initiated (tokens: 1,420, cost: $0.0028)' },
    { time: '08:38:42.120', service: 'khulnasoft/telemetry-collector', level: 'WARN', msg: 'Prometheus scrape target delay > 120ms; buffer queue capacity 88%' },
    { time: '08:38:10.004', service: 'khulnasoft/telemetry-collector', level: 'ERROR', msg: 'ClickHouse batch insert timeout; retrying span buffer insertion (attempt 2/5)' },
    { time: '08:37:45.890', service: 'khulnasoft/identity-service', level: 'INFO', msg: 'Token validation pass RS256 (key_id: kms-key-8821a)' },
    { time: '08:36:02.100', service: 'khulnasoft/payment-gateway', level: 'INFO', msg: 'Stripe webhook charge.succeeded processed (amount: $49.00)' }
  ]);

  const displayedLogs = lokiLogs.filter(l => {
    if (logFilterLevel !== 'ALL' && l.level !== logFilterLevel) return false;
    if (selectedServiceId !== 'all' && l.service !== MOCK_SERVICES_TELEMETRY.find(s => s.id === selectedServiceId)?.name) return false;
    return true;
  });

  const selectedTrace = MOCK_TRACES.find(t => t.traceId === selectedTraceId) || MOCK_TRACES[0];

  const totalTokens24h = MOCK_SERVICES_TELEMETRY.reduce((acc, s) => acc + s.aiTokensUsed24h, 0);
  const totalTokensCost24h = MOCK_SERVICES_TELEMETRY.reduce((acc, s) => acc + s.aiTokensCost24h, 0);
  const totalMonthlyCost = MOCK_SERVICES_TELEMETRY.reduce((acc, s) => acc + s.monthlyCost, 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans relative">
      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 p-3 px-4 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono text-xs shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-cyan-400 font-bold mb-1">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>OpenTelemetry, Prometheus, Grafana, Loki & Tempo Stack</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
              Full Stack Telemetry
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center space-x-3">
            <span>Enterprise Observability & AI Telemetry Suite</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Every service exports Metrics, Logs, Traces, Alerts, Health, Cost, Performance, and Gemini AI Token Usage.
          </p>
        </div>

        {/* Global Service Filter */}
        <div className="flex items-center space-x-3">
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono text-xs focus:border-cyan-500"
          >
            <option value="all">All Services (5 Microservices)</option>
            {MOCK_SERVICES_TELEMETRY.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-2 rounded-xl flex items-center space-x-1.5 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>SLA: 99.98%</span>
          </span>
        </div>
      </div>

      {/* Top Telemetry Feature Tabs */}
      <div className="flex items-center space-x-1 border-b border-slate-800 pb-2 overflow-x-auto font-mono text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-950 hover:bg-slate-800 text-slate-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Services Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('discovery-analytics')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'discovery-analytics'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-950 hover:bg-slate-800 text-slate-300'
          }`}
        >
          <SearchCode className="w-4 h-4" />
          <span>Discovery Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'metrics'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-950 hover:bg-slate-800 text-slate-300'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Metrics (Prometheus & Grafana)</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'logs'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-950 hover:bg-slate-800 text-slate-300'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Logs (Grafana Loki)</span>
        </button>

        <button
          onClick={() => setActiveTab('traces')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'traces'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-950 hover:bg-slate-800 text-slate-300'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>Traces (Grafana Tempo & OTel)</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'alerts'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-950 hover:bg-slate-800 text-slate-300'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Alerts (Alertmanager)</span>
        </button>

        <button
          onClick={() => setActiveTab('health-slo')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'health-slo'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-950 hover:bg-slate-800 text-slate-300'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Health & SLO Budgets</span>
        </button>

        <button
          onClick={() => setActiveTab('cost-tokens')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'cost-tokens'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-950 hover:bg-slate-800 text-slate-300'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Cost & AI Token Usage</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW OF ALL SERVICES */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Metric Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[10px] font-bold uppercase">TOTAL REQUEST THROUGHPUT</div>
              <div className="text-2xl font-black text-slate-100">82,970 RPS</div>
              <div className="text-[10px] text-emerald-400">P99 Avg Latency: 12.4ms</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[10px] font-bold uppercase">OTEL SPAN COLLECTOR</div>
              <div className="text-2xl font-black text-cyan-400">184,200 /s</div>
              <div className="text-[10px] text-cyan-300">Tempo Distributed Traces</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[10px] font-bold uppercase">AI TOKENS (24H)</div>
              <div className="text-2xl font-black text-indigo-400">18.5M</div>
              <div className="text-[10px] text-indigo-300">Gemini 3.6 Cost: ${totalTokensCost24h.toFixed(2)}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[10px] font-bold uppercase">TOTAL INFRA COST</div>
              <div className="text-2xl font-black text-emerald-400">${totalMonthlyCost.toLocaleString()}/mo</div>
              <div className="text-[10px] text-slate-400">Cloud Run / GKE Cluster Spend</div>
            </div>
          </div>

          {/* Service Export Status Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-100 font-bold flex items-center space-x-2 text-sm">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>Service Telemetry Exporters & Metrics Matrix</span>
              </span>
              <span className="text-[10px] text-slate-500">5 Microservices Operational</span>
            </div>

            <div className="space-y-3">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        service.status === 'HEALTHY' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`} />
                      <span className="font-bold text-slate-100 text-sm">{service.name}</span>
                      <span className="text-[10px] text-slate-500">[{service.namespace}]</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800 text-[10px] font-bold">
                        {service.otelExporterStatus}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                        SLO: {service.sloCurrent}%
                      </span>
                    </div>
                  </div>

                  {/* Telemetry Metrics Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-[11px] pt-2 border-t border-slate-900">
                    <div>
                      <span className="text-slate-500 text-[9px] block">RPS THROUGHPUT</span>
                      <span className="text-slate-200 font-bold">{service.rps.toLocaleString()}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[9px] block">P95 LATENCY</span>
                      <span className="text-cyan-400 font-bold">{service.p95LatencyMs} ms</span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[9px] block">P99 LATENCY</span>
                      <span className="text-indigo-400 font-bold">{service.p99LatencyMs} ms</span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[9px] block">CPU / RAM</span>
                      <span className="text-slate-300 font-bold">{service.cpuUsagePct}% / {service.memUsagePct}%</span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[9px] block">AI TOKENS (24H)</span>
                      <span className="text-emerald-400 font-bold">
                        {service.aiTokensUsed24h > 0 ? `${(service.aiTokensUsed24h / 1000000).toFixed(1)}M` : '0'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[9px] block">INFRA COST</span>
                      <span className="text-slate-200 font-bold">${service.monthlyCost}/mo</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DISCOVERY ANALYTICS TAB */}
      {activeTab === 'discovery-analytics' && (
        <DiscoveryAnalytics />
      )}

      {/* TAB 2: METRICS (PROMETHEUS & GRAFANA) */}
      {activeTab === 'metrics' && (
        <div className="space-y-5 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-200 font-bold flex items-center space-x-2 text-sm">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <span>Prometheus PromQL Query Builder & Grafana Dashboard</span>
              </span>
              <span className="text-emerald-400 font-bold text-[10px]">Prometheus Scrape Interval: 15s</span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={promQlQuery}
                onChange={(e) => setPromQlQuery(e.target.value)}
                placeholder="Enter PromQL expression (e.g. rate(http_requests_total[5m]))..."
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2 text-cyan-300 text-xs font-mono"
              />
              <button
                onClick={() => showToast('PromQL query executed on PrometheusTSDB!')}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-xl font-bold cursor-pointer transition-all shrink-0"
              >
                Execute PromQL
              </button>
            </div>
          </div>

          {/* Mock Grafana Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-slate-300 font-bold">
                <span>Request Rate (RPS per Microservice)</span>
                <span className="text-[10px] text-cyan-400">http_requests_total</span>
              </div>
              <div className="h-40 bg-slate-950 rounded-xl border border-slate-800 p-3 flex items-end justify-between space-x-2">
                <div className="w-1/5 bg-cyan-500 rounded-t h-[80%] text-[9px] text-slate-950 font-bold text-center pt-1">core-api</div>
                <div className="w-1/5 bg-indigo-500 rounded-t h-[30%] text-[9px] text-white font-bold text-center pt-1">ai-gw</div>
                <div className="w-1/5 bg-emerald-500 rounded-t h-[60%] text-[9px] text-slate-950 font-bold text-center pt-1">identity</div>
                <div className="w-1/5 bg-purple-500 rounded-t h-[95%] text-[9px] text-white font-bold text-center pt-1">collector</div>
                <div className="w-1/5 bg-amber-500 rounded-t h-[20%] text-[9px] text-slate-950 font-bold text-center pt-1">payment</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-slate-300 font-bold">
                <span>P99 Latency Distribution (ms)</span>
                <span className="text-[10px] text-indigo-400">http_request_duration_seconds</span>
              </div>
              <div className="h-40 bg-slate-950 rounded-xl border border-slate-800 p-3 flex items-end justify-between space-x-2">
                <div className="w-1/5 bg-emerald-500/80 rounded-t h-[25%] text-[9px] text-slate-950 font-bold text-center pt-1">11.8ms</div>
                <div className="w-1/5 bg-amber-500 rounded-t h-[90%] text-[9px] text-slate-950 font-bold text-center pt-1">380ms</div>
                <div className="w-1/5 bg-emerald-500/80 rounded-t h-[15%] text-[9px] text-slate-950 font-bold text-center pt-1">6.4ms</div>
                <div className="w-1/5 bg-indigo-500 rounded-t h-[45%] text-[9px] text-white font-bold text-center pt-1">45.1ms</div>
                <div className="w-1/5 bg-emerald-500/80 rounded-t h-[30%] text-[9px] text-slate-950 font-bold text-center pt-1">22.4ms</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LOGS (GRAFANA LOKI) */}
      {activeTab === 'logs' && (
        <div className="space-y-5 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-slate-200 font-bold flex items-center space-x-2 text-sm">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Grafana Loki LogQL Live Stream Tailer</span>
              </span>

              <div className="flex items-center space-x-2">
                {['ALL', 'INFO', 'WARN', 'ERROR'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLogFilterLevel(lvl as any)}
                    className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                      logFilterLevel === lvl ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={logQlQuery}
                onChange={(e) => setLogQlQuery(e.target.value)}
                placeholder="LogQL expression (e.g. {app='core-api'} |= 'error')..."
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2 text-cyan-300 text-xs font-mono"
              />
              <button
                onClick={() => showToast('Loki stream query filter refreshed!')}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-xl font-bold cursor-pointer shrink-0"
              >
                Tail Loki Logs
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 max-h-[400px] overflow-y-auto font-mono text-xs">
            {displayedLogs.map((log, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-start space-x-3">
                <span className="text-slate-500 text-[10px] shrink-0">{log.time}</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800 text-[10px] font-bold shrink-0">
                  {log.service}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                  log.level === 'ERROR' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                  log.level === 'WARN' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  [{log.level}]
                </span>
                <span className="text-slate-200 text-xs">{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TRACES (GRAFANA TEMPO & OPENTELEMETRY) */}
      {activeTab === 'traces' && (
        <div className="space-y-5 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-200 font-bold flex items-center space-x-2 text-sm">
                <GitBranch className="w-4 h-4 text-indigo-400" />
                <span>Grafana Tempo & OpenTelemetry Distributed Trace Waterfall</span>
              </span>
              <span className="text-cyan-400 text-[10px]">OTLP/gRPC Collector Active</span>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              {MOCK_TRACES.map((t) => (
                <button
                  key={t.traceId}
                  onClick={() => setSelectedTraceId(t.traceId)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer shrink-0 transition-all ${
                    selectedTraceId === t.traceId
                      ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-slate-100 text-xs">{t.traceId}</div>
                  <div className="text-[10px] text-indigo-300">{t.totalDurationMs} ms • HTTP {t.httpStatus}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Trace Span Waterfall Tree */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-200 font-bold">
                Trace Details: <span className="text-indigo-400">{selectedTrace.traceId}</span> ({selectedTrace.spans.length} Spans)
              </span>
              <span className="text-slate-400 text-[10px]">{selectedTrace.timestamp}</span>
            </div>

            <div className="space-y-2">
              {selectedTrace.spans.map((span, idx) => {
                const widthPct = Math.max(10, Math.round((span.durationMs / selectedTrace.totalDurationMs) * 100));

                return (
                  <div key={span.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 text-xs">
                        {span.service} → <span className="text-cyan-300">{span.operation}</span>
                      </span>
                      <span className={`text-[11px] font-bold ${
                        span.statusCode === 'ERROR' ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {span.durationMs} ms
                      </span>
                    </div>

                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full ${span.statusCode === 'ERROR' ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-cyan-400'}`}
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ALERTS (PROMETHEUS ALERTMANAGER) */}
      {activeTab === 'alerts' && (
        <div className="space-y-5 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-200 font-bold flex items-center space-x-2 text-sm">
                <Bell className="w-4 h-4 text-rose-400" />
                <span>Prometheus Alertmanager & PagerDuty Integration</span>
              </span>

              <button
                onClick={() => showToast('Test alert payload dispatched to Slack & PagerDuty!')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl font-bold cursor-pointer text-xs"
              >
                Trigger Test Alert
              </button>
            </div>

            <div className="space-y-3">
              {alerts.map((alt) => (
                <div key={alt.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        alt.status === 'FIRING' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400'
                      }`}>
                        {alt.status}
                      </span>
                      <span className="font-bold text-slate-100 text-sm">{alt.name}</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">{alt.activeSince}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 text-[11px]">
                    Condition: {alt.condition}
                  </div>
                  <div className="text-slate-400 text-[10px]">Target Service: {alt.service}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: HEALTH & SERVICE SLOs */}
      {activeTab === 'health-slo' && (
        <div className="space-y-5 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <span className="text-slate-200 font-bold flex items-center space-x-2 text-sm">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Service Level Objectives (SLOs) & Error Budget Burning</span>
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_SERVICES_TELEMETRY.map((s) => (
                <div key={s.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-sm">{s.name}</span>
                    <span className="text-emerald-400 font-bold">SLO Target: {s.sloTarget}%</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Current Uptime SLO:</span>
                      <span className="text-slate-200 font-bold">{s.sloCurrent}%</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Error Budget Remaining:</span>
                      <span className="text-indigo-400 font-bold">{s.errorBudgetRemaining}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                        style={{ width: `${s.errorBudgetRemaining}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: COST & AI TOKEN USAGE METERING */}
      {activeTab === 'cost-tokens' && (
        <div className="space-y-5 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <span className="text-slate-200 font-bold flex items-center space-x-2 text-sm">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Gemini 3.6 AI Token Usage Metering & Infrastructure Spend</span>
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-slate-400 text-[10px] font-bold uppercase">24H AI TOKENS CONSUMED</span>
                <div className="text-2xl font-black text-cyan-400">{totalTokens24h.toLocaleString()} Tokens</div>
                <div className="text-[10px] text-slate-500">Across Gemini 3.6 Flash & Pro</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-slate-400 text-[10px] font-bold uppercase">24H AI API COST</span>
                <div className="text-2xl font-black text-emerald-400">${totalTokensCost24h.toFixed(2)}</div>
                <div className="text-[10px] text-emerald-300">Measured per 1M tokens</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-slate-400 text-[10px] font-bold uppercase">MONTHLY COMPUTE & EGRESS</span>
                <div className="text-2xl font-black text-indigo-400">${totalMonthlyCost.toLocaleString()}/mo</div>
                <div className="text-[10px] text-indigo-300">Cloud Run & GKE Nodes</div>
              </div>
            </div>

            {/* Token breakdown per service */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="text-slate-200 font-bold border-b border-slate-800 pb-2">
                Microservice AI Token Metering Table
              </div>

              <div className="space-y-2">
                {MOCK_SERVICES_TELEMETRY.map((s) => (
                  <div key={s.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-100">{s.name}</div>
                      <div className="text-[10px] text-slate-500">Model: Gemini 3.6 Flash</div>
                    </div>

                    <div className="text-right">
                      <div className="text-cyan-400 font-bold">{s.aiTokensUsed24h.toLocaleString()} Tokens</div>
                      <div className="text-[10px] text-emerald-400">${s.aiTokensCost24h.toFixed(2)} 24h cost</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
