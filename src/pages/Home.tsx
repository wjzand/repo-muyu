import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { ParticleCanvas } from '@/components/Background/ParticleCanvas';
import { ScanLines, NoiseOverlay } from '@/components/Background/ScanLines';
import { CounterBoard } from '@/components/Counter/CounterBoard';
import { WoodenFish } from '@/components/WoodenFish/WoodenFish';
import { FloatingScripture } from '@/components/Scripture/FloatingScripture';
import { LevelUpEffect } from '@/components/LevelUp/LevelUpEffect';
import { QuickToolbar } from '@/components/Toolbar/QuickToolbar';
import { PosterGenerator } from '@/components/Poster/PosterGenerator';
import { GlitchText } from '@/components/Common/GlitchText';
import { getLevel } from '@/data/levels';

export default function Home() {
  const initUser = useUserStore((s) => s.initUser);
  const user = useUserStore((s) => s.user);
  const [posterOpen, setPosterOpen] = useState(false);
  const currentLevel = getLevel(user.totalMerit);

  useEffect(() => {
    initUser();
  }, [initUser]);

  return (
    <div className="fixed inset-0 flex flex-col items-center cyber-bg overflow-hidden">
      <ParticleCanvas />
      <ScanLines />
      <NoiseOverlay />

      <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-start overflow-y-auto scrollbar-hide pb-40">
        <div className="w-full pt-4 md:pt-6 px-4">
          <div className="max-w-md mx-auto text-center mb-4">
            <GlitchText
              trigger={false}
              className="text-xl md:text-2xl font-orbitron tracking-[0.3em] font-bold"
            >
              <span className="neon-text-purple">赛博</span>
              <span className="neon-text-cyan">电子</span>
              <span className="neon-text-pink">木鱼</span>
            </GlitchText>
            <div className="mt-1 text-xs font-orbitron tracking-widest text-gray-500">
              CYBER WOODEN FISH
            </div>
          </div>

          <div className="text-center mb-4">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border"
              style={{
                borderColor: currentLevel.color + '60',
                backgroundColor: currentLevel.color + '10',
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: currentLevel.color + '20',
                  color: currentLevel.color,
                  border: `1px solid ${currentLevel.color}60`,
                  boxShadow: `0 0 10px ${currentLevel.color}40`,
                }}
              >
                {user.cyberName.charAt(0)}
              </div>
              <span className="font-qingke text-white">{user.cyberName}</span>
            </div>
          </div>
        </div>

        <div className="w-full flex-shrink-0">
          <CounterBoard />
        </div>

        <div className="flex-1 min-h-[320px] flex items-center justify-center w-full my-4">
          <WoodenFish />
        </div>
      </div>

      <FloatingScripture />
      <LevelUpEffect />
      <QuickToolbar onOpenPoster={() => setPosterOpen(true)} />

      <PosterGenerator
        isOpen={posterOpen}
        onClose={() => setPosterOpen(false)}
      />
    </div>
  );
}
