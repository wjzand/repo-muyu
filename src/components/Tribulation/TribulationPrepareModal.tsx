import { useState } from 'react';
import { Modal } from '@/components/Common/Modal';
import { NeonButton } from '@/components/Common/NeonButton';
import { GlitchText } from '@/components/Common/GlitchText';
import { useUserStore } from '@/store/useUserStore';
import { TRIBULATION_DIFFICULTIES, getRankByScore } from '@/data/tribulation';
import { TribulationDifficulty } from '@/types';
import { Zap, Shield, Clock, Target, Coins, AlertTriangle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TribulationPrepareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (difficulty: TribulationDifficulty, shields: number) => void;
}

export function TribulationPrepareModal({ isOpen, onClose, onStart }: TribulationPrepareModalProps) {
  const user = useUserStore((s) => s.user);
  const tribulation = useUserStore((s) => s.tribulation);
  const checkFreeDaily = useUserStore((s) => s.checkFreeDaily);
  const [selectedDifficulty, setSelectedDifficulty] = useState<TribulationDifficulty>('easy');
  const [shields, setShields] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);

  const currentRank = getRankByScore(tribulation.rankScore);
  const selectedCfg = TRIBULATION_DIFFICULTIES.find((d) => d.id === selectedDifficulty)!;
  const shieldCost = 50;
  const canAffordShield = user.totalMerit >= shieldCost;
  const freeAvailable = selectedCfg.freeDaily > 0 ? checkFreeDaily(selectedCfg.freeDaily) : false;
  const canAffordMerit = user.totalMerit >= selectedCfg.costMerit;
  const canStart = freeAvailable || canAffordMerit;
  const expectedSpeed = Math.round(selectedCfg.targetKnocks / selectedCfg.duration * 10) / 10;

  const buyShield = () => {
    if (!canAffordShield) return;
    setShields((s) => s + 1);
    useUserStore.getState().addMerit(-shieldCost);
  };

  const handleStart = () => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c === null) return null;
        if (c <= 1) {
          clearInterval(timer);
          onStart(selectedDifficulty, shields);
          setCountdown(null);
          if (freeAvailable) {
            useUserStore.getState().useFreeDaily();
          } else {
            useUserStore.getState().addMerit(-selectedCfg.costMerit);
          }
          setShields(0);
          setSelectedDifficulty('easy');
          return null;
        }
        return c - 1;
      });
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="渡劫挑战" size="lg">
      <div className="space-y-5">
        <div className="relative overflow-hidden rounded-xl border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-900/20 via-red-900/20 to-purple-900/20 p-4">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, #fbbf2410 10px, #fbbf2410 20px)` }} />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-yellow-300 font-orbitron text-sm">
                <Zap size={16} /> 当前段位
              </div>
              <GlitchText trigger={false} className="text-2xl font-qingke font-bold mt-1">
                <span style={{ color: currentRank.color }}>{currentRank.icon} {currentRank.name}</span>
              </GlitchText>
            </div>
            <div className="text-right space-y-1">
              <div className="text-xs text-gray-400 font-orbitron">累计积分</div>
              <div className="text-xl font-orbitron font-bold text-yellow-300">{tribulation.rankScore}</div>
              {tribulation.consecutiveWins > 0 && (
                <div className="text-xs text-green-400 font-bold animate-pulse">🔥 {tribulation.consecutiveWins}连胜中</div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-orbitron tracking-widest text-yellow-400/80 uppercase mb-2 px-1">
            ⚡ 选择难度
          </div>
          <div className="space-y-2">
            {TRIBULATION_DIFFICULTIES.map((cfg) => {
              const isSelected = selectedDifficulty === cfg.id;
              const isFree = cfg.freeDaily > 0;
              const isFreeUsed = isFree && !checkFreeDaily(cfg.freeDaily);

              return (
                <button
                  key={cfg.id}
                  onClick={() => setSelectedDifficulty(cfg.id)}
                  className={cn(
                    'w-full p-4 rounded-xl border-2 text-left transition-all duration-300',
                    isSelected
                      ? 'border-yellow-400 bg-yellow-500/10 shadow-[0_0_15px_#fbbf2440]'
                      : 'border-cyber-border bg-cyber-bg/50 hover:border-cyber-border/80'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="font-qingke text-lg font-bold"
                          style={{ color: cfg.color }}
                        >
                          {cfg.name}
                        </span>
                        {isFree && (
                          <span className={cn(
                            'px-2 py-0.5 rounded-full text-[10px] font-bold',
                            isFreeUsed ? 'bg-gray-600/50 text-gray-400' : 'bg-green-500/20 text-green-400 border border-green-500/40'
                          )}>
                            {isFreeUsed ? '今日已用' : '每日免费'}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{cfg.description}</div>
                    </div>
                    {!isFree && cfg.costMerit > 0 && (
                      <div className="flex items-center gap-1 shrink-0">
                        <Coins size={14} className="text-yellow-400" />
                        <span className={cn(
                          'font-orbitron font-bold text-sm',
                          canAffordMerit ? 'text-yellow-300' : 'text-red-400'
                        )}>
                          {cfg.costMerit}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                    <div className="p-2 rounded-lg bg-cyber-bg/50 border border-cyber-border/50">
                      <Clock size={14} className="mx-auto text-cyan-400 mb-1" />
                      <div className="text-[10px] text-gray-500">时长</div>
                      <div className="text-sm font-orbitron font-bold text-cyan-300">{cfg.duration}s</div>
                    </div>
                    <div className="p-2 rounded-lg bg-cyber-bg/50 border border-cyber-border/50">
                      <Target size={14} className="mx-auto text-purple-400 mb-1" />
                      <div className="text-[10px] text-gray-500">目标</div>
                      <div className="text-sm font-orbitron font-bold text-purple-300">{cfg.targetKnocks}次</div>
                    </div>
                    <div className="p-2 rounded-lg bg-cyber-bg/50 border border-cyber-border/50">
                      <Sparkles size={14} className="mx-auto text-yellow-400 mb-1" />
                      <div className="text-[10px] text-gray-500">倍率</div>
                      <div className="text-sm font-orbitron font-bold text-yellow-300">x{cfg.rewardMultiplier}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-xs font-orbitron tracking-widest text-yellow-400/80 uppercase mb-2 px-1 flex items-center justify-between">
            <span>🛡️ 渡劫符（护盾）</span>
            <span className="text-cyan-400">{shields}个已装备</span>
          </div>
          <div className="p-4 rounded-xl bg-cyber-bg/50 border border-cyber-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/30 to-cyan-500/30 border border-green-500/50 flex items-center justify-center">
                  <Shield size={24} className="text-green-400" />
                </div>
                <div>
                  <div className="font-medium text-white">干扰护盾</div>
                  <div className="text-xs text-gray-500">装备后可抵挡一次心魔干扰</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <NeonButton
                  size="sm"
                  color="green"
                  variant="outline"
                  onClick={buyShield}
                  disabled={!canAffordShield}
                >
                  <Coins size={14} className="inline mr-1" />
                  {shieldCost} / 购买
                </NeonButton>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-cyan-400 mt-0.5 shrink-0" />
            <div className="text-sm text-gray-300 space-y-1">
              <div className="font-medium text-cyan-300">挑战规则</div>
              <div className="text-xs">• 倒计时 <span className="text-cyan-400 font-bold">{selectedCfg.duration}秒</span>，需完成 <span className="text-purple-400 font-bold">{selectedCfg.targetKnocks}次</span> 敲击</div>
              <div className="text-xs">• 平均速度需达到 <span className="text-yellow-400 font-bold">{expectedSpeed}次/秒</span></div>
              <div className="text-xs">• 过程中会随机出现心魔干扰，处理成功可获额外积分</div>
              <div className="text-xs">• 成功渡劫获得大量功德和皮肤碎片，失败扣除少量功德</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <NeonButton color="purple" variant="ghost" onClick={onClose} size="lg">
            稍后再说
          </NeonButton>
          <NeonButton
            color="gold"
            variant="solid"
            onClick={handleStart}
            disabled={!canStart || countdown !== null}
            size="lg"
          >
            {countdown !== null ? (
              <>
                <Zap size={18} className="inline mr-2 animate-spin" />
                开始渡劫... {countdown}
              </>
            ) : !canStart ? (
              <>功德不足</>
            ) : (
              <>
                <Zap size={18} className="inline mr-2" />
                {freeAvailable ? '免费渡劫' : '开始渡劫'}
              </>
            )}
          </NeonButton>
        </div>
      </div>
    </Modal>
  );
}
