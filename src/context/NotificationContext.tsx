import React, { createContext, useContext, useState, useEffect } from 'react';

export type NotificationType = 
  | 'BUILD_FAILURE' 
  | 'DEPLOY_SUCCESS' 
  | 'SECURITY_VULN' 
  | 'SLO_BREACH' 
  | 'AI_QUOTA' 
  | 'INFO';

export type NotificationSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  severity: NotificationSeverity;
  title: string;
  message: string;
  repo?: string;
  timestamp: string;
  timeAgo: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'BUILD_FAILURE',
    severity: 'CRITICAL',
    title: 'CI Build Failed: #8412',
    message: 'Go compilation error in internal/auth/middleware.go:42 (undefined symbol ValidateTokenJWT)',
    repo: 'khulnasoft/core-api',
    timestamp: '2026-07-24T08:44:00Z',
    timeAgo: '2m ago',
    read: false,
    actionLabel: 'View Build Logs',
  },
  {
    id: 'notif-2',
    type: 'SECURITY_VULN',
    severity: 'CRITICAL',
    title: 'Critical Vulnerability Detected',
    message: 'CVE-2026-2104 (CVSS 9.8) detected in base container image distroless/static-debian11',
    repo: 'khulnasoft/telemetry-collector',
    timestamp: '2026-07-24T08:32:00Z',
    timeAgo: '14m ago',
    read: false,
    actionLabel: 'Inspect Security Policy',
  },
  {
    id: 'notif-3',
    type: 'DEPLOY_SUCCESS',
    severity: 'INFO',
    title: 'ArgoCD Deployment Completed',
    message: 'Revision 8f92a10 successfully synced to khulnasoft-prod-us-east1 (12/12 Pods Healthy)',
    repo: 'khulnasoft/core-api',
    timestamp: '2026-07-24T08:15:00Z',
    timeAgo: '31m ago',
    read: true,
    actionLabel: 'Open ArgoCD Console',
  },
  {
    id: 'notif-4',
    type: 'SLO_BREACH',
    severity: 'HIGH',
    title: 'SLO Latency Warning',
    message: 'p99 latency for khulnasoft/ai-gateway spiked to 380ms (target <= 200ms)',
    repo: 'khulnasoft/ai-gateway',
    timestamp: '2026-07-24T07:50:00Z',
    timeAgo: '56m ago',
    read: true,
    actionLabel: 'View Metrics',
  },
  {
    id: 'notif-5',
    type: 'AI_QUOTA',
    severity: 'MEDIUM',
    title: 'Gemini AI Token Usage Warning',
    message: '24h token consumption reached 80% of enterprise daily limit (18.5M / 25M tokens)',
    repo: 'khulnasoft/ai-gateway',
    timestamp: '2026-07-24T06:30:00Z',
    timeAgo: '2h ago',
    read: true,
    actionLabel: 'View Token Metering',
  }
];

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  activeToasts: NotificationItem[];
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'timeAgo' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  dismissToast: (id: string) => void;
  simulateAlert: (type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('khulnasoft_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [activeToasts, setActiveToasts] = useState<NotificationItem[]>([]);

  useEffect(() => {
    localStorage.setItem('khulnasoft_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (item: Omit<NotificationItem, 'id' | 'timestamp' | 'timeAgo' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}-${Math.random().toString(16).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now',
      read: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setActiveToasts((prev) => [newNotif, ...prev]);

    // Auto-dismiss toast after 6 seconds
    setTimeout(() => {
      setActiveToasts((prev) => prev.filter((t) => t.id !== newNotif.id));
    }, 6000);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    setActiveToasts([]);
  };

  const dismissToast = (id: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const simulateAlert = (type: NotificationType) => {
    switch (type) {
      case 'BUILD_FAILURE':
        addNotification({
          type: 'BUILD_FAILURE',
          severity: 'CRITICAL',
          title: 'CI/CD Build Failure Detected',
          message: 'Build #8419 failed on commit 4a810f9 (core-api) due to failed integration test suite.',
          repo: 'khulnasoft/core-api',
          actionLabel: 'View Build Matrix',
        });
        break;
      case 'DEPLOY_SUCCESS':
        addNotification({
          type: 'DEPLOY_SUCCESS',
          severity: 'INFO',
          title: 'Production Deployment Succeeded',
          message: 'ArgoCD successfully deployed release v2.4.1 to cluster khulnasoft-prod-us-east1.',
          repo: 'khulnasoft/identity-service',
          actionLabel: 'View Pod Status',
        });
        break;
      case 'SECURITY_VULN':
        addNotification({
          type: 'SECURITY_VULN',
          severity: 'CRITICAL',
          title: 'Critical CVE Security Leak Detected',
          message: 'TruffleHog & Trivy flagged plain-text secret pattern match in branch feat/test-secret.',
          repo: 'khulnasoft/telemetry-collector',
          actionLabel: 'Audit Security Center',
        });
        break;
      case 'SLO_BREACH':
        addNotification({
          type: 'SLO_BREACH',
          severity: 'HIGH',
          title: 'SLO Error Budget Threshold Alert',
          message: 'Service error budget remaining dropped below 50% for khulnasoft/telemetry-collector.',
          repo: 'khulnasoft/telemetry-collector',
          actionLabel: 'View Observability Hub',
        });
        break;
      case 'AI_QUOTA':
        addNotification({
          type: 'AI_QUOTA',
          severity: 'MEDIUM',
          title: 'Gemini 3.6 AI Token Quota Alert',
          message: 'High token rate detected: 1.2M tokens consumed in last 5 minutes.',
          repo: 'khulnasoft/ai-gateway',
          actionLabel: 'View AI Token Metering',
        });
        break;
      case 'INFO':
      default:
        addNotification({
          type: 'INFO',
          severity: 'INFO',
          title: 'System Health & Telemetry Sync',
          message: 'All 5 microservices exporting OTel spans and Loki logs smoothly.',
          repo: 'khulnasoft/core-api',
          actionLabel: 'Check Status',
        });
        break;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        activeToasts,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        dismissToast,
        simulateAlert,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
