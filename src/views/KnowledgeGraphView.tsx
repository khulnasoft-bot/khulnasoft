import React, { useState } from 'react';
import { 
  Share2, 
  Search, 
  Filter, 
  Code2, 
  Package, 
  Container, 
  Users, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import { MOCK_GRAPH_NODES, MOCK_GRAPH_EDGES } from '../data/mockData';
import { KnowledgeGraphNode, KnowledgeNodeType } from '../types';

export const KnowledgeGraphView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNodeType, setSelectedNodeType] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<KnowledgeGraphNode | null>(MOCK_GRAPH_NODES[0]);

  const filteredNodes = MOCK_GRAPH_NODES.filter((node) => {
    const matchesSearch = node.label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedNodeType === 'all' || node.type === selectedNodeType;
    return matchesSearch && matchesType;
  });

  const nodeRelations = MOCK_GRAPH_EDGES.filter(
    (e) => e.source === selectedNode?.id || e.target === selectedNode?.id
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center space-x-3">
            <Share2 className="w-6 h-6 text-indigo-400" />
            <span>Enterprise Knowledge Graph</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global semantic topology mapping code repositories, microservices, AST functions, Helm charts, Docker images, and team ownership.
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs text-indigo-300 bg-indigo-950/60 border border-indigo-800/50 px-3 py-1.5 rounded-xl">
          <span>{MOCK_GRAPH_NODES.length} Nodes</span>
          <span>•</span>
          <span>{MOCK_GRAPH_EDGES.length} Edges</span>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search graph nodes..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto text-xs">
          <span className="text-slate-500 font-semibold text-[11px] uppercase mr-1">Type:</span>
          {['all', 'repository', 'package', 'service', 'team', 'helm_chart', 'docker_image'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedNodeType(type)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer capitalize shrink-0 ${
                selectedNodeType === type
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Visual Graph Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Node Explorer Matrix */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 min-h-[420px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Indexed Knowledge Nodes</span>
            <span className="text-[11px] text-slate-500 font-mono">Click a node to inspect relationships</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-3.5 rounded-xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-indigo-950/80 border-indigo-500 ring-1 ring-indigo-500'
                      : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100 font-mono">{node.label}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 uppercase">
                      {node.type}
                    </span>
                  </div>

                  {node.healthScore && (
                    <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Health Score</span>
                      <span className="text-emerald-400 font-bold">{node.healthScore}/100</span>
                    </div>
                  )}

                  <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono grid grid-cols-2 gap-1">
                    {Object.entries(node.properties).map(([k, v]) => (
                      <div key={k}>
                        <span className="text-slate-500">{k}:</span> {String(v)}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Node Relationship Inspector */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
            <Info className="w-4 h-4" />
            <span>Relationship Inspector</span>
          </div>

          {selectedNode ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-100 font-mono">{selectedNode.label}</div>
                <div className="text-[11px] text-indigo-300 font-mono">Type: {selectedNode.type}</div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Connected Edges ({nodeRelations.length})
                </div>

                <div className="space-y-2">
                  {nodeRelations.map((edge) => {
                    const isSource = edge.source === selectedNode.id;
                    const otherNodeId = isSource ? edge.target : edge.source;
                    const otherNode = MOCK_GRAPH_NODES.find((n) => n.id === otherNodeId);

                    return (
                      <div key={edge.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1">
                        <div className="flex items-center justify-between text-indigo-300">
                          <span className="font-bold">{edge.relation.toUpperCase()}</span>
                          <span className="text-[10px] text-slate-500">{isSource ? 'Outgoing' : 'Incoming'}</span>
                        </div>
                        <div className="text-slate-300 truncate">
                          {isSource ? `→ ${otherNode?.label}` : `← ${otherNode?.label}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500">Select a node to inspect relationships.</div>
          )}
        </div>
      </div>
    </div>
  );
};
