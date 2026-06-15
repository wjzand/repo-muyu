import { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { SKINS, getSkinById, isSkinUnlocked } from '@/data/skins';
import { Modal } from '@/components/Common/Modal';
import { NeonButton } from '@/components/Common/NeonButton';
import { FishSkin } from '@/components/WoodenFish/FishSkin';
import { Lock, Check, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SkinPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SkinPanel({ isOpen, onClose }: SkinPanelProps) {
  const user = useUserStore((s) => s.user);
  const setCurrentSkin = useUserStore((s) => s.setCurrentSkin);
  const unlockSkin = useUserStore((s) => s.unlockSkin);

  const handleSelectSkin = (skinId: string) => {
    const skin = getSkinById(skinId);
    if (isSkinUnlocked(skin, user.totalMerit, user.unlockedSkins)) {
      setCurrentSkin(skinId);
    }
  };

  const handleShareUnlock = () => {
    unlockSkin('cat');
    if (navigator.share) {
      navigator.share({
        title: '赛博电子木鱼',
        text: `我是${user.cyberName}，正在赛博修行，快来和我一起积累功德吧！`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="木鱼皮肤" size="xl" position="bottom">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {SKINS.map((skin) => {
          const unlocked = isSkinUnlocked(skin, user.totalMerit, user.unlockedSkins);
          const isActive = user.currentSkin === skin.id;

          const lockText =
            skin.unlockCondition.type === 'merit'
              ? `功德达到 ${skin.unlockCondition.value}`
              : skin.unlockCondition.type === 'share'
              ? '分享解锁'
              : '活动限定';

          return (
            <button
              key={skin.id}
              onClick={() => handleSelectSkin(skin.id)}
              disabled={!unlocked}
              className={cn(
                'relative p-4 rounded-xl border-2 transition-all duration-300',
                'flex flex-col items-center gap-2',
                isActive
                  ? 'border-cyber-purple bg-cyber-purple/10 shadow-neon-purple'
                  : unlocked
                  ? 'border-cyber-border bg-cyber-panel/50 hover:border-cyber-purple/50 hover:bg-cyber-purple/5'
                  : 'border-cyber-border bg-cyber-bg/50 opacity-70 cursor-not-allowed'
              )}
            >
              <div className="relative">
                <FishSkin skin={skin} size={100} />
                {!unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
                    <Lock size={24} className="text-gray-400" />
                  </div>
                )}
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-cyber-purple flex items-center justify-center shadow-neon-purple">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </div>

              <div className="text-center space-y-1">
                <div
                  className="font-qingke text-base"
                  style={{ color: skin.colors.glow }}
                >
                  {skin.name}
                </div>
                <div className="text-xs text-gray-400">{skin.description}</div>
                {!unlocked && (
                  <div className="text-xs text-cyber-pink flex items-center justify-center gap-1">
                    🔒 {lockText}
                  </div>
                )}
              </div>

              {skin.id === 'cat' && !unlocked && (
                <NeonButton
                  size="sm"
                  color="pink"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareUnlock();
                  }}
                  className="mt-1 w-full"
                >
                  <Share2 size={14} className="inline mr-1" />
                  分享解锁
                </NeonButton>
              )}
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
