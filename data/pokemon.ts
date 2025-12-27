
import { Pokemon, Move } from '../types';

const MOVES: Record<string, Move> = {
  Eruption: { name: '喷火', type: 'Fire', category: 'Special', power: 150, accuracy: 100, description: '体力越多威力越大。' },
  SolarBeam: { name: '日光束', type: 'Grass', category: 'Special', power: 120, accuracy: 100, description: '吸收阳光并发射。' },
  WeatherBall: { name: '气象球', type: 'Normal', category: 'Special', power: 50, accuracy: 100, description: '根据天气改变属性。' },
  GigaDrain: { name: '终极吸取', type: 'Grass', category: 'Special', power: 75, accuracy: 100, description: '吸取对方生命值。' },
  SludgeBomb: { name: '污泥炸弹', type: 'Poison', category: 'Special', power: 90, accuracy: 100, description: '可能使对手中毒。' },
  FireBlast: { name: '大字爆炎', type: 'Fire', category: 'Special', power: 110, accuracy: 85, description: '强烈的火焰攻击。' },
  HydroSteam: { name: '水蒸气', type: 'Water', category: 'Special', power: 80, accuracy: 100, description: '在晴天威力和属性增强。' },
  DracoMeteor: { name: '流星群', type: 'Dragon', category: 'Special', power: 130, accuracy: 90, description: '大幅降低自身特攻。' },
  CloseCombat: { name: '近身战', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, description: '降低自身防御特防。' },
  HeadlongRush: { name: '突击', type: 'Ground', category: 'Physical', power: 120, accuracy: 100, description: '猛烈撞击。' },
  DragonDance: { name: '龙之舞', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, description: '提升攻击与速度。' },
  Acrobatics: { name: '杂技', type: 'Flying', category: 'Physical', power: 55, accuracy: 100, description: '无道具时威力翻倍。' },
  ShadowBall: { name: '暗影球', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, description: '可能降低对手特防。' },
  Earthquake: { name: '地震', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, description: '震击所有地面目标。' },
  Moonblast: { name: '月亮之力', type: 'Fairy', category: 'Special', power: 95, accuracy: 100, description: '借用月亮之力。' },
  IronHead: { name: '铁头', type: 'Steel', category: 'Physical', power: 80, accuracy: 100, description: '可能使对手畏缩。' },
  MysticalFire: { name: '魔法火焰', type: 'Fire', category: 'Special', power: 75, accuracy: 100, description: '降低对手的特攻。' },
};

/**
 * 针对中国境内访问优化的图片源：
 * 使用 jsDelivr 提供的官方 PokeAPI 镜像，这是目前国内访问 GitHub 资源最稳定的路径。
 */
const JSDELIVR_POKEAPI = "https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/";

const getSprite = (id: number) => `${JSDELIVR_POKEAPI}${id}.png`;
const getBackSprite = (id: number, showdownName?: string) => {
  // 第九世代宝可梦 (ID > 905) 在官方像素库中往往缺失背面图
  // 我们使用 Showdown 的资源作为补充，或者回退到正面图
  if (id > 905 && showdownName) {
    return `https://play.pokemonshowdown.com/sprites/ani-back/${showdownName}.gif`;
  }
  return `${JSDELIVR_POKEAPI}back/${id}.png`;
};
const getIcon = (id: number) => `${JSDELIVR_POKEAPI}${id}.png`;

