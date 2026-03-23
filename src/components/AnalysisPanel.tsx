import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Loader2, ExternalLink, BookOpen, Shield, Swords, Globe, Eye, Link, Brain, Target, AlertTriangle, Lock, Zap, Network, Lightbulb, Scale, Users } from 'lucide-react';
import { SimulationResult, Theory } from '../types';

interface AnalysisPanelProps {
  onSimulate: (prompt: string) => Promise<void>;
  isSimulating: boolean;
  result: SimulationResult | null;
  selectedTheory: Theory;
}

const THEORY_DETAILS: Record<Theory, { description: string; tenets: { title: string; desc: string; icon: React.ElementType }[] }> = {
  '新现实主义': {
    description: '强调国际体系的无政府结构是决定国家行为的根本原因，国家首要目标是生存。',
    tenets: [
      { title: '无政府状态', desc: '国际社会缺乏最高权威', icon: Globe },
      { title: '结构决定论', desc: '体系结构决定国家行为', icon: Network },
      { title: '生存第一', desc: '国家最核心的利益是生存', icon: Shield }
    ]
  },
  '进攻性现实主义': {
    description: '认为国家为了确保绝对安全，会不断追求权力最大化，最终目标是成为霸权。',
    tenets: [
      { title: '权力最大化', desc: '不断扩张以获取更多权力', icon: Zap },
      { title: '霸权目标', desc: '追求区域或全球霸权', icon: Target },
      { title: '进攻意图', desc: '国家总是具有潜在的进攻性', icon: Swords }
    ]
  },
  '防御性现实主义': {
    description: '认为国际体系并不鼓励过度扩张，国家追求的是适度权力以维持现状和安全。',
    tenets: [
      { title: '安全困境', desc: '增强自身安全会引发他国不安', icon: AlertTriangle },
      { title: '维持现状', desc: '国家倾向于维持现有的权力分配', icon: Lock },
      { title: '权力平衡', desc: '通过制衡来防止霸权出现', icon: Scale }
    ]
  },
  '威慑理论': {
    description: '通过展示报复能力和决心，使对手相信采取敌对行动的成本将超过收益，从而阻止其行动。',
    tenets: [
      { title: '报复能力', desc: '拥有造成不可承受损失的武力', icon: Zap },
      { title: '报复决心', desc: '让对手相信你一定会使用武力', icon: Target },
      { title: '沟通机制', desc: '清晰地向对手传递红线与后果', icon: Eye }
    ]
  },
  '复合相互依赖': {
    description: '强调国家间在经济、社会等多个领域的相互交织，降低了军事力量的有效性。',
    tenets: [
      { title: '多渠道联系', desc: '国家间存在政府与非政府的广泛联系', icon: Network },
      { title: '议题无等级', desc: '军事安全不再绝对高于经济社会议题', icon: Scale },
      { title: '武力作用下降', desc: '军事力量在解决争端中的作用减弱', icon: Link }
    ]
  },
  '建构主义': {
    description: '认为国际政治的现实是由人类的观念、认同和互动所建构的，而非纯粹的物质力量。',
    tenets: [
      { title: '观念与认同', desc: '国家利益由其身份和认同决定', icon: Brain },
      { title: '规范建构', desc: '国际规范塑造国家行为', icon: Lightbulb },
      { title: '互动决定结构', desc: '无政府状态是国家互动的结果', icon: Users }
    ]
  },
  '威胁平衡理论': {
    description: '国家结盟不是为了平衡权力，而是为了平衡威胁。威胁由综合实力、地理、进攻能力和意图决定。',
    tenets: [
      { title: '综合实力', desc: '国家的整体资源和力量', icon: Shield },
      { title: '地理邻近性', desc: '距离越近，威胁感知越强', icon: Globe },
      { title: '进攻意图', desc: '被认知为具有侵略性的国家更具威胁', icon: AlertTriangle }
    ]
  }
};

export function AnalysisPanel({ onSimulate, isSimulating, result, selectedTheory }: AnalysisPanelProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isSimulating) return;
    onSimulate(prompt);
  };

  const theoryInfo = THEORY_DETAILS[selectedTheory];

  return (
    <div className="w-96 flex flex-col bg-slate-900 border-l border-slate-800 h-screen text-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-2">
        <BookOpen size={18} className="text-blue-400" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">战略分析与理论推演</h2>
      </div>

      {/* Output Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Theory Infographic Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 shadow-inner">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={16} className="text-blue-400" />
            <h3 className="text-sm font-bold text-white">{selectedTheory}</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            {theoryInfo.description}
          </p>
          <div className="grid grid-cols-1 gap-3">
            {theoryInfo.tenets.map((tenet, idx) => {
              const Icon = tenet.icon;
              return (
                <div key={idx} className="flex items-start gap-3 bg-slate-800 p-2.5 rounded-md border border-slate-700/50">
                  <div className="bg-blue-900/30 p-1.5 rounded text-blue-400 mt-0.5">
                    <Icon size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">{tenet.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{tenet.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {result ? (
          <div className="prose prose-invert prose-sm max-w-none">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
              <Target size={16} className="text-red-400" />
              <h3 className="text-sm font-bold text-white m-0">推演报告</h3>
            </div>
            <ReactMarkdown>{result.analysis}</ReactMarkdown>
            
            {result.groundingLinks && result.groundingLinks.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">情报来源</h4>
                <ul className="space-y-1 list-none pl-0">
                  {result.groundingLinks.map((link, i) => (
                    <li key={i} className="text-xs">
                      <a href={link.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        <ExternalLink size={12} />
                        <span className="truncate">{link.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500 text-center p-6 mt-8">
            <BookOpen size={48} className="mb-4 opacity-20" />
            <p className="text-sm">请在沙盘地图上部署单位，选择理论框架，并输入战略提示以开始推演。</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="输入反事实推演场景（例如：'如果红军代理人武装对蓝军的指挥节点发动先发制人的网络攻击会怎样？'）"
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
            disabled={isSimulating}
          />
          <button
            type="submit"
            disabled={isSimulating || !prompt.trim()}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-2 px-4 rounded-md transition-colors text-sm uppercase tracking-wider"
          >
            {isSimulating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                推演中...
              </>
            ) : (
              <>
                <Send size={16} />
                运行推演
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}


