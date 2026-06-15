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
import { TribulationEntryButton } from '@/components/Tribulation/TribulationEntryButton';
import { TribulationPrepareModal } from '@/components/Tribulation/TribulationPrepareModal';
import { TribulationGame } from '@/components/Tribulation/TribulationGame';
import { TribulationResultModal } from '@/components/Tribulation/TribulationResultModal';
import { TribulationDifficulty, TribulationSession, TribulationRecord } from '@/types';
import { generateId } from '@/utils/generateName';

export default function Home() {
  const initUser = useUserStore((s) => s.initUser);
  const user = useUserStore((s) => s.user);
  const addTribulationRecord = useUserStore((s) => s.addTribulationRecord);
  const [posterOpen, setPosterOpen] = useState(false);

  const [prepareOpen, setPrepareOpen] = useState(false);
  const [gameConfig, setGameConfig] = useState<{
    difficulty: TribulationDifficulty;
    shields: number;
  } | null>(null);
  const [resultData, setResultData] = useState<{
    session: TribulationSession;
    merit: number;
    fragments: string[];
  } | null>(null);

  const currentLevel = getLevel(user.totalMerit);

  useEffect(() => {
    initUser();
  }, [initUser]);

  const handleTribulationStart = (
    difficulty: TribulationDifficulty,
    shields: number
  ) => {
    setPrepareOpen(false);
    setGameConfig({ difficulty, shields });
  };

  const handleTribulationFinish = (
    session: TribulationSession,
    rewardMerit: number,
    fragments: string[]
  ) => {
    const record: TribulationRecord = {
      id: generateId(),
      session,
      rewardMerit: rewardMerit,
      fragments,
      timestamp: Date.now(),
    };

    const scoreDelta = session.success ? session.score : -Math.floor(session.score * 0.2);

    addTribulationRecord(record, rewardMerit, scoreDelta);

    setGameConfig(null);
    setResultData({ session, merit: rewardMerit, fragments });
  };

  const handleTribulationQuit = () => {
    setGameConfig(null);
  };

  const handleRetry = () => {
    setResultData(null);
    setPrepareOpen(true);
  };

  const handleBackHome = () => {
    setResultData(null);
  };

  if (gameConfig) {
    return (
      <TribulationGame
        difficulty={gameConfig.difficulty}
        shields={gameConfig.shields}
        onFinish={handleTribulationFinish}
        onQuit={handleTribulationQuit}
      />
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center cyber-bg overflow-hidden">
      <ParticleCanvas />
      <ScanLines />
      <NoiseOverlay />

      <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-start overflow-y-auto scrollbar-hide pb-[140px] sm:pb-40">
        <div className="w-full pt-4 md:pt-6 px-4">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border flex-shrink-0"
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
                <span className="font-qingke text-white truncate max-w-[100px] sm:max-w-none">
                  {user.cyberName}
                </span>
              </div>
            </div>

            <TribulationEntryButton onClick={() => setPrepareOpen(true)} />
          </div>

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
      <QuickToolbar
        onOpenPoster={() => setPosterOpen(true)}
        onOpenTribulation={() => setPrepareOpen(true)}
      />

      <PosterGenerator
        isOpen={posterOpen}
        onClose={() => setPosterOpen(false)}
      />

      <TribulationPrepareModal
        isOpen={prepareOpen}
        onClose={() => setPrepareOpen(false)}
        onStart={handleTribulationStart}
      />

      <TribulationResultModal
        isOpen={!!resultData}
        onClose={handleBackHome}
        session={resultData?.session!}
        rewardMerit={resultData?.merit || 0}
        fragments={resultData?.fragments || []}
        onRetry={handleRetry}
        onBackHome={handleBackHome}
      />
    </div>
  );
}
