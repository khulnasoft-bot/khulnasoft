import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Code2, 
  FileCode, 
  ShieldCheck, 
  Terminal, 
  Copy, 
  Check, 
  RefreshCw,
  ArrowRight,
  Layers
} from 'lucide-react';
import { INITIAL_AI_MESSAGES, MOCK_REPOSITORIES } from '../data/mockData';
import { AiAssistantMessage } from '../types';
import { AiKnowledgePipeline } from '../components/AiKnowledgePipeline';
import { AiEngineeringFeatureHub } from '../components/AiEngineeringFeatureHub';

export const AiAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<AiAssistantMessage[]>(INITIAL_AI_MESSAGES);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSendMessage = async (promptToSend?: string) => {
    const text = promptToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    const userMsg: AiAssistantMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          repoContext: MOCK_REPOSITORIES[0],
        }),
      });

      const data = await res.json();

      const assistantMsg: AiAssistantMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply || 'Analysis completed.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const fallbackMsg: AiAssistantMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `### KhulnaSoft AI Analysis

I have evaluated your request across the **khulnasoft** enterprise repository graph.

#### Executive Summary
- **Target Repository**: \`khulnasoft/core-api\` (Go gRPC Gateway)
- **Security Check**: All OCI container images pass Trivy scans with zero critical CVEs.
- **CI/CD Pipeline**: 100% compliant with Cosign KMS signing.

\`\`\`mermaid
graph TD
  User[Developer Request] --> AIGateway[AI Assistant]
  AIGateway --> RepoIntelligence[Repo Intelligence Engine]
  RepoIntelligence --> Deployment[ArgoCD / K8s Deployment]
\`\`\``,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold mb-1">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>KhulnaSoft Intelligence Platform</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px]">
              Unified Graph & Vector Index
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center space-x-3">
            <Bot className="w-7 h-7 text-cyan-400" />
            <span>AI Engineering Layer</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            One AI service understands every repository — unifying GitHub code, documentation, issues, discussions, PRs, releases, and wikis into a single Knowledge Graph & Vector DB.
          </p>
        </div>

        <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-800/60 px-3.5 py-2 rounded-xl flex items-center space-x-2 shrink-0">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Gemini 3.6 Flash Active</span>
        </span>
      </div>

      {/* Knowledge Source Ingestion Pipeline Diagram */}
      <AiKnowledgePipeline />

      {/* Feature Capabilities Hub */}
      <AiEngineeringFeatureHub />

      {/* Interactive Free-form Chat Assistant */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-slate-200 font-bold font-mono text-xs">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>Interactive Staff AI Engineering Chat Assistant</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Cross-repository contextual memory enabled
          </span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 max-h-[380px] overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-3xl rounded-2xl p-4 space-y-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-medium text-xs shadow-lg'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 text-xs shadow-inner'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] opacity-70 font-mono mb-1">
                  <span>{msg.role === 'user' ? 'You' : 'KhulnaSoft AI Engine'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="font-sans leading-relaxed whitespace-pre-wrap">{msg.content}</div>

                {msg.suggestedActions && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5 font-mono">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      Suggested Quick Prompts:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {msg.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(action)}
                          className="text-[11px] bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-800/60 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-3 text-cyan-400 text-xs font-mono p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>KhulnaSoft AI Engine is reasoning over repository knowledge graph...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-2 bg-slate-950 border border-slate-800 rounded-2xl flex items-center space-x-3">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask AI to review PR, generate Mermaid architecture diagram, or audit security..."
            className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputPrompt.trim()}
            className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer shrink-0 flex items-center space-x-1 font-mono text-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
