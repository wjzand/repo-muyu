import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';
import { MOCK_LEADERBOARD, LeaderboardType } from '@/data/mockLeaderboard';
import { getLevel } from '@/data/levels';
import { formatNumber } from '@/utils/formatNumber';
import { ArrowLeft, Crown, Medal, Award, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS: { key: LeaderboardType; label: string; icon: React.ReactNode }[] = [
  { key: 'daily', label: '本日榜', icon: <TrendingUp size={16} /> },
  { key: 'weekly', label: '本周榜', icon: <Award size={16} /> },
  { key: 'total', label: '总榜', icon: <Crown size={16} /> },
];

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const settings = useUserStore((s) => s.settings);
  const [activeTab, setActiveTab] = useState<LeaderboardType>('daily');

  const userLevel = getLevel(user.totalMerit);

  const listData = useMemo(() => {
    const data = [...MOCK_LEADERBOARD[activeTab]];
    if (settings.participateInRanking) {
      let userRankScore = 0;
      switch (activeTab) {
        case 'daily':
          userRankScore = user.todayMerit;
          break;
        case 'weekly':
          userRankScore = Math.floor(user.totalMerit * 0.3 + user.todayMerit * 3);
          break;
        case 'total':
          userRankScore = user.totalMerit;
          break;
      }

      let insertRank = 1;
      for (let i = 0; i < data.length; i++) {
        if (userRankScore > data[i].merit) {
          insertRank = i + 1;
          break;
        }
        insertRank = i + 2;
      }

      const userItem = {
        rank: insertRank,
        userId: user.id,
        cyberName: user.cyberName,
        avatarSeed: user.avatarSeed,
        merit: userRankScore,
        level: user.level,
        isMe: true,
      };

      if (insertRank <= data.length) {
        data.splice(insertRank - 1, 0, userItem as any);
        data.pop();
      } else {
        data.push(userItem as any);
      }

      for (let i = 0; i < data.length; i++) {
        data[i].rank = i + 1;
      }
    }

    return data;
  }, [activeTab, user, settings.participateInRanking]);

  const myRank = listData.findIndex((i: any) => i.isMe) + 1;

  const getRankStyle = (rank: number) => {
    if (rank === 1) return { icon: '🥇', color: '#ffd700', shadow: '0 0 20px #ffd70050' };
    if (rank === 2) return { icon: '🥈', color: '#c0c0c0', shadow: '0 0 20px #c0c0c050' };
    if (rank === 3) return { icon: '🥉', color: '#cd7f32', shadow: '0 0 20px #cd7f3250' };
    return { icon: null, color: '#666', shadow: 'none' };
  };

  return (
    <div className="fixed inset-0 cyber-bg overflow-y-auto scrollbar-hide">
      <div className="min-h-full pb-28">
        <div className="sticky top-0 z-30 bg-cyber-bg/80 backdrop-blur-md border-b border-cyber-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ArrowLeft size={22} />
            </button>
            <h1 className="font-orbitron text-lg tracking-wider neon-text-gold flex-1 flex items-center gap-2">
              <Crown size={20} />
              赛博功德榜
            </h1>
          </div>

          <div className="flex gap-1 px-4 pb-3">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-orbitron tracking-wider transition-all',
                  activeTab === tab.key
                    ? 'bg-cyber-gold/15 text-cyber-gold border border-cyber-gold/40 shadow-[0_0_15px_#ffd70030]'
                    : 'text-gray-500 hover:text-gray-300 border border-transparent'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {settings.participateInRanking && myRank > 0 && (
          <div className="px-4 py-4">
            <div
              className="p-4 rounded-2xl border-2 flex items-center gap-4"
              style={{
                borderColor: userLevel.color + '60',
                backgroundColor: userLevel.color + '10',
                boxShadow: `inset 0 0 30px ${userLevel.color}15`,
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center font-orbitron font-bold text-2xl"
                style={{
                  backgroundColor: userLevel.color + '30',
                  color: userLevel.color,
                  boxShadow: `0 0 20px ${userLevel.color}40`,
                }}
              >
                {myRank <= 999 ? `#${myRank}` : '...'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-qingke text-lg text-white truncate">
                    {user.cyberName}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs bg-white/10 text-gray-300">
                    我
                  </span>
                </div>
                <div
                  className="text-sm font-qingke"
                  style={{ color: userLevel.color }}
                >
                  {userLevel.title}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400 font-orbitron">功德值</div>
                <div className="font-orbitron text-xl font-bold neon-text-gold">
                  {formatNumber(
                    activeTab === 'daily'
                      ? user.todayMerit
                      : activeTab === 'weekly'
                      ? Math.floor(user.totalMerit * 0.3 + user.todayMerit * 3)
                      : user.totalMerit
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="px-4 pb-6 max-w-2xl mx-auto space-y-2">
          {listData.slice(0, 3).map((item: any, idx) => {
            const style = getRankStyle(idx + 1);
            const level = getLevel(item.merit);
            return (
              <div
                key={item.userId}
                className={cn(
                  'p-4 rounded-2xl border-2 flex items-center gap-4 transition-all',
                  item.isMe ? 'border-cyber-purple/60 bg-cyber-purple/10' : 'border-cyber-border bg-cyber-panel/60'
                )}
                style={{
                  boxShadow: style.shadow,
                }}
              >
                <div className="text-4xl w-14 text-center">
                  {idx === 0 && <Crown size={40} className="mx-auto" style={{ color: style.color }} />}
                  {idx === 1 && <Medal size={36} className="mx-auto" style={{ color: style.color }} />}
                  {idx === 2 && <Award size={36} className="mx-auto" style={{ color: style.color }} />}
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0"
                  style={{
                    backgroundColor: level.color + '25',
                    border: `1px solid ${level.color}50`,
                    color: level.color,
                  }}
                >
                  {item.cyberName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-qingke text-lg text-white truncate">
                      {item.cyberName}
                    </span>
                    {item.isMe && (
                      <span className="px-2 py-0.5 rounded text-xs bg-cyber-purple/30 text-cyber-purple">
                        我
                      </span>
                    )}
                  </div>
                  <div
                    className="text-sm font-qingke"
                    style={{ color: level.color }}
                  >
                    {level.title}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-orbitron text-2xl font-bold neon-text-gold">
                    {formatNumber(item.merit)}
                  </div>
                  <div className="text-[10px] text-gray-500 font-orbitron tracking-wider">
                    功德
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-2 space-y-1.5">
            {listData.slice(3).map((item: any) => {
              const level = getLevel(item.merit);
              return (
                <div
                  key={item.userId}
                  className={cn(
                    'p-3 rounded-xl border flex items-center gap-3 transition-all',
                    item.isMe
                      ? 'border-cyber-purple/50 bg-cyber-purple/8'
                      : 'border-cyber-border/60 bg-cyber-panel/40 hover:bg-cyber-panel/60'
                  )}
                >
                  <div
                    className="w-10 text-center font-orbitron text-sm text-gray-400 flex-shrink-0"
                  >
                    #{item.rank}
                  </div>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold flex-shrink-0"
                    style={{
                      backgroundColor: level.color + '20',
                      border: `1px solid ${level.color}40`,
                      color: level.color,
                    }}
                  >
                    {item.cyberName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-qingke text-sm text-white truncate">
                        {item.cyberName}
                      </span>
                      {item.isMe && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyber-purple/30 text-cyber-purple">
                          我
                        </span>
                      )}
                    </div>
                    <div
                      className="text-xs font-qingke opacity-70"
                      style={{ color: level.color }}
                    >
                      {level.title}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-orbitron text-lg font-bold text-cyber-gold">
                      {formatNumber(item.merit)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!settings.participateInRanking && (
            <div className="mt-6 p-6 rounded-xl border border-cyber-border/60 bg-cyber-panel/40 text-center">
              <Users size={40} className="mx-auto mb-3 text-gray-500" />
              <div className="font-qingke text-gray-400 mb-2">
                你选择了不参与排行榜
              </div>
              <div className="text-sm text-gray-500">
                可在设置中开启「参与排行榜」
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
