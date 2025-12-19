
import React from 'react';
import { Pokemon } from '../types';
import { TYPE_COLORS, TYPE_NAMES_CN } from '../data/constants';

interface Props {
  pokemon: Pokemon;
  isOpponent?: boolean;
}

const HealthBar: React.FC<Props> = ({ pokemon, isOpponent }) => {
  const hpPercentage = Math.max(0, (pokemon.currentHp / pokemon.stats.hp) * 100);
  
  const getHpColor = () => {
    if (hpPercentage > 50) return 'bg-green-500';
    if (hpPercentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`p-4 bg-[#f8f8d8] border-4 border-gray-800 rounded-lg shadow-[8px_8px_0px_rgba(0,0,0,0.2)] w-80 text-gray-800 ${isOpponent ? 'self-start ml-4' : 'self-end mr-4'}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold text-lg uppercase tracking-tight">{pokemon.name}</span>
        <span className="text-sm font-bold bg-gray-300 px-2 py-0.5 rounded border border-gray-400">Lv50</span>
      </div>

      <div className="flex gap-1 mb-2">
        {pokemon.types.map(t => (
          <span key={t} className="text-[10px] px-2 py-0.5 text-white rounded shadow-sm border border-black/20" style={{ backgroundColor: TYPE_COLORS[t] }}>
            {TYPE_NAMES_CN[t]}
          </span>
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-orange-600">HP</span>
        <div className="relative h-4 flex-1 bg-gray-400 border-2 border-gray-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${getHpColor()}`}
            style={{ width: `${hpPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {!isOpponent && (
        <div className="text-right text-sm mt-1 font-bold font-mono">
          {Math.floor(pokemon.currentHp)} / {pokemon.stats.hp}
        </div>
      )}
    </div>
  );
};

export default HealthBar;
