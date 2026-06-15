import { useEffect, useState, useRef } from 'react';
import { ActiveHeartDemon, HeartDemonType } from '@/types';
import { HEART_DEMONS, getHeartDemonById } from '@/data/tribulation';
import { cn } from '@/lib/utils';
import { X, Shield, Skull } from 'lucide-react';

interface HeartDemonOverlayProps {
  demons: ActiveHeartDemon[];
  onResolveDemon: (demonId: string) => void;
  onShieldUsed?: () => boolean;
}

export function HeartDemonOverlay({ demons, onResolveDemon, onShieldUsed }: HeartDemonOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      {demons.map((demon) => (
        <DemonRenderer
          key={demon.id}
          demon={demon}
          onResolve={() => onResolveDemon(demon.id)}
          onShieldUsed={onShieldUsed}
        />
      ))}
    </div>
  );
}

function DemonRenderer({
  demon,
  onResolve,
  onShieldUsed,
}: {
  demon: ActiveHeartDemon;
  onResolve: () => void;
  onShieldUsed?: () => boolean;
}) {
  const config = getHeartDemonById(demon.type);
  const [timeLeft, setTimeLeft] = useState(demon.duration);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (demon.resolved) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 100) {
          return 0;
        }
        return t - 100;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [demon.resolved]);

  useEffect(() => {
    if (timeLeft <= 0 && !demon.resolved) {
      onResolve();
    }
  }, [timeLeft, demon.resolved, onResolve]);

  const progress = (timeLeft / demon.duration) * 100;

  if (!config) return null;

  const handleShield = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShieldUsed && onShieldUsed()) {
      onResolve();
    }
  };

  const demonEl = (() => {
    switch (demon.type) {
      case 'barrage':
        return <BarrageDemon demon={demon} config={config} onResolve={onResolve} progress={progress} />;
      case 'offset':
        return null;
      case 'reverse':
        return <ReverseDemon demon={demon} config={config} onResolve={onResolve} progress={progress} />;
      case 'sound':
        return <SoundDemon demon={demon} config={config} onResolve={onResolve} progress={progress} />;
      case 'imp':
        return <ImpDemon demon={demon} config={config} onResolve={onResolve} progress={progress} />;
      case 'shield':
        return <ShieldDropDemon demon={demon} config={config} onResolve={onResolve} progress={progress} />;
      default:
        return null;
    }
  })();

  if (demon.type === 'offset') return null;

  return (
    <div
      className={cn(
        'absolute pointer-events-auto transition-all duration-300',
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90',
        demon.resolved && 'opacity-0 scale-110'
      )}
    >
      {demonEl}
      {onShieldUsed && !['shield', 'offset', 'reverse'].includes(demon.type) && (
        <button
          onClick={handleShield}
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-green-500/90 border-2 border-green-300 flex items-center justify-center shadow-[0_0_10px_#10b981] hover:scale-110 transition-transform z-10"
          title="使用护盾抵挡"
        >
          <Shield size={14} className="text-white" />
        </button>
      )}
    </div>
  );
}

