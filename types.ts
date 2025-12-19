
export type PokemonType = 
  | 'Fire' | 'Water' | 'Grass' | 'Electric' | 'Ice' | 'Fighting' | 'Poison' 
  | 'Ground' | 'Flying' | 'Psychic' | 'Bug' | 'Rock' | 'Ghost' | 'Dragon' 
  | 'Steel' | 'Fairy' | 'Normal' | 'Dark';

export interface Move {
  name: string;
  type: PokemonType;
  category: 'Physical' | 'Special' | 'Status';
  power: number;
  accuracy: number;
  description: string;
}

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  spAtk: number;
  spDef: number;
  speed: number;
}

export interface Pokemon {
  id: string;
  name: string;
  types: PokemonType[];
  stats: PokemonStats;
  currentHp: number;
  moves: Move[];
  ability: string;
  item: string;
  sprite: string;
  backSprite: string;
  icon: string;
}

export interface BattleState {
  playerTeam: Pokemon[];
  opponentTeam: Pokemon[];
  playerActiveIdx: number;
  opponentActiveIdx: number;
  weather: 'None' | 'Sun' | 'Rain' | 'Sandstorm' | 'Snow';
  weatherTurns: number;
  log: string[];
  isGameOver: boolean;
  winner: 'Player' | 'Opponent' | null;
}
