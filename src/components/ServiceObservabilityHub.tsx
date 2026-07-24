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
  Check
} from 'lucide-react';

export interface MicroserviceTelemetry {
  id: string;
  name: string;
  namespace: string;
  status: 'HEALTHY' | 'DEGRADED' | 'WARNING';
  sloTarget: number; // e.g. 99.9%
  sloCurrent: number; // e.g. 99.94%
  errorBudgetRemaining: number; // e.g. 84%
  rps: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  cpuUsagePct: number;
  memUsagePct: number;
  monthlyCost: number;
  aiTokensUsed24h: number; // e.g., 1,240,000 tokens
  aiTokensCost24h: number; // e.g., $2.48
  otelExporterStatus: 'OTLP/gRPC Active' | 'Prometheus Scraping' | 'Degraded';
}

export const MOCK_SERVICES_TELEMETRY: MicroserviceTelemetry[] = [
  {
    id: 'core-api',
    name: 'khulnasoft/core-api',
    namespace: 'khulnasoft-prod',
    status: 'HEALTHY',
    sloTarget: 99.9,
    sloCurrent: 99.98,
    errorBudgetRemaining: 92.4,
    rps: 18450,
    p95LatencyMs: 4.2,
    p99LatencyMs: 11.8,
    cpuUsagePct: 42,
    memUsagePct: 58,
    monthlyCost: 340,
    aiTokensUsed24h: 0,
    aiTokensCost24h: 0,
    otelExporterStatus: 'OTLP/gRPC Active'
  },
  {
    id: 'ai-gateway',
    name: 'khulnasoft/ai-gateway',
    namespace: 'khulnasoft-prod',
    status: 'HEALTHY',
    sloTarget: 99.5,
    sloCurrent: 99.85,
    errorBudgetRemaining: 88.0,
    rps: 3200,
    p95LatencyMs: 142.0,
    p99LatencyMs: 380.0,
    cpuUsagePct: 65,
    memUsagePct: 74,
    monthlyCost: 890,
    aiTokensUsed24h: 18450000,
    aiTokensCost24h: 36.90,
    otelExporterStatus: 'OTLP/gRPC Active'
  },
  {
    id: 'identity-service',
    name: 'khulnasoft/identity-service',
    namespace: 'security-zero-trust',
    status: 'HEALTHY',
    sloTarget: 99.99,
    sloCurrent: 99.99,
    errorBudgetRemaining: 98.2,
    rps: 12100,
    p95LatencyMs: 2.1,
    p99LatencyMs: 6.4,
    cpuUsagePct: 31,
    memUsagePct: 44,
    monthlyCost: 210,
    aiTokensUsed24h: 0,
    aiTokensCost24h: 0,
    otelExporterStatus: 'OTLP/gRPC Active'
  },
  {
    id: 'telemetry-collector',
    name: 'khulnasoft/telemetry-collector',
    namespace: 'monitoring',
    status: 'WARNING',
    sloTarget: 99.9,
    sloCurrent: 99.72,
    errorBudgetRemaining: 48.0,
    rps: 48200,
    p95LatencyMs: 18.4,
    p99LatencyMs: 45.1,
    cpuUsagePct: 84,
    memUsagePct: 88,
    monthlyCost: 620,
    aiTokensUsed24h: 120000,
    aiTokensCost24h: 0.24,
    otelExporterStatus: 'Prometheus Scraping'
  },
  {
    id: 'payment-gateway',
    name: 'khulnasoft/payment-gateway',
    namespace: 'finance',
    status: 'HEALTHY',
    sloTarget: 99.99,
    sloCurrent: 100.0,
    errorBudgetRemaining: 100.0,
    rps: 1420,
    p95LatencyMs: 8.9,
    p99LatencyMs: 22.4,
    cpuUsagePct: 28,
    memUsagePct: 38,
    monthlyCost: 450,
    aiTokensUsed24h: 0,
    aiTokensCost24h: 0,
    otelExporterStatus: 'OTLP/gRPC Active'
  }
];

