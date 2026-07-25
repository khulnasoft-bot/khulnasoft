import React, { createContext, useContext, useState, useEffect } from 'react';

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  category: 'AI / LLM' | 'Security & eBPF' | 'GitOps & Infra' | 'Observability';
  enabled: boolean;
  experimental: boolean;
  requiresRestart?: boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: 'enableAiAutoHealing',
    name: 'AI Auto-Healing & Incident Remediation',
    description: 'Enables Gemini-powered automated K8s pod restart & trace-based diagnostic hotfixes.',
    category: 'AI / LLM',
    enabled: true,
    experimental: true,
  },
  {
    id: 'enableEbpfSecurity',
    name: 'Cilium eBPF Kernel Security Enforcement',
    description: 'Enforces kernel-level syscall tracing, socket filtering, and zero-trust policy evaluation.',
    category: 'Security & eBPF',
    enabled: true,
    experimental: false,
  },
  {
    id: 'enableZeroDowntimeRollouts',
    name: 'Progressive Canary & Flagger Rollouts',
    description: 'Automates ArgoCD canary deployments with instant rollback upon p99 latency spikes.',
    category: 'GitOps & Infra',
    enabled: false,
    experimental: false,
  },
  {
    id: 'enableRealtimeKafkaStream',
    name: 'Real-Time ClickHouse + Kafka Telemetry',
    description: 'Ingests sub-millisecond OTel spans and Loki logs directly into ClickHouse cluster.',
    category: 'Observability',
    enabled: true,
    experimental: false,
  },
  {
    id: 'enableMultiCloudGpuRouting',
    name: 'Multi-Cloud AI GPU Inference Router',
    description: 'Intelligently routes Gemini & LLM workloads across GKE, EKS, and bare-metal GPU pools.',
    category: 'AI / LLM',
    enabled: false,
    experimental: true,
  },
  {
    id: 'enableSbomAutoRemediation',
    name: 'Cosign + Trivy SBOM Auto-Patching',
    description: 'Automatically creates pull requests to upgrade vulnerable dependencies flagged by Trivy.',
    category: 'Security & eBPF',
    enabled: true,
    experimental: true,
  },
];

interface FeatureFlagsContextType {
  flags: FeatureFlag[];
  toggleFlag: (id: string) => void;
  setAllFlags: (enabled: boolean) => void;
  isFlagEnabled: (id: string) => boolean;
  resetToDefaults: () => void;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined);

export const FeatureFlagsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flags, setFlags] = useState<FeatureFlag[]>(() => {
    const saved = localStorage.getItem('khulnasoft_feature_flags');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_FEATURE_FLAGS;
      }
    }
    return DEFAULT_FEATURE_FLAGS;
  });

  useEffect(() => {
    localStorage.setItem('khulnasoft_feature_flags', JSON.stringify(flags));
  }, [flags]);

  const toggleFlag = (id: string) => {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const setAllFlags = (enabled: boolean) => {
    setFlags((prev) => prev.map((f) => ({ ...f, enabled })));
  };

  const isFlagEnabled = (id: string): boolean => {
    const flag = flags.find((f) => f.id === id);
    return flag ? flag.enabled : false;
  };

  const resetToDefaults = () => {
    if (window.confirm('Reset all feature flags to defaults? This cannot be undone.')) {
      setFlags(DEFAULT_FEATURE_FLAGS);
    }
  };

  return (
    <FeatureFlagsContext.Provider
      value={{
        flags,
        toggleFlag,
        setAllFlags,
        isFlagEnabled,
        resetToDefaults,
      }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export const useFeatureFlags = (): FeatureFlagsContextType => {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
};
