
import { Pokemon, Move, BattleState } from '../types';
import { getTypeEffectiveness } from '../data/constants';

export const calculateDamage = (attacker: Pokemon, defender: Pokemon, move: Move, weather: BattleState['weather']): number => {
  if (move.category === 'Status') return 0;

  const level = 50;
  
  // 气象球机制处理
  let movePower = move.power;
  let moveType = move.type;
  
  if (move.name === '气象球' && weather !== 'None') {
    movePower = 100; // 天气下威力翻倍
    if (weather === 'Sun') moveType = 'Fire';
    else if (weather === 'Rain') moveType = 'Water';
    else if (weather === 'Sandstorm') moveType = 'Rock';
    else if (weather === 'Snow') moveType = 'Ice';
  }

  const attack = move.category === 'Physical' ? attacker.stats.attack : attacker.stats.spAtk;
  const defense = move.category === 'Physical' ? defender.stats.defense : defender.stats.spDef;

  let damage = (((2 * level / 5 + 2) * movePower * attack / defense) / 50 + 2);

  // Weather modifiers
  if (weather === 'Sun') {
    if (moveType === 'Fire') damage *= 1.5;
    if (moveType === 'Water' && move.name !== '水蒸气') damage *= 0.5;
    if (move.name === '水蒸气') damage *= 1.5;
  }

  // STAB
  if (attacker.types.includes(moveType)) damage *= 1.5;

  // Type effectiveness
  const effectiveness = getTypeEffectiveness(moveType, defender.types);
  damage *= effectiveness;

  // Random factor
  const random = 0.85 + Math.random() * 0.15;
  damage *= random;

  return Math.floor(damage);
};

export const getAIAction = (opponent: Pokemon, player: Pokemon, weather: BattleState['weather']): number => {
  // Simple heuristic: Choose move with highest damage
  let bestMoveIdx = 0;
  let maxDamage = -1;

  opponent.moves.forEach((move, idx) => {
    const damage = calculateDamage(opponent, player, move, weather);
    if (damage > maxDamage) {
      maxDamage = damage;
      bestMoveIdx = idx;
    }
  });

  return bestMoveIdx;
};

export const checkSpeed = (p1: Pokemon, p2: Pokemon, weather: BattleState['weather']): boolean => {
  let s1 = p1.stats.speed;
  let s2 = p2.stats.speed;

  if (weather === 'Sun') {
    if (p1.ability === 'Chlorophyll') s1 *= 2;
    if (p2.ability === 'Chlorophyll') s2 *= 2;
  }

  return s1 >= s2;
};