function BarrageDemon({ demon, config, onResolve, progress }: any) {
  const [clearClicks, setClearClicks] = useState(0);
  const requiredClicks = 2;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setClearClicks((c) => {
      if (c + 1 >= requiredClicks) {
        onResolve();
        return c + 1;
      }
      return c + 1;
    });
  };

  return (
    <div
      className="absolute left-0 right-0 top-1/4 -translate-y-1/2 mx-4"
      onClick={handleClick}
    >
      <div
        className="relative p-6 rounded-2xl border-2 backdrop-blur-sm"
        style={{
          borderColor: config.color + '80',
          backgroundColor: 'rgba(0,0,0,0.85)',
          boxShadow: `0 0 30px ${config.color}60`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-cyber-bg overflow-hidden">
          <div
            className="h-full transition-all"
            style={{
              width: `${progress}%`,
              backgroundColor: config.color,
              boxShadow: `0 0 10px ${config.color}`,
            }}
          />
        </div>

        <div className="space-y-3 animate-[slideIn_0.3s_ease-out]">
          <div className="text-center">
            <span className="text-3xl animate-bounce inline-block">{config.icon}</span>
          </div>
          <div className="text-center font-qingke text-lg font-bold" style={{ color: config.color }}>
            {config.name}！
          </div>
          <div className="space-y-1 max-h-32 overflow-hidden">
            {['功德-1', 'BUG+1', '加班！', '需求变更', '福报耗尽', '远离BUG', '加班远离我'].slice(0, 5).map((text, i) => (
              <div
                key={i}
                className="font-qingke text-center text-sm px-3 py-1.5 rounded-lg border animate-pulse"
                style={{
                  borderColor: config.color + '40',
                  color: config.color,
                  backgroundColor: config.color + '10',
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                {text}
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">
              连续点击清除（{clearClicks}/{requiredClicks}）
            </div>
            <div className="text-xs font-bold" style={{ color: config.color }}>
              ⚠️ 遮挡木鱼区域！
            </div>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onResolve();
          }}
          className="absolute top-2 right-2 p-1 rounded-md text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

function ReverseDemon({ demon, config, onResolve, progress }: any) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="relative p-8 rounded-2xl border-2 backdrop-blur-md"
        style={{
          borderColor: config.color + '90',
          backgroundColor: 'rgba(139, 92, 246, 0.15)',
          boxShadow: `inset 0 0 50px ${config.color}30, 0 0 30px ${config.color}60`,
        }}
      >
        <div className="absolute inset-0 rounded-2xl border-4 animate-ping" style={{ borderColor: config.color + '30' }} />

        <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-cyber-bg overflow-hidden">
          <div
            className="h-full transition-all"
            style={{
              width: `${progress}%`,
              backgroundColor: config.color,
              boxShadow: `0 0 10px ${config.color}`,
            }}
          />
        </div>

        <div className="text-center space-y-4">
          <div className="text-6xl animate-[shake_0.5s_infinite]">{config.icon}</div>
          <div className="font-qingke text-2xl font-bold" style={{ color: config.color, textShadow: `0 0 20px ${config.color}` }}>
            逆心咒
          </div>
          <div className="space-y-1">
            <div className="text-white text-lg font-bold animate-pulse">⚠️ 停止敲击！</div>
            <div className="text-gray-400 text-sm">此时敲击将 <span className="text-red-400 font-bold">打断连击</span></div>
            <div className="text-xs text-gray-500">等待咒语消散...</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SoundDemon({ demon, config, onResolve, progress }: any) {
  const [clickCount, setClickCount] = useState(0);
  const targetClicks = 5;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setClickCount((c) => {
      if (c + 1 >= targetClicks) {
        onResolve();
        return c + 1;
      }
      return c + 1;
    });
  };

  return (
    <div
      className="absolute top-4 right-4"
      onClick={handleClick}
    >
      <div
        className="relative p-4 rounded-xl border-2 cursor-pointer backdrop-blur-sm"
        style={{
          borderColor: config.color + '80',
          backgroundColor: 'rgba(6, 182, 212, 0.15)',
          boxShadow: `0 0 20px ${config.color}50`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-cyber-bg overflow-hidden">
          <div
            className="h-full transition-all"
            style={{
              width: `${progress}%`,
              backgroundColor: config.color,
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="text-4xl animate-[wiggle_0.3s_infinite]">{config.icon}</div>
          <div>
            <div className="font-bold text-sm" style={{ color: config.color }}>
              幻音干扰
            </div>
            <div className="text-xs text-gray-400 mt-1">
              点击消除（{clickCount}/{targetClicks}）
            </div>
            <div className="flex gap-1 mt-1">
              {Array.from({ length: targetClicks }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full transition-colors"
                  style={{
                    backgroundColor: i < clickCount ? config.color : '#374151',
                    boxShadow: i < clickCount ? `0 0 5px ${config.color}` : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImpDemon({ demon, config, onResolve, progress }: any) {
  const [pos, setPos] = useState({ x: demon.x || 50, y: demon.y || 50 });
  const animationRef = useRef<number>();

  useEffect(() => {
    let frame = 0;
    const animate = () => {
      frame++;
      setPos((p) => ({
        x: Math.max(10, Math.min(90, p.x + Math.sin(frame * 0.1) * 2)),
        y: Math.max(20, Math.min(80, p.y + Math.cos(frame * 0.08) * 1.5)),
      }));
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div
      className="absolute"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onResolve();
      }}
    >
      <div
        className="relative cursor-pointer"
      >
        <div
          className="absolute inset-0 rounded-full blur-xl animate-pulse"
          style={{ backgroundColor: config.color + '50' }}
        />
        <div
          className="relative w-16 h-16 rounded-full border-2 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
          style={{
            borderColor: config.color,
            backgroundColor: config.color + '30',
            boxShadow: `0 0 20px ${config.color}80`,
          }}
        >
          <span className="text-3xl animate-bounce">{config.icon}</span>
        </div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: config.color + '30',
              color: config.color,
              border: `1px solid ${config.color}60`,
            }}
          >
            点击消灭！
          </div>
        </div>

        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16">
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                backgroundColor: config.color,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ShieldDropDemon({ demon, config, onResolve, progress }: any) {
  return (
    <div
      className="absolute"
      style={{
        left: `${demon.x || 30}%`,
        top: `${demon.y || 60}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onResolve();
      }}
    >
      <div className="relative cursor-pointer">
        <div
          className="absolute inset-0 rounded-full blur-2xl animate-pulse"
          style={{ backgroundColor: config.color + '60' }}
        />
        <div
          className="relative w-20 h-20 rounded-full border-2 flex flex-col items-center justify-center hover:scale-110 active:scale-95 transition-all"
          style={{
            borderColor: config.color,
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            boxShadow: `0 0 30px ${config.color}90, inset 0 0 20px ${config.color}40`,
          }}
        >
          <Shield size={28} className="text-green-300 mb-1" />
          <span className="text-[10px] font-bold text-green-300">+1护盾</span>
        </div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/30 text-green-300 border border-green-500/60 animate-bounce">
            护盾掉落！
          </div>
        </div>

        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-20">
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                backgroundColor: config.color,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
