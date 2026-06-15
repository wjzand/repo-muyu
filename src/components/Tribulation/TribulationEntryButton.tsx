import { Zap } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { getRankByScore } from '@/data/tribulation';
import { cn } from '@/lib/utils';

interface TribulationEntryButtonProps {
  onClick: () => void;
  isInGame?: boolean;
}

export function TribulationEntryButton({ onClick, isInGame = false }: TribulationEntryButtonProps) {
  const tribulation = useUserStore((s) => s.tribulation);
  const currentRank = getRankByScore(tribulation.rankScore);

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative group flex items-center gap-2',
        'px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl',
        'border-2 font-orbitron text-sm font-bold tracking-wider',
        'transition-all duration-300 active:scale-95',
        isInGame
          ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300 shadow-[0_0_20px_#fbbf24,0_0_40px_#fbbf2460] animate-pulse'
          : 'bg-gradient-to-r from-yellow-900/40 via-red-900/40 to-purple-900/40 border-yellow-500/60 text-yellow-200 hover:border-yellow-400 hover:shadow-[0_0_15px_#fbbf2460] hover:text-yellow-100'
      )}
    >
      <div className="relative">
        <Zap
          size={18}
          className={cn(
            'transition-transform duration-300',
            isInGame ? 'animate-spin' : 'group-hover:scale-110'
          )}
        />
        {!isInGame && (
          <div className="absolute -inset-1 bg-yellow-400/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity animate-breath" />
        )}
      </div>

      <span className="whitespace-nowrap">
        {isInGame ? '渡劫中' : '渡劫'}
      </span>

      <div
        className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
        style={{
          backgroundColor: currentRank.color + '20',
          borderColor: currentRank.color + '60',
          color: currentRank.color,
          border: `1px solid ${currentRank.color}60`,
        }}
      >
        <span>{currentRank.icon}</span>
        <span className="whitespace-nowrap">{currentRank.name}</span>
      </div>

      {tribulation.consecutiveWins >= 2 && !isInGame && (
        <div className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold shadow-[0_0_8px_#ef4444] animate-bounce">
          {tribulation.consecutiveWins}连胜
        </div>
      )}
    </button>
  );
}
