import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Sparkles, 
  Code2, 
  Workflow, 
  Activity, 
  Building2, 
  BookOpen, 
  ShieldCheck, 
  Key, 
  Layers, 
  Bot, 
  Compass,
  Play
} from 'lucide-react';
import { TabType } from '../types';

export interface WalkthroughStep {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  tabTarget: TabType;
  icon: React.ElementType;
  description: string;
  keyFeatures: string[];
  actionPrompt?: string;
  actionType?: 'analyzer' | 'tokens' | 'tab';
}

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: 'step-repos',
    title: 'Repository Catalog & Microservices',
    subtitle: 'Unified Service Directory & Metadata',
    category: 'Core Navigation',
    tabTarget: 'repos',
    icon: Code2,
    description: 'Explore all 18+ microservices across Khulnasoft, complete with language tags, owner teams, SBOM vulnerability security status, and active deployment environments.',
    keyFeatures: [
      'Filter by Tech Stack (TypeScript, Go, Rust, Python)',
      'Inspect SLSA provenance and SBOM vulnerability badges',
      'Direct link to AI Architecture Analysis'
    ],
    actionPrompt: 'Navigate to Repository Catalog',
    actionType: 'tab'
  },
  {
    id: 'step-ai-analysis',
    title: 'AI Code Analysis & Gemini 3.6',
    subtitle: 'Deep Repo Intelligence & Architecture Insights',
    category: 'AI Engine',
    tabTarget: 'repos',
    icon: Sparkles,
    description: 'Leverage Gemini 3.6 Flash server-side AI to analyze repository codebases, generate dependency flow diagrams, review pull request security risks, and explain complex logic.',
    keyFeatures: [
      'Real-time automated code refactoring & security scoring',
      'Interactive architecture diagram generator',
      'Knowledge Graph dependency mapping'
    ],
    actionPrompt: 'Launch AI Repo Analyzer',
    actionType: 'analyzer'
  },
  {
    id: 'step-cicd-topology',
    title: 'CI/CD Pipeline Topology & Zero Trust',
    subtitle: 'Interactive D3 Stage Dependency Graph',
    category: 'Platform Automation',
    tabTarget: 'cicd',
    icon: Workflow,
    description: 'Visualize build, test, SAST scan, container push, and Kubernetes deployment pipelines using our interactive D3 DAG topology map.',
    keyFeatures: [
      'Interactive stage dependency flow & parallel workers',
      'Cosign KMS hardware key signatures',
      'Automated ArgoCD canary deployment verification'
    ],
    actionPrompt: 'View Pipeline Topology',
    actionType: 'tab'
  },
  {
    id: 'step-observability',
    title: 'Observability & OpenTelemetry Traces',
    subtitle: 'Real-time Metrics & Distributed Logging',
    category: 'Governance & Ops',
    tabTarget: 'observability',
    icon: Activity,
    description: 'Monitor microservice health with OTel collectors, live latency histograms, error rate spikes, and flamegraph distributed tracing.',
    keyFeatures: [
      'Zero-overhead eBPF auto-instrumentation',
      'Live log streaming with regex filtering',
      'Prometheus SLA health indicators'
    ],
    actionPrompt: 'Open Observability Dashboard',
    actionType: 'tab'
  },
  {
    id: 'step-enterprise-auth',
    title: 'Enterprise OIDC, RBAC & Tokens',
    subtitle: 'Zero Trust Authentication & JWT Inspection',
    category: 'Security & Auth',
    tabTarget: 'enterprise',
    icon: Key,
    description: 'Manage Okta OIDC, Azure AD OAuth2, Keycloak, and PingIdentity SSO integration with fine-grained Role-Based Access Control (RBAC).',
    keyFeatures: [
      'Inspect decoded RS256 JWT claims and access tokens',
      'Simulate 5 distinct enterprise roles (Admin, Security, DevOps, Dev, Auditor)',
      'Hardware YubiKey / TOTP step-up MFA'
    ],
    actionPrompt: 'Inspect OIDC JWT Tokens',
    actionType: 'tokens'
  }
];

interface WalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStepIndex: number;
  setCurrentStepIndex: (index: number) => void;
  onSelectTab: (tab: TabType) => void;
  onOpenAiRepoAnalyzer: () => void;
  onOpenTokenInspector: () => void;
  completedSteps: string[];
  markStepCompleted: (stepId: string) => void;
}

export const WalkthroughModal: React.FC<WalkthroughModalProps> = ({
  isOpen,
  onClose,
  currentStepIndex,
  setCurrentStepIndex,
  onSelectTab,
  onOpenAiRepoAnalyzer,
  onOpenTokenInspector,
  completedSteps,
  markStepCompleted,
}) => {
  if (!isOpen) return null;

  const currentStep = WALKTHROUGH_STEPS[currentStepIndex] || WALKTHROUGH_STEPS[0];
  const StepIcon = currentStep.icon;
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === WALKTHROUGH_STEPS.length - 1;

  const handleNext = () => {
    markStepCompleted(currentStep.id);
    if (!isLast) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleExecuteAction = () => {
    markStepCompleted(currentStep.id);
    if (currentStep.actionType === 'analyzer') {
      onOpenAiRepoAnalyzer();
    } else if (currentStep.actionType === 'tokens') {
      onOpenTokenInspector();
    } else {
      onSelectTab(currentStep.tabTarget);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative font-sans">
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-cyan-950 border border-cyan-800 text-cyan-400">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-400">
                <span>Khulnasoft Platform Onboarding Tour</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                  Step {currentStepIndex + 1} of {WALKTHROUGH_STEPS.length}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-100 mt-0.5">{currentStep.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Overall Walkthrough Progress</span>
            <span className="text-cyan-400 font-bold">
              {Math.round(((currentStepIndex + 1) / WALKTHROUGH_STEPS.length) * 100)}%
            </span>
          </div>
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / WALKTHROUGH_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Body Content */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono">
          <div className="flex items-center justify-between text-xs border-b border-slate-900 pb-2">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold text-[10px] uppercase">
              {currentStep.category}
            </span>
            <span className="text-slate-400 text-[11px]">{currentStep.subtitle}</span>
          </div>

          <p className="text-slate-300 text-xs leading-relaxed font-sans">
            {currentStep.description}
          </p>

          {/* Key Features List */}
          <div className="space-y-2 pt-1">
            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              Highlighted Capabilities:
            </div>
            <div className="space-y-1.5">
              {currentStep.keyFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Trigger Button */}
          {currentStep.actionPrompt && (
            <div className="pt-2">
              <button
                onClick={handleExecuteAction}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold p-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{currentStep.actionPrompt}</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handlePrev}
            disabled={isFirst}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              isFirst
                ? 'opacity-30 cursor-not-allowed text-slate-600 bg-slate-950'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          {/* Step Dots */}
          <div className="flex items-center space-x-1.5">
            {WALKTHROUGH_STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex
                    ? 'bg-cyan-400 ring-4 ring-cyan-500/20'
                    : completedSteps.includes(step.id)
                    ? 'bg-emerald-500'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
                title={step.title}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center space-x-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shadow-md shadow-cyan-500/20"
          >
            <span>{isLast ? 'Complete Onboarding' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
