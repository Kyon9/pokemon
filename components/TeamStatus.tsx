
import React from 'react';
import { Pokemon } from '../types';

interface Props {
  team: Pokemon[];
  isOpponent?: boolean;
}

const TeamStatus: React.FC<Props> = ({ team, isOpponent }) => {
  return (
    <div className={`flex gap-1 ${isOpponent ? 'justify-start ml-4 mt-2' : 'justify-end mr-4 mt-2'}`}>
      {Array.from({ length: 6 }).map((_, i) => {
        const pokemon = team[i];
        const isFainted = pokemon ? pokemon.currentHp <= 0 : true;
        const exists = !!pokemon;

        return (
          <div 
            key={i} 
            className={`w-4 h-4 rounded-full border border-gray-900 shadow-sm transition-colors duration-500
              ${!exists ? 'bg-transparent border-dashed opacity-30' : 
                isFainted ? 'bg-gray-500' : 'bg-red-500'}`}
          >
            <div className="w-full h-[1px] bg-gray-900 mt-[7px]"></div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamStatus;
