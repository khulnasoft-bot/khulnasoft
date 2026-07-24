import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Flame, 
  TrendingUp, 
  Filter, 
  Activity, 
  CheckCircle2, 
  Server, 
  Zap, 
  Layers, 
  BarChart2, 
  Info,
  ChevronRight
} from 'lucide-react';

export type EnvironmentType = 'all' | 'kubernetes' | 'docker' | 'vm' | 'baremetal' | 'edge' | 'cloud';

interface HeatmapCellData {
  dayIndex: number; // 0 = Mon, 6 = Sun
  hourIndex: number; // 0 to 23
  dayName: string;
  hourLabel: string;
  count: number;
  environmentCounts: Record<EnvironmentType, number>;
  successRate: number;
  topReleaseTag: string;
}

interface DailyHeatmapCellData {
  dateStr: string;
  dayOfWeek: string;
  count: number;
  environment: string;
  successRate: number;
  releaseTag: string;
}

export const DeploymentHeatmap: React.FC = () => {
  const [selectedEnv, setSelectedEnv] = useState<EnvironmentType>('all');
  const [viewMode, setViewMode] = useState<'hourly_week' | 'calendar_90day'>('hourly_week');
  const [hoveredCell, setHoveredCell] = useState<HeatmapCellData | null>(null);
  const [selectedCell, setSelectedCell] = useState<HeatmapCellData | null>(null);

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  // Generate deterministic pseudo-realistic heatmap data matrix (7 days x 24 hours)
  const generateHourWeekMatrix = (): HeatmapCellData[][] => {
    return DAYS.map((dayName, dayIndex) => {
      return HOURS.map((hourLabel, hourIndex) => {
        // Higher intensity during work hours (10:00 to 18:00) on weekdays (Mon-Fri)
        const isWeekday = dayIndex < 5;
        const isPeakHours = hourIndex >= 13 && hourIndex <= 17; // 1pm - 5pm UTC
        const isMorningWork = hourIndex >= 9 && hourIndex <= 12;

        let baseCount = 0;
        if (isWeekday) {
          if (isPeakHours) baseCount = 12 + ((dayIndex * 3 + hourIndex * 7) % 11);
          else if (isMorningWork) baseCount = 5 + ((dayIndex * 2 + hourIndex * 3) % 7);
          else baseCount = (dayIndex + hourIndex) % 3;
        } else {
          // Weekend minimal deployments
          baseCount = (dayIndex * 3 + hourIndex) % 2;
        }

        // Adjust count based on selected environment
        let count = baseCount;
        if (selectedEnv === 'kubernetes') count = Math.round(baseCount * 0.45);
        else if (selectedEnv === 'docker') count = Math.round(baseCount * 0.25);
        else if (selectedEnv === 'cloud') count = Math.round(baseCount * 0.15);
        else if (selectedEnv === 'edge') count = Math.round(baseCount * 0.08);
        else if (selectedEnv === 'vm') count = Math.round(baseCount * 0.05);
        else if (selectedEnv === 'baremetal') count = Math.round(baseCount * 0.02);

        const envCounts: Record<EnvironmentType, number> = {
          all: count,
          kubernetes: Math.max(1, Math.round(count * 0.42)),
          docker: Math.max(0, Math.round(count * 0.24)),
          cloud: Math.max(0, Math.round(count * 0.15)),
          edge: Math.max(0, Math.round(count * 0.09)),
          vm: Math.max(0, Math.round(count * 0.06)),
          baremetal: Math.max(0, Math.round(count * 0.04))
        };

        const successRate = count === 0 ? 100 : Math.min(100, Math.max(92, 98.5 + ((dayIndex + hourIndex) % 3) * 0.5));
        const tags = ['v2.4.0', 'v2.3.9-patch', 'v2.4.1-rc2', 'v2.3.8', 'v2.5.0-alpha', 'hotfix-auth-3'];
        const topReleaseTag = tags[(dayIndex * 2 + hourIndex) % tags.length];

        return {
          dayIndex,
          hourIndex,
          dayName,
          hourLabel,
          count,
          environmentCounts: envCounts,
          successRate: Number(successRate.toFixed(1)),
          topReleaseTag
        };
      });
    });
  };

  const hourWeekMatrix = generateHourWeekMatrix();

  // Generate 90-day calendar heatmap data
  const generate90DayData = (): DailyHeatmapCellData[] => {
    const list: DailyHeatmapCellData[] = [];
    const today = new Date('2026-07-24');
    for (let i = 89; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = DAYS[(d.getDay() + 6) % 7]; // Mon = 0
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;

      let count = isWeekend ? (i % 3) : (5 + (i * 7) % 18);
      if (selectedEnv !== 'all') {
        count = Math.max(0, Math.round(count * 0.3));
      }

      const envs = ['Kubernetes Cluster', 'Docker Compose', 'GCP Cloud Run', 'K3s Edge', 'AWS EC2 VM', 'Bare Metal'];
      const releaseTag = `v2.${(i % 5) + 1}.${i % 10}`;

      list.push({
        dateStr,
        dayOfWeek,
        count,
        environment: envs[i % envs.length],
        successRate: Number((98 + (i % 3) * 0.7).toFixed(1)),
        releaseTag
      });
    }
    return list;
  };

  const daily90DayData = generate90DayData();

  // Color intensity helper
  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-slate-950 border-slate-800/60 text-slate-700';
    if (count <= 2) return 'bg-cyan-950/80 text-cyan-300 border-cyan-900/60';
    if (count <= 6) return 'bg-cyan-800/80 text-cyan-100 border-cyan-600 font-bold';
    if (count <= 12) return 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold shadow-sm shadow-cyan-500/20';
    return 'bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-950 font-black shadow-md shadow-cyan-500/40';
  };

  const activeCell = selectedCell || hoveredCell || hourWeekMatrix[1][15]; // Default Tuesday 15:00

  // Total deployments calculation
  const totalDeployments = hourWeekMatrix.flat().reduce((sum, cell) => sum + cell.count, 0);

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold mb-1">
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>Deployment Activity Heatmap & Frequency Analytics</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px]">
              Peak Release Windows
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-100 flex items-center space-x-3">
            <span>Production Deployment Heatmap</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Calendar-based frequency matrix mapping release density across 24-hour timeframes, days of the week, and deployment targets.
          </p>
        </div>

        {/* View Mode & Environment Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Environment Filter Selector */}
          <div className="flex items-center space-x-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-bold">Target:</span>
            <select
              value={selectedEnv}
              onChange={(e) => setSelectedEnv(e.target.value as EnvironmentType)}
              className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-slate-200">All Environments</option>
              <option value="kubernetes" className="bg-slate-900 text-slate-200">Kubernetes Cluster</option>
              <option value="docker" className="bg-slate-900 text-slate-200">Docker Containers</option>
              <option value="cloud" className="bg-slate-900 text-slate-200">Cloud Serverless</option>
              <option value="edge" className="bg-slate-900 text-slate-200">K3s Edge Nodes</option>
              <option value="vm" className="bg-slate-900 text-slate-200">Virtual Machines</option>
              <option value="baremetal" className="bg-slate-900 text-slate-200">Bare Metal</option>
            </select>
          </div>

          {/* Toggle View Mode */}
          <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('hourly_week')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                viewMode === 'hourly_week'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              24h x Day Matrix
            </button>
            <button
              onClick={() => setViewMode('calendar_90day')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                viewMode === 'calendar_90day'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              90-Day Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Analytics KPI Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase font-bold flex items-center space-x-1">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Weekly Release Volume</span>
          </div>
          <div className="text-lg font-black text-cyan-300">{totalDeployments} <span className="text-xs font-normal text-slate-400">deployments</span></div>
          <div className="text-[10px] text-emerald-400 font-bold">↑ 18% vs previous period</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase font-bold flex items-center space-x-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Peak Release Window</span>
          </div>
          <div className="text-sm font-black text-amber-300">Tue & Thu (14:00-16:00 UTC)</div>
          <div className="text-[10px] text-slate-400">Highest velocity release window</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase font-bold flex items-center space-x-1">
            <Server className="w-3.5 h-3.5 text-indigo-400" />
            <span>Top Target Runtime</span>
          </div>
          <div className="text-sm font-black text-indigo-300">Kubernetes (42.8%)</div>
          <div className="text-[10px] text-slate-400">followed by Docker (24.1%)</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pipeline Success Rate</span>
          </div>
          <div className="text-lg font-black text-emerald-400">99.4%</div>
          <div className="text-[10px] text-slate-400">MTTD: 3m 42s average</div>
        </div>
      </div>

      {/* HEATMAP VIEW 1: 24-Hour x Day-of-Week Grid */}
      {viewMode === 'hourly_week' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Hover or click any cell to inspect hourly release metrics:</span>
            {/* Legend */}
            <div className="flex items-center space-x-2 text-[10px]">
              <span className="text-slate-500">Frequency:</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-600">0</span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-900">1-2</span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-800 text-cyan-100 border border-cyan-600 font-bold">3-6</span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-500 text-slate-950 font-extrabold">7-12</span>
              <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-black">13+ Peak</span>
            </div>
          </div>

          {/* Heatmap Grid Matrix */}
          <div className="overflow-x-auto pb-2 scrollbar-none">
            <div className="min-w-[800px] space-y-1 font-mono text-xs">
              {/* Hours Header Row */}
              <div className="grid grid-cols-25 gap-1 text-[9px] text-slate-500 text-center font-bold">
                <div className="text-left pl-1">Day/UTC</div>
                {HOURS.map((h, idx) => (
                  <div key={idx} className="truncate">
                    {idx % 2 === 0 ? h.split(':')[0] : ''}
                  </div>
                ))}
              </div>

              {/* Day Rows */}
              {hourWeekMatrix.map((dayRow, dayIdx) => (
                <div key={dayIdx} className="grid grid-cols-25 gap-1 items-center">
                  <div className="text-xs font-bold text-slate-300 pr-2 font-mono">
                    {DAYS[dayIdx]}
                  </div>

                  {dayRow.map((cell, hourIdx) => {
                    const isSelected = selectedCell?.dayIndex === dayIdx && selectedCell?.hourIndex === hourIdx;

                    return (
                      <button
                        key={hourIdx}
                        onClick={() => setSelectedCell(cell)}
                        onMouseEnter={() => setHoveredCell(cell)}
                        className={`h-7 rounded transition-all cursor-pointer flex items-center justify-center text-[10px] font-bold border ${getIntensityClass(cell.count)} ${
                          isSelected ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-900 z-10 scale-110' : 'hover:scale-110'
                        }`}
                        title={`${cell.dayName} ${cell.hourLabel} UTC: ${cell.count} deployments`}
                      >
                        {cell.count > 0 ? cell.count : ''}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HEATMAP VIEW 2: 90-Day Calendar Heatmap Grid */}
      {viewMode === 'calendar_90day' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span>Daily deployment intensity over the past 90 days:</span>
            <span className="text-[10px] text-cyan-400">Total 90-Day Deployments: {daily90DayData.reduce((acc, d) => acc + d.count, 0)}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-18 lg:grid-cols-30 gap-1.5">
              {daily90DayData.map((d, idx) => {
                const intensity = d.count === 0 
                  ? 'bg-slate-900/60 border-slate-800 text-slate-700'
                  : d.count < 5 
                  ? 'bg-cyan-950 text-cyan-400 border-cyan-900'
                  : d.count < 12 
                  ? 'bg-cyan-700 text-cyan-100 font-bold border-cyan-500'
                  : 'bg-emerald-400 text-slate-950 font-black shadow-sm';

                return (
                  <div
                    key={idx}
                    className={`h-8 rounded-lg border p-1 flex flex-col justify-between text-[9px] hover:scale-110 transition-all cursor-pointer ${intensity}`}
                    title={`${d.dateStr} (${d.dayOfWeek}): ${d.count} releases via ${d.environment}`}
                  >
                    <div className="font-bold">{d.dateStr.split('-')[2]}</div>
                    {d.count > 0 && <div className="text-[8px] opacity-90">{d.count}d</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Inspector Box for Hovered / Selected Heatmap Cell */}
      {activeCell && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-2 gap-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-slate-100 text-sm">
                {activeCell.dayName} at {activeCell.hourLabel} UTC Window
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px]">
                {activeCell.count} Deployments Total
              </span>
            </div>

            <div className="text-slate-400 text-[11px]">
              Success Rate: <strong className="text-emerald-400">{activeCell.successRate}%</strong> • Top Release Tag: <strong className="text-cyan-300">{activeCell.topReleaseTag}</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[10px]">
            <div className="p-2 rounded bg-slate-900 border border-slate-800 space-y-0.5">
              <div className="text-slate-500">Kubernetes</div>
              <div className="text-cyan-300 font-bold text-xs">{activeCell.environmentCounts.kubernetes} releases</div>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800 space-y-0.5">
              <div className="text-slate-500">Docker Containers</div>
              <div className="text-indigo-300 font-bold text-xs">{activeCell.environmentCounts.docker} releases</div>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800 space-y-0.5">
              <div className="text-slate-500">Cloud Serverless</div>
              <div className="text-emerald-300 font-bold text-xs">{activeCell.environmentCounts.cloud} releases</div>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800 space-y-0.5">
              <div className="text-slate-500">K3s Edge Nodes</div>
              <div className="text-amber-300 font-bold text-xs">{activeCell.environmentCounts.edge} releases</div>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800 space-y-0.5">
              <div className="text-slate-500">Virtual Machines</div>
              <div className="text-slate-300 font-bold text-xs">{activeCell.environmentCounts.vm} releases</div>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800 space-y-0.5">
              <div className="text-slate-500">Bare Metal</div>
              <div className="text-rose-300 font-bold text-xs">{activeCell.environmentCounts.baremetal} releases</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
