import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
  Workflow, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Box, 
  Layers, 
  Zap, 
  Cpu, 
  Terminal, 
  Info, 
  Play, 
  Lock, 
  ChevronRight,
  GitBranch,
  ArrowRight
} from 'lucide-react';
import { CiCdPipeline } from '../types';

export interface TopologyStageNode {
  id: string;
  name: string;
  category: 'build' | 'test' | 'scan' | 'deploy';
  status: 'passed' | 'failed' | 'running' | 'queued';
  durationSeconds: number;
  parallelThreads?: number;
  dependencies: string[]; // parent node IDs
  artifact?: string;
  gateType?: string;
  x?: number;
  y?: number;
}

interface PipelineTopologyMapProps {
  pipeline: CiCdPipeline;
  onSelectStage?: (stageName: string) => void;
}

export const PipelineTopologyMap: React.FC<PipelineTopologyMapProps> = ({
  pipeline,
  onSelectStage
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-test');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Generate deterministic topology nodes based on selected pipeline
  const getTopologyNodes = (): TopologyStageNode[] => {
    const isSuccess = pipeline.status === 'success';

    return [
      {
        id: 'node-checkout',
        name: 'Checkout & Context',
        category: 'build',
        status: 'passed',
        durationSeconds: 4,
        parallelThreads: 1,
        dependencies: [],
        artifact: 'src.tar.gz'
      },
      {
        id: 'node-build',
        name: 'Build & Bundle',
        category: 'build',
        status: 'passed',
        durationSeconds: 18,
        parallelThreads: 4,
        dependencies: ['node-checkout'],
        artifact: 'dist/bundle.js'
      },
      {
        id: 'node-sast',
        name: 'Semgrep SAST Scan',
        category: 'scan',
        status: 'passed',
        durationSeconds: 12,
        dependencies: ['node-checkout'],
        gateType: 'Zero Critical Vulnerabilities'
      },
      {
        id: 'node-test',
        name: 'Parallel Jest / Go Matrix',
        category: 'test',
        status: 'passed',
        durationSeconds: 42,
        parallelThreads: 8,
        dependencies: ['node-build'],
        artifact: 'coverage-report.xml'
      },
      {
        id: 'node-trivy',
        name: 'Trivy Container Scan',
        category: 'scan',
        status: isSuccess ? 'passed' : 'failed',
        durationSeconds: 15,
        dependencies: ['node-sast', 'node-build'],
        gateType: 'Cosign Policy Gate'
      },
      {
        id: 'node-docker',
        name: 'Docker OCI Build & Push',
        category: 'build',
        status: isSuccess ? 'passed' : 'failed',
        durationSeconds: 28,
        dependencies: ['node-test', 'node-trivy'],
        artifact: `registry.khulnasoft.com/${pipeline.repoName}:${pipeline.commitSha.slice(0, 7)}`
      },
      {
        id: 'node-cosign',
        name: 'Cosign KMS Signature',
        category: 'scan',
        status: isSuccess ? 'passed' : 'queued',
        durationSeconds: 5,
        dependencies: ['node-docker'],
        gateType: 'Hardware Security Key'
      },
      {
        id: 'node-deploy',
        name: 'ArgoCD / K8s Deploy',
        category: 'deploy',
        status: isSuccess ? 'passed' : 'queued',
        durationSeconds: 22,
        dependencies: ['node-cosign'],
        artifact: 'helm-manifests-v2'
      },
      {
        id: 'node-e2e',
        name: 'Canary E2E Verification',
        category: 'test',
        status: isSuccess ? 'passed' : 'queued',
        durationSeconds: 14,
        dependencies: ['node-deploy'],
        gateType: 'Prometheus SLA Healthcheck'
      }
    ];
  };

  const nodesData = getTopologyNodes();

  // D3 DAG Topology Map Layout & Render
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 850;
    const height = 240;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Define Arrowhead Marker and Glow Filters
    const defs = svg.append('defs');

    // Arrow marker
    defs
      .append('marker')
      .attr('id', 'topo-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#0284c7');

    // Active link marker
    defs
      .append('marker')
      .attr('id', 'topo-arrow-active')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#38bdf8');

    // Assign explicit column-based positions for a clean DAG layout
    const columns: Record<string, number> = {
      'node-checkout': 50,
      'node-build': 210,
      'node-sast': 210,
      'node-test': 380,
      'node-trivy': 380,
      'node-docker': 540,
      'node-cosign': 670,
      'node-deploy': 670,
      'node-e2e': 790
    };

    const rowY: Record<string, number> = {
      'node-checkout': 120,
      'node-build': 65,
      'node-sast': 175,
      'node-test': 65,
      'node-trivy': 175,
      'node-docker': 120,
      'node-cosign': 65,
      'node-deploy': 175,
      'node-e2e': 120
    };

    const positionedNodes = nodesData.map((node) => ({
      ...node,
      x: columns[node.id] || 100,
      y: rowY[node.id] || 120
    }));

    // Build link pairs
    const links: { source: TopologyStageNode; target: TopologyStageNode }[] = [];
    positionedNodes.forEach((targetNode) => {
      targetNode.dependencies.forEach((parentKey) => {
        const sourceNode = positionedNodes.find((n) => n.id === parentKey);
        if (sourceNode) {
          links.push({ source: sourceNode, target: targetNode });
        }
      });
    });

    // Draw Links
    const linkGroup = svg.append('g').attr('class', 'links');

    links.forEach((link) => {
      const isHighlighted =
        hoveredNodeId === link.source.id ||
        hoveredNodeId === link.target.id ||
        selectedNodeId === link.source.id ||
        selectedNodeId === link.target.id;

      const pathGenerator = d3
        .linkHorizontal<any, { x: number; y: number }>()
        .x((d) => d.x)
        .y((d) => d.y);

      const pathD = pathGenerator({
        source: link.source,
        target: link.target
      });

      // Link line
      linkGroup
        .append('path')
        .attr('d', pathD || '')
        .attr('fill', 'none')
        .attr('stroke', isHighlighted ? '#38bdf8' : '#334155')
        .attr('stroke-width', isHighlighted ? 2.5 : 1.5)
        .attr('stroke-dasharray', link.target.status === 'queued' ? '4 4' : 'none')
        .attr('marker-end', isHighlighted ? 'url(#topo-arrow-active)' : 'url(#topo-arrow)');
    });

    // Draw Nodes
    const nodeGroup = svg.append('g').attr('class', 'nodes');

    positionedNodes.forEach((node) => {
      const isSelected = selectedNodeId === node.id;
      const isHovered = hoveredNodeId === node.id;
      const isDimmed = activeCategoryFilter !== 'all' && node.category !== activeCategoryFilter;

      const g = nodeGroup
        .append('g')
        .attr('transform', `translate(${node.x},${node.y})`)
        .attr('class', 'cursor-pointer')
        .style('opacity', isDimmed ? 0.3 : 1)
        .on('click', () => {
          setSelectedNodeId(node.id);
          if (onSelectStage) onSelectStage(node.name);
        })
        .on('mouseenter', () => setHoveredNodeId(node.id))
        .on('mouseleave', () => setHoveredNodeId(null));

      // Node background pill shape
      const nodeWidth = 110;
      const nodeHeight = 36;

      let strokeColor = '#334155';
      let fillColor = '#0f172a';
      let statusColor = '#38bdf8';

      if (node.status === 'passed') {
        strokeColor = '#059669';
        statusColor = '#10b981';
      } else if (node.status === 'failed') {
        strokeColor = '#e11d48';
        statusColor = '#f43f5e';
      } else if (node.status === 'queued') {
        strokeColor = '#475569';
        statusColor = '#64748b';
      }

      if (isSelected) {
        fillColor = '#1e293b';
        strokeColor = '#38bdf8';
      }

      g.append('rect')
        .attr('x', -nodeWidth / 2)
        .attr('y', -nodeHeight / 2)
        .attr('width', nodeWidth)
        .attr('height', nodeHeight)
        .attr('rx', 10)
        .attr('fill', fillColor)
        .attr('stroke', isSelected ? '#38bdf8' : strokeColor)
        .attr('stroke-width', isSelected || isHovered ? 2 : 1)
        .attr('filter', isSelected ? 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.4))' : 'none');

      // Status indicator dot
      g.append('circle')
        .attr('cx', -nodeWidth / 2 + 12)
        .attr('cy', 0)
        .attr('r', 4)
        .attr('fill', statusColor);

      // Node Name Label
      g.append('text')
        .attr('x', -nodeWidth / 2 + 22)
        .attr('y', -2)
        .attr('fill', '#f1f5f9')
        .attr('font-size', '9.5px')
        .attr('font-weight', 'bold')
        .attr('font-family', 'monospace')
        .text(node.name.length > 14 ? `${node.name.slice(0, 13)}…` : node.name);

      // Duration or Category Label
      g.append('text')
        .attr('x', -nodeWidth / 2 + 22)
        .attr('y', 10)
        .attr('fill', '#94a3b8')
        .attr('font-size', '8px')
        .attr('font-family', 'monospace')
        .text(`${node.category.toUpperCase()} • ${node.durationSeconds}s`);
    });
  }, [pipeline.id, selectedNodeId, hoveredNodeId, activeCategoryFilter]);

  const activeNode = nodesData.find((n) => n.id === selectedNodeId) || nodesData[1];

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
      {/* Topology Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold mb-1">
            <Workflow className="w-4 h-4 text-emerald-400" />
            <span>CI/CD Pipeline Topology & Stage Dependency Map</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px]">
              D3 DAG Engine
            </span>
          </div>
          <h2 className="text-base font-extrabold text-slate-100 flex items-center space-x-2">
            <span>Stage Dependency Flow</span>
            <span className="text-xs text-slate-400 font-mono font-normal">({nodesData.length} Stages)</span>
          </h2>
        </div>

        {/* Filter Category Toolbar */}
        <div className="flex items-center space-x-1 font-mono text-xs">
          <span className="text-slate-500 font-bold text-[10px] uppercase mr-1">Highlight:</span>
          {['all', 'build', 'test', 'scan', 'deploy'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                activeCategoryFilter === cat
                  ? 'bg-cyan-500 text-slate-950 font-black'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* D3 Topology Canvas Container */}
      <div className="relative p-2 rounded-xl bg-slate-950 border border-slate-800/90 overflow-x-auto scrollbar-none">
        <svg ref={svgRef} className="w-full min-w-[850px] h-60 overflow-visible" />
      </div>

      {/* Node Inspector Drawer */}
      {activeNode && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-2 gap-2">
            <div className="flex items-center space-x-2">
              <Box className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-slate-100 text-sm">{activeNode.name}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                  activeNode.status === 'passed'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}
              >
                {activeNode.status}
              </span>
            </div>

            <div className="text-slate-400 text-[11px] flex items-center space-x-3">
              <span>Category: <strong className="text-cyan-300 uppercase">{activeNode.category}</strong></span>
              <span>Execution Time: <strong className="text-slate-200">{activeNode.durationSeconds}s</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[10px] uppercase">Upstream Dependencies</div>
              <div className="text-slate-200 font-bold flex flex-wrap gap-1">
                {activeNode.dependencies.length > 0 ? (
                  activeNode.dependencies.map((dep) => (
                    <span key={dep} className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800 text-[10px]">
                      {dep.replace('node-', '')}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic">None (Root Node)</span>
                )}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[10px] uppercase">Artifact / Gate Details</div>
              <div className="text-emerald-300 font-bold truncate">
                {activeNode.artifact || activeNode.gateType || 'Standard Execution Output'}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[10px] uppercase">Parallel Workers</div>
              <div className="text-indigo-300 font-bold">
                {activeNode.parallelThreads ? `${activeNode.parallelThreads} K8s Ephemeral Pods` : 'Single Runner'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
