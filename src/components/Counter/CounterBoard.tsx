import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useGameStore } from '@/store/useGameStore';
import { getLevel, getLevelProgress, DAILY_MERIT_LIMIT, LEVELS } from '@/data/levels';
import { formatNumber } from '@/utils/formatNumber';
import { GlitchText } from '@/components/Common/GlitchText';
import { cn } from '@/lib/utils';
import { Trophy, Zap } from 'lucide-react';

export function CounterBoard() {
  const user = useUserStore((s) => s.user);
  const meritFlash = useGameStore((s) => s.meritFlash);

  const currentLevel = getLevel(user.totalMerit);
  const levelProgress = getLevelProgress(user.totalMerit);
  const nextLevel = LEVELS.find((l) => l.index === currentLevel.index + 1);

  const [displayKnocks, setDisplayKnocks] = useState(user.totalKnocks);
  const [displayMerit, setDisplayMerit] = useState(user.totalMerit);
  const [glitchTrigger, setGlitchTrigger] = useState(0);

  useEffect(() => {
    if (displayKnocks === user.totalKnocks) return;
    const diff = user.totalKnocks - displayKnocks;
    const step = Math.max(1, Math.ceil(diff / 10));
    const timer = setInterval(() => {
      setDisplayKnocks((prev) => {
        const next = prev + step;
        if (next >= user.totalKnocks) {
          clearInterval(timer);
          return user.totalKnocks;
        }
        return next;
      });
    }, 20);
    return () => clearInterval(timer);
  }, [user.totalKnocks, displayKnocks]);

  useEffect(() => {
    if (displayMerit === user.totalMerit) return;
    const diff = user.totalMerit - displayMerit;
    const step = Math.max(1, Math.ceil(diff / 10));
    const timer = setInterval(() => {
      setDisplayMerit((prev) => {
        const next = prev + step;
        if (next >= user.totalMerit) {
          clearInterval(timer);
          return user.totalMerit;
        }
        return next;
      });
    }, 20);
    if (meritFlash) {
      setGlitchTrigger((g) => g + 1);
    }
    return () => clearInterval(timer);
  }, [user.totalMerit, displayMerit, meritFlash]);

  const dailyProgress = Math.min(100, (user.todayMerit / DAILY_MERIT_LIMIT) * 100);

  return (
    <div className="w-full max-w-md mx-auto space-y-4 px-4">
      <div className="flex items-center justify-center gap-4">
        <div
          className="px-4 py-1.5 rounded-full border text-sm font-qingke tracking-wider whitespace-nowrap"
          style={{
            borderColor: currentLevel.color,
            color: currentLevel.color,
            boxShadow: `0 0 10px ${currentLevel.color}40`,
            textShadow: `0 0 5px ${currentLevel.color}80`,
          }}
        >
          {currentLevel.title}
        </div>
      </div>

      <div className="bg-cyber-panel/60 backdrop-blur-sm rounded-2xl border border-cyber-border p-5 space-y-4">
        <div className="text-center">
          <div className="text-xs font-orbitron tracking-widest text-gray-500 uppercase mb-2">
            累计敲击
          </div>
          <div
            className={cn(
              'font-orbitron font-bold text-4xl tracking-wider transition-all duration-300',
              meritFlash ? 'neon-text-purple scale-105' : 'text-white'
            )}
          >
            <GlitchText trigger={glitchTrigger > 0}>
              {formatNumber(displayKnocks)}
            </GlitchText>
          </div>
          <div className="text-xs text-gray-500 mt-1">次</div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-cyber-purple/50 to-transparent" />

        <div className="text-center">
          <div className="text-xs font-orbitron tracking-widest text-gray-500 uppercase mb-2">
            赛博功德值
          </div>
          <div
            className={cn(
              'font-orbitron font-bold text-5xl tracking-wider transition-all duration-300',
              meritFlash ? 'neon-text-cyan scale-105' : 'neon-text-cyan'
            )}
          >
            <GlitchText trigger={glitchTrigger > 0} color1="#a855f7" color2="#ec4899">
              {formatNumber(displayMerit)}
            </GlitchText>
          </div>
          <div className="text-xs text-gray-500 mt-1">功德</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1">
              <Trophy size={12} style={{ color: currentLevel.color }} />
              升级进度
            </span>
            <span style={{ color: currentLevel.color }}>
              {nextLevel
                ? `${formatNumber(user.totalMerit)} / ${formatNumber(nextLevel.minMerit)}`
                : '已达最高等级'}
            </span>
          </div>
          <div className="h-2 bg-cyber-bg rounded-full overflow-hidden border border-cyber-border">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${levelProgress * 100}%`,
                background: `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel?.color || currentLevel.color})`,
                boxShadow: `0 0 10px ${currentLevel.color}`,
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1">
              <Zap size={12} className="text-cyber-green" />
              今日功德 ({user.todayMerit}/{DAILY_MERIT_LIMIT})
            </span>
            <span
              className={cn(
                dailyProgress >= 100 ? 'text-cyber-red' : 'text-cyber-green'
              )}
            >
              {dailyProgress >= 100 ? '已满' : `${dailyProgress.toFixed(0)}%`}
            </span>
          </div>
          <div className="h-1.5 bg-cyber-bg rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300',
                dailyProgress >= 100 ? 'bg-cyber-red' : 'bg-cyber-green'
              )}
              style={{
                width: `${dailyProgress}%`,
                boxShadow: dailyProgress < 100 ? '0 0 8px #00ff8880' : '0 0 8px #ff336680',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
