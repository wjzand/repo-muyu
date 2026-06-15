import { useCallback, useEffect, useRef, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useGameStore } from '@/store/useGameStore';
import { useAudio } from '@/hooks/useAudio';
import { useVibration } from '@/hooks/useVibration';
import { getSkinById } from '@/data/skins';
import { FishSkin } from './FishSkin';
import { cn } from '@/lib/utils';

interface WoodenFishProps {
  className?: string;
}

export function WoodenFish({ className }: WoodenFishProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [autoKnockFlash, setAutoKnockFlash] = useState(false);

  const user = useUserStore((s) => s.user);
  const settings = useUserStore((s) => s.settings);
  const performKnock = useGameStore((s) => s.performKnock);
  const addRipple = useGameStore((s) => s.addRipple);
  const spawnParticles = useGameStore((s) => s.spawnParticles);

  const { playSound } = useAudio();
  const { vibrate, isSupported: vibrationSupported } = useVibration();

  const currentSkin = getSkinById(user.currentSkin);

  const doKnock = useCallback(
    (clientX?: number, clientY?: number, isAuto = false) => {
      const { reachedLimit } = performKnock(isAuto);
      if (reachedLimit) return;

      if (settings.soundEnabled) {
        playSound(settings.soundType, settings.soundVolume);
      }

      if (settings.vibrationEnabled && vibrationSupported) {
        vibrate(30);
      }

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX ?? rect.left + rect.width / 2;
        const y = clientY ?? rect.top + rect.height / 2;
        addRipple(x, y);
        spawnParticles(x, y, 15);
      }

      if (isAuto) {
        setAutoKnockFlash(true);
        setIsPressed(true);
        setTimeout(() => {
          setAutoKnockFlash(false);
          setIsPressed(false);
        }, 100);
      }
    },
    [performKnock, settings.soundEnabled, settings.soundType, settings.soundVolume, settings.vibrationEnabled, vibrationSupported, playSound, vibrate, addRipple, spawnParticles]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsPressed(true);
      doKnock(e.clientX, e.clientY);
    },
    [doKnock]
  );

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      setIsPressed(true);
      const touch = e.touches[0];
      doKnock(touch.clientX, touch.clientY);
    },
    [doKnock]
  );

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsPressed(true);
        doKnock();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [doKnock]);

  useEffect(() => {
    if (!settings.autoKnockEnabled) return;

    const interval = setInterval(() => {
      doKnock(undefined, undefined, true);
    }, settings.autoKnockSpeed);

    return () => clearInterval(interval);
  }, [settings.autoKnockEnabled, settings.autoKnockSpeed, doKnock]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex items-center justify-center',
        'cursor-pointer select-none',
        'touch-none',
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={cn(
          'absolute rounded-full blur-3xl transition-opacity duration-300',
          'pointer-events-none',
          isPressed || autoKnockFlash ? 'opacity-60 scale-110' : 'opacity-30 scale-100'
        )}
        style={{
          width: 320,
          height: 320,
          background: `radial-gradient(circle, ${currentSkin.colors.glow}40 0%, transparent 70%)`,
        }}
      />
      <FishSkin
        skin={currentSkin}
        size={280}
        isPressed={isPressed || autoKnockFlash}
      />
      <div className="absolute -bottom-4 text-sm font-orbitron tracking-wider text-gray-500">
        点击/触摸/空格键
      </div>
    </div>
  );
}
