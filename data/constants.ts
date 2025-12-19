
import { PokemonType } from '../types';

export const TYPE_CHART: Record<PokemonType, Partial<Record<PokemonType, number>>> = {
  Fire: { Grass: 2, Ice: 2, Bug: 2, Steel: 2, Fire: 0.5, Water: 0.5, Rock: 0.5, Dragon: 0.5 },
  Water: { Fire: 2, Ground: 2, Rock: 2, Water: 0.5, Grass: 0.5, Dragon: 0.5 },
  Grass: { Water: 2, Ground: 2, Rock: 2, Fire: 0.5, Grass: 0.5, Poison: 0.5, Flying: 0.5, Bug: 0.5, Dragon: 0.5, Steel: 0.5 },
  Electric: { Water: 2, Flying: 2, Electric: 0.5, Grass: 0.5, Dragon: 0.5, Ground: 0 },
  Ice: { Grass: 2, Ground: 2, Flying: 2, Dragon: 2, Fire: 0.5, Water: 0.5, Ice: 0.5, Steel: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Rock: 2, Dark: 2, Steel: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Fairy: 0.5, Ghost: 0 },
  Poison: { Grass: 2, Fairy: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0 },
  Ground: { Fire: 2, Electric: 2, Poison: 2, Rock: 2, Steel: 2, Grass: 0.5, Bug: 0.5, Flying: 0 },
  Flying: { Grass: 2, Fighting: 2, Bug: 2, Electric: 0.5, Rock: 0.5, Steel: 0.5 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Steel: 0.5, Dark: 0 },
  Bug: { Grass: 2, Psychic: 2, Dark: 2, Fire: 0.5, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Ghost: 0.5, Steel: 0.5, Fairy: 0.5 },
  Rock: { Fire: 2, Ice: 2, Flying: 2, Bug: 2, Fighting: 0.5, Ground: 0.5, Steel: 0.5 },
  Ghost: { Psychic: 2, Ghost: 2, Normal: 0, Dark: 0.5 },
  Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Steel: { Ice: 2, Rock: 2, Fairy: 2, Fire: 0.5, Water: 0.5, Electric: 0.5, Steel: 0.5 },
  Fairy: { Fighting: 2, Dragon: 2, Dark: 2, Fire: 0.5, Poison: 0.5, Steel: 0.5 },
  Normal: { Rock: 0.5, Steel: 0.5, Ghost: 0 },
  Dark: { Psychic: 2, Ghost: 2, Fighting: 0.5, Dark: 0.5, Fairy: 0.5 },
};

export const TYPE_COLORS: Record<PokemonType, string> = {
  Fire: '#F08030', Water: '#6890F0', Grass: '#78C850', Electric: '#F8D030',
  Ice: '#98D8D8', Fighting: '#C03028', Poison: '#A040A0', Ground: '#E0C068',
  Flying: '#A890F0', Psychic: '#F85888', Bug: '#A8B820', Rock: '#B8A038',
  Ghost: '#705898', Dragon: '#7038F8', Steel: '#B8B8D0', Fairy: '#EE99AC',
  Normal: '#A8A878', Dark: '#705848'
};

export const TYPE_NAMES_CN: Record<PokemonType, string> = {
  Fire: '火', Water: '水', Grass: '草', Electric: '电',
  Ice: '冰', Fighting: '格斗', Poison: '毒', Ground: '地面',
  Flying: '飞行', Psychic: '超能', Bug: '虫', Rock: '岩石',
  Ghost: '幽灵', Dragon: '龙', Steel: '钢', Fairy: '妖精',
  Normal: '一般', Dark: '恶'
};

export const getTypeEffectiveness = (moveType: PokemonType, defenderTypes: PokemonType[]): number => {
  return defenderTypes.reduce((acc, defType) => {
    const effectiveness = TYPE_CHART[moveType]?.[defType] ?? 1;
    return acc * effectiveness;
  }, 1);
};
