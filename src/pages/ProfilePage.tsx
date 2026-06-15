import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';
import { getLevel, getLevelProgress, LEVELS } from '@/data/levels';
import { SKINS, getSkinById, isSkinUnlocked } from '@/data/skins';
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

  const currentLevel = getLevel(user.totalMerit);
  const levelProgress = getLevelProgress(user.totalMerit);
  const nextLevel = LEVELS.find((l) => l.index === currentLevel.index + 1);

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
