import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';
import { FeatureFlagsDrawer } from './components/FeatureFlagsDrawer';
import { AiRepoAnalyzerModal } from './components/AiRepoAnalyzerModal';
import { OidcTokenModal } from './components/OidcTokenModal';
import { WalkthroughModal, WALKTHROUGH_STEPS } from './components/WalkthroughModal';
import { FeatureFlagsProvider } from './context/FeatureFlagsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { OverviewDashboardView } from './views/OverviewDashboardView';
import { RepositoryCatalogView } from './views/RepositoryCatalogView';
import { KnowledgeGraphView } from './views/KnowledgeGraphView';
import { DeveloperPortalView } from './views/DeveloperPortalView';
import { DocPlatformView } from './views/DocPlatformView';
import { PackageRegistryView } from './views/PackageRegistryView';
import { DistributionPlatformView } from './views/DistributionPlatformView';
import { CiCdPlatformView } from './views/CiCdPlatformView';
import { ProductionPlatformView } from './views/ProductionPlatformView';
import { WebhooksDashboardView } from './views/WebhooksDashboardView';
import { KubernetesPlatformView } from './views/KubernetesPlatformView';
import { ObservabilityView } from './views/ObservabilityView';
import { SecurityCenterView } from './views/SecurityCenterView';
import { AiAssistantView } from './views/AiAssistantView';
import { EnterpriseManagementView } from './views/EnterpriseManagementView';
import { Login } from './components/Login';
import { TabType } from './types';

function MainApp() {
  const { user, isAuthenticated, inspectTokensOpen, setInspectTokensOpen } = useAuth();
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedRepoId, setSelectedRepoId] = useState<string>('repo-core-api');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isFeatureFlagsOpen, setIsFeatureFlagsOpen] = useState<boolean>(false);
  const [isAiRepoAnalyzerOpen, setIsAiRepoAnalyzerOpen] = useState<boolean>(false);
  const [selectedOrg, setSelectedOrg] = useState<string>('khulnasoft');

  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState<boolean>(false);
  const [walkthroughStepIndex, setWalkthroughStepIndex] = useState<number>(0);
  const [completedWalkthroughSteps, setCompletedWalkthroughSteps] = useState<string[]>(['step-repos']);

  if (!isAuthenticated || !user) {
    return <Login />;
  }

  const handleOpenWalkthrough = (stepIndex: number = 0) => {
    setWalkthroughStepIndex(stepIndex);
    setIsWalkthroughOpen(true);
  };

  const handleMarkStepCompleted = (stepId: string) => {
    if (!completedWalkthroughSteps.includes(stepId)) {
      setCompletedWalkthroughSteps((prev) => [...prev, stepId]);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      theme === 'light' 
        ? 'bg-slate-100 text-slate-900 selection:bg-cyan-500 selection:text-slate-950' 
        : 'bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950'
    }`}>
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAiAssistant={() => setActiveTab('ai-assistant')}
        onOpenFeatureFlags={() => setIsFeatureFlagsOpen(true)}
        onOpenAiRepoAnalyzer={() => setIsAiRepoAnalyzerOpen(true)}
        selectedOrg={selectedOrg}
        setSelectedOrg={setSelectedOrg}
      />

      {/* Main Container: Sidebar + Active View Content */}
      <div className="flex flex-1 relative overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenWalkthrough={handleOpenWalkthrough}
          completedStepsCount={completedWalkthroughSteps.length}
          totalStepsCount={WALKTHROUGH_STEPS.length}
        />

        <main className="flex-1 overflow-y-auto bg-slate-950/60 pb-12">
          {activeTab === 'overview' && (
            <OverviewDashboardView
              onSelectTab={setActiveTab}
              onSelectRepo={setSelectedRepoId}
            />
          )}

          {activeTab === 'repos' && (
            <RepositoryCatalogView
              selectedRepoId={selectedRepoId}
              onSelectRepo={setSelectedRepoId}
              onSelectTab={setActiveTab}
              onOpenAiRepoAnalyzer={() => setIsAiRepoAnalyzerOpen(true)}
            />
          )}

          {activeTab === 'graph' && <KnowledgeGraphView />}

          {activeTab === 'portal' && (
            <DeveloperPortalView
              onSelectTab={setActiveTab}
              onSelectRepo={setSelectedRepoId}
              onOpenAiRepoAnalyzer={() => setIsAiRepoAnalyzerOpen(true)}
            />
          )}

          {activeTab === 'docs' && (
            <DocPlatformView
              onOpenAiRepoAnalyzer={() => setIsAiRepoAnalyzerOpen(true)}
            />
          )}

          {activeTab === 'packages' && <PackageRegistryView />}

          {activeTab === 'distribution' && <DistributionPlatformView />}

          {activeTab === 'cicd' && <CiCdPlatformView />}

          {activeTab === 'production-platform' && <ProductionPlatformView />}

          {activeTab === 'webhooks' && <WebhooksDashboardView />}

          {activeTab === 'kubernetes' && <KubernetesPlatformView />}

          {activeTab === 'observability' && <ObservabilityView />}

          {activeTab === 'security' && <SecurityCenterView />}

          {activeTab === 'ai-assistant' && <AiAssistantView />}

          {activeTab === 'enterprise' && <EnterpriseManagementView />}
        </main>
      </div>

      {/* Command Palette Overlay */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTab={setActiveTab}
        onSelectRepo={setSelectedRepoId}
      />

      {/* Feature Flags Slide-over Drawer */}
      <FeatureFlagsDrawer
        isOpen={isFeatureFlagsOpen}
        onClose={() => setIsFeatureFlagsOpen(false)}
      />

      {/* AI Repository Analyzer Modal */}
      <AiRepoAnalyzerModal
        isOpen={isAiRepoAnalyzerOpen}
        onClose={() => setIsAiRepoAnalyzerOpen(false)}
        defaultRepoId={selectedRepoId}
      />

      {/* OIDC JWT Token Inspector Modal */}
      <OidcTokenModal
        isOpen={inspectTokensOpen}
        onClose={() => setInspectTokensOpen(false)}
      />

      {/* Guided Walkthrough Onboarding Modal */}
      <WalkthroughModal
        isOpen={isWalkthroughOpen}
        onClose={() => setIsWalkthroughOpen(false)}
        currentStepIndex={walkthroughStepIndex}
        setCurrentStepIndex={setWalkthroughStepIndex}
        onSelectTab={setActiveTab}
        onOpenAiRepoAnalyzer={() => setIsAiRepoAnalyzerOpen(true)}
        onOpenTokenInspector={() => setInspectTokensOpen(true)}
        completedSteps={completedWalkthroughSteps}
        markStepCompleted={handleMarkStepCompleted}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FeatureFlagsProvider>
          <MainApp />
        </FeatureFlagsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}


