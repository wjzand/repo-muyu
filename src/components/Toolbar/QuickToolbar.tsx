import { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { Link, useLocation } from 'react-router-dom';
import { SkinPanel } from './SkinPanel';
import { SettingsPanel } from './SettingsPanel';
import { SOUND_CONFIGS } from '@/data/sounds';
import { useAudio } from '@/hooks/useAudio';
import {
  Palette,
  Settings,
  Volume2,
  VolumeX,
  Scroll,
  ScrollText,
  Activity,
  ZapOff,
  User,
  Trophy,
  Share2,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: (e?: React.MouseEvent) => void;
  active?: boolean;
  color?: 'purple' | 'cyan' | 'pink' | 'green' | 'gold';
  asLink?: string;
  badge?: string | number;
}

const colorClasses: Record<string, string> = {
  purple: 'hover:text-purple-400 hover:shadow-[0_0_15px_#a855f750]',
  cyan: 'hover:text-cyan-400 hover:shadow-[0_0_15px_#22d3ee50]',
  pink: 'hover:text-pink-400 hover:shadow-[0_0_15px_#ec489950]',
  green: 'hover:text-green-400 hover:shadow-[0_0_15px_#00ff8850]',
  gold: 'hover:text-yellow-400 hover:shadow-[0_0_15px_#ffd70050]',
};

const activeColorClasses: Record<string, string> = {
  purple: 'text-purple-400 shadow-[0_0_15px_#a855f750] bg-purple-500/10 border-purple-500/30',
  cyan: 'text-cyan-400 shadow-[0_0_15px_#22d3ee50] bg-cyan-500/10 border-cyan-500/30',
  pink: 'text-pink-400 shadow-[0_0_15px_#ec489950] bg-pink-500/10 border-pink-500/30',
  green: 'text-green-400 shadow-[0_0_15px_#00ff8850] bg-green-500/10 border-green-500/30',
  gold: 'text-yellow-400 shadow-[0_0_15px_#ffd70050] bg-yellow-500/10 border-yellow-500/30',
};

function ToolbarButton({
  icon,
  label,
  onClick,
  active = false,
  color = 'purple',
  asLink,
  badge,
}: ToolbarButtonProps) {
  const location = useLocation();
  const isActiveRoute = asLink ? location.pathname === asLink : false;
  const isActive = active || isActiveRoute;

  const classes = cn(
    'relative flex flex-col items-center justify-center gap-1',
    'w-14 h-16 rounded-xl border border-transparent',
    'text-gray-400 transition-all duration-200',
    'active:scale-95',
    isActive ? activeColorClasses[color] : colorClasses[color]
  );

  const content = (
    <>
      <div className="relative">
        {icon}
        {badge !== undefined && (
          <span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] px-1 rounded-full bg-cyber-pink text-white text-[10px] flex items-center justify-center font-bold shadow-[0_0_8px_#ec4899]">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[10px] font-orbitron tracking-wider whitespace-nowrap">
        {label}
      </span>
    </>
  );

  if (asLink) {
    return (
      <Link to={asLink} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {content}
    </button>
  );
}

export function QuickToolbar({
  onOpenPoster,
}: {
  onOpenPoster?: () => void;
}) {
  const [skinOpen, setSkinOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const settings = useUserStore((s) => s.settings);
  const updateSettings = useUserStore((s) => s.updateSettings);
  const user = useUserStore((s) => s.user);

  const { playSound } = useAudio();

  const currentSoundCfg = SOUND_CONFIGS.find((s) => s.type === settings.soundType);

  const handleSoundToggle = () => {
    const newVal = !settings.soundEnabled;
    updateSettings('soundEnabled', newVal);
    if (newVal) {
      setTimeout(() => playSound(settings.soundType, settings.soundVolume), 100);
    }
  };

  const handleSoundCycle = () => {
    const types = SOUND_CONFIGS.map((s) => s.type);
    const idx = types.indexOf(settings.soundType);
    const next = types[(idx + 1) % types.length];
    updateSettings('soundType', next);
    if (settings.soundEnabled) {
      setTimeout(() => playSound(next, settings.soundVolume), 50);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: '赛博电子木鱼',
      text: `我是${user.cyberName}，已经积累了${user.totalMerit}赛博功德，快来和我一起修行吧！`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(
          `${shareData.title} - ${shareData.text} ${shareData.url}`
        );
        alert('分享链接已复制到剪贴板！');
      } catch {}
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2 bg-gradient-to-t from-cyber-bg via-cyber-bg/90 to-transparent">
        <div className="max-w-lg mx-auto">
          <div className="bg-cyber-panel/80 backdrop-blur-md rounded-2xl border border-cyber-border p-2 shadow-2xl">
            <div className="flex items-center justify-around">
              <ToolbarButton
                icon={<Palette size={22} />}
                label="皮肤"
                color="pink"
                onClick={() => setSkinOpen(true)}
              />

              <ToolbarButton
                icon={settings.soundEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
                label={currentSoundCfg?.name.slice(0, 2) || '音效'}
                color="cyan"
                active={settings.soundEnabled}
                onClick={(e) => {
                  if (e && e.shiftKey) {
                    handleSoundCycle();
                  } else {
                    handleSoundToggle();
                  }
                }}
              />

              <ToolbarButton
                icon={settings.scriptureEnabled ? <Scroll size={22} /> : <ScrollText size={22} />}
                label="经文"
                color="purple"
                active={settings.scriptureEnabled}
                onClick={() => updateSettings('scriptureEnabled', !settings.scriptureEnabled)}
              />

              <ToolbarButton
                icon={settings.autoKnockEnabled ? <Activity size={22} /> : <ZapOff size={22} />}
                label="自动"
                color="green"
                active={settings.autoKnockEnabled}
                onClick={() => updateSettings('autoKnockEnabled', !settings.autoKnockEnabled)}
              />

              <ToolbarButton
                icon={<Trophy size={22} />}
                label="排行"
                color="gold"
                asLink="/leaderboard"
              />

              <ToolbarButton
                icon={<User size={22} />}
                label="我的"
                color="purple"
                asLink="/profile"
              />

              <ToolbarButton
                icon={<Download size={22} />}
                label="海报"
                color="cyan"
                onClick={onOpenPoster}
              />

              <ToolbarButton
                icon={<Share2 size={22} />}
                label="分享"
                color="pink"
                onClick={handleShare}
              />

              <ToolbarButton
                icon={<Settings size={22} />}
                label="设置"
                color="cyan"
                onClick={() => setSettingsOpen(true)}
              />
            </div>
          </div>

          {settings.autoKnockEnabled && (
            <div className="mt-2 text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-green/10 border border-cyber-green/30 text-cyber-green text-xs font-orbitron animate-breath">
                <Activity size={12} className="animate-pulse" />
                赛博修行中...
              </span>
            </div>
          )}
        </div>
      </div>

      <SkinPanel isOpen={skinOpen} onClose={() => setSkinOpen(false)} />
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
