import React from 'react';
import { Theory, UnitType, Faction, Unit } from '../types';
import { Shield, Plane, Ship, Zap, Satellite, Radiation, Users, Crosshair, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ControlPanelProps {
  selectedTheory: Theory;
  onTheoryChange: (theory: Theory) => void;
  onAddUnit: (type: UnitType, faction: Faction, label: string) => void;
  onRemoveUnit: (id: string) => void;
  selectedUnitId: string | null;
  units: Unit[];
}

const THEORIES: Theory[] = [
  '新现实主义',
  '进攻性现实主义',
  '防御性现实主义',
  '威慑理论',
  '复合相互依赖',
  '建构主义',
  '威胁平衡理论'
];

const UNIT_TYPES: { type: UnitType, icon: React.ReactNode, label: string }[] = [
  { type: '步兵', icon: <Users size={16} />, label: '步兵' },
  { type: '装甲', icon: <Shield size={16} />, label: '装甲' },
  { type: '空军', icon: <Plane size={16} />, label: '空军' },
  { type: '海军', icon: <Ship size={16} />, label: '海军' },
  { type: '网络', icon: <Zap size={16} />, label: '网络' },
  { type: '太空', icon: <Satellite size={16} />, label: '太空' },
  { type: '战略核', icon: <Radiation size={16} />, label: '战略核' },
  { type: '代理人', icon: <Crosshair size={16} />, label: '代理人' },
];

export function ControlPanel({ 
  selectedTheory, 
  onTheoryChange, 
  onAddUnit, 
  onRemoveUnit, 
  selectedUnitId,
  units
}: ControlPanelProps) {
  const [newUnitLabel, setNewUnitLabel] = React.useState('');
  const [newUnitFaction, setNewUnitFaction] = React.useState<Faction>('蓝军');

  const handleAddUnit = (type: UnitType) => {
    onAddUnit(type, newUnitFaction, newUnitLabel || `${type} 1`);
    setNewUnitLabel('');
  };

  const selectedUnit = units.find(u => u.id === selectedUnitId);

  return (
    <div className="w-80 flex flex-col gap-6 bg-slate-900 border-r border-slate-800 p-6 h-screen overflow-y-auto text-slate-200">
      <div>
        <h2 className="text-xl font-bold font-serif mb-1 text-white">国际战略学</h2>
        <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">兵棋推演实验室</p>
      </div>

      {/* Theory Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">学术理论框架</h3>
        <select 
          className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedTheory}
          onChange={(e) => onTheoryChange(e.target.value as Theory)}
        >
          {THEORIES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Order of Battle (OOB) */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">战斗序列</h3>
        
        <div className="flex gap-2 mb-2">
          <button 
            className={cn("flex-1 py-1 text-xs font-bold rounded", newUnitFaction === '蓝军' ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400")}
            onClick={() => setNewUnitFaction('蓝军')}
          >
            蓝军
          </button>
          <button 
            className={cn("flex-1 py-1 text-xs font-bold rounded", newUnitFaction === '红军' ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400")}
            onClick={() => setNewUnitFaction('红军')}
          >
            红军
          </button>
          <button 
            className={cn("flex-1 py-1 text-xs font-bold rounded", newUnitFaction === '中立' ? "bg-gray-500 text-white" : "bg-slate-800 text-slate-400")}
            onClick={() => setNewUnitFaction('中立')}
          >
            中立
          </button>
        </div>

        <input 
          type="text" 
          placeholder="单位标识（例如：第一舰队）" 
          className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          value={newUnitLabel}
          onChange={(e) => setNewUnitLabel(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-2">
          {UNIT_TYPES.map(({ type, icon, label }) => (
            <button
              key={type}
              onClick={() => handleAddUnit(type)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md px-3 py-2 text-xs transition-colors"
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Unit Info */}
      {selectedUnit && (
        <div className="mt-auto pt-4 border-t border-slate-800 space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">已选单位</h3>
          <div className="bg-slate-800 p-3 rounded-md border border-slate-700">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-bold text-sm">{selectedUnit.label}</div>
                <div className="text-xs text-slate-400 uppercase">{selectedUnit.faction} • {selectedUnit.type}</div>
              </div>
              <button 
                onClick={() => onRemoveUnit(selectedUnit.id)}
                className="text-red-400 hover:text-red-300 p-1"
                title="移除单位"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="text-xs font-mono text-slate-500">
              坐标: {selectedUnit.lat.toFixed(2)}纬度, {selectedUnit.lng.toFixed(2)}经度
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

