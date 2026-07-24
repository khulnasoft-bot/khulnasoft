import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  GitCommit, 
  BarChart2, 
  PieChart as PieIcon, 
  TrendingUp, 
  Zap, 
  Calendar, 
  RefreshCw,
  Sparkles,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { Repository, RepoHealthMetrics, CommitFrequencyDataPoint, BuildHistoryDataPoint } from '../types';

interface RepoHealthD3ChartsProps {
  repository: Repository;
}

// Deterministic mock health metric generator for repositories
export function getOrCreateHealthMetrics(repo: Repository, timeframeDays: number = 30): RepoHealthMetrics {
  if (repo.healthMetrics) {
    return repo.healthMetrics;
  }

  // Seed based on repo id
  let hash = 0;
  for (let i = 0; i < repo.id.length; i++) {
    hash = (hash << 5) - hash + repo.id.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);

  const commitFrequency: CommitFrequencyDataPoint[] = [];
  const buildHistory: BuildHistoryDataPoint[] = [];

  const now = new Date('2026-07-24T00:00:00Z');
  let totalCommits = 0;
  let totalBuilds = 0;
  let passedBuilds = 0;
  let failedBuilds = 0;

  for (let i = timeframeDays - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Day of week factor (fewer commits on weekends)
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Pseudo-random commits count
    const pseudoVal = Math.sin(seed + i * 1.7) * 0.5 + 0.5;
    const baseCommits = isWeekend ? Math.floor(pseudoVal * 3) : Math.floor(pseudoVal * 12) + 2;
    const authors = Math.max(1, Math.floor(baseCommits / 3) + 1);

    commitFrequency.push({
      date: dateStr,
      commits: baseCommits,
      authorsCount: authors,
    });
    totalCommits += baseCommits;

    // Generate 1-2 builds per day
    const buildsToday = isWeekend ? 1 : Math.floor((pseudoVal * 100) % 3) + 1;
    for (let b = 0; b < buildsToday; b++) {
      totalBuilds++;
      const buildFailChance = (100 - repo.testCoverage) / 150; // lower test coverage = slightly higher build fail chance
      const isFailed = Math.sin(seed + i * 3.1 + b) < (buildFailChance - 0.35);
      const isCancelled = !isFailed && Math.sin(seed + i * 5.3 + b) > 0.92;

      const status: 'success' | 'failed' | 'cancelled' = isFailed ? 'failed' : isCancelled ? 'cancelled' : 'success';
      if (status === 'success') passedBuilds++;
      if (status === 'failed') failedBuilds++;

      const durationSec = Math.floor(45 + Math.abs(Math.sin(seed + i + b) * 90));
      const currentSuccessRate = totalBuilds > 0 ? (passedBuilds / totalBuilds) * 100 : 100;

      buildHistory.push({
        buildNumber: 100 + totalBuilds,
        date: dateStr,
        status,
        durationSec,
        successRate: parseFloat(currentSuccessRate.toFixed(1)),
      });
    }
  }

  const buildSuccessRate = totalBuilds > 0 ? parseFloat(((passedBuilds / totalBuilds) * 100).toFixed(1)) : 98.5;
  const avgDuration = buildHistory.length > 0 
    ? Math.round(buildHistory.reduce((acc, curr) => acc + curr.durationSec, 0) / buildHistory.length) 
    : 62;

  return {
    buildSuccessRate,
    totalBuilds30Days: totalBuilds,
    passedBuilds30Days: passedBuilds,
    failedBuilds30Days: failedBuilds,
    avgBuildDurationSec: avgDuration,
    totalCommits30Days: totalCommits,
    activeContributors30Days: repo.contributors.length,
    meanTimeToRecoveryMinutes: Math.round(12 + (100 - repo.securityScore) * 0.4),
    commitFrequency,
    buildHistory,
  };
}

