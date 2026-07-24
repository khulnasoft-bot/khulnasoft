import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  GitPullRequest, 
  Share2, 
  BookOpen, 
  Package, 
  Workflow, 
  Container, 
  Activity, 
  ShieldAlert, 
  Bot, 
  Building2, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Code2,
  Rocket,
  Webhook,
  Send,
  HelpCircle,
  Compass,
  CheckCircle2,
  Sparkles,
  Key,
  ExternalLink
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenWalkthrough?: (stepIndex?: number) => void;
  completedStepsCount?: number;
  totalStepsCount?: number;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  category?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  onOpenWalkthrough,
  completedStepsCount = 0,
  totalStepsCount = 5
}) => {
  const [isHelpExpanded, setIsHelpExpanded] = useState<boolean>(true);

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, category: 'Core' },
    { id: 'repos', label: 'Repository Catalog', icon: Code2, badge: 18, category: 'Core' },
    { id: 'graph', label: 'Knowledge Graph', icon: Share2, badge: '1.4k', badgeColor: 'bg-indigo-900/60 text-indigo-300', category: 'Core' },
    { id: 'portal', label: 'Developer Portal', icon: GitPullRequest, category: 'Core' },
    
    { id: 'docs', label: 'AI Documentation', icon: BookOpen, category: 'Platform' },
    { id: 'packages', label: 'Package Registry', icon: Package, badge: 'Docker/OCI', category: 'Platform' },
    { id: 'distribution', label: 'Distribution Platform', icon: Send, badge: 'Auto-Publish', badgeColor: 'bg-indigo-950 text-indigo-300 border border-indigo-800', category: 'Platform' },
    { id: 'cicd', label: 'CI/CD Pipelines', icon: Workflow, badge: '6 Active', badgeColor: 'bg-emerald-950 text-emerald-400 border border-emerald-800', category: 'Platform' },
    { id: 'production-platform', label: 'Production Platform', icon: Rocket, badge: 'Pipeline', badgeColor: 'bg-cyan-950 text-cyan-400 border border-cyan-800', category: 'Platform' },
    { id: 'webhooks', label: 'Webhooks & Events', icon: Webhook, badge: 'Live Logs', badgeColor: 'bg-indigo-950 text-indigo-300 border border-indigo-800', category: 'Platform' },
    { id: 'kubernetes', label: 'Kubernetes Platform', icon: Container, category: 'Platform' },
    
    { id: 'observability', label: 'Observability & OTel', icon: Activity, category: 'Governance' },
    { id: 'security', label: 'Security & Policy', icon: ShieldAlert, badge: 'Pass 94%', badgeColor: 'bg-emerald-950 text-emerald-400', category: 'Governance' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, badge: 'Gemini 3.6', badgeColor: 'bg-cyan-950 text-cyan-400 border border-cyan-800', category: 'Governance' },
    { id: 'enterprise', label: 'Organization & Business', icon: Building2, badge: 'Business Layer', badgeColor: 'bg-cyan-950 text-cyan-300 border border-cyan-800', category: 'Governance' },
  ];

  const categories = ['Core', 'Platform', 'Governance'];

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 shrink-0 select-none overflow-y-auto">
      <div className="p-3 space-y-6">
        {categories.map((cat) => {
          const items = navItems.filter((item) => item.category === cat);
          return (
            <div key={cat} className="space-y-1">
              <h3 className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase px-3 py-1">
                {cat}
              </h3>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/15 via-indigo-500/10 to-transparent text-cyan-300 border-l-2 border-cyan-400 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive ? 'text-cyan-400' : 'text-slate-500'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full shrink-0 ${
                            item.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Collapsible Help & Onboarding Module */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 font-mono">
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsHelpExpanded(!isHelpExpanded)}
              className="flex items-center space-x-2 text-slate-200 hover:text-white cursor-pointer font-bold text-[11px]"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Help & Onboarding</span>
            </button>

            <div className="flex items-center space-x-1">
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                {completedStepsCount}/{totalStepsCount}
              </span>
              <button
                onClick={() => setIsHelpExpanded(!isHelpExpanded)}
                className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {isHelpExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Expanded Content */}
          {isHelpExpanded && (
            <div className="space-y-2.5 pt-1 text-[10px]">
              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Tour Completed</span>
                  <span className="text-emerald-400 font-bold">
                    {Math.round((completedStepsCount / totalStepsCount) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300"
                    style={{ width: `${(completedStepsCount / totalStepsCount) * 100}%` }}
                  />
                </div>
              </div>

              {/* Start Walkthrough Main Button */}
              <button
                onClick={() => onOpenWalkthrough && onOpenWalkthrough(0)}
                className="w-full flex items-center justify-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold p-1.5 rounded-lg text-[10px] cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <Compass className="w-3 h-3" />
                <span>{completedStepsCount > 0 ? 'Resume Onboarding Tour' : 'Start Walkthrough'}</span>
              </button>

              {/* Quick Feature Step Shortcuts */}
              <div className="space-y-1 pt-1 border-t border-slate-800/80">
                <div className="text-slate-500 uppercase font-bold text-[9px] tracking-wider">Guided Highlights:</div>
                {[
                  { index: 0, label: '1. Repository Catalog' },
                  { index: 1, label: '2. AI Code Analysis' },
                  { index: 2, label: '3. CI/CD Topology Map' },
                  { index: 3, label: '4. Observability & OTel' },
                  { index: 4, label: '5. Enterprise OIDC & RBAC' },
                ].map((item) => (
                  <button
                    key={item.index}
                    onClick={() => {
                      if (onOpenWalkthrough) onOpenWalkthrough(item.index);
                    }}
                    className="w-full flex items-center justify-between p-1 rounded hover:bg-slate-800/80 text-slate-300 hover:text-cyan-300 cursor-pointer text-[10px] text-left"
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* System status note */}
        <div className="mt-2 text-[9px] text-slate-500 flex items-center justify-between px-1">
          <span>Khulnasoft v2.10</span>
          <span className="text-emerald-400 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Synced</span>
          </span>
        </div>
      </div>
    </aside>
  );
};
