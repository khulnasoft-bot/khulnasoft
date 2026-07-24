import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
  Activity, 
  CheckCircle2, 
  GitCommit, 
  TrendingUp, 
  Zap, 
  Clock, 
  BarChart2, 
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Repository } from '../types';
import { getOrCreateHealthMetrics } from './RepoHealthD3Charts';

interface RepoHealthMiniDashboardProps {
  repository: Repository;
  onViewFullHealth?: () => void;
}

export const RepoHealthMiniDashboard: React.FC<RepoHealthMiniDashboardProps> = ({
  repository,
  onViewFullHealth,
}) => {
  const commitChartRef = useRef<SVGSVGElement | null>(null);
  const buildGaugeRef = useRef<SVGSVGElement | null>(null);

  const [hoveredCommit, setHoveredCommit] = useState<{ date: string; commits: number } | null>(null);

  const metrics = getOrCreateHealthMetrics(repository, 14); // 14-day mini view

  // Render D3 Mini Commit Frequency Chart
  useEffect(() => {
    if (!commitChartRef.current) return;

    const svg = d3.select(commitChartRef.current);
    svg.selectAll('*').remove();

    const width = 280;
    const height = 75;
    const margin = { top: 10, right: 10, bottom: 20, left: 25 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = metrics.commitFrequency;

    const xScale = d3
      .scaleBand<string>()
      .domain(data.map((d) => d.date))
      .range([0, innerWidth])
      .padding(0.2);

    const maxCommits = d3.max(data, (d) => d.commits) || 10;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxCommits * 1.1])
      .range([innerHeight, 0]);

    // Gradient
    const defs = svg.append('defs');
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'miniCommitGrad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#22d3ee').attr('stop-opacity', 0.9);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#0284c7').attr('stop-opacity', 0.3);

    // Bars
    g.selectAll('.mini-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'mini-bar')
      .attr('x', (d) => xScale(d.date) || 0)
      .attr('width', xScale.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('rx', 2)
      .attr('fill', 'url(#miniCommitGrad)')
      .on('mouseenter', function (_, d) {
        d3.select(this).attr('fill', '#38bdf8');
        setHoveredCommit({ date: d.date, commits: d.commits });
      })
      .on('mouseleave', function () {
        d3.select(this).attr('fill', 'url(#miniCommitGrad)');
      })
      .transition()
      .duration(600)
      .delay((_, i) => i * 20)
      .attr('y', (d) => yScale(d.commits))
      .attr('height', (d) => innerHeight - yScale(d.commits));

    // Y Axis
    const yAxis = d3.axisLeft(yScale).ticks(2);
    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '8px')
      .attr('font-family', 'monospace');

    g.selectAll('.domain').attr('stroke', '#334155');
    g.selectAll('.tick line').attr('stroke', '#334155');
  }, [repository.id]);

  // Render D3 Mini Build Success Donut Gauge
  useEffect(() => {
    if (!buildGaugeRef.current) return;

    const svg = d3.select(buildGaugeRef.current);
    svg.selectAll('*').remove();

    const width = 85;
    const height = 85;
    const radius = Math.min(width, height) / 2 - 4;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const donutData = [
      { label: 'Passed', value: metrics.passedBuilds30Days, color: '#10b981' },
      { label: 'Failed', value: metrics.failedBuilds30Days, color: '#f43f5e' },
    ];

    const pie = d3.pie<{ label: string; value: number; color: string }>()
      .value((d) => d.value)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<{ label: string; value: number; color: string }>>()
      .innerRadius(radius - 12)
      .outerRadius(radius)
      .cornerRadius(3)
      .padAngle(0.05);

    // Track
    g.append('circle')
      .attr('r', radius - 6)
      .attr('fill', 'none')
      .attr('stroke', '#0f172a')
      .attr('stroke-width', 12);

    // Arcs
    const arcs = g
      .selectAll('.arc')
      .data(pie(donutData))
      .enter()
      .append('g');

    arcs
      .append('path')
      .attr('fill', (d) => d.data.color)
      .transition()
      .duration(750)
      .attrTween('d', function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(interpolate(t)) || '';
        };
      });

    // Center text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#f8fafc')
      .attr('font-size', '13px')
      .attr('font-weight', '900')
      .attr('font-family', 'monospace')
      .text(`${metrics.buildSuccessRate}%`);
  }, [repository.id]);

  return (
    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-xl space-y-3 font-mono">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-black text-slate-100 uppercase tracking-wider">
            Repository Health Mini-Dashboard
          </span>
          <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
            D3 Visualizer
          </span>
        </div>

        {onViewFullHealth && (
          <button
            onClick={onViewFullHealth}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1 cursor-pointer"
          >
            <span>Full Health Analytics</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2 Mini D3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Card 1: Last Commit Frequency */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-bold flex items-center space-x-1.5">
              <GitCommit className="w-3.5 h-3.5 text-cyan-400" />
              <span>Last Commit Frequency</span>
            </span>
            {hoveredCommit ? (
              <span className="text-cyan-300 font-bold text-[10px] bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                {hoveredCommit.date}: {hoveredCommit.commits} commits
              </span>
            ) : (
              <span className="text-slate-300 font-bold text-[11px]">
                {metrics.totalCommits30Days} commits <span className="text-slate-500 font-normal text-[10px]">(30d)</span>
              </span>
            )}
          </div>

          <div className="w-full h-20 flex items-center">
            <svg ref={commitChartRef} className="w-full h-full overflow-visible" />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
            <span>Peak Activity: <strong className="text-cyan-400">Tue & Thu</strong></span>
            <span>Velocity: <strong className="text-emerald-400">High</strong></span>
          </div>
        </div>

        {/* Card 2: Build Success Rate */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-bold flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Build Success Rate</span>
            </span>
            <span className="text-emerald-400 font-bold text-[11px]">
              {metrics.passedBuilds30Days}/{metrics.totalBuilds30Days} Passed
            </span>
          </div>

          <div className="flex items-center space-x-3 h-20">
            {/* D3 Donut */}
            <div className="w-20 h-20 shrink-0">
              <svg ref={buildGaugeRef} className="w-full h-full" />
            </div>

            {/* Metrics Breakdown */}
            <div className="flex-1 space-y-1.5 text-[10px]">
              <div className="flex justify-between items-center bg-slate-950 p-1.5 rounded border border-slate-800">
                <span className="text-slate-400">Avg Build Time:</span>
                <span className="text-indigo-300 font-bold">{metrics.avgBuildDurationSec}s</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950 p-1.5 rounded border border-slate-800">
                <span className="text-slate-400">Recovery MTTR:</span>
                <span className="text-amber-300 font-bold">{metrics.meanTimeToRecoveryMinutes}m</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
            <span>Pipeline: <strong className="text-emerald-400">GKE CI Runner</strong></span>
            <span>Status: <strong className="text-cyan-300">Healthy</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
