import { useEffect, useState, useRef, useCallback } from 'react';
import { TribulationDifficulty, TribulationSession, ActiveHeartDemon, HeartDemonType } from '@/types';
import { getDifficultyById, HEART_DEMONS, generateId, calculateGrade, calculateReward } from '@/data/tribulation';
import { useUserStore } from '@/store/useUserStore';
import { useAudio } from '@/hooks/useAudio';
import { useVibration } from '@/hooks/useVibration';
import { FishSkin } from '@/components/WoodenFish/FishSkin';
import { getSkinById } from '@/data/skins';
import { HeartDemonOverlay } from './HeartDemonOverlay';
import { GlitchText } from '@/components/Common/GlitchText';
import { NeonButton } from '@/components/Common/NeonButton';
import { Ripple, Particle } from '@/types';
import { cn } from '@/lib/utils';
import { Clock, Target, Zap, Shield, Flame, X } from 'lucide-react';

interface TribulationGameProps {
  difficulty: TribulationDifficulty;
  shields: number;
  onFinish: (session: TribulationSession, rewardMerit: number, fragments: string[]) => void;
  onQuit: () => void;
}

export function TribulationGame({ difficulty, shields: initialShields, onFinish, onQuit }: TribulationGameProps) {
  const user = useUserStore((s) => s.user);
  const settings = useUserStore((s) => s.settings);
  const tribulation = useUserStore((s) => s.tribulation);
  const addDemonEncountered = useUserStore((s) => s.addDemonEncountered);
  const addTribulationFragment = useUserStore((s) => s.addTribulationFragment);

  const difficultyCfg = getDifficultyById(difficulty)!;
  const currentSkin = getSkinById(user.currentSkin);
  const { playSound } = useAudio();
  const { vibrate } = useVibration();

  const [timeLeft, setTimeLeft] = useState(difficultyCfg.duration * 1000);
  const [knocks, setKnocks] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [demons, setDemons] = useState<ActiveHeartDemon[]>([]);
  const [shields, setShields] = useState(initialShields);
  const [demonsEncountered, setDemonsEncountered] = useState(0);
  const [demonsResolved, setDemonsResolved] = useState(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const [currentOffset, setCurrentOffset] = useState({ x: 0, y: 0 });
  const [hasReverseDemon, setHasReverseDemon] = useState(false);
  const [interrupts, setInterrupts] = useState(0);
  const [bonusScore, setBonusScore] = useState(0);
  const [lightningFlash, setLightningFlash] = useState(false);

  const fishContainerRef = useRef<HTMLDivElement>(null);
  const comboTimerRef = useRef<number | null>(null);
  const lastKnockTimeRef = useRef(0);
  const rippleIdRef = useRef(0);

  const finishedRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  const finishGame = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    const grade = calculateGrade(knocks, difficultyCfg.targetKnocks, demonsResolved, demonsEncountered);
    const success = knocks >= difficultyCfg.targetKnocks;

    const consecutiveWins = success ? tribulation.consecutiveWins + 1 : 0;
    const { merit, fragments, scoreBonus } = calculateReward(grade, difficultyCfg, consecutiveWins);

    const finalKnocks = knocks;
    const finalInterrupts = interrupts;
    const finalDemonsEncountered = demonsEncountered;
    const finalDemonsResolved = demonsResolved;
    const finalMaxCombo = Math.max(maxCombo, combo);

    const baseScore = Math.round((finalKnocks / difficultyCfg.targetKnocks) * 1000);
    const comboBonus = finalMaxCombo * 2;
    const demonBonus = finalDemonsResolved * 10;
    const interruptPenalty = finalInterrupts * 15;
    const successBonus = success ? 500 : 0;
    const totalScore = Math.max(0, baseScore + comboBonus + demonBonus + bonusScore - interruptPenalty + successBonus);

    const finalMerit = success ? merit : -Math.round(difficultyCfg.costMerit * 0.2);

    fragments.forEach((f) => addTribulationFragment(f));

    const session: TribulationSession = {
      difficulty,
      startTime: startTimeRef.current,
      endTime: Date.now(),
      totalKnocks: finalKnocks,
      demonsEncountered: finalDemonsEncountered,
      demonsResolved: finalDemonsResolved,
      maxCombo: finalMaxCombo,
      currentCombo: combo,
      shields: initialShields,
      interrupts: finalInterrupts,
      score: totalScore,
      success,
      grade,
    };

    onFinish(session, finalMerit, fragments);
  }, [
    knocks, difficultyCfg, demonsResolved, demonsEncountered, tribulation.consecutiveWins,
    maxCombo, combo, interrupts, bonusScore, difficulty, initialShields,
    addTribulationFragment, onFinish,
  ]);

  useEffect(() => {
    if (finishedRef.current) return;
    const duration = difficultyCfg.duration * 1000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        finishGame();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [difficultyCfg.duration, finishGame]);

  useEffect(() => {
    if (knocks >= difficultyCfg.targetKnocks && !finishedRef.current) {
      finishGame();
    }
  }, [knocks, difficultyCfg.targetKnocks, finishGame]);

  useEffect(() => {
    if (finishedRef.current) return;
    const checkInterval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const shouldHaveDemons = Math.floor(elapsed / difficultyCfg.demonFrequency);
      const currentActive = demons.filter((d) => !d.resolved).length;

      if (demonsEncountered < shouldHaveDemons && currentActive < 2) {
        spawnDemon();
      }
    }, 500);

    return () => clearInterval(checkInterval);
  }, [difficultyCfg.demonFrequency, demonsEncountered, demons]);

  useEffect(() => {
    const lightningInterval = setInterval(() => {
      if (Math.random() < 0.15) {
        setLightningFlash(true);
        setTimeout(() => setLightningFlash(false), 100);
      }
    }, 2000);
    return () => clearInterval(lightningInterval);
  }, []);

  const spawnDemon = () => {
    const demonTypes: HeartDemonType[] = ['barrage', 'offset', 'reverse', 'sound', 'imp', 'shield'];
    const weights = [0.2, 0.15, 0.1, 0.2, 0.25, 0.1];

    let random = Math.random();
    let selectedType: HeartDemonType = 'imp';
    for (let i = 0; i < demonTypes.length; i++) {
      if (random < weights[i]) {
        selectedType = demonTypes[i];
        break;
      }
      random -= weights[i];
    }

    const demonConfig = HEART_DEMONS.find((d) => d.id === selectedType)!;

    const newDemon: ActiveHeartDemon = {
      id: generateId(),
      type: selectedType,
      startTime: Date.now(),
      duration: selectedType === 'reverse' ? 2500 : selectedType === 'barrage' ? 4000 : selectedType === 'shield' ? 6000 : 5000,
      resolved: false,
      x: 15 + Math.random() * 70,
      y: 30 + Math.random() * 50,
      offsetX: selectedType === 'offset' ? (Math.random() - 0.5) * 60 : 0,
      offsetY: selectedType === 'offset' ? (Math.random() - 0.5) * 60 : 0,
    };

    addDemonEncountered(selectedType);

    setDemons((prev) => [...prev, newDemon]);
    setDemonsEncountered((c) => c + 1);

    if (selectedType === 'offset') {
      setCurrentOffset({ x: newDemon.offsetX!, y: newDemon.offsetY! });
    }

    if (selectedType === 'reverse') {
      setHasReverseDemon(true);
    }

    setTimeout(() => {
      if (selectedType === 'offset') {
        setCurrentOffset({ x: 0, y: 0 });
      }
      if (selectedType === 'reverse') {
        setHasReverseDemon(false);
      }
      resolveDemon(newDemon.id, false);
    }, newDemon.duration + 200);
  };

  const resolveDemon = (demonId: string, wasSuccess = true) => {
    setDemons((prev) => {
      const demon = prev.find((d) => d.id === demonId);
      if (!demon || demon.resolved) return prev;

      if (wasSuccess && demon.type === 'imp') {
        setBonusScore((s) => s + 50);
      }
      if (wasSuccess && demon.type === 'shield') {
        setShields((s) => s + 1);
      }
      if (wasSuccess) {
        setDemonsResolved((c) => c + 1);
      }
      if (demon.type === 'offset') {
        setCurrentOffset({ x: 0, y: 0 });
      }
      if (demon.type === 'reverse') {
        setHasReverseDemon(false);
      }

      return prev.map((d) => (d.id === demonId ? { ...d, resolved: true } : d));
    });

    setTimeout(() => {
      setDemons((prev) => prev.filter((d) => d.id !== demonId));
    }, 300);
  };

  const useShield = (): boolean => {
    if (shields <= 0) return false;
    setShields((s) => s - 1);
    return true;
  };

  const handleKnock = (e: React.MouseEvent | React.TouchEvent) => {
    if (finishedRef.current) return;
    if (hasReverseDemon) {
      setCombo(0);
      setInterrupts((i) => i + 1);
      vibrate([50, 50, 50]);
      return;
    }

    const now = Date.now();
    const timeSinceLastKnock = now - lastKnockTimeRef.current;
    lastKnockTimeRef.current = now;

    setKnocks((k) => k + 1);

    if (timeSinceLastKnock < 2000) {
      setCombo((c) => {
        const newCombo = c + 1;
        setMaxCombo((mc) => Math.max(mc, newCombo));
        return newCombo;
      });
    } else {
      setCombo(1);
      setMaxCombo((mc) => Math.max(mc, 1));
    }

    if (comboTimerRef.current) {
      clearTimeout(comboTimerRef.current);
    }
    comboTimerRef.current = window.setTimeout(() => {
      setCombo(0);
    }, 2000);

    playSound(settings.soundType || 'electronic', (settings.soundVolume ?? 0.5) * 0.8);
    vibrate(20);

    const rect = fishContainerRef.current?.getBoundingClientRect();
    let clickX: number, clickY: number;

    if ('touches' in e) {
      clickX = e.touches[0]?.clientX ?? (rect?.left ?? 0) + (rect?.width ?? 0) / 2;
      clickY = e.touches[0]?.clientY ?? (rect?.top ?? 0) + (rect?.height ?? 0) / 2;
    } else {
      clickX = e.clientX;
      clickY = e.clientY;
    }

    const rippleId = rippleIdRef.current++;
    setRipples((prev) => [...prev, { id: rippleId, x: clickX, y: clickY }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 600);

    const colors = [currentSkin.colors.glow, '#fbbf24', '#22d3ee', '#a855f7', '#ec4899'];
    const newParticles: Particle[] = Array.from({ length: 8 }).map((_, i) => ({
      x: clickX,
      y: clickY,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 2,
      life: 1,
      maxLife: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 3 + Math.random() * 4,
    }));
    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles((prev) => prev.slice(newParticles.length));
    }, 600);
  };

  const progress = (knocks / difficultyCfg.targetKnocks) * 100;
  const timeProgress = (timeLeft / (difficultyCfg.duration * 1000)) * 100;
  const isUrgent = timeLeft < 5000;

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 50% 0%, rgba(124, 58, 237, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 100%, rgba(220, 38, 38, 0.2) 0%, transparent 50%),
          linear-gradient(180deg, #0a0514 0%, #1a0a2e 50%, #0f0a1a 100%)
        `,
      }}
    >
      {lightningFlash && (
        <div className="absolute inset-0 bg-white/30 pointer-events-none z-50 animate-[flash_0.1s_ease-out]" />
      )}

      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `repeating-linear-gradient(0deg, #fff 0px, transparent 1px, transparent 4px)` }} />

      <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
        <defs>
          <pattern id="thunder-pattern" width="200" height="200" patternUnits="userSpaceOnUse">
            <path d="M100 0 L120 60 L90 60 L130 120 L70 120 L100 200" stroke="#fbbf2420" fill="none" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#thunder-pattern)" />
      </svg>

      <div className="relative z-10 p-3 sm:p-4">
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GlitchText trigger={false} className="text-lg sm:text-xl font-orbitron font-bold">
                <span className="text-yellow-400">⚡ 渡劫中</span>
              </GlitchText>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  backgroundColor: difficultyCfg.color + '20',
                  color: difficultyCfg.color,
                  border: `1px solid ${difficultyCfg.color}60`,
                }}
              >
                {difficultyCfg.name}
              </span>
            </div>
            <NeonButton color="purple" variant="ghost" size="sm" onClick={onQuit}>
              <X size={16} />
            </NeonButton>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 rounded-xl border border-red-500/40 bg-red-500/10 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock size={14} className={cn('text-red-400', isUrgent && 'animate-pulse')} />
                <span className={`text-xs font-orbitron ${isUrgent ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}>
                  剩余时间
                </span>
              </div>
              <div className={cn(
                'font-orbitron font-bold',
                isUrgent ? 'text-2xl sm:text-3xl text-red-400 animate-[shake_0.5s_infinite]' : 'text-xl sm:text-2xl text-white'
              )}>
                {(timeLeft / 1000).toFixed(1)}s
              </div>
              <div className="mt-1.5 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-100',
                    isUrgent ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-gradient-to-r from-red-500 to-orange-500'
                  )}
                  style={{ width: `${timeProgress}%` }}
                />
              </div>
            </div>

            <div className="p-2 sm:p-3 rounded-xl border border-yellow-500/40 bg-yellow-500/10 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <Target size={14} className="text-yellow-400" />
                <span className="text-xs font-orbitron text-gray-400">敲击进度</span>
              </div>
              <div className="font-orbitron font-bold text-xl sm:text-2xl text-yellow-300">
                <span className={progress >= 100 ? 'text-green-400' : ''}>{knocks}</span>
                <span className="text-sm text-gray-500"> / {difficultyCfg.targetKnocks}</span>
              </div>
              <div className="mt-1.5 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-green-500 transition-all duration-200 shadow-[0_0_10px_#fbbf24]"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              {combo >= 3 && (
                <div className="px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/50 animate-bounce">
                  <div className="flex items-center gap-1">
                    <Flame size={12} className="text-orange-400" />
                    <span className="text-xs font-bold text-orange-300">{combo} 连击!</span>
                  </div>
                </div>
              )}
              {shields > 0 && (
                <div className="px-2.5 py-1 rounded-full bg-green-500/20 border border-green-500/50">
                  <div className="flex items-center gap-1">
                    <Shield size={12} className="text-green-400" />
                    <span className="text-xs font-bold text-green-300">{shields}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400">最高连击: <span className="text-purple-300 font-bold">{maxCombo}</span></span>
              {bonusScore > 0 && (
                <span className="text-green-400">+{bonusScore}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div
          ref={fishContainerRef}
          className="relative cursor-pointer select-none touch-none"
          onMouseDown={(e) => { setIsPressed(true); handleKnock(e); }}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          onTouchStart={(e) => { setIsPressed(true); handleKnock(e); }}
          onTouchEnd={() => setIsPressed(false)}
          style={{
            transform: `translate(${currentOffset.x}px, ${currentOffset.y}px) scale(${isPressed ? 0.92 : 1})`,
            transition: isPressed ? 'transform 0.05s ease-out' : 'transform 0.15s ease-out',
          }}
        >
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-50"
            style={{
              background: `radial-gradient(circle, ${difficultyCfg.color} 0%, transparent 70%)`,
              transform: 'scale(1.5)',
            }}
          />
          <div
            className="absolute -inset-4 rounded-full animate-breath opacity-30"
            style={{
              background: `radial-gradient(circle, ${currentSkin.colors.glow} 0%, transparent 70%)`,
            }}
          />
          <FishSkin skin={currentSkin} size={200} />
        </div>
      </div>

      <HeartDemonOverlay
        demons={demons.filter((d) => !d.resolved)}
        onResolveDemon={(id) => resolveDemon(id, true)}
        onShieldUsed={useShield}
      />

      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="fixed pointer-events-none z-40 rounded-full border-2"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            transform: 'translate(-50%, -50%)',
            borderColor: currentSkin.colors.glow,
            animation: 'rippleExpand 0.6s ease-out forwards',
          }}
        />
      ))}

      <style>{`
        @keyframes rippleExpand {
          0% { width: 0; height: 0; opacity: 1; }
          100% { width: 150px; height: 150px; opacity: 0; }
        }
        @keyframes flash {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
      `}</style>
    </div>
  );
}
