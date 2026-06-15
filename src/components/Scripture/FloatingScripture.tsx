import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useUserStore } from '@/store/useUserStore';
import { FloatingScripture as FloatingScriptureType } from '@/types';

export function FloatingScripture() {
  const scriptures = useGameStore((s) => s.floatingScriptures);
  const opacity = useUserStore((s) => s.settings.scriptureOpacity);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {scriptures.map((s) => (
        <ScriptureItem key={s.key} scripture={s} baseOpacity={opacity} />
      ))}
    </div>
  );
}

function ScriptureItem({
  scripture,
  baseOpacity,
}: {
  scripture: FloatingScriptureType;
  baseOpacity: number;
}) {
  const [pos, setPos] = useState({ x: scripture.x, y: scripture.y });
  const [fadePhase, setFadePhase] = useState<'in' | 'stay' | 'out'>('in');
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const angleRad = (scripture.angle * Math.PI) / 180;
    const vx = Math.sin(angleRad) * scripture.speed;
    const vy = -Math.cos(angleRad) * scripture.speed;

    let rafId: number;
    let frame = 0;

    const animate = () => {
      frame++;
      setPos((p) => ({
        x: p.x + vx * 0.3,
        y: p.y + vy * 0.3,
      }));

      if (frame < 20) {
        setFadePhase('in');
        setOpacity((frame / 20) * baseOpacity);
      } else if (frame < 180) {
        setFadePhase('stay');
        setOpacity(baseOpacity);
      } else if (frame < 220) {
        setFadePhase('out');
        setOpacity(((220 - frame) / 40) * baseOpacity);
      }

      if (frame < 250) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [scripture.angle, scripture.speed, baseOpacity]);

  return (
    <div
      className="absolute font-qingke whitespace-nowrap"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: `translate(-50%, -50%) rotate(${(scripture.angle - 90) * 0.1}deg)`,
        color: scripture.color,
        opacity,
        fontSize: '1.25rem',
        textShadow: `0 0 8px ${scripture.color}, 0 0 16px ${scripture.color}60`,
        transition: fadePhase === 'stay' ? 'opacity 0.3s' : 'none',
      }}
    >
      {scripture.text}
    </div>
  );
}
