
import React from 'react';

interface Props {
  src: string;
  isOpponent?: boolean;
  isAttacking?: boolean;
  isFainted?: boolean;
}

const PokemonSprite: React.FC<Props> = ({ src, isOpponent, isAttacking, isFainted }) => {
  return (
    <div className={`relative transition-all duration-500 ease-out ${isFainted ? 'opacity-0 translate-y-10 scale-75' : 'opacity-100 translate-y-0 scale-100'}`}>
      <img 
        src={src} 
        alt="pokemon" 
        className={`w-64 h-64 object-contain filter drop-shadow-xl
          ${isAttacking ? (isOpponent ? '-translate-x-12' : 'translate-x-12') : 'translate-x-0'}
          transition-transform duration-150 ease-in-out`}
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};

export default PokemonSprite;