export const RepoHealthD3Charts: React.FC<RepoHealthD3ChartsProps> = ({ repository }) => {
  const [timeframeDays, setTimeframeDays] = useState<number>(30);
  const [selectedHoverPoint, setSelectedHoverPoint] = useState<{ date: string; commits: number; authors: number } | null>(null);
  const [selectedBuildHover, setSelectedBuildHover] = useState<BuildHistoryDataPoint | null>(null);

  const metrics = getOrCreateHealthMetrics(repository, timeframeDays);

  // D3 Refs
  const commitChartSvgRef = useRef<SVGSVGElement | null>(null);
  const buildSuccessGaugeSvgRef = useRef<SVGSVGElement | null>(null);
  const buildTrendSvgRef = useRef<SVGSVGElement | null>(null);

  // Render D3 Commit Frequency Chart
  useEffect(() => {
    if (!commitChartSvgRef.current) return;

    const svg = d3.select(commitChartSvgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const width = 640;
    const height = 210;
    const margin = { top: 20, right: 20, bottom: 35, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = metrics.commitFrequency;

    // Parse dates
    const parseDate = d3.timeParse('%Y-%m-%d');
    const formattedData = data.map((d) => ({
      ...d,
      parsedDate: parseDate(d.date) || new Date(),
    }));

    // Scales
    const xScale = d3
      .scaleBand<string>()
      .domain(data.map((d) => d.date))
      .range([0, innerWidth])
      .padding(0.25);

    const xTimeScale = d3
      .scaleTime()
      .domain(d3.extent(formattedData, (d) => d.parsedDate) as [Date, Date])
      .range([0, innerWidth]);

    const maxCommits = d3.max(data, (d) => d.commits) || 10;
    const yScale = d3
      .scaleLinear()
      .domain([0, Math.ceil(maxCommits * 1.15)])
      .range([innerHeight, 0]);

    // Gradients
    const defs = svg.append('defs');

    // Bar Gradient (Cyan to Indigo)
    const barGradient = defs
      .append('linearGradient')
      .attr('id', 'commitBarGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    barGradient.append('stop').attr('offset', '0%').attr('stop-color', '#06b6d4').attr('stop-opacity', 0.9);
    barGradient.append('stop').attr('offset', '100%').attr('stop-color', '#3b82f6').attr('stop-opacity', 0.3);

    // Area Gradient
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'commitAreaGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient.append('stop').attr('offset', '0%').attr('stop-color', '#06b6d4').attr('stop-opacity', 0.35);
    areaGradient.append('stop').attr('offset', '100%').attr('stop-color', '#06b6d4').attr('stop-opacity', 0.0);

    // Grid lines
    const yGrid = d3.axisLeft(yScale).ticks(4).tickSize(-innerWidth).tickFormat(() => '');
    g.append('g')
      .attr('class', 'grid-lines')
      .call(yGrid)
      .selectAll('line')
      .attr('stroke', '#1e293b')
      .attr('stroke-dasharray', '3,3');

    // Draw Smooth Area Line overlay
    const lineGenerator = d3
      .line<{ date: string; commits: number; parsedDate: Date }>()
      .x((d) => (xScale(d.date) || 0) + xScale.bandwidth() / 2)
      .y((d) => yScale(d.commits))
      .curve(d3.curveMonotoneX);

    const areaGenerator = d3
      .area<{ date: string; commits: number; parsedDate: Date }>()
      .x((d) => (xScale(d.date) || 0) + xScale.bandwidth() / 2)
      .y0(innerHeight)
      .y1((d) => yScale(d.commits))
      .curve(d3.curveMonotoneX);

    // Render Area
    g.append('path')
      .datum(formattedData)
      .attr('fill', 'url(#commitAreaGradient)')
      .attr('d', areaGenerator);

    // Render Bars
    g.selectAll('.commit-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'commit-bar')
      .attr('x', (d) => xScale(d.date) || 0)
      .attr('width', xScale.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('rx', 3)
      .attr('fill', 'url(#commitBarGradient)')
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('fill', '#22d3ee').attr('filter', 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.6))');
        setSelectedHoverPoint({ date: d.date, commits: d.commits, authors: d.authorsCount });
      })
      .on('mouseleave', function () {
        d3.select(this).attr('fill', 'url(#commitBarGradient)').attr('filter', 'none');
      })
      .transition()
      .duration(750)
      .delay((_, i) => i * 15)
      .attr('y', (d) => yScale(d.commits))
      .attr('height', (d) => innerHeight - yScale(d.commits));

    // Render Line Path
    const path = g
      .append('path')
      .datum(formattedData)
      .attr('fill', 'none')
      .attr('stroke', '#38bdf8')
      .attr('stroke-width', 2.5)
      .attr('d', lineGenerator);

    // Animate line path
    const totalLength = path.node()?.getTotalLength() || 0;
    path
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1000)
      .attr('stroke-dashoffset', 0);

    // Render Dots on peaks
    g.selectAll('.commit-dot')
      .data(formattedData.filter((d) => d.commits > 0))
      .enter()
      .append('circle')
      .attr('class', 'commit-dot')
      .attr('cx', (d) => (xScale(d.date) || 0) + xScale.bandwidth() / 2)
      .attr('cy', (d) => yScale(d.commits))
      .attr('r', 3)
      .attr('fill', '#0ea5e9')
      .attr('stroke', '#0284c7')
      .attr('stroke-width', 1.5);

    // Axes
    const xAxis = d3
      .axisBottom(xScale)
      .tickValues(data.filter((_, i) => i % Math.ceil(data.length / 6) === 0).map((d) => d.date))
      .tickFormat((d) => {
        const p = parseDate(d);
        return p ? d3.timeFormat('%b %d')(p) : d;
      });

    const yAxis = d3.axisLeft(yScale).ticks(4);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Remove domain lines
    g.selectAll('.domain').attr('stroke', '#334155');
    g.selectAll('.tick line').attr('stroke', '#334155');
  }, [repository.id, timeframeDays]);

  // Render D3 Build Success Donut Gauge
  useEffect(() => {
    if (!buildSuccessGaugeSvgRef.current) return;

    const svg = d3.select(buildSuccessGaugeSvgRef.current);
    svg.selectAll('*').remove();

    const width = 180;
    const height = 180;
    const radius = Math.min(width, height) / 2 - 10;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const donutData = [
      { label: 'Passed', value: metrics.passedBuilds30Days, color: '#10b981' },
      { label: 'Failed', value: metrics.failedBuilds30Days, color: '#f43f5e' },
      { label: 'Cancelled', value: Math.max(1, Math.round(metrics.totalBuilds30Days * 0.03)), color: '#f59e0b' },
    ];

    const pie = d3.pie<{ label: string; value: number; color: string }>()
      .value((d) => d.value)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<{ label: string; value: number; color: string }>>()
      .innerRadius(radius - 22)
      .outerRadius(radius)
      .cornerRadius(4)
      .padAngle(0.04);

    // Background track
    g.append('circle')
      .attr('r', radius - 11)
      .attr('fill', 'none')
      .attr('stroke', '#0f172a')
      .attr('stroke-width', 22);

    // Arcs
    const arcs = g
      .selectAll('.arc')
      .data(pie(donutData))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs
      .append('path')
      .attr('fill', (d) => d.data.color)
      .transition()
      .duration(900)
      .attrTween('d', function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(interpolate(t)) || '';
        };
      });

    // Center Text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.1em')
      .attr('fill', '#f8fafc')
      .attr('font-size', '20px')
      .attr('font-weight', '900')
      .attr('font-family', 'monospace')
      .text(`${metrics.buildSuccessRate}%`);

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.4em')
      .attr('fill', '#10b981')
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .attr('font-family', 'sans-serif')
      .text('SUCCESS RATE');
  }, [repository.id, timeframeDays]);

  // Render D3 Build Success Trend Step Chart
  useEffect(() => {
    if (!buildTrendSvgRef.current) return;

    const svg = d3.select(buildTrendSvgRef.current);
    svg.selectAll('*').remove();

    const width = 420;
    const height = 150;
    const margin = { top: 15, right: 15, bottom: 30, left: 35 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = metrics.buildHistory.slice(-25); // last 25 builds

    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([80, 100])
      .range([innerHeight, 0]);

    // Grid
    const yGrid = d3.axisLeft(yScale).ticks(3).tickSize(-innerWidth).tickFormat(() => '');
    g.append('g')
      .call(yGrid)
      .selectAll('line')
      .attr('stroke', '#1e293b')
      .attr('stroke-dasharray', '2,2');

    // Line
    const lineGenerator = d3
      .line<BuildHistoryDataPoint>()
      .x((_, i) => xScale(i))
      .y((d) => yScale(d.successRate))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#10b981')
      .attr('stroke-width', 2.5)
      .attr('d', lineGenerator);

    // Points
    g.selectAll('.build-dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'build-dot')
      .attr('cx', (_, i) => xScale(i))
      .attr('cy', (d) => yScale(d.successRate))
      .attr('r', (d) => (d.status === 'failed' ? 5 : 3.5))
      .attr('fill', (d) => (d.status === 'failed' ? '#f43f5e' : d.status === 'cancelled' ? '#f59e0b' : '#10b981'))
      .attr('stroke', '#022c22')
      .attr('stroke-width', 1.5)
      .attr('cursor', 'pointer')
      .on('mouseenter', (_, d) => setSelectedBuildHover(d))
      .on('mouseleave', () => setSelectedBuildHover(null));

    // Axes
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(5)
      .tickFormat((i) => `#${data[i as number]?.buildNumber || ''}`);

    const yAxis = d3.axisLeft(yScale).ticks(3).tickFormat((d) => `${d}%`);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace');

    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace');

    g.selectAll('.domain').attr('stroke', '#334155');
    g.selectAll('.tick line').attr('stroke', '#334155');
  }, [repository.id, timeframeDays]);

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 space-y-6 shadow-xl">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold mb-1">
            <BarChart2 className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>D3 Real-Time Health & Pipeline Analytics</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px]">
              D3.js v7
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-100 flex items-center space-x-2">
            <span>Repository Health & Commit Activity Dashboard</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive D3 visualization of commit velocity, build success stability, and MTTR benchmarks for <span className="font-mono text-cyan-300 font-bold">{repository.name}</span>.
          </p>
        </div>

        {/* Timeframe Controls */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <Calendar className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
          {[14, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setTimeframeDays(days)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                timeframeDays === days
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {days}D
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 relative overflow-hidden">
          <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center justify-between">
            <span>Commit Velocity ({timeframeDays}D)</span>
            <GitCommit className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-cyan-300">{metrics.totalCommits30Days}</div>
          <div className="text-[10px] text-slate-400">
            Avg <strong className="text-slate-200">{(metrics.totalCommits30Days / timeframeDays).toFixed(1)}</strong> commits/day
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center justify-between">
            <span>Build Success Rate</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400">{metrics.buildSuccessRate}%</div>
          <div className="text-[10px] text-slate-400">
            <span className="text-emerald-400 font-bold">{metrics.passedBuilds30Days} passed</span> / <span className="text-rose-400 font-bold">{metrics.failedBuilds30Days} failed</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center justify-between">
            <span>Avg Build Duration</span>
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-black text-indigo-300">{metrics.avgBuildDurationSec}s</div>
          <div className="text-[10px] text-slate-400">GKE CI Runner Agent</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center justify-between">
            <span>Mean Recovery (MTTR)</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-300">{metrics.meanTimeToRecoveryMinutes}m</div>
          <div className="text-[10px] text-emerald-400 font-bold">Auto-rollback ready</div>
        </div>
      </div>

      {/* Grid of Main D3 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: D3 Commit Frequency Chart */}
        <div className="lg:col-span-7 p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Last Commit Frequency Trend ({timeframeDays} Days)</span>
            </div>
            {selectedHoverPoint ? (
              <div className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800">
                {selectedHoverPoint.date}: <strong>{selectedHoverPoint.commits} commits</strong> ({selectedHoverPoint.authors} authors)
              </div>
            ) : (
              <span className="text-[10px] font-mono text-slate-500">Hover bars to inspect commits</span>
            )}
          </div>

          <div className="w-full relative">
            <svg ref={commitChartSvgRef} className="w-full h-auto overflow-visible" />
          </div>
        </div>

        {/* Right 5 Cols: D3 Build Success Donut Gauge & Build History */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <PieIcon className="w-4 h-4 text-emerald-400" />
              <span>CI/CD Build Success Stability</span>
            </div>
            {selectedBuildHover && (
              <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Build #{selectedBuildHover.buildNumber}: {selectedBuildHover.status.toUpperCase()} ({selectedBuildHover.durationSec}s)
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
            {/* D3 Donut Gauge */}
            <div className="w-36 h-36 shrink-0 relative">
              <svg ref={buildSuccessGaugeSvgRef} className="w-full h-full" />
            </div>

            {/* D3 Trend Line Chart */}
            <div className="flex-1 w-full space-y-2">
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">Build Success % Over Recent Runs</div>
              <svg ref={buildTrendSvgRef} className="w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