export interface TraceSpan {
  id: string;
  service: string;
  operation: string;
  durationMs: number;
  statusCode: 'OK' | 'ERROR';
  childSpans?: TraceSpan[];
}

export interface TraceGroup {
  traceId: string;
  rootService: string;
  totalDurationMs: number;
  timestamp: string;
  httpStatus: number;
  spans: TraceSpan[];
}

export const MOCK_TRACES: TraceGroup[] = [
  {
    traceId: 'tr-8f92a10b4c',
    rootService: 'khulnasoft/core-api',
    totalDurationMs: 184.2,
    timestamp: '2026-07-24 08:38:12.102',
    httpStatus: 200,
    spans: [
      { id: 'sp-1', service: 'core-api', operation: 'POST /api/gemini/chat', durationMs: 184.2, statusCode: 'OK' },
      { id: 'sp-2', service: 'identity-service', operation: 'gRPC /Auth.ValidateToken', durationMs: 3.4, statusCode: 'OK' },
      { id: 'sp-3', service: 'ai-gateway', operation: 'Gemini.GenerateStream (3.6 Flash)', durationMs: 168.0, statusCode: 'OK' },
      { id: 'sp-4', service: 'telemetry-collector', operation: 'OTel.ExportSpanContext', durationMs: 2.8, statusCode: 'OK' },
    ]
  },
  {
    traceId: 'tr-3e110c9d7a',
    rootService: 'khulnasoft/payment-gateway',
    totalDurationMs: 42.1,
    timestamp: '2026-07-24 08:37:45.890',
    httpStatus: 200,
    spans: [
      { id: 'sp-10', service: 'payment-gateway', operation: 'POST /v1/charges', durationMs: 42.1, statusCode: 'OK' },
      { id: 'sp-11', service: 'identity-service', operation: 'gRPC /Auth.ValidateToken', durationMs: 2.1, statusCode: 'OK' },
      { id: 'sp-12', service: 'core-api', operation: 'PostgreSQL.TxCommit', durationMs: 14.2, statusCode: 'OK' }
    ]
  },
  {
    traceId: 'tr-[ERROR]-99120a',
    rootService: 'khulnasoft/telemetry-collector',
    totalDurationMs: 820.5,
    timestamp: '2026-07-24 08:36:10.004',
    httpStatus: 504,
    spans: [
      { id: 'sp-20', service: 'telemetry-collector', operation: 'ClickHouse.BatchInsertSpans', durationMs: 820.5, statusCode: 'ERROR' }
    ]
  }
];

export interface AlertRule {
  id: string;
  name: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  service: string;
  condition: string;
  status: 'FIRING' | 'RESOLVED' | 'PENDING';
  activeSince: string;
}

export const MOCK_ALERTS: AlertRule[] = [
  {
    id: 'alt-1',
    name: 'TelemetryCollectorHighMemoryUsage',
    severity: 'WARNING',
    service: 'khulnasoft/telemetry-collector',
    condition: 'container_memory_working_set_bytes > 85%',
    status: 'FIRING',
    activeSince: '14 mins ago'
  },
  {
    id: 'alt-2',
    name: 'AIGatewayGeminiTokenQuotaApproaching',
    severity: 'WARNING',
    service: 'khulnasoft/ai-gateway',
    condition: 'rate(ai_tokens_consumed_total[5m]) > 100k/min',
    status: 'FIRING',
    activeSince: '2 hours ago'
  },
  {
    id: 'alt-3',
    name: 'CoreApiP99LatencyBreach',
    severity: 'CRITICAL',
    service: 'khulnasoft/core-api',
    condition: 'histogram_quantile(0.99, http_request_duration_seconds_bucket) > 50ms',
    status: 'RESOLVED',
    activeSince: 'Yesterday 14:00'
  }
];
