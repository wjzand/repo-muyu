import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';
import { getLevel, getLevelProgress, LEVELS } from '@/data/levels';
import { SKINS, getSkinById, isSkinUnlocked } from '@/data/skins';
import {
  TRIBULATION_RANKS,
  HEART_DEMONS,
  getDifficultyById,
  getRankByScore,
  GRADE_COLORS,
  SKIN_FRAGMENTS as FRAGMENTS,
} from '@/data/tribulation';
import { NeonButton } from '@/components/Common/NeonButton';
import { FishSkin } from '@/components/WoodenFish/FishSkin';
import { formatNumber } from '@/utils/formatNumber';
import { generateCyberName } from '@/utils/generateName';
import { Modal } from '@/components/Common/Modal';
import {
  ArrowLeft,
  User,
  Edit3,
  Trophy,
  Download,
  Upload,
  Trash2,
  Palette,
  Sparkles,
  RefreshCw,
  Save,
  Zap,
  Target,
  Clock,
  Skull,
  Gem,
  Award,
  Flame,
  History,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ACHIEVEMENTS = [
  { id: 'first_knock', name: '初心者', desc: '完成第一次敲击', icon: '🔔', check: (k: number) => k >= 1 },
  { id: 'knock_100', name: '勤学者', desc: '累计敲击100次', icon: '📿', check: (k: number) => k >= 100 },
  { id: 'knock_1000', name: '精进者', desc: '累计敲击1000次', icon: '🕯️', check: (k: number) => k >= 1000 },
  { id: 'knock_10000', name: '大圆满', desc: '累计敲击10000次', icon: '🏆', check: (k: number) => k >= 10000 },
  { id: 'merit_100', name: '初入佛门', desc: '功德达到100', icon: '💫', check: (_, m: number) => m >= 100 },
  { id: 'merit_1000', name: '功德无量', desc: '功德达到1000', icon: '✨', check: (_, m: number) => m >= 1000 },
  { id: 'merit_10000', name: '功德圆满', desc: '功德达到10000', icon: '🌟', check: (_, m: number) => m >= 10000 },
  { id: 'full_stack', name: '全栈成佛', desc: '达到最高境界', icon: '👑', check: (_, m: number) => m >= 10000 },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const settings = useUserStore((s) => s.settings);
  const tribulation = useUserStore((s) => s.tribulation);
  const setCyberName = useUserStore((s) => s.setCyberName);
  const setAvatarSeed = useUserStore((s) => s.setAvatarSeed);
  const resetAllData = useUserStore((s) => s.resetAllData);
  const exportData = useUserStore((s) => s.exportData);
  const importData = useUserStore((s) => s.importData);
  const setCurrentSkin = useUserStore((s) => s.setCurrentSkin);

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.cyberName);
  const [showResetModal, setShowResetModal] = useState(false);
  const [exported, setExported] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'tribulation' | 'demons'>('basic');
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

  const currentLevel = getLevel(user.totalMerit);
  const levelProgress = getLevelProgress(user.totalMerit);
  const nextLevel = LEVELS.find((l) => l.index === currentLevel.index + 1);

  const currentRank = getRankByScore(tribulation.rankScore);
  const nextRank = TRIBULATION_RANKS.find((r) => r.minScore > currentRank.minScore);
  const rankProgress = nextRank
    ? (tribulation.rankScore - currentRank.minScore) / (nextRank.minScore - currentRank.minScore)
    : 1;

  const unlockedAchievements = ACHIEVEMENTS.filter((a) =>
    a.check(user.totalKnocks, user.totalMerit)
  );

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setCyberName(nameInput.trim());
    }
    setEditingName(false);
  };

  const handleRandomName = () => {
    const newName = generateCyberName();
    setNameInput(newName);
    setCyberName(newName);
  };

  const handleExport = () => {
    const data = exportData();
    navigator.clipboard?.writeText(data);
    setExported(true);
    setTimeout(() => setExported(false), 2000);

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyber-woodenfish-${user.cyberName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    try {
      const text = await navigator.clipboard?.readText();
      if (text && importData(text)) {
        alert('数据导入成功！');
      } else {
        alert('导入失败，请检查剪贴板数据');
      }
    } catch {
      alert('无法读取剪贴板，请手动粘贴');
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    if (sameDay) return `今天 ${hh}:${mm}`;
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return `昨天 ${hh}:${mm}`;
    return `${d.getMonth() + 1}/${d.getDate()} ${hh}:${mm}`;
  };

  const TabButton = ({
    id,
    label,
    icon,
    badge,
  }: {
    id: typeof activeTab;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        'flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-orbitron tracking-wider transition-all',
        activeTab === id
          ? 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/40 shadow-[0_0_10px_#a855f730]'
          : 'text-gray-500 hover:text-gray-300 border border-transparent'
      )}
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
      {badge !== undefined && (
        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-cyber-pink/80 text-white text-[10px] font-bold">
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="fixed inset-0 cyber-bg overflow-y-auto scrollbar-hide">
      <div className="min-h-full pb-28">
        <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-cyber-bg/80 backdrop-blur-md border-b border-cyber-border">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="font-orbitron text-lg tracking-wider neon-text-purple flex-1">
            修行中心
          </h1>
        </div>

        <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
          <div className="relative p-6 rounded-2xl border border-cyber-border bg-cyber-panel/60 backdrop-blur-sm overflow-hidden">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(circle at 20% 20%, ${currentLevel.color}40 0%, transparent 50%)`,
              }}
            />
            <div className="relative z-10">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0">
                  <button
                    onClick={() => setAvatarSeed(Math.floor(Math.random() * 1000))}
                    className={cn(
                      'w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold transition-transform hover:scale-105',
                      'border-2'
                    )}
                    style={{
                      backgroundColor: currentLevel.color + '20',
                      borderColor: currentLevel.color + '60',
                      color: currentLevel.color,
                      boxShadow: `0 0 20px ${currentLevel.color}30`,
                    }}
                  >
                    {user.cyberName.charAt(0)}
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {editingName ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          maxLength={12}
                          className="flex-1 bg-cyber-bg border border-cyber-cyan/50 rounded-lg px-3 py-1.5 text-white font-qingke focus:outline-none focus:border-cyber-cyan"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveName}
                          className="p-2 rounded-lg bg-cyber-cyan/20 text-cyber-cyan hover:bg-cyber-cyan/30"
                        >
                          <Save size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h2 className="font-qingke text-2xl text-white truncate">
                          {user.cyberName}
                        </h2>
                        <button
                          onClick={() => {
                            setNameInput(user.cyberName);
                            setEditingName(true);
                          }}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-cyber-cyan hover:bg-cyber-cyan/10"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={handleRandomName}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-cyber-purple hover:bg-cyber-purple/10"
                          title="随机法号"
                        >
                          <RefreshCw size={14} />
                        </button>
                      </>
                    )}
                  </div>

                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: currentLevel.color + '15',
                      border: `1px solid ${currentLevel.color}50`,
                      color: currentLevel.color,
                    }}
                  >
                    <Trophy size={14} />
                    <span className="font-qingke">{currentLevel.title}</span>
                    <span className="opacity-60">Lv.{currentLevel.index + 1}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">升级进度</span>
                  <span style={{ color: currentLevel.color }}>
                    {nextLevel
                      ? `${formatNumber(user.totalMerit)} / ${formatNumber(nextLevel.minMerit)}`
                      : '已达最高境界'}
                  </span>
                </div>
                <div className="h-3 bg-cyber-bg rounded-full overflow-hidden border border-cyber-border">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${levelProgress * 100}%`,
                      background: `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel?.color || currentLevel.color})`,
                      boxShadow: `0 0 10px ${currentLevel.color}`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className="relative p-5 rounded-2xl border-2 overflow-hidden"
            style={{
              borderColor: currentRank.color + '40',
              background: `linear-gradient(135deg, ${currentRank.color}10 0%, transparent 50%, #1a1a2e 100%)`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                  style={{
                    backgroundColor: currentRank.color + '20',
                    border: `2px solid ${currentRank.color}60`,
                    boxShadow: `0 0 15px ${currentRank.color}30`,
                  }}
                >
                  {currentRank.icon}
                </div>
                <div>
                  <div className="text-xs font-orbitron tracking-wider text-yellow-400/80">
                    ⚡ 渡劫段位
                  </div>
                  <div
                    className="text-xl font-qingke font-bold"
                    style={{ color: currentRank.color }}
                  >
                    {currentRank.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <Flame size={12} className={cn(tribulation.consecutiveWins > 0 && 'text-orange-400 animate-pulse')} />
                    <span>连胜 {tribulation.consecutiveWins}</span>
                    <span>·</span>
                    <Award size={12} />
                    <span>最高 {tribulation.maxConsecutiveWins}</span>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="text-xs text-gray-400 font-orbitron">段位积分</div>
                <div
                  className="text-2xl font-orbitron font-bold"
                  style={{ color: currentRank.color }}
                >
                  {formatNumber(tribulation.rankScore)}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">
                  {currentRank.name}
                </span>
                <span style={{ color: nextRank ? nextRank.color : currentRank.color }}>
                  {nextRank ? nextRank.name : '已至巅峰'}
                </span>
              </div>
              <div className="h-2.5 bg-cyber-bg rounded-full overflow-hidden border border-cyber-border">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, rankProgress * 100)}%`,
                    background: `linear-gradient(90deg, ${currentRank.color}, ${nextRank?.color || currentRank.color})`,
                    boxShadow: `0 0 8px ${currentRank.color}`,
                  }}
                />
              </div>
              {nextRank && (
                <div className="text-right text-[10px] text-gray-500">
                  距离 {nextRank.name} 还需 {formatNumber(nextRank.minScore - tribulation.rankScore)} 积分
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2 mt-4 text-center">
              <div className="p-2 rounded-lg bg-cyber-bg/40 border border-cyber-border/50">
                <Zap size={14} className="mx-auto text-yellow-400 mb-1" />
                <div className="text-[10px] text-gray-500">最高分</div>
                <div className="text-sm font-orbitron font-bold text-yellow-300">
                  {tribulation.bestScore}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-cyber-bg/40 border border-cyber-border/50">
                <Trophy size={14} className="mx-auto text-green-400 mb-1" />
                <div className="text-[10px] text-gray-500">成功</div>
                <div className="text-sm font-orbitron font-bold text-green-300">
                  {tribulation.successCount}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-cyber-bg/40 border border-cyber-border/50">
                <Skull size={14} className="mx-auto text-red-400 mb-1" />
                <div className="text-[10px] text-gray-500">失败</div>
                <div className="text-sm font-orbitron font-bold text-red-300">
                  {tribulation.failCount}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-cyber-bg/40 border border-cyber-border/50">
                <Gem size={14} className="mx-auto text-purple-400 mb-1" />
                <div className="text-[10px] text-gray-500">碎片</div>
                <div className="text-sm font-orbitron font-bold text-purple-300">
                  {tribulation.fragments.length}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-cyber-cyan/30 bg-cyber-cyan/5 text-center">
              <div className="text-xs font-orbitron tracking-wider text-cyber-cyan/70 mb-1">
                功德值
              </div>
              <div className="font-orbitron text-2xl font-bold neon-text-cyan">
                {formatNumber(user.totalMerit)}
              </div>
            </div>
            <div className="p-4 rounded-xl border border-cyber-purple/30 bg-cyber-purple/5 text-center">
              <div className="text-xs font-orbitron tracking-wider text-cyber-purple/70 mb-1">
                敲击数
              </div>
              <div className="font-orbitron text-2xl font-bold neon-text-purple">
                {formatNumber(user.totalKnocks)}
              </div>
            </div>
            <div className="p-4 rounded-xl border border-cyber-pink/30 bg-cyber-pink/5 text-center">
              <div className="text-xs font-orbitron tracking-wider text-cyber-pink/70 mb-1">
                今日功德
              </div>
              <div className="font-orbitron text-2xl font-bold neon-text-pink">
                {formatNumber(user.todayMerit)}
              </div>
            </div>
          </div>

          <div className="flex gap-2 bg-cyber-panel/50 rounded-2xl p-1.5 border border-cyber-border">
            <TabButton id="basic" label="修行" icon={<User size={16} />} />
            <TabButton
              id="tribulation"
              label="渡劫"
              icon={<Zap size={16} />}
              badge={tribulation.records.length > 0 ? tribulation.records.length : undefined}
            />
            <TabButton
              id="demons"
              label="心魔"
              icon={<BookOpen size={16} />}
              badge={
                tribulation.demonsEncountered.length > 0
                  ? `${tribulation.demonsEncountered.length}/${HEART_DEMONS.length}`
                  : undefined
              }
            />
          </div>

          {activeTab === 'basic' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <Palette size={18} className="text-cyber-pink" />
                  <h3 className="font-orbitron tracking-wider text-cyber-pink">皮肤收藏</h3>
                  <span className="text-xs text-gray-500">
                    {user.unlockedSkins.length}/{SKINS.length}
                  </span>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {SKINS.map((skin) => {
                    const unlocked = isSkinUnlocked(skin, user.totalMerit, user.unlockedSkins);
                    const isActive = user.currentSkin === skin.id;
                    return (
                      <button
                        key={skin.id}
                        onClick={() => unlocked && setCurrentSkin(skin.id)}
                        disabled={!unlocked}
                        className={cn(
                          'relative p-3 rounded-xl border-2 transition-all',
                          'flex flex-col items-center',
                          isActive
                            ? 'border-cyber-purple bg-cyber-purple/10 shadow-neon-purple'
                            : unlocked
                            ? 'border-cyber-border bg-cyber-panel/50 hover:border-cyber-purple/50'
                            : 'border-cyber-border bg-cyber-bg/50 opacity-50'
                        )}
                      >
                        <div className="relative">
                          <FishSkin skin={skin} size={60} />
                          {!unlocked && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xl">🔒</span>
                            </div>
                          )}
                        </div>
                        <div
                          className="mt-2 text-xs font-qingke text-center truncate w-full"
                          style={{ color: skin.colors.glow }}
                        >
                          {skin.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <Sparkles size={18} className="text-cyber-gold" />
                  <h3 className="font-orbitron tracking-wider text-cyber-gold">成就徽章</h3>
                  <span className="text-xs text-gray-500">
                    {unlockedAchievements.length}/{ACHIEVEMENTS.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {ACHIEVEMENTS.map((a) => {
                    const unlocked = unlockedAchievements.some((u) => u.id === a.id);
                    return (
                      <div
                        key={a.id}
                        className={cn(
                          'p-4 rounded-xl border text-center transition-all',
                          unlocked
                            ? 'border-cyber-gold/50 bg-cyber-gold/5 shadow-[0_0_15px_#ffd70020]'
                            : 'border-cyber-border bg-cyber-bg/30 opacity-50'
                        )}
                      >
                        <div className="text-3xl mb-2">{unlocked ? a.icon : '❓'}</div>
                        <div
                          className={cn(
                            'font-qingke text-sm',
                            unlocked ? 'neon-text-gold' : 'text-gray-500'
                          )}
                        >
                          {unlocked ? a.name : '???'}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1">{a.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <User size={18} className="text-cyber-cyan" />
                  <h3 className="font-orbitron tracking-wider text-cyber-cyan">数据管理</h3>
                </div>
                <div className="p-4 rounded-xl border border-cyber-border bg-cyber-panel/50 space-y-3">
                  <div className="flex gap-3 flex-wrap">
                    <NeonButton color="cyan" size="sm" variant="outline" onClick={handleExport}>
                      <Download size={16} className="inline mr-1" />
                      {exported ? '已导出!' : '导出数据'}
                    </NeonButton>
                    <NeonButton color="purple" size="sm" variant="outline" onClick={handleImport}>
                      <Upload size={16} className="inline mr-1" />
                      导入数据
                    </NeonButton>
                    <NeonButton
                      color="pink"
                      size="sm"
                      variant="outline"
                      onClick={() => setShowResetModal(true)}
                    >
                      <Trash2 size={16} className="inline mr-1" />
                      重置数据
                    </NeonButton>
                  </div>
                  <div className="text-xs text-gray-500 pt-2 border-t border-cyber-border/50">
                    💡 数据通过 localStorage 本地存储，清除浏览器数据会丢失。建议定期导出备份。
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <Trophy size={18} className="text-cyber-green" />
                  <h3 className="font-orbitron tracking-wider text-cyber-green">境界一览</h3>
                </div>
                <div className="p-4 rounded-xl border border-cyber-border bg-cyber-panel/50 space-y-3">
                  {LEVELS.map((level, idx) => {
                    const achieved = user.level >= level.index;
                    return (
                      <div
                        key={level.index}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg transition-all',
                          achieved ? 'bg-white/5' : 'opacity-40'
                        )}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{
                            backgroundColor: achieved ? level.color + '30' : '#1e1e2e',
                            border: `1px solid ${achieved ? level.color + '60' : '#333'}`,
                            color: achieved ? level.color : '#666',
                          }}
                        >
                          {achieved ? '✓' : idx + 1}
                        </div>
                        <div className="flex-1">
                          <div
                            className="font-qingke"
                            style={{ color: achieved ? level.color : '#666' }}
                          >
                            {level.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            功德 {formatNumber(level.minMerit)}+
                            {level.maxMerit !== Infinity &&
                              ` ~ ${formatNumber(level.maxMerit)}`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tribulation' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <Trophy size={18} className="text-yellow-400" />
                  <h3 className="font-orbitron tracking-wider text-yellow-400">段位一览</h3>
                </div>
                <div className="p-4 rounded-xl border border-cyber-border bg-cyber-panel/50 space-y-2">
                  {TRIBULATION_RANKS.map((rank, idx) => {
                    const achieved = tribulation.rankScore >= rank.minScore;
                    const isCurrent = currentRank.id === rank.id;
                    return (
                      <div
                        key={rank.id}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg transition-all',
                          isCurrent && 'ring-2 ring-offset-2 ring-offset-cyber-panel/50',
                          achieved ? 'bg-white/5' : 'opacity-40'
                        )}
                        style={isCurrent ? { boxShadow: `0 0 15px ${rank.color}50`, border: `1px solid ${rank.color}80` } : {}}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                          style={{
                            backgroundColor: achieved ? rank.color + '20' : '#1e1e2e',
                            border: `1px solid ${achieved ? rank.color + '60' : '#333'}`,
                          }}
                        >
                          {achieved ? rank.icon : '🔒'}
                        </div>
                        <div className="flex-1">
                          <div
                            className="font-qingke font-bold"
                            style={{ color: achieved ? rank.color : '#666' }}
                          >
                            {rank.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            积分 {formatNumber(rank.minScore)}+
                          </div>
                        </div>
                        {isCurrent && (
                          <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-[10px] font-bold border border-yellow-500/40">
                            当前
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {FRAGMENTS && FRAGMENTS.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <Gem size={18} className="text-purple-400" />
                    <h3 className="font-orbitron tracking-wider text-purple-400">皮肤碎片</h3>
                    <span className="text-xs text-gray-500">
                      {tribulation.fragments.length} 个
                    </span>
                  </div>
                  <div className="p-4 rounded-xl border border-cyber-border bg-cyber-panel/50">
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {FRAGMENTS.map((f) => {
                        const count = tribulation.fragments.filter((x) => x === f.id).length;
                        return (
                          <div
                            key={f.id}
                            className={cn(
                              'relative p-3 rounded-xl border-2 text-center transition-all',
                              count > 0
                                ? 'border-purple-500/50 bg-purple-500/10'
                                : 'border-cyber-border bg-cyber-bg/50 opacity-50'
                            )}
                          >
                            <div className="text-3xl mb-1">{f.icon}</div>
                            <div className="text-xs font-qingke text-purple-300 truncate">
                              {f.name}
                            </div>
                            {count > 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center">
                                {count}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <History size={18} className="text-cyan-400" />
                  <h3 className="font-orbitron tracking-wider text-cyan-400">渡劫记录</h3>
                  <span className="text-xs text-gray-500">
                    共 {tribulation.records.length} 次
                  </span>
                </div>

                {tribulation.records.length === 0 ? (
                  <div className="p-8 rounded-xl border border-cyber-border bg-cyber-panel/50 text-center">
                    <div className="text-4xl mb-3 opacity-40">⚡</div>
                    <div className="text-gray-400 font-qingke">暂无渡劫记录</div>
                    <div className="text-xs text-gray-600 mt-1">
                      回到首页点击"渡劫"开启你的第一次修行挑战
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tribulation.records.map((record) => {
                      const diffCfg = getDifficultyById(record.session.difficulty);
                      const gradeColor = GRADE_COLORS[record.session.grade] || '#94a3b8';
                      const isExpanded = expandedRecord === record.id;
                      return (
                        <div
                          key={record.id}
                          className={cn(
                            'rounded-xl border transition-all overflow-hidden',
                            record.session.success
                              ? 'border-green-500/30 bg-green-500/5'
                              : 'border-red-500/30 bg-red-500/5'
                          )}
                        >
                          <button
                            onClick={() =>
                              setExpandedRecord(isExpanded ? null : record.id)
                            }
                            className="w-full p-4 flex items-center gap-3 text-left"
                          >
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                              style={{
                                backgroundColor: record.session.success
                                  ? '#10b98120'
                                  : '#ef444420',
                                border: `1px solid ${record.session.success ? '#10b98160' : '#ef444460'}`,
                              }}
                            >
                              {record.session.success ? '✨' : '💥'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className="font-qingke font-bold"
                                  style={{ color: diffCfg?.color }}
                                >
                                  {diffCfg?.name}
                                </span>
                                <span
                                  className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                                  style={{
                                    backgroundColor: gradeColor + '20',
                                    color: gradeColor,
                                    border: `1px solid ${gradeColor}60`,
                                  }}
                                >
                                  {record.session.grade}
                                </span>
                                <span
                                  className={cn(
                                    'text-xs font-bold',
                                    record.session.success
                                      ? 'text-green-400'
                                      : 'text-red-400'
                                  )}
                                >
                                  {record.session.success ? '渡劫成功' : '渡劫失败'}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Target size={10} />
                                  {record.session.totalKnocks}/{diffCfg?.targetKnocks}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Award size={10} />
                                  {record.session.score}分
                                </span>
                                <span>{formatTime(record.timestamp)}</span>
                              </div>
                            </div>
                            {isExpanded ? (
                              <ChevronUp size={18} className="text-gray-500 shrink-0" />
                            ) : (
                              <ChevronDown size={18} className="text-gray-500 shrink-0" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="px-4 pb-4 pt-0 border-t border-cyber-border/50 mt-0">
                              <div className="pt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
                                <div className="p-2 rounded-lg bg-cyber-bg/40">
                                  <div className="text-[10px] text-gray-500">最大连击</div>
                                  <div className="text-sm font-orbitron font-bold text-orange-300">
                                    {record.session.maxCombo}
                                  </div>
                                </div>
                                <div className="p-2 rounded-lg bg-cyber-bg/40">
                                  <div className="text-[10px] text-gray-500">心魔遭遇</div>
                                  <div className="text-sm font-orbitron font-bold text-red-300">
                                    {record.session.demonsEncountered}
                                  </div>
                                </div>
                                <div className="p-2 rounded-lg bg-cyber-bg/40">
                                  <div className="text-[10px] text-gray-500">成功化解</div>
                                  <div className="text-sm font-orbitron font-bold text-green-300">
                                    {record.session.demonsResolved}
                                  </div>
                                </div>
                                <div className="p-2 rounded-lg bg-cyber-bg/40">
                                  <div className="text-[10px] text-gray-500">中断次数</div>
                                  <div className="text-sm font-orbitron font-bold text-pink-300">
                                    {record.session.interrupts}
                                  </div>
                                </div>
                              </div>
                              {record.fragments.length > 0 && (
                                <div className="mt-3 p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                                  <div className="text-[10px] text-purple-300 font-orbitron tracking-wider mb-1">
                                    🎁 获得碎片
                                  </div>
                                  <div className="flex gap-2 flex-wrap">
                                    {record.fragments.map((fid, i) => {
                                      const f = FRAGMENTS?.find((x) => x.id === fid);
                                      return (
                                        <span
                                          key={i}
                                          className="px-2 py-1 rounded-full bg-purple-500/20 text-xs text-purple-300"
                                        >
                                          {f?.icon} {f?.name || fid}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'demons' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-xl border border-cyber-border bg-cyber-panel/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-red-400" />
                    <h3 className="font-orbitron tracking-wider text-red-400">心魔图鉴</h3>
                  </div>
                  <span className="text-xs font-orbitron px-2 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/30">
                    {tribulation.demonsEncountered.length} / {HEART_DEMONS.length}
                  </span>
                </div>
                <div className="h-2.5 bg-cyber-bg rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-red-500 via-purple-500 to-pink-500"
                    style={{
                      width: `${(tribulation.demonsEncountered.length / HEART_DEMONS.length) * 100}%`,
                      boxShadow: '0 0 10px #ef4444',
                    }}
                  />
                </div>
                {tribulation.demonsEncountered.length === HEART_DEMONS.length && (
                  <div className="mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-center">
                    <div className="text-lg mb-1">🏆</div>
                    <div className="text-xs font-qingke text-yellow-300">
                      成就达成：心魔猎人 · 全收集！
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {HEART_DEMONS.map((demon) => {
                  const encountered = tribulation.demonsEncountered.includes(
                    demon.id as never
                  );
                  return (
                    <div
                      key={demon.id}
                      className={cn(
                        'relative p-4 rounded-2xl border-2 overflow-hidden transition-all',
                        encountered
                          ? 'bg-cyber-panel/60'
                          : 'bg-cyber-bg/60 opacity-60'
                      )}
                      style={{
                        borderColor: encountered ? demon.color + '60' : '#333',
                        boxShadow: encountered ? `0 0 15px ${demon.color}20` : 'none',
                      }}
                    >
                      <div
                        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
                        style={{ backgroundColor: demon.color }}
                      />
                      <div className="relative z-10 flex items-start gap-3">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0"
                          style={{
                            backgroundColor: encountered ? demon.color + '20' : '#1e1e2e',
                            border: `2px solid ${encountered ? demon.color + '60' : '#333'}`,
                          }}
                        >
                          {encountered ? demon.icon : '❓'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4
                              className="font-qingke font-bold text-lg"
                              style={{ color: encountered ? demon.color : '#666' }}
                            >
                              {encountered ? demon.name : '???'}
                            </h4>
                            {encountered && (
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-green-500/20 text-green-400 border border-green-500/40">
                                已收录
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                            {encountered
                              ? demon.description
                              : '在渡劫中遭遇后解锁详细信息'}
                          </p>
                          {encountered && demon.tip && (
                            <div className="mt-2 p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                              <div className="text-[10px] font-orbitron text-cyan-400 tracking-wider mb-0.5">
                                💡 应对技巧
                              </div>
                              <div className="text-[11px] text-cyan-200/80">
                                {demon.tip}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="确认重置"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center p-4">
            <div className="text-5xl mb-3">⚠️</div>
            <div className="font-qingke text-lg text-cyber-pink mb-2">
              确定要重置所有数据吗？
            </div>
            <div className="text-sm text-gray-400">
              此操作将清除所有功德、皮肤解锁和设置。
              <br />
              <span className="text-cyber-red">操作不可恢复！</span>
            </div>
          </div>
          <div className="flex gap-3">
            <NeonButton
              color="pink"
              variant="solid"
              className="flex-1"
              onClick={() => {
                resetAllData();
                setShowResetModal(false);
              }}
            >
              <Trash2 size={16} className="inline mr-1" />
              确认重置
            </NeonButton>
            <NeonButton
              color="cyan"
              variant="ghost"
              className="flex-1"
              onClick={() => setShowResetModal(false)}
            >
              取消
            </NeonButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
