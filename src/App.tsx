import React, { useState } from 'react';
import { SandboxMap } from './components/SandboxMap';
import { ControlPanel } from './components/ControlPanel';
import { AnalysisPanel } from './components/AnalysisPanel';
import { Unit, Theory, Scenario, SimulationResult, UnitType, Faction } from './types';
import { runWargameSimulation } from './services/geminiService';

const DEFAULT_SCENARIO: Scenario = {
  id: 'middle-east-1',
  name: '波斯湾冲突热点',
  description: '一个假设的中东地区大国升级场景，重点关注战略威慑、代理人战争以及潜在的核突破。',
  mapSvg: '', 
  defaultUnits: [
    { id: 'u1', type: '空军', faction: '蓝军', lat: 26.2, lng: 50.6, label: '第一打击联队' },
    { id: 'u2', type: '战略核', faction: '红军', lat: 29.6, lng: 52.5, label: '战略火箭军' },
    { id: 'u3', type: '代理人', faction: '红军', lat: 26.0, lng: 56.0, label: '地方武装组织' },
    { id: 'u4', type: '海军', faction: '蓝军', lat: 25.0, lng: 54.0, label: '航母打击群' },
  ]
};

export default function App() {
  const [units, setUnits] = useState<Unit[]>(DEFAULT_SCENARIO.defaultUnits);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedTheory, setSelectedTheory] = useState<Theory>('新现实主义');
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleUnitMove = (id: string, lat: number, lng: number) => {
    setUnits(prev => prev.map(u => u.id === id ? { ...u, lat, lng } : u));
  };

  const handleAddUnit = (type: UnitType, faction: Faction, label: string) => {
    const newUnit: Unit = {
      id: `u-${Date.now()}`,
      type,
      faction,
      label,
      lat: 26.5,
      lng: 54.0
    };
    setUnits(prev => [...prev, newUnit]);
    setSelectedUnitId(newUnit.id);
  };

  const handleRemoveUnit = (id: string) => {
    setUnits(prev => prev.filter(u => u.id !== id));
    if (selectedUnitId === id) setSelectedUnitId(null);
  };

  const handleSimulate = async (prompt: string) => {
    setIsSimulating(true);
    try {
      const res = await runWargameSimulation(DEFAULT_SCENARIO, units, selectedTheory, prompt);
      setResult(res);
    } catch (error) {
      console.error(error);
      setResult({ analysis: "推演过程中发生错误，请检查控制台或您的 API 密钥。" });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      <ControlPanel 
        selectedTheory={selectedTheory}
        onTheoryChange={setSelectedTheory}
        onAddUnit={handleAddUnit}
        onRemoveUnit={handleRemoveUnit}
        selectedUnitId={selectedUnitId}
        units={units}
      />
      
      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <header className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">{DEFAULT_SCENARIO.name}</h1>
            <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">{DEFAULT_SCENARIO.description}</p>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">当前理论框架</div>
            <div className="text-lg font-bold text-blue-400">{selectedTheory}</div>
          </div>
        </header>

        <div className="flex-1 relative rounded-xl border border-slate-800 bg-slate-900/50 shadow-2xl p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">战术沙盘</h2>
            <div className="flex gap-4 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> 蓝军</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> 红军</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-500"></span> 中立</span>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <SandboxMap 
              units={units}
              onUnitMove={handleUnitMove}
              onUnitSelect={setSelectedUnitId}
              selectedUnitId={selectedUnitId}
            />
          </div>
        </div>
      </main>

      <AnalysisPanel 
        onSimulate={handleSimulate}
        isSimulating={isSimulating}
        result={result}
        selectedTheory={selectedTheory}
      />
    </div>
  );
}

