export type UnitType = '步兵' | '装甲' | '空军' | '海军' | '网络' | '太空' | '战略核' | '代理人';
export type Faction = '蓝军' | '红军' | '中立';

export interface Unit {
  id: string;
  type: UnitType;
  faction: Faction;
  lat: number;
  lng: number;
  label: string;
}

export type Theory = 
  | '新现实主义' 
  | '进攻性现实主义' 
  | '防御性现实主义' 
  | '威慑理论' 
  | '复合相互依赖'
  | '建构主义'
  | '威胁平衡理论';

export interface Scenario {
  id: string;
  name: string;
  description: string;
  mapSvg: string; // URL or SVG string
  defaultUnits: Unit[];
}

export interface SimulationResult {
  analysis: string;
  groundingLinks?: { title: string; uri: string }[];
}
