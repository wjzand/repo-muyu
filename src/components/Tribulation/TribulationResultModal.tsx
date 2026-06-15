import { useEffect, useState } from 'react';
import { Modal } from '@/components/Common/Modal';
import { NeonButton } from '@/components/Common/NeonButton';
import { GlitchText } from '@/components/Common/GlitchText';
import { TribulationSession, TribulationDifficulty } from '@/types';
import { getDifficultyById, GRADE_COLORS, getRankByScore, getFragmentById, TRIBULATION_MOTTOS } from '@/data/tribulation';
import { useUserStore } from '@/store/useUserStore';
import { Zap, Trophy, Flame, Target, Clock, Shield, Skull, Coins, Gem, Sparkles, Share2, RotateCcw, Home, TrendingUp, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TribulationResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: TribulationSession;
  rewardMerit: number;
  fragments: string[];
  onRetry: () => void;
  onBackHome: () => void;
}

export function TribulationResultModal({
  isOpen,
  onClose,
  session,
  rewardMerit,
  fragments,
  onRetry,
  onBackHome,
}: TribulationResultModalProps) {
  const tribulation = useUserStore((s) => s.tribulation);
  const user = useUserStore((s) => s.user);
  const [showDetails, setShowDetails] = useState(false);
  const [rankAnimating, setRankAnimating] = useState(false);

  const difficultyCfg = getDifficultyById(session.difficulty)!;
  const gradeColor = GRADE_COLORS[session.grade];
  const motto = TRIBULATION_MOTTOS[user.avatarSeed % TRIBULATION_MOTTOS.length];

  const oldRank = getRankByScore(Math.max(0, tribulation.rankScore - session.score));
  const newRank = getRankByScore(tribulation.rankScore);
  const rankUp = newRank.minScore > oldRank.minScore;

  useEffect(() => {
    if (isOpen && rankUp) {
      setRankAnimating(true);
      const t = setTimeout(() => setRankAnimating(false), 3000);
      return () => clearTimeout(t);
    }
  }, [isOpen, rankUp]);

  const handleShare = () => {
    const shareText = `我在赛博电子木鱼${session.success ? '成功渡过' : '挑战了'}【${difficultyCfg.name}】！获得${session.grade}级评价，得分${session.score}分，功德${rewardMerit >= 0 ? '+' : ''}${rewardMerit}！${motto}`;
    if (navigator.share) {
      try {
        navigator.share({
          title: '赛博渡劫战报',
          text: shareText,
          url: window.location.href,
        });
      } catch {}
    } else {
      try {
        navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
        alert('战报已复制到剪贴板！');
      } catch {}
    }
  };

  const fragmentItems = fragments.map((fid) => getFragmentById(fid)).filter(Boolean);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={session.success ? '渡劫成功！' : '渡劫失败'} size="lg">
      <div className="space-y-5">
        <div className={cn(
          'relative overflow-hidden rounded-2xl border-2 p-6 text-center',
          session.success
            ? 'border-yellow-500/60 bg-gradient-to-br from-yellow-900/30 via-orange-900/20 to-green-900/30'
            : 'border-red-500/60 bg-gradient-to-br from-red-900/30 via-gray-900/20 to-purple-900/30'
        )}>
          {session.success && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-[particleFloat_3s_ease-in-out_infinite]"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor: ['#fbbf24', '#22d3ee', '#a855f7', '#10b981'][i % 4],
                    animationDelay: `${i * 0.15}s`,
                    opacity: 0.6,
                    boxShadow: `0 0 10px currentColor`,
                  }}
                />
              ))}
            </div>
          )}

          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div
                className={cn(
                  'relative w-24 h-24 rounded-full flex items-center justify-center text-5xl',
                  session.success
                    ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 shadow-[0_0_40px_#fbbf24,inset_0_0_20px_#ffffff40]'
                    : 'bg-gradient-to-br from-red-900 via-gray-900 to-purple-900 shadow-[0_0_30px_#ef444460] border-2 border-red-500/50'
                )}
              >
                {session.success ? <Trophy size={40} className="text-white" /> : <Skull size={40} className="text-red-400" />}
              </div>
            </div>

            <GlitchText trigger={session.success} className="mb-2">
              <span
                className="text-4xl font-qingke font-bold"
                style={{
                  color: session.success ? '#fbbf24' : '#ef4444',
                  textShadow: session.success ? '0 0 20px #fbbf2480' : '0 0 20px #ef444480',
                }}
              >
                {session.success ? '渡劫成功' : '渡劫失败'}
              </span>
            </GlitchText>

            <div className="flex items-center justify-center gap-3 my-4">
              <div className="text-center">
                <div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl text-5xl font-orbitron font-black border-4 animate-[gradeBounce_1s_ease-in-out_infinite]"
                  style={{
                    borderColor: gradeColor,
                    backgroundColor: gradeColor + '20',
                    color: gradeColor,
                    textShadow: `0 0 15px ${gradeColor}`,
                    boxShadow: `0 0 25px ${gradeColor}60, inset 0 0 15px ${gradeColor}30`,
                  }}
                >
                  {session.grade}
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-300 italic mb-4">「{motto}」</div>

            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
              style={{
                backgroundColor: difficultyCfg.color + '20',
                border: `1px solid ${difficultyCfg.color}60`,
                color: difficultyCfg.color,
              }}
            >
              <Zap size={16} />
              {difficultyCfg.name}挑战
            </div>
          </div>
        </div>

        {rankUp && (
          <div
            className={cn(
              'relative p-4 rounded-xl border-2 overflow-hidden',
              rankAnimating ? 'animate-[rankPulse_0.5s_ease-in-out_infinite]' : ''
            )}
            style={{
              borderColor: newRank.color + '80',
              backgroundColor: newRank.color + '15',
            }}
          >
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-[10px] text-gray-500 font-orbitron mb-1">原段位</div>
                <div className="text-lg opacity-60" style={{ color: oldRank.color }}>
                  {oldRank.icon} {oldRank.name}
                </div>
              </div>
              <TrendingUp size={24} className="text-yellow-400 animate-bounce" />
              <div className="text-center">
                <div className="text-[10px] font-orbitron mb-1" style={{ color: newRank.color }}>新段位！</div>
                <div
                  className="text-2xl font-bold"
                  style={{
                    color: newRank.color,
                    textShadow: `0 0 15px ${newRank.color}80`,
                  }}
                >
                  {newRank.icon} {newRank.name}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={<Target size={18} />}
            label="总敲击"
            value={session.totalKnocks.toString()}
            color="#22d3ee"
          />
          <StatCard
            icon={<Flame size={18} />}
            label="最高连击"
            value={session.maxCombo.toString()}
            color="#f97316"
          />
          <StatCard
            icon={<Award size={18} />}
            label="干扰处理"
            value={`${session.demonsResolved}/${session.demonsEncountered}`}
            color="#a855f7"
          />
          <StatCard
            icon={<Zap size={18} />}
            label="总评分"
            value={session.score.toString()}
            color="#fbbf24"
            highlight
          />
        </div>

        <div className="p-4 rounded-xl border border-cyber-border bg-cyber-bg/50">
          <div className="text-xs font-orbitron tracking-widest text-purple-400 uppercase mb-3 px-1">
            🎁 结算奖励
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Coins size={20} className="text-yellow-400" />
                </div>
                <div>
                  <div className="font-medium text-white">功德值</div>
                  <div className="text-xs text-gray-500">{session.success ? '渡劫奖励' : '少量扣损'}</div>
                </div>
              </div>
              <div
                className={cn(
                  'font-orbitron font-bold text-xl',
                  rewardMerit >= 0 ? 'text-green-400' : 'text-red-400'
                )}
              >
                {rewardMerit >= 0 ? '+' : ''}{rewardMerit}
              </div>
            </div>

            {fragmentItems.length > 0 && (
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Gem size={18} className="text-purple-400" />
                  <span className="font-medium text-white">皮肤碎片 x{fragmentItems.length}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {fragmentItems.map((f, i) => (
                    f && (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                        style={{
                          borderColor: f.color + '50',
                          backgroundColor: f.color + '10',
                        }}
                      >
                        <span className="text-xl">{f.icon}</span>
                        <div>
                          <div className="text-sm font-bold" style={{ color: f.color }}>{f.name}</div>
                          <div className="text-[10px] text-gray-500">{f.description}</div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowDetails((s) => !s)}
              className="w-full text-left text-xs text-gray-400 hover:text-gray-300 transition-colors flex items-center justify-center gap-1 py-1"
            >
              <Sparkles size={12} />
              {showDetails ? '隐藏详细数据' : '查看详细数据'}
            </button>

            {showDetails && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-cyber-border/50">
                <DetailItem label="中断次数" value={session.interrupts.toString()} />
                <DetailItem label="处理成功率" value={session.demonsEncountered > 0 ? `${Math.round(session.demonsResolved / session.demonsEncountered * 100)}%` : '100%'} />
                <DetailItem label="使用护盾" value={session.shields.toString()} />
                <DetailItem
                  label="完成度"
                  value={`${Math.min(100, Math.round(session.totalKnocks / difficultyCfg.targetKnocks * 100))}%`}
                />
                <DetailItem
                  label="平均速度"
                  value={`${(session.totalKnocks / difficultyCfg.duration).toFixed(1)}次/秒`}
                />
                <DetailItem
                  label="目标速度"
                  value={`${(difficultyCfg.targetKnocks / difficultyCfg.duration).toFixed(1)}次/秒`}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <NeonButton color="purple" variant="ghost" size="lg" onClick={onBackHome}>
            <Home size={18} className="inline mr-2" />
            返回修行
          </NeonButton>
          <NeonButton color="cyan" variant="outline" size="lg" onClick={handleShare}>
            <Share2 size={18} className="inline mr-2" />
            炫耀战果
          </NeonButton>
          <NeonButton color="gold" variant="solid" size="lg" onClick={onRetry}>
            <RotateCcw size={18} className="inline mr-2" />
            再来一局
          </NeonButton>
        </div>
      </div>

      <style>{`
        @keyframes gradeBounce {
          0%, 100% { transform: scale(1) rotate(0); }
          25% { transform: scale(1.1) rotate(-3deg); }
          75% { transform: scale(1.1) rotate(3deg); }
        }
        @keyframes rankPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 1; }
        }
      `}</style>
    </Modal>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        'p-3 rounded-xl border text-center transition-all',
        highlight
          ? 'border-yellow-500/50 bg-yellow-500/10 shadow-[0_0_15px_#fbbf2430]'
          : 'border-cyber-border bg-cyber-bg/50'
      )}
    >
      <div className="flex justify-center mb-1" style={{ color }}>
        {icon}
      </div>
      <div className="text-[10px] text-gray-500 mb-0.5">{label}</div>
      <div
        className="font-orbitron font-bold"
        style={{ color: highlight ? color : undefined }}
      >
        {value}
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-2 py-1.5 rounded bg-cyber-bg/30">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xs font-medium text-white">{value}</span>
    </div>
  );
}