export const PLAYER_TEAM: Pokemon[] = [
  {
    id: 'p1', name: '煤炭龟', types: ['Fire'], ability: 'Drought', item: '炎热岩石',
    stats: { hp: 344, attack: 206, defense: 416, spAtk: 206, spDef: 176, speed: 76 },
    currentHp: 344, sprite: getSprite(324), backSprite: getBackSprite(324), icon: getIcon(324),
    moves: [MOVES.Eruption, MOVES.SolarBeam, MOVES.WeatherBall, MOVES.Earthquake]
  },
  {
    id: 'p2', name: '妙蛙花', types: ['Grass', 'Poison'], ability: 'Chlorophyll', item: '生命宝珠',
    stats: { hp: 301, attack: 180, defense: 202, spAtk: 299, spDef: 236, speed: 259 },
    currentHp: 301, sprite: getSprite(3), backSprite: getBackSprite(3), icon: getIcon(3),
    moves: [MOVES.GigaDrain, MOVES.WeatherBall, MOVES.SludgeBomb, MOVES.SolarBeam]
  },
  {
    id: 'p3', name: '波荡水', types: ['Water', 'Dragon'], ability: 'Protosynthesis', item: '讲究眼镜',
    stats: { hp: 343, attack: 181, defense: 218, spAtk: 349, spDef: 202, speed: 317 },
    currentHp: 343, sprite: getSprite(1009), backSprite: getBackSprite(1009, 'walkingwake'), icon: getIcon(1009),
    moves: [MOVES.HydroSteam, MOVES.DracoMeteor, MOVES.WeatherBall, MOVES.FireBlast]
  },
  {
    id: 'p4', name: '雄伟牙', types: ['Ground', 'Fighting'], ability: 'Protosynthesis', item: '驱劲能量',
    stats: { hp: 371, attack: 361, defense: 298, spAtk: 127, spDef: 142, speed: 273 },
    currentHp: 371, sprite: getSprite(984), backSprite: getBackSprite(984, 'greattusk'), icon: getIcon(984),
    moves: [MOVES.HeadlongRush, MOVES.CloseCombat, MOVES.Earthquake, MOVES.IronHead]
  },
  {
    id: 'p5', name: '振翼发', types: ['Ghost', 'Fairy'], ability: 'Protosynthesis', item: '驱劲能量',
    stats: { hp: 251, attack: 131, defense: 146, spAtk: 369, spDef: 306, speed: 405 },
    currentHp: 251, sprite: getSprite(987), backSprite: getBackSprite(987, 'fluttermane'), icon: getIcon(987),
    moves: [MOVES.ShadowBall, MOVES.Moonblast, MOVES.WeatherBall, MOVES.MysticalFire]
  },
  {
    id: 'p6', name: '喷火龙', types: ['Fire', 'Flying'], ability: 'Solar Power', item: '厚底靴',
    stats: { hp: 297, attack: 183, defense: 192, spAtk: 317, spDef: 206, speed: 299 },
    currentHp: 297, sprite: getSprite(6), backSprite: getBackSprite(6), icon: getIcon(6),
    moves: [MOVES.FireBlast, MOVES.SolarBeam, MOVES.WeatherBall, MOVES.DracoMeteor]
  }
];

export const OPPONENT_TEAM: Pokemon[] = [
  {
    id: 'o1', name: '烈咬陆鲨', types: ['Dragon', 'Ground'], ability: 'Rough Skin', item: '生命宝珠',
    stats: { hp: 357, attack: 359, defense: 226, spAtk: 176, spDef: 206, speed: 303 },
    currentHp: 357, sprite: getSprite(445), backSprite: getBackSprite(445), icon: getIcon(445),
    moves: [MOVES.Earthquake, MOVES.IronHead, MOVES.DracoMeteor, MOVES.CloseCombat]
  },
  {
    id: 'o2', name: '赛富豪', types: ['Steel', 'Ghost'], ability: 'Good as Gold', item: '讲究眼镜',
    stats: { hp: 315, attack: 140, defense: 226, spAtk: 365, spDef: 218, speed: 267 },
    currentHp: 315, sprite: getSprite(1000), backSprite: getBackSprite(1000, 'gholdengo'), icon: getIcon(1000),
    moves: [MOVES.ShadowBall, MOVES.IronHead, MOVES.WeatherBall, MOVES.Moonblast]
  },
  {
    id: 'o3', name: '铁武者', types: ['Fairy', 'Fighting'], ability: 'Quark Drive', item: '驱劲能量',
    stats: { hp: 289, attack: 359, defense: 216, spAtk: 339, spDef: 156, speed: 331 },
    currentHp: 289, sprite: getSprite(1006), backSprite: getBackSprite(1006, 'ironvaliant'), icon: getIcon(1006),
    moves: [MOVES.Moonblast, MOVES.CloseCombat, MOVES.ShadowBall, MOVES.IronHead]
  },
  {
    id: 'o4', name: '仆刀将军', types: ['Dark', 'Steel'], ability: 'Supreme Overlord', item: '剩饭',
    stats: { hp: 341, attack: 371, defense: 276, spAtk: 140, spDef: 206, speed: 136 },
    currentHp: 341, sprite: getSprite(983), backSprite: getBackSprite(983, 'kingambit'), icon: getIcon(983),
    moves: [MOVES.IronHead, MOVES.ShadowBall, MOVES.Earthquake, MOVES.CloseCombat]
  },
  {
    id: 'o5', name: '多龙巴鲁托', types: ['Dragon', 'Ghost'], ability: 'Infiltrator', item: '讲究头带',
    stats: { hp: 317, attack: 339, defense: 186, spAtk: 236, spDef: 186, speed: 421 },
    currentHp: 317, sprite: getSprite(887), backSprite: getBackSprite(887), icon: getIcon(887),
    moves: [MOVES.ShadowBall, MOVES.DracoMeteor, MOVES.Acrobatics, MOVES.FireBlast]
  },
  {
    id: 'o6', name: '巨锻匠', types: ['Fairy', 'Steel'], ability: 'Mold Breaker', item: '剩饭',
    stats: { hp: 311, attack: 186, defense: 206, spAtk: 176, spDef: 246, speed: 224 },
    currentHp: 311, sprite: getSprite(959), backSprite: getBackSprite(959, 'tinkaton'), icon: getIcon(959),
    moves: [MOVES.IronHead, MOVES.Moonblast, MOVES.CloseCombat, MOVES.ShadowBall]
  }
];
