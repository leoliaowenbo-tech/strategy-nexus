import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Unit, Faction, UnitType } from '../types';
import { renderToString } from 'react-dom/server';
import { Shield, Plane, Ship, Zap, Satellite, Radiation, Users, Crosshair } from 'lucide-react';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const UnitIconSvg = ({ type }: { type: UnitType }) => {
  switch (type) {
    case '步兵': return <Users size={20} />;
    case '装甲': return <Shield size={20} />;
    case '空军': return <Plane size={20} />;
    case '海军': return <Ship size={20} />;
    case '网络': return <Zap size={20} />;
    case '太空': return <Satellite size={20} />;
    case '战略核': return <Radiation size={20} />;
    case '代理人': return <Crosshair size={20} />;
    default: return <Shield size={20} />;
  }
};

const createUnitIcon = (unit: Unit, isSelected: boolean) => {
  const bgColor = unit.faction === '蓝军' ? '#2563eb' : unit.faction === '红军' ? '#dc2626' : '#64748b';
  const ring = isSelected ? 'box-shadow: 0 0 0 4px white;' : '';
  const scale = isSelected ? 'transform: scale(1.1);' : '';
  
  const iconHtml = renderToString(<UnitIconSvg type={unit.type} />);
  
  const html = `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <div style="display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 6px; border: 2px solid white; background-color: ${bgColor}; color: white; ${ring} ${scale} transition: all 0.2s; cursor: grab;">
        ${iconHtml}
      </div>
      <div style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); margin-top: 4px; padding: 2px 6px; font-size: 10px; font-family: monospace; font-weight: bold; border-radius: 4px; white-space: nowrap; background-color: #1e293b; color: #e2e8f0; z-index: 1000; pointer-events: none;">
        ${unit.label}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-unit-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

function MapEvents({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({
    click: onMapClick,
  });
  return null;
}

interface SandboxMapProps {
  units: Unit[];
  onUnitMove: (id: string, lat: number, lng: number) => void;
  onUnitSelect: (id: string | null) => void;
  selectedUnitId: string | null;
}

export function SandboxMap({ units, onUnitMove, onUnitSelect, selectedUnitId }: SandboxMapProps) {
  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-slate-700 shadow-2xl z-0">
      <MapContainer center={[26.5, 54.0]} zoom={5} style={{ height: '100%', width: '100%' }} attributionControl={false}>
        <TileLayer
          url="https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
        />
        <MapEvents onMapClick={() => onUnitSelect(null)} />
        {units.map((unit) => (
          <Marker
            key={unit.id}
            position={[unit.lat, unit.lng]}
            icon={createUnitIcon(unit, selectedUnitId === unit.id)}
            draggable={true}
            eventHandlers={{
              click: () => onUnitSelect(unit.id),
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                onUnitMove(unit.id, position.lat, position.lng);
              },
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
