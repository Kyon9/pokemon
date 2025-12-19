
import React, { useState, useEffect } from 'react';
import { Pokemon, BattleState, Move } from './types';
import { PLAYER_TEAM, OPPONENT_TEAM } from './data/pokemon';
import { calculateDamage, getAIAction, checkSpeed } from './utils/battleEngine';
import { TYPE_COLORS, TYPE_NAMES_CN, getTypeEffectiveness } from './data/constants';
import HealthBar from './components/HealthBar';
import PokemonSprite from './components/PokemonSprite';
import TeamStatus from './components/TeamStatus';

const App: React.FC = () => {
  const [state, setState] = useState<BattleState>({
    playerTeam: JSON.parse(JSON.stringify(PLAYER_TEAM)),
    opponentTeam: JSON.parse(JSON.stringify(OPPONENT_TEAM)),
    playerActiveIdx: 0,
    opponentActiveIdx: 0,
    weather: 'None',
    weatherTurns: 0,
    log: ['一场激烈的宝可梦对战开始了！'],
    isGameOver: false,
    winner: null,
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);
  const [attackerSide, setAttackerSide] = useState<'player' | 'opponent' | null>(null);

  useEffect(() => {
    restartGame();
  }, []);

  if (!state.playerTeam || !state.opponentTeam) return null;

  const playerActive = state.playerTeam[state.playerActiveIdx];
  const opponentActive = state.opponentTeam[state.opponentActiveIdx];

  const addLog = (msg: string) => {
    setState(prev => ({ ...prev, log: [msg, ...prev.log].slice(0, 10) }));
  };

  const restartGame = () => {
    setState({
      playerTeam: JSON.parse(JSON.stringify(PLAYER_TEAM)),
      opponentTeam: JSON.parse(JSON.stringify(OPPONENT_TEAM)),
      playerActiveIdx: 0,
      opponentActiveIdx: 0,
      weather: 'None',
      weatherTurns: 0,
      log: ['战斗重置，新的对决开始了！'],
      isGameOver: false,
      winner: null,
    });
    setIsAnimating(false);
    setShowSwitchMenu(false);
    setAttackerSide(null);
  };

  useEffect(() => {
    if (playerActive && playerActive.ability === 'Drought' && state.weather !== 'Sun' && !state.isGameOver && playerActive.currentHp > 0) {
      setState(prev => ({ ...prev, weather: 'Sun', weatherTurns: 8 }));
      addLog(`因为${playerActive.name}的【日照】特性，阳光变得猛烈了！`);
    }
  }, [state.playerActiveIdx, state.isGameOver, playerActive.id]);

  const getEffectivenessLabel = (move: Move, defender: Pokemon) => {
    const effectiveness = getTypeEffectiveness(move.type, defender.types);
    if (effectiveness > 1) return { text: '效果绝佳', color: 'text-red-500' };
    if (effectiveness === 1) return { text: '效果一般', color: 'text-gray-600' };
    if (effectiveness > 0) return { text: '收效甚微', color: 'text-blue-500' };
    return { text: '没有效果', color: 'text-gray-400' };
  };

  const executeMove = async (attacker: Pokemon, defender: Pokemon, move: Move, isPlayerAttacker: boolean) => {
    if (attacker.currentHp <= 0 || state.isGameOver) return false;
    addLog(`${attacker.name}使用了【${move.name}】！`);
    setAttackerSide(isPlayerAttacker ? 'player' : 'opponent');
    await new Promise(r => setTimeout(r, 200));
    setAttackerSide(null);
    await new Promise(r => setTimeout(r, 400));
    const damage = calculateDamage(attacker, defender, move, state.weather);
    const isFainted = defender.currentHp - damage <= 0;
    setState(prev => {
      const targetTeamKey = isPlayerAttacker ? 'opponentTeam' : 'playerTeam';
      const targetIdx = isPlayerAttacker ? prev.opponentActiveIdx : prev.playerActiveIdx;
      const newTeam = [...prev[targetTeamKey]];
      newTeam[targetIdx] = { ...newTeam[targetIdx], currentHp: Math.max(0, newTeam[targetIdx].currentHp - damage) };
      return { ...prev, [targetTeamKey]: newTeam };
    });
    const eff = getTypeEffectiveness(move.type, defender.types);
    if (eff > 1) addLog(`效果绝佳！`);
    else if (eff < 1 && eff > 0) addLog(`收效甚微...`);
    else if (eff === 0) addLog(`完全没有效果。`);
    if (isFainted) {
      await new Promise(r => setTimeout(r, 600));
      addLog(`${defender.name}倒下了！`);
      return true;
    }
    return false;
  };

  const endTurn = () => {
    setState(prev => {
      if (prev.weather !== 'None' && prev.weatherTurns > 0) {
        const nextTurns = prev.weatherTurns - 1;
        if (nextTurns === 0) {
          addLog('天气恢复了正常。');
          return { ...prev, weather: 'None', weatherTurns: 0 };
        }
        return { ...prev, weatherTurns: nextTurns };
      }
      return prev;
    });
    checkBattleStatus();
  };

  const handleMove = async (moveIdx: number) => {
    if (isAnimating || state.isGameOver) return;
    setIsAnimating(true);
    const pMove = playerActive.moves[moveIdx];
    const aiIdx = getAIAction(opponentActive, playerActive, state.weather);
    const oMove = opponentActive.moves[aiIdx];
    const playerGoesFirst = checkSpeed(playerActive, opponentActive, state.weather);
    if (playerGoesFirst) {
      const opponentFainted = await executeMove(playerActive, opponentActive, pMove, true);
      if (!opponentFainted) {
        await new Promise(r => setTimeout(r, 400));
        await executeMove(opponentActive, playerActive, oMove, false);
      }
    } else {
      const playerFainted = await executeMove(opponentActive, playerActive, oMove, false);
      if (!playerFainted) {
        await new Promise(r => setTimeout(r, 400));
        await executeMove(playerActive, opponentActive, pMove, true);
      }
    }
    endTurn();
    setIsAnimating(false);
  };

  const handleSwitch = async (idx: number) => {
    if (isAnimating || idx === state.playerActiveIdx || state.playerTeam[idx].currentHp <= 0) return;
    setIsAnimating(true);
    setShowSwitchMenu(false);
    const isForced = playerActive.currentHp <= 0;
    if (!isForced) {
      addLog(`辛苦了${playerActive.name}！回来吧！`);
      await new Promise(r => setTimeout(r, 600));
    }
    setState(prev => ({
      ...prev,
      playerActiveIdx: idx,
      log: [`去吧！${prev.playerTeam[idx].name}！`, ...prev.log]
    }));
    if (!isForced) {
      await new Promise(r => setTimeout(r, 800));
      const curOpponent = state.opponentTeam[state.opponentActiveIdx];
      const nextPlayer = state.playerTeam[idx];
      const aiIdx = getAIAction(curOpponent, nextPlayer, state.weather);
      await executeMove(curOpponent, nextPlayer, curOpponent.moves[aiIdx], false);
      endTurn();
    } 
    setIsAnimating(false);
  };

  const checkBattleStatus = () => {
    setState(prev => {
      const pAllFainted = prev.playerTeam.every(p => p.currentHp <= 0);
      const oAllFainted = prev.opponentTeam.every(p => p.currentHp <= 0);
      if (pAllFainted) return { ...prev, isGameOver: true, winner: 'Opponent' };
      if (oAllFainted) return { ...prev, isGameOver: true, winner: 'Player' };
      if (prev.opponentTeam[prev.opponentActiveIdx].currentHp <= 0) {
        const nIdx = prev.opponentTeam.findIndex(p => p.currentHp > 0);
        if (nIdx !== -1) {
          return { 
            ...prev, 
            opponentActiveIdx: nIdx, 
            log: [`对手派出了${prev.opponentTeam[nIdx].name}！`, ...prev.log] 
          };
        }
      }
      return prev;
    });
  };

  const weatherLabels: Record<string, string> = {
    'Sun': '猛烈阳光',
    'Rain': '下雨',
    'Sandstorm': '沙暴',
    'Snow': '下雪',
    'None': '无天气'
  };

  return (
    <div className="h-screen w-full bg-[#000] flex flex-col items-center justify-center p-2">
      {/* 战斗主屏幕 */}
      <div className="relative w-full max-w-4xl aspect-[16/9] bg-[#a5d6a7] border-[8px] border-[#222] rounded-[40px] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,1)]">
        
        {/* 背景 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#80d8ff] via-[#90e0ff] to-[#a5d6a7]"></div>
        
        {/* 平台渲染 */}
        {/* 对手平台 - 极其右上 */}
        <div className="absolute top-[28%] right-[5%] w-[35%] h-[12%] bg-black/10 rounded-[100%] blur-md z-0"></div>
        {/* 玩家平台 - 极其左下 */}
        <div className="absolute bottom-[2%] left-[2%] w-[55%] h-[22%] bg-black/10 rounded-[100%] blur-md z-0"></div>

        {/* 天气遮罩 */}
        {state.weather === 'Sun' && (
          <div className="absolute inset-0 bg-orange-400/20 pointer-events-none animate-pulse z-30"></div>
        )}

        {/* 【对手】 UI & 立绘 */}
        {/* 对手UI：相对于旧版下移并右移 */}
        <div className="absolute top-24 left-32 z-40 transform scale-90 origin-top-left">
          <HealthBar key={`hp-opp-${opponentActive.id}`} pokemon={opponentActive} isOpponent />
          <TeamStatus team={state.opponentTeam} isOpponent />
        </div>
        
        {/* 对手立绘：极右上角 */}
        <div className="absolute top-[2%] right-[4%] z-20">
          <PokemonSprite 
            key={`sprite-opp-${opponentActive.id}`} 
            src={opponentActive.sprite} 
            isOpponent 
            isAttacking={attackerSide === 'opponent'} 
            isFainted={opponentActive.currentHp <= 0} 
          />
        </div>

        {/* 【玩家】 立绘 & UI */}
        {/* 玩家立绘：贴近左下边缘 */}
        <div className="absolute bottom-[-5%] left-[5%] z-20 scale-110">
          <PokemonSprite 
            key={`sprite-pla-${playerActive.id}`} 
            src={playerActive.backSprite} 
            isAttacking={attackerSide === 'player'} 
            isFainted={playerActive.currentHp <= 0} 
          />
        </div>

        {/* 玩家UI：底部右侧 */}
        <div className="absolute bottom-6 right-8 z-40 transform scale-95 origin-bottom-right">
          <HealthBar key={`hp-pla-${playerActive.id}`} pokemon={playerActive} />
          <TeamStatus team={state.playerTeam} />
        </div>

        {/* 底部天气状态栏 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full flex justify-center">
          <div className={`pixel-corners px-5 py-2 bg-black/70 border-2 border-yellow-400/30 flex items-center gap-4 transition-all duration-500 ${state.weather === 'None' ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'}`}>
            <div className="flex flex-col items-center">
              <span className="text-[12px] text-yellow-400 font-bold tracking-widest">{weatherLabels[state.weather]}</span>
              <span className="text-[10px] text-white/90 font-mono">REMAINING: {state.weatherTurns}</span>
            </div>
            <div className="h-6 w-[1px] bg-white/20"></div>
            <div className="flex flex-col items-start">
               <span className="text-[9px] text-blue-300 font-bold">回合倒计时</span>
               <div className="w-20 h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-blue-500 animate-[shimmer_2s_infinite]" style={{ width: `${(state.weatherTurns/8)*100}%` }}></div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部面板 */}
      <div className="w-full max-w-4xl mt-3 grid grid-cols-12 gap-3 h-44">
        {/* 日志 */}
        <div className="col-span-7 bg-[#111] border-2 border-[#333] p-4 pixel-corners overflow-y-auto shadow-inner custom-scrollbar">
          {state.isGameOver ? (
            <div className="h-full flex flex-col items-center justify-center">
              <h2 className={`text-xl font-bold mb-3 ${state.winner === 'Player' ? 'text-yellow-400' : 'text-red-500'}`}>
                {state.winner === 'Player' ? '胜负已分：你赢了！' : '胜负已分：你输了...'}
              </h2>
              <button onClick={restartGame} className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-2 text-base font-bold pixel-corners transition-all active:translate-y-1">
                重新开局
              </button>
            </div>
          ) : (
            state.log.map((entry, i) => (
              <p key={i} className={`text-sm mb-1 font-bold ${i === 0 ? 'text-yellow-400' : 'text-gray-500'}`}>
                {entry}
              </p>
            ))
          )}
        </div>

        {/* 控制 */}
        <div className="col-span-5 flex flex-col gap-2">
          {!showSwitchMenu && !state.isGameOver ? (
            <div className="grid grid-cols-2 gap-2 h-full">
              {playerActive.moves.map((move, i) => {
                const eff = getEffectivenessLabel(move, opponentActive);
                return (
                  <button
                    key={i}
                    disabled={isAnimating || playerActive.currentHp <= 0}
                    onClick={() => handleMove(i)}
                    className={`pixel-corners p-1.5 flex flex-col items-center justify-center transition-all border-b-2 border-r-2
                      ${isAnimating || playerActive.currentHp <= 0 ? 'bg-gray-900 border-gray-950 opacity-50' : 'bg-[#eee] hover:bg-white active:translate-y-1 active:border-b-0 border-gray-400'}`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: TYPE_COLORS[move.type] }}></span>
                      <span className="text-gray-900 font-bold text-[11px]">{move.name}</span>
                    </div>
                    <span className={`text-[8px] font-bold ${eff.color}`}>{eff.text}</span>
                  </button>
                );
              })}
              <button disabled={isAnimating} onClick={() => setShowSwitchMenu(true)} className="col-span-2 pixel-corners font-bold text-[11px] py-2 bg-blue-700 hover:bg-blue-600 border-b-2 border-r-2 border-blue-900 text-white transition-all active:translate-y-1 active:border-b-0">
                更换宝可梦
              </button>
            </div>
          ) : showSwitchMenu && !state.isGameOver ? (
            <div className="grid grid-cols-3 gap-1 h-full">
              {state.playerTeam.map((p, i) => (
                <button
                  key={p.id}
                  disabled={p.currentHp <= 0 || i === state.playerActiveIdx}
                  onClick={() => handleSwitch(i)}
                  className={`pixel-corners p-0.5 flex flex-col items-center justify-center transition-all border-b-2 border-r-2
                    ${i === state.playerActiveIdx ? 'bg-green-700 border-green-900' : 'bg-[#222] border-[#000] hover:bg-[#333]'}
                    ${p.currentHp <= 0 ? 'opacity-20 grayscale' : ''}`}
                >
                  <img src={p.icon} className="w-8 h-8 object-contain" style={{ imageRendering: 'pixelated' }} />
                  <span className="text-[8px] text-white font-bold truncate w-full px-0.5">{p.name}</span>
                </button>
              ))}
              <button disabled={playerActive.currentHp <= 0} onClick={() => setShowSwitchMenu(false)} className="col-span-3 pixel-corners text-[11px] font-bold text-white py-1.5 bg-gray-700 hover:bg-gray-600 border-b-2 border-r-2 border-gray-900">
                取消
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #444;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default App;
